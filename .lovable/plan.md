

## Formularios de Funil + Paginas de Redirecionamento — CONCLUÍDO ✅

### Arquitetura

```text
ROTAS FIXAS (standalone):
  /vitrine          → src/pages/Vitrine.tsx ✅
  /redirect-webinar → src/pages/RedirectWebinar.tsx ✅

TEMPLATES DE PRODUTO (via /p/:slug):
  form_funil_360      → src/components/templates/FormFunil360.tsx ✅
  form_funil_frontend → src/components/templates/FormFunilFrontend.tsx ✅
```

### Registros no banco (page_templates)
- `form_funil_360` — Formulário Funil 360 (application_form) ✅
- `form_funil_frontend` — Formulário Funil Front-End (application_form) ✅

### Lógica de Redirecionamento

```text
FORMULÁRIO 360 (Tráfego Frio)
├── Cargo
│   ├── NÃO é Sócio → navigate("/vitrine")
│   └── É Sócio → Faturamento
│       ├── < R$1M → navigate("/redirect-webinar")
│       └── >= R$1M → Raio-X → Contato → Submit

FORMULÁRIO FRONT-END (Já comprou Webinar)
├── Bloco 1: Contato (nome, whatsapp, email, instagram)
├── Cargo
│   ├── NÃO é Sócio → navigate("/vitrine")
│   └── É Sócio → Faturamento
│       ├── < R$1M → navigate("/vitrine")
│       └── >= R$1M → Raio-X → Submit
```
