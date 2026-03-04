

## Diagnostico de Performance das Landing Pages

### Problemas Identificados

**1. framer-motion no Mentoria360.tsx (~30KB gzipped)**
A pagina Mentoria360 importa `framer-motion` para animacoes simples de fade-in. Esse pacote e pesado e so e usado nessa pagina. Substituir por animacoes CSS nativas elimina esse peso do bundle.

**2. Google Fonts via @import dentro de `<style>` (render-blocking)**
Mentoria360 carrega fontes via `@import url(...)` dentro de uma tag `<style>`. Isso bloqueia a renderizacao. Deve ser movido para `<link>` com `preconnect` no `index.html`.

**3. Fonte externa CDN (DisketMono) sem preload**
Mentoria360 carrega uma fonte custom de `fonts.cdnfonts.com` via CSS `@font-face`. Sem preconnect ou preload, isso atrasa o rendering.

**4. YouTube iframe carregado eagerly**
Mentoria360 carrega o iframe do YouTube assim que a pagina renderiza, mesmo estando abaixo da dobra. Deve usar um facade (thumbnail + click-to-load).

**5. Imagens sem lazy loading nem dimensoes explicitas**
Varias landing pages nao usam `loading="lazy"` para imagens abaixo da dobra, nem definem `width`/`height`, causando layout shift (CLS).

**6. Imagens externas sem otimizacao de tamanho**
Vitrine carrega 6 imagens do Unsplash em 800px sem considerar o tamanho real do container (~350px). LpWebinarNovoPadrao carrega imagem do Supabase Storage sem parametros de resize.

**7. Script UTMify carregado sem estrategia**
LpWebinarCultura injeta script UTMify via DOM manipulation no useEffect, o que e correto (async/defer), mas pode ser melhorado.

---

### Plano de Implementacao

**Arquivos a modificar:**

| Arquivo | Mudancas |
|---|---|
| `index.html` | Adicionar `preconnect` para Google Fonts, CDN fonts, Supabase Storage, Unsplash |
| `src/pages/Mentoria360.tsx` | Remover framer-motion, substituir por CSS animations. YouTube facade. Mover fonts para index.html. Lazy loading em imagens below-fold. |
| `src/components/templates/LpWebinarNovoPadrao.tsx` | Lazy loading em imagens below-fold, dimensoes explicitas |
| `src/components/templates/LpWebinarCultura.tsx` | `loading="lazy"` em imagens below-fold, `width`/`height` explicitos |
| `src/pages/Vitrine.tsx` | Reduzir tamanho das imagens Unsplash (w=400), `loading="lazy"`, dimensoes explicitas |
| `src/pages/RedirectVitrine.tsx` | `loading="lazy"` no logo |
| `src/pages/RedirectWebinar.tsx` | `loading="lazy"` no logo |

**Detalhes tecnicos:**

1. **framer-motion → CSS**: `motion.div` com `fadeInUp` vira `div` com classes CSS de animacao usando `@keyframes` + `IntersectionObserver` via um hook leve `useInView`.

2. **YouTube Facade**: Substituir `<iframe>` por thumbnail + botao Play. Ao clicar, carrega o iframe. Elimina ~500KB de JS do YouTube no load inicial.

3. **index.html preconnects**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://naroalxhbrvmosbqzhrb.supabase.co" />
<link rel="preconnect" href="https://images.unsplash.com" />
```

4. **Imagens Unsplash**: Reduzir `w=800` para `w=400` nos cards da Vitrine (container tem ~350px de largura).

5. **Todas as imagens below-fold**: Adicionar `loading="lazy"` e `decoding="async"`.

