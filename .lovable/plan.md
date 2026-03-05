

## Mudança na lógica de redirect do Funil 360

### Situação atual
O formulário redireciona o usuário **durante** as perguntas:
- Se cargo != "Sócio / Proprietário" → redireciona imediatamente para `/redirect-vitrine` (step 0)
- Se faturamento < 1M → redireciona imediatamente para `/redirect-webinar` (step 1)

### Nova lógica
Todos os usuários completam o formulário inteiro. O redirect acontece **após o envio**, baseado na combinação cargo + faturamento:

| Cargo | Faturamento | Ação |
|---|---|---|
| Sócio / Proprietário | >= 1M (1M-5M, 5M-10M, 10M-50M, +50M) | Fluxo normal: salva lead, cria deal, vai para página de obrigado |
| Sócio / Proprietário | < 1M (<500k, 500k-1M) | Redirect externo: `https://www.grifocrm.com.br/p/masterclass-o-novo-padrao-da-construcao` |
| Qualquer outro cargo | >= 1M | Redirect externo: `https://www.grifocrm.com.br/p/masterclass-o-novo-padrao-da-construcao` |
| Qualquer outro cargo | < 1M | Redirect para `/redirect-vitrine` |

### Mudanças técnicas

**Arquivo:** `src/components/templates/FormFunil360.tsx`

1. **`handleCargoSelect`** (linhas 165-174): Remover o redirect. Apenas setar o valor e avançar para step 1 (faturamento).

2. **`handleFaturamentoSelect`** (linhas 176-185): Remover o redirect. Apenas setar o valor e avançar para step 2.

3. **`handleSubmit`** (linhas 233-317): Após salvar o lead e o form_submission, avaliar a combinação cargo + faturamento:
   - Se Sócio + faturamento >= 1M: manter fluxo atual (cria deal se configurado, navega para obrigado)
   - Nos outros 3 cenários: salva lead e submission (sem criar deal), e faz o redirect adequado usando `window.location.href` (para URLs externas) ou `navigate` (para internas)

4. **Navegação** (linha 479): Ajustar a condição `step > 1` para `step > 0` já que agora step 0 e 1 não fazem auto-advance com redirect, precisam do botão Voltar a partir do step 1.

