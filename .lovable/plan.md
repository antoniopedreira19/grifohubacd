## Ajustes no filtro "Filtros de respostas" (página /leads)

### 1. Remover campos de identificação (ex.: nome da empresa)
Em `answersFieldsForProduct` (src/pages/Leads.tsx), aplicar uma blacklist de chaves que não fazem sentido como filtro categórico (são texto livre / dados de contato), pulando-as ao agregar:

- `nome`, `name`, `nome_completo`
- `email`, `e_mail`
- `telefone`, `whatsapp`, `phone`, `celular`
- `empresa`, `company`, `nome_empresa`, `company_name`, `razao_social`

Match case-insensitive. Assim o campo "nome da empresa" (e demais identificadores) não aparece mais no popover, e também não vira coluna duplicada de filtragem.

### 2. Corrigir scroll do popover
O `ScrollArea` está com `max-h-[420px]`, que no Radix ScrollArea não rola corretamente (precisa de altura definida no viewport interno). Trocar por:

- `<ScrollArea className="h-[420px]">` (altura fixa) e manter o `<div className="p-3 space-y-4">` interno.

Isso garante que, quando há muitos campos/valores, o conteúdo role dentro do popover.

### Arquivos
- `src/pages/Leads.tsx` — ajustar `answersFieldsForProduct` (blacklist) e o `ScrollArea` do `PopoverContent`.

Sem mudanças de schema, RLS ou lógica de exportação.
