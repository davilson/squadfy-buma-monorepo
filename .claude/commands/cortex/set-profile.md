# Cortex — Mudar Perfil

Você vai mudar o perfil ativo do Cortex para este projeto.

---

## PASSO 1 — Mostrar perfil atual

Ler o perfil atual de `.claude/settings.local.json`:

```bash
cat .claude/settings.local.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('cortex',{}).get('profile','(não configurado)'))"
```

Exibir: `Perfil atual: <valor>`

---

## PASSO 2 — Selecionar novo perfil

Exibir o menu abaixo em texto e pedir que o usuário responda com o número:

```
Selecione o perfil [1-6]:

  [1] Frontend Engineer   — STRATEGY, EXECUTION  (UI, React, design systems)
  [2] Backend Engineer    — STRATEGY, EXECUTION  (APIs, banco de dados, infra)
  [3] Full-stack Engineer — STRATEGY, EXECUTION  (frontend + backend completo)
  [4] Designer            — DESIGN, IDEIA        (UX/UI, Figma, handoff)
  [5] Product Manager     — STRATEGY             (Epic, Modify, Ideia, spec)
  [6] Tech Lead           — acesso total         (STRATEGY + DESIGN + EXECUTION)

Sua escolha [1-6]:
```

Aguardar a resposta do usuário (número de 1 a 6 ou o nome do perfil).

---

## PASSO 3 — Salvar

Mapear label → valor de perfil:

| Label selecionado | Valor |
|-------------------|-------|
| Frontend Engineer | `frontend` |
| Backend Engineer | `backend` |
| Full-stack Engineer | `fullstack` |
| Designer | `designer` |
| Product Manager | `product` |
| Tech Lead | `techlead` |

Salvar em `.claude/settings.local.json` sem sobrescrever as demais chaves (merge JSON):

```bash
python3 - <<'EOF'
import json, sys
path = ".claude/settings.local.json"
try:
    with open(path) as f:
        data = json.load(f)
except:
    data = {}
if "cortex" not in data:
    data["cortex"] = {}
data["cortex"]["profile"] = "NOVO_PERFIL"
with open(path, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("Perfil salvo.")
EOF
```

Substituir `NOVO_PERFIL` pelo valor mapeado.

---

## PASSO 4 — Confirmação

Exibir:

```
✅ Perfil atualizado: <label selecionado> (<valor>)
   Modos disponíveis: <listar os modos do perfil>

Execute /cortex:boot para iniciar uma sessão com o novo perfil.
```

Modos por perfil para exibir na confirmação:

| Perfil | Modos |
|--------|-------|
| frontend | STRATEGY, EXECUTION |
| backend | STRATEGY, EXECUTION |
| fullstack | STRATEGY, EXECUTION |
| designer | DESIGN, IDEIA |
| product | STRATEGY |
| techlead | STRATEGY, DESIGN, EXECUTION |
