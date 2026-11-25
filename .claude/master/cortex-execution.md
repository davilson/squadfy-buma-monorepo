# CORTEX EXECUTION MASTER (v1.8.1)

> Modo genérico de execução. Ativo na Janela 2 — Execução Técnica.
> Regras do projeto são lidas de `docs/` — nunca assumidas de memória.
> Aplica GATE 3 (ADR mapping) antes de cada arquivo e GATE 4 (plan consistency) na ativação.
> Este modo NÃO redefine arquitetura.

---

## Pré-condições Obrigatórias

**Nesta ordem:**
0. Branch de trabalho correta criada/trocada (PASSO 0)
1. Boot executado com GATE 0 aprovado
2. `context.md` e `architecture.md` existem em `docs/.cortex/sessions/<slug>/`
3. GATE 2 foi aprovado pela Strategy Mode (spec fechada)

Se qualquer pré-condição falhar → bloqueio imediato com mensagem clara.

---

## Escopo de Responsabilidade

```
boot → start → plan → work → pre-pr → pr

start:    criação/troca de branch de trabalho
plan:     criação do plan.md com fases
work:     execução fase a fase (GATE 3 por arquivo)
pre-pr:   validação final (GATE 5)
pr:       abertura de Pull Request
```

**Importante:** O "start" aqui refere-se ao `/engineer:start` (ou Cortex Platform Task que cria a session). A criação/troca de branch é obrigatória antes de qualquer implementação.

---

## Restrições Absolutas

**PROIBIDO:**
- Redefinir arquitetura já validada no `architecture.md`
- Alterar regras de negócio sem aprovação explícita
- Iniciar implementação sem `context.md` + `architecture.md`
- Assumir stack, ADRs ou regras de memória — sempre ler de `docs/`
- Assumir que env vars, arquivos externos ou serviços existem

**Se houver inconsistência detectada durante implementação:**
```
INCONSISTÊNCIA DETECTADA
Arquivo: <arquivo>
Esperado (architecture.md): <o que diz a spec>
Encontrado: <o que o código exige>
Impacto: <o que quebra>

Opções:
  A) Ajustar spec no architecture.md
  B) Documentar contorno como trade-off
  C) Escalar para Strategy Mode
Aguardando instrução. NÃO prosseguir automaticamente.
```

---

## Sequência de Ativação

### PASSO 0 — BRANCH DE TRABALHO (OBRIGATÓRIO)

Antes de qualquer implementação, verificar/criar a branch de trabalho:

1. **Identificar o slug** da session (formato: `tipo-NNN-descricao`)

2. **Verificar branch atual:**
   ```bash
   git branch --show-current
   ```

3. **Se já está na branch correta** (`feature/<slug>`, `fix/<slug>`, `chore/<slug>`):
   ```
   Branch atual: <branch atual> ✓
   Prosseguindo para Passo 1.
   ```

4. **Se precisa criar/trocar de branch:**
   ```
   Branch atual: <branch>
   Branch esperada: feature/<slug>
   
   Criar nova branch? [S/N]
   ```
   - Se "S": executar `git checkout -b feature/<slug>`
   - Se "N": aguarda instrução

5. **Se branch existe mas está desatualizada:**
   ```
   Branch <branch> existe mas está atrás de main/dev.
   Deseja fazer rebase? [S/N]
   ```

**Padrão de nomenclatura:**
| Tipo | Prefixo | Exemplo |
|------|---------|---------|
| Feature | `feature/` | `feature/001-login-oauth2` |
| Bug Fix | `fix/` | `fix/002-corrigir-timeout` |
| Chore | `chore/` | `chore/003-atualizar-deps` |

**Após branch configurada → prosseguir para PASSO 1.**

---

### PASSO 1 — Verificar CORTEX_CONTEXT + VALIDAR FINGERPRINT

1. Se Boot foi executado nesta janela: usar contexto existente.
2. Se não: executar boot completo (`/cortex:boot`) e aguardar GATE 0 antes de continuar.
3. **VALIDAR FINGERPRINT:**
   - Se Boot foi executado nesta mesma janela → fingerprint já validado pelo Boot.
     **SKIP**: não revalidar.
   - Se esta é uma nova janela de Execution (sem Boot prévio nela):
     - Ler `docs/.cortex/.cortex-fingerprint.json`
     - Para cada arquivo listado, obter mtime real via Bash (NUNCA assumir):
       ```bash
       stat -f%m <arquivo>   # macOS
       stat -c%Y <arquivo>   # Linux
       ```
     - Comparar com o `mtime` registrado no fingerprint
     - Se ALGUM arquivo mudou:
       ```
       DETECTADA MUDANÇA EM docs/
       Arquivo(s) modificado(s): <lista>
       Execute /cortex:boot para atualizar contexto.
       NÃO PROSSIGA — contexto pode estar desatualizado.
       ```

### PASSO 2 — Identificar a session via MANIFESTO

1. Perguntar: "Qual o slug da session? (formato: tipo-NNN-descricao)"
2. Validar padrão de slug. Se inválido, rejeitar.
3. Verificar no `docs/.cortex/sessions-manifest.json`:
   - Se session não existe: "Session '<slug>' não encontrada. Execute /cortex:strategy."
   - Se exists: exibir status do manifesto

Exibir:
```
Session encontrada no manifesto:
  <slug>
  Status: in_progress|closed
  Created: <timestamp>
  Files: context.md [✓/✗] — architecture.md [✓/✗] — plan.md [✓/✗]
```

### PASSO 3 — Verificar pré-requisitos (BLOQUEANTE)

```
docs/.cortex/sessions/<slug>/context.md         → OBRIGATÓRIO
docs/.cortex/sessions/<slug>/architecture.md    → OBRIGATÓRIO
```

**Se faltarem:**
```
BLOQUEADO: Spec não encontrada para slug "<slug>".
Execute /cortex:strategy para criar context.md + architecture.md.
```

### PASSO 4 — Carregar regras do projeto (via CORTEX_CONTEXT)

Usar `docs/.cortex/.cortex-context.json` (comprimido) se disponível:
- Ler `critical_rules_summary` para regras críticas
- Ler `adrs_summary` para lista de ADRs
- Se necessário detalhes completos: ler arquivos originais em `docs/technical-context/briefing/`

Se `docs/.cortex/.cortex-context.json` não existir:
```
BLOQUEADO: CORTEX_CONTEXT ausente em docs/.cortex/.
Execute /cortex:boot para gerar índices.
```

### PASSO 4B — Carregar Design Spec (se existir)

Verificar existência de `docs/.cortex/sessions/<slug>/design/design.md`:

**Se existir:**

Ler obrigatoriamente:
- Seção `## Ativos Protegidos` — registrar internamente
- Seção `## Telas e Fluxos` — inventário de telas, componentes e tokens esperados
- Campo `qaRequired` do manifesto `docs/.cortex/sessions/<slug>/design/manifest.json`

Exibir:
```
Design spec carregada: docs/.cortex/sessions/<slug>/design/design.md ✓
Ativos protegidos registrados: <N itens>
QA de Design: <obrigatório antes do merge / dispensado pelo Designer>
```

**Se não existir:**
```
Aviso: design.md não encontrado para slug "<slug>".
Se esta feature inclui telas ou componentes visuais:
Recomendado solicitar spec de design ao Designer antes de implementar UI.
Opções:
  [A] Aguardar Designer executar /cortex:design → [6] HANDOFF
  [B] Prosseguir sem spec (registrado no PR)
Aguardando instrução.
```

---

### PASSO 5 — GATE 4: Consistência Automática Plan + Architecture

**Verificação 1 — Timestamps (sempre):**

Obter timestamps reais via Bash:
```bash
stat -f%m docs/.cortex/sessions/<slug>/plan.md          # macOS
stat -f%m docs/.cortex/sessions/<slug>/architecture.md  # macOS
stat -c%Y docs/.cortex/sessions/<slug>/plan.md          # Linux
stat -c%Y docs/.cortex/sessions/<slug>/architecture.md  # Linux
```

Se `architecture.md` mais recente que `plan.md`:
```
GATE 4 ALERTA ⚠: Plan pode estar desatualizado.
  plan.md:         <epoch>
  architecture.md: <epoch> (mais recente)
Opção A: Recriar plan.md baseado na architecture.md atual
Opção B: Prosseguir ciente do risco
Aguardando instrução.
```

**Verificação 2 — Cobertura de arquivos (se plan.md existir):**

1. Ler seção `## Estrutura de Arquivos` de `architecture.md` — extrair caminhos
2. Ler `plan.md` — verificar quais caminhos aparecem nas fases

Para cada arquivo em `architecture.md` **não encontrado** em `plan.md`:
```
GATE 4 ALERTA ⚠: "<path>" em architecture.md não coberto por nenhuma fase do plan.md.
```

**Verificação 3 — Realidade do disco (fases marcadas como ✓):**

Para cada fase marcada como `✓ concluída` em `plan.md`:
- Extrair caminhos de arquivos listados na fase
- Verificar existência via Bash:
  ```bash
  test -f <path> && echo "exists" || echo "missing"
  ```

Para cada arquivo ausente no disco mas marcado como ✓ concluído:
```
GATE 4 ALERTA ⚠: fase "<nome>" marcada ✓ mas "<path>" não existe no disco.
Possível: fase marcada incorretamente ou arquivo deletado.
```

**Saída consolidada do GATE 4:**
- Se nenhuma inconsistência → `GATE 4 ✓ — Plan consistente.`
- Se alertas → listar todos; aguardar instrução para Opção A ou B antes de continuar

### PASSO 6 — Exibir status e confirmar dependências

```
Épico: <nome do context.md>
Objetivo: <uma linha>
Regras críticas do projeto: <contagem> regras carregadas
ADRs mapeadas: <contagem>

DEPENDÊNCIAS NECESSÁRIAS:
[Ler seção "Dependências Externas" de architecture.md e listar:]
  [ ] <VAR/arquivo/serviço> — confirmado?
  [ ] ...

Confirmar dependências antes de prosseguir com implementação.
```

---

## Abordagem ADR-First — GATE 3 Incremental (obrigatório por arquivo)

**Antes de implementar qualquer arquivo, executar:**

### GATE 3 — ADR Mapping Incremental para <arquivo>

1. **Extrair keywords** do nome do arquivo:
   - Ex: `auth-component.tsx` → keywords: ["auth", "component"]
   - Ex: `page.tsx` → keywords: ["page"]
   - Ex: `viewModel.ts` → keywords: ["viewmodel", "state"]

2. **Lookup em CORTEX_INDEX** (`docs/.cortex/.cortex-index.json` - preenchido dinamicamente pelo Boot):
   - Para cada keyword, buscar em `adrs_by_keyword`
   - Unificar resultados sem duplicatas

3. **Se keywords encontradas no index:**
   ```
   GATE 3 [<arquivo>] via INDEX:
     ADR-NNN: <regra específica aplicável>
     ADR-NNN: <regra específica aplicável>
   OK — prosseguindo.
   ```

4. **Se keywords NÃO encontradas no index:**
   ```
   GATE 3 [<arquivo>] — sem match no INDEX. Lendo adrs-summary.md...
     ADR-NNN: <regra específica aplicável>
     ADR-NNN: <regra específica aplicável>
   OK — prosseguindo.
   ```

5. **Se arquivo de ADRs não pôde ser lido → PARAR. Não inventar regras.**

6. **Se o arquivo for de UI** (extensões: `.tsx`, `.jsx`, `.vue`, `.css`, `.scss`, `.styles.*`, ou path contém `/components/`, `/pages/`, `/screens/`, `/views/`):

   **6a. Inventário pré-implementação contra spec da feature (`design.md`) — REGRA DE FIDELIDADE:**

   Se `docs/.cortex/sessions/<slug>/design/design.md` existir:

   **Se o arquivo for componente genérico/compartilhado** (sem mapeamento 1:1 com uma tela — ex: `Button.tsx`, `Input.tsx`, `Modal.tsx`, hooks, utilitários): verificar apenas tokens e ativos protegidos globais da seção `## Ativos Protegidos`; pular verificação de estados e microcopy específicos de tela.

   **Se o arquivo implementar uma tela ou componente específico da spec:**
   - Identificar qual tela/componente do `design.md` este arquivo implementa
   - Registrar internamente o inventário da spec para este componente/tela:
     - Estados esperados (Normal, Loading, Empty, Error, Success)
     - Edge cases documentados
     - Microcopy exato (CTAs, labels, mensagens de erro)
     - Motion/animações especificados
     - Ativos Protegidos desta tela (ícones, ilustrações, tokens)

   Se a implementação planejada divergir do inventário registrado, declarar ANTES de escrever o código:
   ```
   DIVERGÊNCIA DE DESIGN DETECTADA [GATE 3]:
     Arquivo: <arquivo>
     Tela/componente: <nome conforme design.md>
     Spec diz: <o que design.md especifica>
     Implementação prevista: <o que será implementado>
     Motivo: <razão técnica ou omissão>

   Opções:
     [A] Seguir a spec exatamente
     [B] Documentar divergência e prosseguir (registrado no PR)
     [C] Consultar Designer antes de prosseguir
   Aguardando instrução.
   ```

   **PROIBIDO sem confirmação explícita:**
   - Omitir ícones ou substituir por biblioteca diferente da especificada
   - Remover ilustrações marcadas como presentes na tela
   - Ignorar motion/animações especificados
   - Usar cores hardcoded ao invés dos tokens definidos em `design.md`
   - Simplificar ou remover variantes de componentes sem consulta
   - Alterar, parafrasear ou simplificar qualquer microcopy especificado

   Se `design.md` não existir para a session: registrar aviso e prosseguir.

   **6b. Verificação contra Design System global (`docs/design-context/`) — `design-compliance-checker`:**

   Após a verificação 6a, ativar `design-compliance-checker` com o arquivo em análise:
   - Verificar se componentes usados existem em `docs/design-context/components.md`
   - Verificar se valores de cor/tipografia/espaçamento usam tokens do DS (não hardcoded)
   - Verificar se princípios de UX de `docs/design-context/ux-principles.md` são respeitados
   - Verificar se padrões de feedback states de `docs/design-context/feedback-states.md` são seguidos

   Se `docs/design-context/` não existir: pular verificação e registrar aviso.

**Benefício do lookup incremental:**
- ~80% dos casos encontram ADRs via INDEX (sem reler arquivo)
- Apenas quando necessário: relê `adrs-summary.md` completo
- Economia média: ~120 tokens por arquivo

**NOTA: CORTEX_INDEX e CORTEX_CONTEXT são preenchidos dinamicamente pelo Boot com dados DO PROJETO ATUAL (docs/).**

---

## Durante o Work

- Avançar fase a fase conforme `plan.md`
- Ao final de cada fase:
  1. Pausar
  2. Listar arquivos criados/modificados
  3. Confirmar GATE 3 foi executado para cada arquivo
  4. Aguardar validação do usuário
  5. Atualizar `plan.md` com progresso real
  6. **ATUALIZAR MANIFESTO**: se plan.md foi criado → `files.plan.md: true`, `missing: [...]`
- Se fase não concluída: marcar como `⚠ parcial` em `plan.md`, não como `✓`

**Formato de reporte por fase:**
```
[FASE X — <nome> — ✓ concluída]
Arquivos: <lista>
ADRs aplicadas: <lista>
Próxima fase: <nome>
Dependências confirmadas: <lista ou "nenhuma adicional">
```

---

## GATE 5 — Pre-PR

Antes de invocar `/pre-pr`:

- [ ] Todas as fases do `plan.md` marcadas como `✓ concluída`?
- [ ] `plan.md` tem aprendizados de cada fase registrados?
- [ ] Nenhum arquivo de `architecture.md` foi pulado?

**Se a feature tem componentes de UI — verificação adicional de design:**

Checar se `docs/.cortex/sessions/<slug>/design/design.md` existe e GATE-D foi aprovado.

Se existir: verificar fidelidade à spec da feature (não re-executar design-compliance-checker global — já foi executado em GATE 3 6b por arquivo):
- Conferir divergências [B] registradas no PR: contar total
- Verificar se componentes implementados batem com os especificados no `design.md`
- Verificar se estados (loading, error, empty, success) foram implementados conforme spec
- Verificar se motion/interações foram implementados conforme especificado no `design.md`

**Threshold de re-avaliação de QA:** Se o total de divergências [B] registradas for ≥ 3:
```
ATENÇÃO: <N> divergências de design documentadas neste PR.
Independentemente do flag qaRequired, recomendado notificar o Designer antes do merge.
Prosseguir mesmo assim? [S/N]
```

Se threshold não atingido → verificar `qaRequired` no manifesto de design:

**Se `qaRequired: true`** (Designer exigiu QA neste handoff):

```
IMPLEMENTAÇÃO PRONTA PARA QA DE DESIGN

Ação do Dev — postar no Linear (comentário na task <slug>):

📋 Implementação pronta para QA de Design

Branch: <nome da branch>
Preview: <URL do preview — Vercel/Netlify/staging>
(Se não houver preview: compartilhar screenshots de todas as telas e estados)

Designer: executar /cortex:design → [7] QA para iniciar a revisão.
O PR permanece aberto até QA aprovado.
```

Atualizar manifesto do design: `handoff.implementation = "ready-for-qa"`.

**Se `qaRequired: false`** (Designer dispensou QA neste handoff):

```
QA de Design: dispensado pelo Designer para esta feature.
Spec verificada — PR pode prosseguir para merge após GATE 5.
```

Atualizar manifesto do design: `handoff.implementation = "ready-for-merge"`.

Se `design.md` não existir para feature com UI:
```
Aviso: feature tem componentes de UI mas design.md não encontrado na session.
Recomendado: Designer executar /cortex:design → [6] HANDOFF antes de fechar o PR.
Opções:
  [A] Aguardar Designer executar /cortex:design → [6] HANDOFF
  [B] Prosseguir sem spec (registrado no PR)
Aguardando instrução.
```

**Se qualquer item falhar:**
```
GATE 5 FALHOU
Fases pendentes: <lista>
Completar antes de executar /pre-pr.
```

---

## Checklist de Entrega (por arquivo)

```
[ ] Segue regras críticas de docs/technical-context/briefing/critical-rules.md?
[ ] Todas as ADRs mapeadas no GATE 3 foram respeitadas?
[ ] Estrutura de pastas conforme architecture.md?
[ ] Nenhuma dependência implícita não confirmada?
[ ] (se UI) Spec da feature respeitada: estados, edge cases, microcopy, motion e ativos protegidos conforme design.md (GATE 3 — 6a)
[ ] (se UI) Design System global respeitado: componentes do DS, tokens, UX principles, feedback states (GATE 3 — 6b)
```
