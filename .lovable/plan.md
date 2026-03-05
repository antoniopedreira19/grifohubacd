

## Problema: Tela "Carregando..." antes da LP

A LP do webinar passa por **duas camadas de loading** antes de renderizar:

1. **Supabase query** (`PublicPageRenderer.tsx` linhas 30-38) — mostra spinner + "Carregando..." enquanto busca o produto no banco
2. **Suspense fallback** (`PublicPageRenderer.tsx` linhas 61-66) — mostra outro spinner enquanto o lazy component carrega

Isso causa uma experiencia amadora: o usuario ve uma tela cinza com spinner antes de ver a LP.

### Solucao

| Arquivo | Mudanca |
|---|---|
| `src/pages/PublicPageRenderer.tsx` | Remover o texto "Carregando..." e substituir ambos os fallbacks (loading state e Suspense) por um fundo escuro (`bg-[#112232]`) sem texto, apenas com um spinner minimalista discreto. Isso combina com o fundo da LP e faz a transicao parecer seamless. |
| `src/components/templates/LpWebinarNovoPadrao.tsx` (hero img) | Adicionar `loading="eager"` na hero image para garantir que o browser comece a baixar a imagem imediatamente, sem lazy loading padrao. |

O fundo escuro (#112232) e a cor dominante das LPs (webinar e mentoria), entao o loading sera quase imperceptivel — apenas um spinner sutil no mesmo tom de fundo.

