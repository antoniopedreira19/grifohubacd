

## Problema

1. **Imagem hero demora para aparecer**: A imagem vem de uma URL do Supabase Storage e só começa a baixar quando o React monta o componente. Mesmo com `fetchPriority="high"`, o browser precisa primeiro baixar o JS, executar, montar o React, e só então descobre a URL da imagem.

2. **Texto "(inserir métricas reais)"** aparece nos cards dos mentores (linhas 668 e 688).

## Solução

### 1. Preload da imagem hero no `index.html`

Adicionar `<link rel="preload">` no `<head>` do `index.html` para que o browser comece a baixar a imagem hero **imediatamente**, antes mesmo do JS carregar:

```html
<link rel="preload" as="image" href="https://naroalxhbrvmosbqzhrb.supabase.co/storage/v1/object/public/photos-wallpapers/WhatsApp%20Image%202026-02-16%20at%205.38.48%20PM%20(2).jpeg">
```

Isso elimina o delay porque o browser descobre a imagem no HTML inicial, não precisa esperar o React.

### 2. Remover "(inserir métricas reais)" dos mentores

**Arquivo:** `src/components/templates/LpWebinarNovoPadrao.tsx`

- Linha 668: remover ` (inserir métricas reais)` do texto do Daniel Gedeon
- Linha 688: remover ` (inserir métricas reais)` do texto do Estevão Farkasvölgyi

