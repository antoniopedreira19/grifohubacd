

## Problema

No mobile, o container principal usa `overflow-hidden` (linha 324) e `justify-center`, fazendo com que steps com muitas opções (como "Setores com equipe" com 7 itens) ultrapassem a viewport. A última opção fica escondida e não há como rolar.

## Solução

**Arquivo:** `src/components/templates/FormFunil360.tsx`

1. **Container principal** (linha 324): Trocar `overflow-hidden` por `overflow-y-auto` para permitir scroll. Mudar `justify-center` para `justify-start md:justify-center` para que no mobile o conteúdo comece do topo (evitando corte). Adicionar padding bottom extra (`pb-28`) para compensar a nav fixa no bottom.

2. **Scrollbar customizada**: Adicionar classes inline de estilo para scrollbar minimalista — track transparente, thumb em `rgba(225,216,207,0.15)` (tom do `#E1D8CF` com baixa opacidade, combinando com o fundo escuro), largura fina. Usar as utility classes `scrollbar-thin` já definidas no `src/index.css` e complementar com uma tag `<style>` específica para o thumb color correto.

3. **Padding no wrapper de opções**: Adicionar `pb-20 md:pb-0` no `div` interno (`max-w-2xl`) para garantir que a última opção não fique atrás da barra de navegação fixa no mobile.

