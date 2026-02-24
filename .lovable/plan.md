

## Formularios de Funil + Paginas de Redirecionamento

### Arquitetura

As paginas Vitrine e Redirect Webinar serao **rotas fixas** no App.tsx (como `/mentoria-360`), sem associacao a produto. Os dois formularios serao **templates registrados** no banco e no registry, associaveis a produtos via `/p/:slug`.

```text
ROTAS FIXAS (standalone):
  /vitrine          → LpVitrine.tsx
  /redirect-webinar → LpRedirectWebinar.tsx

TEMPLATES DE PRODUTO (via /p/:slug):
  form_funil_360      → FormFunil360.tsx
  form_funil_frontend → FormFunilFrontend.tsx
```

---

### Logica de Redirecionamento

```text
FORMULARIO 360 (Trafego Frio)
├── Cargo
│   ├── NAO e Socio → navigate("/vitrine")
│   └── E Socio → Faturamento
│       ├── < R$1M → navigate("/redirect-webinar")
│       └── >= R$1M → Raio-X → Contato → Submit

FORMULARIO FRONT-END (Ja comprou Webinar)
├── Bloco 1: Contato (nome, whatsapp, email, instagram)
├── Cargo
│   ├── NAO e Socio → navigate("/vitrine")
│   └── E Socio → Faturamento
│       ├── < R$1M → navigate("/vitrine") (ja comprou, nao manda pro webinar)
│       └── >= R$1M → Raio-X → Submit
```

---

### Arquivos a criar

| Arquivo | Descricao |
|---|---|
| `src/pages/Vitrine.tsx` | Pagina standalone - mostra produtos alternativos (Masterclass, Planilhas, etc.) |
| `src/pages/RedirectWebinar.tsx` | Pagina standalone - convence socio com fat < R$1M a ir para Masterclass |
| `src/components/templates/FormFunil360.tsx` | Template de formulario funil 360 com logica de corte |
| `src/components/templates/FormFunilFrontend.tsx` | Template de formulario front-end com ordem diferente |

### Arquivos a modificar

| Arquivo | Mudanca |
|---|---|
| `src/App.tsx` | Adicionar rotas `/vitrine` e `/redirect-webinar` |
| `src/components/templates/registry.tsx` | Registrar `form_funil_360` e `form_funil_frontend` |

### Migracao SQL

Inserir apenas **2 registros** na tabela `page_templates` (somente os formularios):

| component_key | name | type |
|---|---|---|
| `form_funil_360` | Formulario Funil 360 | application_form |
| `form_funil_frontend` | Formulario Funil Front-End | application_form |

---

### Detalhes das Paginas Standalone

**Pagina Vitrine (`/vitrine`):**
- Headline: "A MENTORIA GRIFO 360 NAO E O SEU PROXIMO PASSO."
- Subheadline sobre perfil inadequado para mentoria avancada
- Busca produtos ativos do banco (excluindo eventos) e exibe como cards com nome, preco e botao de checkout
- Visual dark navy (#112232) + gold (#A47428)

**Pagina Redirect Webinar (`/redirect-webinar`):**
- Headline: "ANTES DE AVANCAR, VOCE PRECISA DOMINAR A BASE DO SISTEMA."
- Texto sobre dominar fundamentos antes da Mentoria 360
- Botao pulsante dourado "PARTICIPE AGORA" linkando para a Masterclass/Webinar mais recente (busca do banco)
- Visual dark navy + gold

---

### Detalhes dos Formularios

Ambos seguem o padrao visual do `FormConstruction` existente (dark navy, gold, progress bar, QuestionCard, OptionButton, InputLine).

**FormFunil360 (12 steps):**
1. Cargo (6 opcoes) - corte anti-ICP
2. Faturamento (6 faixas) - corte para webinar
3. Setor de atuacao (multipla escolha)
4. Ticket medio (numerico)
5. Obras simultaneas (numerico)
6. Regiao/Estado (dropdown)
7. Possui socios? (Sim/Nao)
8. Setores com equipe (multipla escolha)
9. Nome completo
10. WhatsApp
11. Email
12. Instagram da construtora

**FormFunilFrontend (12 steps):**
1. Nome completo
2. WhatsApp
3. Email
4. Instagram
5. Cargo - corte para vitrine
6. Faturamento - corte para vitrine
7-12. Raio-X (mesmas perguntas)

Integracao: `usePartialLeadCapture`, `useMetaPixel`, salva em `leads` + `form_submissions`, cria deal se configurado.

