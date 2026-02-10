

# Captura Progressiva de Leads nos Formularios

## Objetivo
Salvar os dados do lead silenciosamente a cada troca de etapa ("Continuar"), sem esperar o submit final. Assim, mesmo que o lead abandone o formulario no meio, voce ja tera os dados que ele preencheu ate aquele ponto.

## Como vai funcionar

1. Quando o lead clica "Continuar" em qualquer etapa, antes de avancar para a proxima tela, o sistema salva os dados coletados ate ali no banco de dados (Supabase), em segundo plano.
2. O lead nao ve nenhum indicador de salvamento -- sem toasts, sem loading. A navegacao entre etapas continua instantanea.
3. Se o salvamento em segundo plano falhar, nada acontece para o lead. Ele continua preenchendo normalmente.
4. No submit final, o sistema atualiza o lead existente (ja criado nas etapas anteriores) em vez de criar um novo.

## Fluxo do usuario (nao muda nada visualmente)

```text
Etapa 1: Digita nome -> Clica "Continuar"
         [silenciosamente: cria lead parcial no banco com status "Parcial"]
         
Etapa 2: Digita email + whatsapp -> Clica "Continuar" ou "Enviar"
         [silenciosamente: atualiza o lead com email e telefone]
         
Submit final: Cria form_submission, deal (se configurado), e muda status para "Novo"
```

## Detalhes Tecnicos

### Arquivos que serao modificados

**1. `src/components/templates/FormBasic.tsx`**
- Adicionar um `useRef` para guardar o `leadId` parcial criado na primeira etapa.
- Modificar a funcao `nextStep` para chamar uma funcao `savePartialLead()` silenciosamente (fire-and-forget) antes de avancar.
- `savePartialLead()`:
  - **Etapa 0 -> 1**: Faz `upsert` na tabela `leads` com `full_name`, `origin`, `status: "Parcial"`. Guarda o `leadId` no ref.
  - **Etapa 1 -> submit**: Ja tem o `leadId`. Faz `update` com `email` e `phone`.
- No `submitMutation` final: Usa o `leadId` do ref (se existir) para atualizar em vez de criar. Muda `status` de "Parcial" para "Novo". Cria `form_submission` e `deal` normalmente.
- Todas as chamadas parciais usam `.then().catch()` (fire-and-forget), sem `await`, para nao bloquear a UI.

**2. `src/components/templates/FormHighTicket.tsx`**
- Mesma logica, mas com mais etapas:
  - Etapa 0 -> 1: Cria lead parcial com `full_name`
  - Etapa 1 -> 2: Atualiza com `email`, `phone`
  - Etapa 2 -> 3: Atualiza `answers` parciais (empresa, cargo)
  - Etapa 3 -> 4: Atualiza `answers` parciais (nicho, volume)
  - Etapa 4 -> submit: Fluxo final completo

**3. Outros formularios** (`FormConstruction.tsx`, `FormGrifoTalk.tsx`)
- Mesma logica aplicada, adaptada ao numero de etapas de cada um.

### Estrategia de salvamento

- Usar `useRef<string | null>(null)` para o `partialLeadId` -- refs nao causam re-render.
- A funcao `savePartialLead` e chamada dentro de `nextStep`, mas sem `await` -- ela roda em background.
- No primeiro save (sem leadId), cria o lead e salva o id no ref.
- Nos saves seguintes, faz update usando o id do ref.
- No submit final, verifica se ja existe `partialLeadId` para fazer update em vez de insert.
- O status "Parcial" permite diferenciar leads que completaram o formulario dos que abandonaram.

### Tratamento de erros

- Se o save parcial falhar, o erro e silenciosamente logado no console (sem toast).
- O submit final continua funcionando normalmente mesmo se nenhum save parcial teve sucesso (fallback para o fluxo atual de criar lead do zero).

### Impacto no banco de dados

- Nenhuma alteracao de schema necessaria. O campo `status` da tabela `leads` ja aceita texto livre, entao "Parcial" funciona sem migracao.
- Leads parciais (abandonados) ficam com `status = "Parcial"` para facil identificacao e filtragem.

