

## Diagnostico PageSpeed - Mentoria 360 (Score 65)

### Problemas Criticos Identificados

**1. Imagem LCP (daniel-gedeon.jpg) = 2.2MB, 1440x1920px**
Este e o problema #1. A imagem do hero e o LCP element e tem 2.2MB. E exibida em no maximo 420x520px. Isso sozinho causa o LCP de 12.1s. Como e um asset local importado via Vite, nao ha como redimensionar em runtime. A solucao e:
- Hospedar a imagem otimizada no Supabase Storage e carregar via URL com parametros de resize
- Ou substituir o arquivo local por uma versao comprimida/redimensionada

**2. Google Fonts render-blocking (990ms)**
As duas tags `<link rel="stylesheet">` do Google Fonts bloqueiam a renderizacao. Devem ser carregadas de forma nao-bloqueante usando `media="print" onload="this.media='all'"`.

**3. DisketMono retornando 404**
O PageSpeed mostra que `DisketMono-Regular.woff` retorna 404 do cdnfonts.com. O preload e o @font-face estao apontando para uma URL quebrada. Precisamos encontrar uma URL valida ou hospedar a fonte localmente.

**4. Preconnects nao usados na /mentoria-360**
`images.unsplash.com` e `naroalxhbrvmosbqzhrb.supabase.co` nao sao usados nessa pagina mas estao no index.html. Excesso de preconnects prejudica (o proprio PageSpeed avisa). Remover os que nao sao universais.

**5. grifo-logo.png = 67KB (500x500 exibido em 56x56)**
O logo e um PNG de 500x500 sendo exibido em ~40x40. Deveria ser redimensionado.

**6. Preload de imagens no index.html com paths /src/assets/**
As linhas `<link rel="preload" as="image" href="/src/assets/daniel-gedeon.jpg">` nao funcionam em producao porque o Vite faz hash dos assets. Esses preloads sao ineficazes no build.

---

### Plano de Implementacao

| Arquivo | Mudanca |
|---|---|
| `index.html` | (1) Tornar Google Fonts nao-bloqueante com `media="print" onload`. (2) Remover preconnects nao usados universalmente (unsplash, supabase). (3) Remover preloads de `/src/assets/` que nao funcionam em producao. (4) Corrigir URL do DisketMono ou remover preload quebrado. |
| `src/pages/Mentoria360.tsx` | Substituir import local de `daniel-gedeon.jpg` por URL do Supabase Storage com resize (`/render/image/public/...?width=500&quality=80`). Mesma abordagem para `grifo-logo.png` (reduzir para width=80). Tambem para `mentoria-360-hero-bg.jpg` e `mentoria-360-solution-bg.jpg` e `mentoria-360-setup-bg.jpg` se forem pesados. |
| `src/index.css` | Atualizar URL do @font-face do DisketMono para uma que funcione, ou usar fallback seguro. |

**Impacto esperado:**
- **LCP**: 12.1s → ~3-4s (eliminando 2MB da imagem principal)
- **FCP**: 3.0s → ~1.5s (removendo render-blocking fonts)
- **Score**: 65 → 85+

**Nota importante:** Para a imagem do Daniel Gedeon, a melhor solucao e fazer upload de uma versao otimizada (max 500px largura, qualidade 80%, formato WebP) no Supabase Storage e usar a URL com transformacao. Se o Supabase Storage do projeto suporta Image Transformations, podemos usar `/render/image/public/` com `?width=500&quality=80`. Caso contrario, o arquivo precisa ser re-exportado manualmente em tamanho menor.

