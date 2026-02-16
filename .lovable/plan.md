

## Plano: Trocar a foto da Hero Section do Webinar

### Problema
A imagem da hero section ainda mostra a foto antiga. As tentativas anteriores de copiar o arquivo local não funcionaram corretamente. A solução e usar diretamente a URL do Supabase Storage onde a foto correta ja esta hospedada.

### O que sera feito

1. **Atualizar a `src` da imagem no componente `LpWebinarNovoPadrao.tsx`** - substituir `/images/webinar-hero-duo.jpg` pela URL do Supabase Storage:
   `https://naroalxhbrvmosbqzhrb.supabase.co/storage/v1/object/public/photos-wallpapers/WhatsApp%20Image%202026-02-16%20at%205.38.48%20PM%20(2).jpeg`

2. **Mostrar a imagem tambem no mobile** - atualmente o container da imagem usa `hidden md:flex`, o que esconde no mobile. Vamos trocar para `flex` para aparecer em ambos os tamanhos de tela.

### Detalhes tecnicos

- **Arquivo**: `src/components/templates/LpWebinarNovoPadrao.tsx`
- **Linha ~298**: Trocar `hidden md:flex` por `flex`
- **Linha ~300**: Trocar `src="/images/webinar-hero-duo.jpg"` pela URL completa do Supabase Storage
- Nenhum arquivo de imagem local precisa ser copiado, pois usaremos a URL externa diretamente

