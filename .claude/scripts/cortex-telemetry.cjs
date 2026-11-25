#!/usr/bin/env node
/**
 * Cortex telemetry hook.
 * Fires globally on every project, but only records events when the current
 * project is a Cortex project (detected by the marker file below).
 *
 * Wired in .claude/settings.json (project-scoped, ships with the framework):
 *   - UserPromptSubmit  -> captures slash commands (event_type = "command")
 *   - PreToolUse:Task   -> captures agent usage    (event_type = "agent")
 *                          (matcher "Task" also fires for the "Agent" tool)
 *
 * Credentials: an INSERT-ONLY anon key is embedded below so monitoring is
 * mandatory and requires zero per-dev setup. The anon key is safe to commit —
 * RLS on cortex_usage_events allows insert only (no select/update/delete).
 * Optionally overridden by ~/.claude/.cortex-telemetry.env (e.g. service_role
 * for local admin); that file is NEVER committed.
 * The script NEVER blocks or breaks a session: any failure => silent exit 0.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");

const HOME = os.homedir();
const MARKER = ".claude/commands/cortex/boot.md"; // "is this a Cortex project?"
const ENV_FILE = path.join(HOME, ".claude", ".cortex-telemetry.env"); // optional override
const DEBUG_LOG = path.join(HOME, ".claude", ".cortex-telemetry.log");
const HTTP_TIMEOUT_MS = 2000;

// Committed defaults: anon key with RLS insert-only policy. Safe to version.
const DEFAULT_ENV = {
  SUPABASE_URL: "https://hrrjbxgxmauhbzveiizr.supabase.co",
  SUPABASE_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhycmpieGd4bWF1aGJ6dmVpaXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNjEzMDgsImV4cCI6MjA5OTYzNzMwOH0.wNPxXnWeFymYOyMFz0-oovr1XmzXfFUZNiAJUVqlERk",
};

// Temporary debug: appends every invocation + decision. Remove once validated.
function dbg(msg) {
  try {
    fs.appendFileSync(DEBUG_LOG, `[${new Date().toISOString()}] ${msg}\n`);
  } catch {}
}

function bail(why) {
  if (why) dbg("SKIP: " + why);
  process.exit(0); // always succeed: telemetry must never disrupt the session
}

function loadEnv(file) {
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

function git(cwd, cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim() || null;
  } catch {
    return null;
  }
}

function insert(env, row) {
  const url = new URL(`${env.SUPABASE_URL}/rest/v1/cortex_usage_events`);
  const body = JSON.stringify([row]);
  const req = https.request(
    {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "POST",
      timeout: HTTP_TIMEOUT_MS,
      headers: {
        apikey: env.SUPABASE_KEY,
        Authorization: `Bearer ${env.SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    (res) => {
      let b = "";
      res.on("data", (c) => (b += c));
      res.on("end", () => {
        dbg(`HTTP ${res.statusCode} ${b.slice(0, 200)}`);
        process.exit(0);
      });
    }
  );
  req.on("timeout", () => { dbg("HTTP timeout"); req.destroy(); });
  req.on("error", (e) => bail("HTTP error: " + e.message));
  req.on("close", () => process.exit(0));
  req.write(body);
  req.end();
}

function main() {
  let raw = "";
  try {
    raw = fs.readFileSync(0, "utf8"); // hook payload on stdin
  } catch {
    return bail("no stdin");
  }

  let p;
  try {
    p = JSON.parse(raw);
  } catch {
    return bail("bad json: " + raw.slice(0, 200));
  }

  dbg(`IN event=${p.hook_event_name} tool=${p.tool_name || "-"} prompt=${JSON.stringify((p.prompt || "").slice(0, 80))}`);

  const cwd = p.cwd || process.cwd();

  // 1. Guard: only Cortex projects.
  if (!fs.existsSync(path.join(cwd, MARKER))) return bail("not a cortex project: " + cwd);

  // 2. Credentials: committed anon defaults, optionally overridden by env file.
  let env = { ...DEFAULT_ENV };
  if (fs.existsSync(ENV_FILE)) {
    try {
      env = { ...env, ...loadEnv(ENV_FILE) };
    } catch {}
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) return bail("missing SUPABASE_URL/KEY");

  // 3. Build the event.
  const event = p.hook_event_name;
  let row = null;

  if (event === "UserPromptSubmit") {
    const m = String(p.prompt || "").match(/^\s*(\/[A-Za-z0-9_:-]+)/);
    if (!m) return bail("prompt is not a command"); // plain prompt -> ignore
    row = { event_type: "command", command: m[1] };
  } else if (event === "PreToolUse" && (p.tool_name === "Task" || p.tool_name === "Agent")) {
    const agent = p.tool_input && p.tool_input.subagent_type;
    if (!agent) return bail("Task without subagent_type");
    row = { event_type: "agent", agent };
  } else {
    return bail("unhandled event/tool");
  }
  dbg(`MATCH ${row.event_type} ${row.command || row.agent}`);

  // 4. Enrich with git + session context.
  row.session_id = p.session_id || null;
  row.repo = (git(cwd, "rev-parse --show-toplevel") || "").split("/").pop() || null;
  row.git_user = git(cwd, "config user.name");
  row.git_email = git(cwd, "config user.email");
  row.git_branch = git(cwd, "rev-parse --abbrev-ref HEAD");
  row.git_commit = git(cwd, "rev-parse --short HEAD");

  // 5. Ship it (created_at defaulted server-side).
  insert(env, row);
}

try {
  main();
} catch {
  bail();
}
