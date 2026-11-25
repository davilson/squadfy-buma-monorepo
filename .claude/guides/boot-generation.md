# CORTEX BOOT — Geração de Cache (PASSO 3.2 e 3.3)

> Lido pelo Boot APENAS em cache miss ou primeira execução.
> Em cache hit esses passos são pulados — este arquivo não é carregado.

---

## PASSO 3.2 — Gerar CORTEX_INDEX e CORTEX_CONTEXT Comprimido

Gerar dois arquivos em `docs/.cortex/` com dados DO PROJETO ATUAL.

### A. CORTEX_INDEX — `docs/.cortex/.cortex-index.json`

```json
{
  "schema_version": "1.6.0",
  "generated_at": "<ISO 8601>",
  "rules_count": 0,
  "adr_count": 0,
  "adrs_by_keyword": { "<keyword>": ["ADR-001"] },
  "adrs_index": { "ADR-001": "<título em até 60 chars>" }
}
```

**Algoritmo `adrs_by_keyword`:** para cada ADR em `adrs-summary.md`: tokenizar título+desc (lowercase, split por espaços/hífens), remover stopwords PT (a, o, de, do, da, para, com, em, que, uma, um, por, na, no, as, os, é, ser, ter, ou, não, mais, mas, quando, como) e tokens com menos de 3 chars, mapear `token → [ADR-ID]`.

### B. CORTEX_CONTEXT — `docs/.cortex/.cortex-context.json`

```json
{
  "schema_version": "1.6.0",
  "generated_at": "<ISO 8601>",
  "project_name": "<nome>",
  "project_version": "<versão ou null>",
  "tech_stack": "<frameworks principais separados por + — máx 80 chars>",
  "rules_count": 0,
  "adr_count": 0,
  "critical_rules_summary": ["<regra em 1 frase>"],
  "adrs_summary": ["ADR-001: <título>"],
  "widget_exceptions": [],
  "epics_completed": [],
  "epic_active": null,
  "ideas_backlog_count": 0
}
```

**Regras:**
- `critical_rules_summary`: 1 frase por regra (não copiar texto completo)
- `adrs_summary`: apenas `"ADR-NNN: <título>"` — sem corpo
- `epics_completed` / `epic_active`: preservar do arquivo existente; não redefinir
- `ideas_backlog_count`: `ls docs/business-context/backlog/*.md 2>/dev/null | wc -l | tr -d ' '`
- Arquivos NUNCA editados manualmente — regenerados pelo Boot

---

## PASSO 3.3 — Gerar Fingerprint

Criar/atualizar `docs/.cortex/.cortex-fingerprint.json`. **Usar Bash — NUNCA inventar valores.**

Para cada arquivo lido no GATE 0:

```bash
# tamanho em bytes
stat -f%z <arquivo>   # macOS  |  stat -c%s <arquivo>   # Linux
# mtime como epoch inteiro
stat -f%m <arquivo>   # macOS  |  stat -c%Y <arquivo>   # Linux
# sha256
shasum -a 256 <arquivo> | cut -d' ' -f1   # macOS  |  sha256sum <arquivo> | cut -d' ' -f1  # Linux
```

```json
{
  "schema_version": "1.6.0",
  "boot_timestamp": "<ISO 8601>",
  "files": {
    "docs/technical-context/project-briefing.md": {
      "size": 4219,
      "mtime": 1729686766,
      "checksum": "e9133314bc5888..."
    }
  }
}
```

Se Bash falhar: `"checksum": "unavailable"` e avisar usuário.
Se fingerprint já existe e foi cache hit: não reescrever — apenas atualizar `boot_timestamp`.
