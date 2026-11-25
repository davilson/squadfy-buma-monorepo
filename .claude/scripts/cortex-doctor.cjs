#!/usr/bin/env node
/**
 * cortex doctor — valida a integridade do próprio framework.
 *
 * Pega a classe de bug que passa despercebida em revisão manual:
 * referências a agentes/comandos que foram renomeados ou removidos,
 * divergência de schema_version e uso indevido do status `closed`.
 *
 * Uso:  node .claude/scripts/cortex-doctor.cjs   (ou npm run doctor)
 * Exit: 0 = ok (ou só avisos)   1 = há erro
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const CLAUDE = path.join(ROOT, ".claude");

const errors = [];
const warns = [];

const rel = (p) => path.relative(ROOT, p);

function walk(dir, ext = ".md") {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full, ext);
    return e.name.toLowerCase().endsWith(ext) ? [full] : [];
  });
}

// ---------------------------------------------------------------- inventário

const agentFiles = walk(path.join(CLAUDE, "agents"));
const agents = new Set();
for (const f of agentFiles) {
  const src = fs.readFileSync(f, "utf8");
  const m = src.match(/^---\r?\n[\s\S]*?^name:\s*(.+?)\s*$/m);
  const name = m ? m[1].trim() : path.basename(f, ".md");
  if (m && name !== path.basename(f, ".md")) {
    warns.push(`${rel(f)}: frontmatter name "${name}" difere do nome do arquivo`);
  }
  agents.add(name);
}

const commandFiles = walk(path.join(CLAUDE, "commands"));
const commands = new Set(
  commandFiles.map((f) => {
    const p = path.relative(path.join(CLAUDE, "commands"), f).replace(/\.md$/, "");
    return p.split(path.sep).join(":");
  })
);

const guideFiles = walk(path.join(CLAUDE, "guides"));

// ------------------------------------------------- 1. referências a agentes

// Identificador em backtick cujo sufixo é típico de nome de agente. Não exige
// palavra-chave na linha: em listas ("- `code-reviewer` — ...") não há nenhuma.
const AGENT_SUFFIX =
  /-(specialist|expert|architect|checker|reviewer|engineer|planner|writer|developer|analyst|orchestrator|keeper|sync|setup|designer|guardian|debugger|generate|qa|lead)$/;

// Vocabulário do framework que colide com o padrão de nome de agente. Ex.: `design-qa`
// é token de `solo.skipped`, não agente — e o sufixo `qa` não pode sair do regex porque
// `email-template-qa` é agente de verdade.
const NON_AGENT = new Set([
  "design-qa",
  "design-spec",
  "pm-approval",
  "ready-for-qa",
  "ready-for-merge",
  "pending-handoff",
]);

for (const f of [...commandFiles, ...guideFiles, ...walk(path.join(CLAUDE, "profiles"))]) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/`([a-z][a-z0-9]+(?:-[a-z0-9]+){1,4})`/g)) {
      const ref = m[1];
      // ignora comandos, caminhos e palavras genéricas
      if (ref.includes(":") || ref.includes("/") || ref.includes(".")) continue;
      if (agents.has(ref)) continue;
      if (NON_AGENT.has(ref)) continue;
      if (!AGENT_SUFFIX.test(ref)) continue;
      errors.push(`${rel(f)}:${i + 1}: agente inexistente \`${ref}\``);
    }
  });
}

// ------------------------------------------------ 2. referências a comandos

for (const f of [...commandFiles, ...guideFiles]) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    // ignora linhas que são URL/endpoint: `labels/priority:high` não é comando
    if (/https?:\/\/|api\.github\.com/.test(line)) return;
    for (const m of line.matchAll(/\/([a-z][a-z0-9-]*):([a-z][a-z0-9-]*)/g)) {
      const ref = `${m[1]}:${m[2]}`;
      if (commands.has(ref)) continue;
      // namespaces com subpastas ou comandos com argumento
      if ([...commands].some((c) => c.startsWith(ref + ":"))) continue;
      warns.push(`${rel(f)}:${i + 1}: comando não encontrado \`/${ref}\``);
    }
  });
}

// ------------------------------------------------------ 3. schema_version

const schemas = new Map();
for (const f of [...commandFiles, ...guideFiles]) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/"schema_version":\s*"([^"]+)"/g)) {
    if (!schemas.has(m[1])) schemas.set(m[1], []);
    schemas.get(m[1]).push(rel(f));
  }
}
if (schemas.size > 1) {
  warns.push(
    `schema_version divergente entre arquivos: ${[...schemas.entries()]
      .map(([v, fs_]) => `${v} (${fs_.length}x)`)
      .join(", ")}`
  );
}

// ------------------------------------- 4. quem escreve status "closed"

const CLOSED_WRITER = "commands/engineer/pr.md";
for (const f of commandFiles) {
  const r = rel(f).replace(/^\.claude\//, "");
  if (r === CLOSED_WRITER) continue;
  const lines = fs.readFileSync(f, "utf8").split("\n");
  const WRITE_CUE = /atualiz|adicionar|adicione|gravar|grave|marcar|marque|escrever|escreva|ATUALIZAR MANIFESTO/i;
  lines.forEach((line, i) => {
    if (/status['"]?\s*[:=]\s*"closed"/.test(line)) {
      // só é problema se a instrução é de ESCRITA; leituras/mapeamentos são legítimos
      const ctx = lines.slice(Math.max(0, i - 3), i + 1).join(" ");
      if (!WRITE_CUE.test(ctx)) return;
      errors.push(
        `${rel(f)}:${i + 1}: escreve status "closed" — só /engineer:pr pode. Use "spec_closed" se a intenção é "spec fechada"`
      );
    }
  });
}

// ----------------------------------------- 5. arquivos citados que não existem

for (const f of [...commandFiles, ...guideFiles]) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/`(\.claude\/[A-Za-z0-9_./-]+\.(?:md|json|cjs|js))`/g)) {
      if (!fs.existsSync(path.join(ROOT, m[1]))) {
        errors.push(`${rel(f)}:${i + 1}: arquivo citado não existe: ${m[1]}`);
      }
    }
  });
}

// -------------------------------------------------------------- 6. VERSION

const version = fs.readFileSync(path.join(ROOT, "VERSION"), "utf8").trim();
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
if (pkg.version !== version) {
  errors.push(`VERSION (${version}) != package.json version (${pkg.version})`);
}

// ---------------------------------------------------------------- relatório

const dedup = (a) => [...new Set(a)];
const errs = dedup(errors);
const wrns = dedup(warns);

console.log(`cortex doctor — ${agents.size} agentes, ${commands.size} comandos, v${version}\n`);

if (errs.length) {
  console.log(`ERRO (${errs.length}):`);
  errs.forEach((e) => console.log(`  ✗ ${e}`));
  console.log("");
}
if (wrns.length) {
  console.log(`AVISO (${wrns.length}):`);
  wrns.forEach((w) => console.log(`  ⚠ ${w}`));
  console.log("");
}
if (!errs.length && !wrns.length) console.log("✓ nada a reportar");

process.exit(errs.length ? 1 : 0);
