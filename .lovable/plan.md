

## Revisao de Performance - Problemas Remanescentes

Apos analise detalhada de todas as landing pages, os problemas anteriores (framer-motion, YouTube facade, preconnects, lazy loading) ja foram corrigidos. Restam os seguintes problemas:

### Problemas Identificados

**1. Mentoria360 - Fonte DisketMono ainda carregada via CSS inline (linha 63-67)**
A fonte `DisketMono` continua sendo carregada via `@font-face` dentro de uma tag `<style>` inline. Apesar do `font-display: swap`, nao ha `preconnect` para `fonts.cdnfonts.com` no `index.html` (ja temos preconnect mas sem o crossorigin). O download da fonte so inicia apos o CSS ser parseado, atrasando o rendering.

**2. LpWebinarNovoPadrao - Imagem hero do Supabase Storage sem otimizacao**
Linha 300: A imagem hero carrega a versao original do Supabase Storage (potencialmente varios MB). Nao ha parametros de resize na URL. Supabase Storage nao suporta transformacao de imagem nativamente, mas podemos ao menos garantir `loading="eager"` (ja tem) e adicionar dimensoes corretas.

**3. LpWebinarNovoPadrao - Imagens de speakers sem lazy loading**
Linhas 626 e 646: As imagens dos speakers (`/images/daniel-gedeon-obra.jpg` e `/images/estevao-farkasvolgyi.jpg`) ja tem `loading="lazy"` - OK.

**4. LpWebinarNovoPadrao - Countdown causa re-render a cada segundo**
O `useCountdown` hook atualiza o state a cada 1 segundo via `setInterval`, causando re-render de todo o componente (1048 linhas). Isso nao e um problema grave de performance percebido pelo usuario, mas e ineficiente.

**5. LpWebinarCultura - CSS `animate-fade-in` sem definicao**
Linhas 99, 122, 130, 152: Usa classes `animate-fade-in` que dependem de definicoes no Tailwind config. Se nao estiverem definidas, as animacoes nao funcionam (nao e performance, mas e um bug potencial).

**6. Inline `<style>` tags em Mentoria360 e Vitrine**
Ambas as paginas injetam blocos `<style>` inline com `@keyframes` e classes customizadas. Isso forca o browser a re-parsear o CSSOM a cada render. Mover para `src/index.css` centraliza e permite caching.

---

### Plano de Implementacao

| Arquivo | Mudanca |
|---|---|
| `src/index.css` | Mover `@keyframes fadeInUp`, `staggerIn`, `pulse-gold`, `grid-bg`, `font-disket`, `text-gradient-gold`, `ping-urgent` das tags `<style>` inline para o CSS global |
| `src/pages/Mentoria360.tsx` | Remover bloco `<style>` inline (mover CSS para index.css) |
| `src/pages/Vitrine.tsx` | Remover bloco `<style>` inline (mover CSS para index.css) |
| `src/components/templates/LpWebinarNovoPadrao.tsx` | Isolar countdown em componente separado com `React.memo` para evitar re-render do componente inteiro |
| `index.html` | Adicionar `crossorigin` no preconnect de `fonts.cdnfonts.com`; adicionar `<link rel="preload">` para a fonte DisketMono |

**Impacto esperado:**
- Eliminacao de re-parse CSS a cada render (inline style → global CSS)
- Reducao de re-renders desnecessarios no LpWebinarNovoPadrao
- Carregamento mais rapido da fonte DisketMono via preload

