

## Diagnóstico: Tela branca de 2-4s nas landing pages

O Lovable roda Vite + React SPA. Não é possível migrar para Next.js/SSR neste ambiente. Porém, existem duas técnicas eficazes que eliminam a tela branca sem mudar de framework:

### Solução 1: Skeleton inline no `index.html`

Colocar HTML/CSS puro dentro do `<div id="root">` que é exibido instantaneamente e substituído quando o React monta. Isso elimina a tela branca.

**Arquivo: `index.html`**
- Dentro de `<div id="root">`, adicionar um skeleton styled com CSS inline que imita o visual da landing page: fundo escuro (#0b1c2e), logo Grifo centralizada, headline placeholder, e um shimmer animation
- Quando React montar, esse conteúdo é automaticamente substituído

### Solução 2: Preload do bundle e assets críticos

**Arquivo: `index.html`**
- Adicionar `<link rel="modulepreload">` para o entry point JS (Vite gera isso automaticamente no build, mas podemos forçar)
- Preconnect ao Supabase storage (onde estão as imagens das LPs): `<link rel="preconnect" href="https://naroalxhbrvmosbqzhrb.supabase.co">`

### Solução 3: Reduzir o caminho crítico nas páginas `/p/:slug`

**Arquivo: `src/pages/PublicPageRenderer.tsx`**
- O fluxo atual é: JS carrega → React monta → fetch ao Supabase (product by slug) → lazy load do template → render
- Otimização: mover o fallback do `<Suspense>` para mostrar um skeleton visual rico (não apenas spinner) enquanto o template carrega

### Implementação detalhada

1. **`index.html`**: Adicionar dentro de `<div id="root">` um skeleton com:
   - Background `#0b1c2e`, logo Grifo (URL já usada no projeto), texto "Carregando..." sutil
   - CSS inline com animação shimmer
   - `<style>` inline (não depende de JS)

2. **`index.html`**: Adicionar preconnect ao Supabase storage

3. **`src/pages/PublicPageRenderer.tsx`**: Trocar o spinner genérico por um skeleton visual que combine com o tema escuro das LPs — mostrando placeholders de headline, countdown e CTA

Essas 3 mudanças combinadas reduzem a percepção de espera de ~3s para <0.5s sem precisar de SSR.

