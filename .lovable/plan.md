
# Otimizar carregamento da Landing Page do Webinar

## Problema
A landing page demora para carregar por varias razoes:

1. **Imagens pesadas embutidas no bundle** - As 3 fotos (hero, Daniel, Estevao) sao importadas como `import from "@/assets/..."`, o que faz o Vite incluir elas diretamente no bundle JavaScript ou gerar assets grandes sem otimizacao.

2. **Rotas nao usam lazy loading** - No `App.tsx`, todas as paginas (Dashboard, Pipeline, Leads, etc.) sao importadas de forma eagera. Quando alguem acessa `/p/slug`, o navegador ainda precisa baixar o codigo de TODAS as paginas administrativas antes de mostrar a landing page.

3. **Imagens sem lazy loading nativo** - As 3 imagens da LP carregam todas de uma vez, mesmo as que estao fora da tela (mentores la embaixo).

## Solucao

### 1. Lazy loading das rotas no App.tsx
Usar `React.lazy()` para todas as paginas, especialmente as administrativas. Assim, quem acessar `/p/slug` so baixa o codigo da landing page, nao o CRM inteiro.

### 2. Mover imagens para /public e adicionar loading="lazy"
- Mover as 3 imagens JPG de `src/assets/` para `public/images/`
- Referenciar via URL string (`/images/webinar-hero-duo.jpg`) em vez de import
- Adicionar `loading="lazy"` nas imagens dos mentores (que ficam abaixo da dobra)
- Manter a imagem hero sem lazy (ela precisa carregar rapido)

### 3. Adicionar atributos de performance nas imagens
- `decoding="async"` em todas as imagens
- `width` e `height` explicitos para evitar layout shift
- `fetchPriority="high"` na imagem hero

---

## Detalhes Tecnicos

### Arquivos modificados

**`src/App.tsx`**
- Substituir imports diretos por `React.lazy()` para todas as paginas
- Envolver as rotas em `<Suspense>` com fallback de loading

**`src/components/templates/LpWebinarNovoPadrao.tsx`**
- Remover `import webinarHeroDuo from "@/assets/..."` e similares
- Usar strings de URL: `"/images/webinar-hero-duo.jpg"`
- Adicionar `loading="lazy"` nas imagens de mentores
- Adicionar `decoding="async"` em todas as `<img>`

**`public/images/`**
- Mover `webinar-hero-duo.jpg`, `daniel-gedeon-obra.jpg`, `estevao-farkasvolgyi.jpg` para esta pasta

Essas mudancas devem reduzir significativamente o tempo de carregamento, especialmente para visitantes acessando a landing page pela primeira vez.
