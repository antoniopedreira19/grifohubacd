

## Diagnostico: Imagem cortada no hero da LP Webinar Novo Padrao

### Causa

A imagem do hero usa a URL do Supabase **render** (`/render/image/public/...?width=800&quality=80`), que pode estar fazendo crop server-side ao redimensionar. Alem disso, o `rounded-2xl` com bordas grossas pode estar clipando conteudo nas bordas da imagem.

### Correcao

| Arquivo | Mudanca |
|---|---|
| `src/components/templates/LpWebinarNovoPadrao.tsx` | Trocar a URL de `/render/image/public/` para `/object/public/` (URL direta sem transformacao server-side). Manter `w-full h-auto` para que o browser exiba a imagem completa no tamanho correto. Reduzir o `rounded-2xl` para `rounded-xl` para menos clipping nas bordas. |

A imagem sera carregada no tamanho original sem crop. Como e a imagem LCP, manter `fetchPriority="high"`.

