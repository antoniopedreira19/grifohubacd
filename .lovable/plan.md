

## Diagnostico PageSpeed - Webinar Novo Padrao (Score 62)

### Problema Principal: Imagens locais poluindo TODOS os builds

O PageSpeed mostra que `/assets/daniel-ge….jpg` (2.2MB) e `/assets/mentoria-….jpg` (197KB) estao sendo carregados nesta pagina **mesmo que ela nao os use**. Isso acontece porque:

- `Mentoria360.tsx` importa `daniel-gedeon.jpg`, `mentoria-360-hero-bg.jpg`, `mentoria-360-solution-bg.jpg`, `mentoria-360-setup-bg.jpg`, `grifo-logo.png`
- `LpWebinarCultura.tsx` importa `daniel-gedeon.jpg`, `mentores-webinar-cultura.jpg`, `rafael-soares.jpg`
- Quando dois lazy chunks importam o mesmo asset (ex: `daniel-gedeon.jpg`), o Vite cria um modulo compartilhado que pode ser carregado junto com o vendor chunk principal, afetando TODAS as paginas

Isso explica os 2.4MB extras carregados desnecessariamente. E o maior problema de performance de todo o projeto.

### Solucao

Substituir TODOS os imports locais de imagens pesadas por URLs diretas (Supabase Storage ou caminhos em `/public/images/`). Imagens em `/public/` nao sao processadas pelo Vite e so carregam quando referenciadas via `<img src>`.

### Plano de Implementacao

| Arquivo | Mudanca |
|---|---|
| `src/pages/Mentoria360.tsx` | Remover imports de `@/assets/daniel-gedeon.jpg`, `mentoria-360-hero-bg.jpg`, `mentoria-360-solution-bg.jpg`, `mentoria-360-setup-bg.jpg`, `grifo-logo.png`. Usar URLs de `/images/` (arquivos ja existem em `public/images/`) ou Supabase Storage |
| `src/components/templates/LpWebinarCultura.tsx` | Remover imports de `@/assets/daniel-gedeon.jpg`, `mentores-webinar-cultura.jpg`, `rafael-soares.jpg`. Usar URLs de `/images/` ou Supabase Storage |
| Assets para `/public/images/` | Mover os arquivos de `src/assets/` que ainda nao existem em `public/images/` para la. Arquivos em public sao servidos estaticamente sem bundling |

### Nota sobre Google Fonts e DisketMono

O codigo fonte ja tem as correcoes (fonts nao-bloqueantes, DisketMono local). O PageSpeed mostra a versao deployada antiga. Apos deploy das mudancas, esses problemas desaparecem.

### Impacto Esperado

- **Payload**: -2.4MB por pagina (daniel-gedeon.jpg + mentoria bg nao serao mais bundled)
- **LCP**: 12.3s → ~4-5s (eliminando download desnecessario de 2.4MB)
- **Score**: 62 → 80+

