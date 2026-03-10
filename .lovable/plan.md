

## Diagnóstico de Performance das Landing Pages

O arquivo `LpWebinarNovoPadrao.tsx` tem **1038 linhas** com todo o conteúdo inline. O fluxo crítico para `/p/:slug` é:

1. JS bundle carrega → React monta → `AuthProvider` inicializa (chama `supabase.auth.getSession()`) → Router resolve → `PublicPageRenderer` monta → fetch ao Supabase (product by slug) → lazy load do template → render

**Problemas identificados:**

- **AuthProvider bloqueia rotas públicas**: Mesmo para landing pages que não precisam de auth, o `AuthProvider` envolve toda a app e faz `getSession()` + `onAuthStateChange()` antes de renderizar qualquer coisa
- **Imagem hero pesada**: A imagem LCP vem do Supabase Storage (URL longa), sem `width`/`height` definidos, causando layout shift
- **Lucide-react com 15+ ícones**: Cada ícone importado individualmente adiciona ao chunk, mas isso já é tree-shaken pelo Vite
- **Todo o conteúdo num único componente**: 1038 linhas carregam de uma vez, mas como é lazy-loaded, o impacto é no chunk size, não no initial load

---

## Plano de Otimização

### 1. Separar rotas públicas do AuthProvider

**Arquivo: `src/App.tsx`**

Mover as rotas públicas (`/p/:slug`, `/nps/:slug`, `/mentoria-360`, etc.) para **fora** do `AuthProvider`. Essas rotas não precisam de autenticação e atualmente esperam pelo `getSession()` do Supabase antes de renderizar.

Estrutura proposta:
```text
<BrowserRouter>
  <Routes>
    {/* Public routes — NO AuthProvider */}
    <Route path="/p/:slug" element={<PublicPageRenderer />} />
    <Route path="/nps/:slug" element={...} />
    ...

    {/* Auth-dependent routes — wrapped in AuthProvider */}
    <Route element={<AuthProvider><Outlet /></AuthProvider>}>
      <Route path="/login" ... />
      <Route element={<ProtectedRoute />}>...</Route>
    </Route>
  </Routes>
</BrowserRouter>
```

Isso elimina a chamada `getSession()` para visitantes de landing pages, economizando ~200-500ms.

### 2. Adicionar `width`/`height` na imagem hero (LCP)

**Arquivo: `src/components/templates/LpWebinarNovoPadrao.tsx`**

Adicionar atributos `width` e `height` na imagem hero (linha 329-336) para evitar layout shift (CLS) e ajudar o browser a reservar espaço antes do download.

### 3. Lazy-load seções abaixo do fold

**Arquivo: `src/components/templates/LpWebinarNovoPadrao.tsx`**

Usar o hook `useInView` já existente no projeto para renderizar seções pesadas (FAQ com Accordion, grid de mentores, pricing cards) apenas quando entram no viewport. Isso reduz o trabalho inicial do React ao montar o componente.

Seções candidatas: Problem Section, Convergence, Mentores, Programação, Pricing, FAQ, Urgency, Guarantee — tudo abaixo do hero + countdown.

### 4. Preconnect ao domínio de imagens do Supabase Storage

**Arquivo: `index.html`**

Já existe preconnect ao Supabase API (`naroalxhbrvmosbqzhrb.supabase.co`). Verificar se o storage usa o mesmo domínio (sim, usa). Já coberto.

---

## Impacto Esperado

| Otimização | Ganho estimado |
|---|---|
| Remover AuthProvider das rotas públicas | -200-500ms (elimina getSession) |
| width/height na imagem hero | Melhora CLS score |
| Lazy-load seções below-fold | -100-300ms de TTI (menos DOM inicial) |

