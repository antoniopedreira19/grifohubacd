

## Plano: Importação de Leads e Vendas da Planilha do Webinar

### Resumo

A planilha contém 70 linhas com email, telefone e produto principal. Vou criar um script Python que lê a planilha e insere os dados diretamente no banco via `psql`.

### Mapeamento de Produtos (já existentes no banco)

| Produto na Planilha | Produto no Banco | ID | Preço |
|---|---|---|---|
| Masterclass - O Novo Padrão da Construção | MASTERCLASS: O NOVO PADRÃO DA CONSTRUÇÃO | `aa5db57f-57f2-40d1-ba53-cc216f16db13` | R$ 97 |
| ... (VIP) | ... (VIP) | `417d4734-2dbf-4bdd-8c20-7e8ecc1bd18f` | R$ 297 |
| ... (DIAMOND) | ... (DIAMOND) | `85668aab-150b-44be-a8bb-440718e35226` | R$ 2.997 |

### O que o script fará

1. **Ler a planilha** com pandas
2. **Para cada linha**, mapear o "Produto principal" ao produto correto do banco
3. **Upsert do Lead** na tabela `leads` (by email) com status "Cliente", origin "Lastlink"
4. **Inserir Sale** na tabela `sales` com o produto, valor e origin `lastlink_auto`
5. Gerar um relatório de quantos leads/vendas foram criados

### Notas importantes
- Emails duplicados na planilha (ex: `lucas@construtoravaug.com.br` aparece 2x com produtos diferentes) serão tratados como vendas separadas do mesmo lead
- O preço usado será o do produto cadastrado no banco (97, 297, 2997), não o valor da coluna "Nome da oferta" que às vezes mostra "2900 (Combo)"
- O trigger `update_lead_stats` já existente recalculará o LTV automaticamente após inserir as sales

### Execução
- Script Python com `psql` para inserções diretas
- Sem necessidade de migração (estrutura já existe)
- Sem necessidade de alterações no código React

