## Objetivo
Adicionar na página `/leads` filtros baseados nas respostas do histórico de formulários e permitir exportar XLSX incluindo essas respostas.

## Como vai funcionar

### 1. Filtros por respostas
Como cada produto tem campos diferentes (ex.: Mentoria 360 tem `faturamento`, `estado`, `cargo`, `ticket_medio`, `obras_simultaneas`, etc; GBC tem `revenue`, `niche`, `role`…), os filtros por resposta só fazem sentido quando há um produto selecionado.

Comportamento:
- Quando o filtro "Produto" estiver em **Todos**: nenhum filtro de resposta aparece (igual hoje).
- Quando um **produto específico** for selecionado: aparece um botão **"Filtros de respostas"** ao lado dos filtros existentes. Ao clicar, abre um popover com um seletor para cada campo daquele produto (ex.: Faturamento, Estado, Cargo, Ticket médio…). Cada campo lista os valores únicos encontrados nas submissões daquele produto, com multi-seleção.
- Um lead aparece se tiver pelo menos uma `form_submission` daquele produto que satisfaça TODOS os filtros marcados (AND entre campos, OR entre valores do mesmo campo).
- Badge mostrando quantos filtros estão ativos + botão "Limpar".

### 2. Exportação XLSX enriquecida
Substituir o botão `XLSX` atual para exportar:
- Colunas fixas: Nome, Email, Telefone, Estado (DDD), LTV, Status, Origem, Cadastro.
- Colunas dinâmicas: uma coluna por campo de resposta encontrado nas submissões dos leads exportados (ex.: `Mentoria 360 — faturamento`, `Mentoria 360 — estado`, `GBC — revenue`…). Se um lead tem múltiplas submissões do mesmo produto, usa a mais recente.
- Quando há produto selecionado no filtro, exporta apenas as colunas daquele produto (mais limpo). Quando "Todos", exporta todos os campos de todos os produtos com prefixo do nome do produto.
- Arrays (ex.: `setores_atuacao`) são serializados como `valor1; valor2`.

## Detalhes técnicos
- Buscar `form_submissions` (com `product_id` e `answers`) no mesmo `useQuery` ou em query separada com cache.
- Construir o mapa `valores únicos por campo por produto` em memória (client-side) — datasets atuais são pequenos (<1k subs).
- Filtragem: estender o `.filter()` existente em `Leads.tsx` para cruzar com as submissões do lead.
- Exportação: estender `handleExportXLSX` para fazer o `flatten` dos answers conforme regra acima usando `xlsx` (já está no projeto).
- Sem mudanças de schema/RLS.

## Pergunta
Confirma esse comportamento, ou prefere algo diferente em algum ponto (ex.: filtros aparecendo sempre, mesmo sem produto selecionado)?