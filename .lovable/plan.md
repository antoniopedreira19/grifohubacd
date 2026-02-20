
## Página de Eventos — Estratégia sem refatorar o que já existe

### Contexto atual

Os dois GrifoTalks já existem como **produtos** no banco de dados, com toda a infraestrutura funcionando:

- **GrifoTalk** (`id: 6ef525cb`) — template `form_grifo_talk`, NPS vinculado (`nps-grifotalk`)
- **GrifoTalk #2** (`id: a003647e`) — template `form_grifo_talk`, NPS vinculado (`nps-grifotalk-2`)

Isso significa que **não precisamos mexer no banco de dados nem nas páginas públicas**. A estratégia é criar uma "vista de Eventos" que **lê os mesmos produtos**, mas apresenta com uma interface orientada a eventos.

---

### Estratégia: View Layer sem quebrar nada

A abordagem é **criar uma coluna booleana `is_event` na tabela `products`** (nullable, default `false`). Produtos marcados como evento aparecem na aba Eventos. Produtos não marcados continuam aparecendo normalmente em Produtos.

Isso garante:
- Nenhuma funcionalidade existente é quebrada
- Os GrifoTalks continuam gerando deals, coletando NPS, aceitando inscrições
- A migração é feita simplesmente marcando `is_event = true` nos dois GrifoTalks existentes
- No futuro, qualquer produto pode virar um evento com um toggle

---

### O que será implementado

**1. Migração de banco de dados**

Adicionar coluna `is_event` na tabela `products`:
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_event boolean DEFAULT false;
```

Marcar os dois GrifoTalks existentes como eventos:
```sql
UPDATE products SET is_event = true 
WHERE id IN ('6ef525cb-5159-4a2e-b15a-26f2f2d4bff3', 'a003647e-c047-4e52-90f7-2f5abefd5e81');
```

**2. Página `src/pages/Eventos.tsx`**

Substituir o placeholder "Em Construção" por uma página completa com:

- Header com ícone e botão "Novo Evento"
- Cards de eventos (visual diferente do ProductCard, orientado a evento):
  - Data do evento (campo novo `event_date` no produto ou extraído do título por ora)
  - Modalidade: Presencial / Online
  - Número de inscritos (count de `form_submissions`)
  - Badge de status (Ativo/Inativo)
  - Ações: Ver Página Pública, Ver Confirmados, Ver NPS, Editar

**3. Novo componente `src/components/events/EventCard.tsx`**

Card visual diferente do ProductCard, com visual de evento:
- Destaque para data e modalidade
- Contador de participantes em tempo real (via query)
- Acesso direto ao NPS vinculado
- Acesso à lista de confirmados (já existe: `GrifoTalkAttendeesSheet`)

**4. Novo componente `src/components/events/NewEventDialog.tsx`**

Dialog simplificado para criar novo evento (subset do ProductWizard), com campos específicos:
- Nome do evento
- Data
- Modalidade (presencial / online / híbrido)
- Slug (URL pública de inscrição)
- Template de formulário (padrão: `form_grifo_talk`)
- `is_event = true` automaticamente

**5. Ajuste em `src/pages/Produtos.tsx`**

Filtrar para **não mostrar** produtos com `is_event = true`, mantendo a aba Produtos limpa e focada em produtos de venda.

---

### Campos adicionais no banco (opcionais, na mesma migração)

Para ter uma experiência de eventos mais rica, adicionar na mesma migração:
- `event_date` (timestamp) — data/hora do evento
- `event_modality` (text) — `'presencial'`, `'online'`, `'hibrido'`
- `event_location` (text) — endereço ou link da sala

Esses campos são opcionais e não afetam nada existente.

---

### Resumo técnico das mudanças

| Arquivo | Ação |
|---|---|
| Migração SQL | Adicionar `is_event`, `event_date`, `event_modality`, `event_location` em `products` |
| `src/pages/Eventos.tsx` | Substituir placeholder por página completa |
| `src/pages/Produtos.tsx` | Filtrar `is_event = false` (ou null) para não mostrar eventos |
| `src/components/events/EventCard.tsx` | Novo componente visual de card de evento |
| `src/components/events/NewEventDialog.tsx` | Dialog simplificado de criação de evento |
| `src/components/products/ProductEditSheet.tsx` | Adicionar campos `event_date`, `event_modality`, `event_location` quando `is_event = true` |

---

### O que NÃO muda

- Páginas públicas `/p/grifo-talk` e `/p/grifotalk-2` continuam funcionando
- Formulários de inscrição funcionando normalmente
- NPS `/nps/nps-grifotalk` e `/nps/nps-grifotalk-2` funcionando
- Deals no pipeline continuam sendo gerados
- A lógica de `GrifoTalkAttendeesSheet` é reutilizada diretamente
