# ✅ Checklist de Implementação - Order Bumps

## 📋 Status da Implementação

### ✅ Fase 1: Desenvolvimento (CONCLUÍDO)

- [x] Investigar estrutura de webhooks da Hotmart
- [x] Criar tabela `user_products` no banco de dados
- [x] Atualizar webhook handler para processar order bumps
- [x] Criar funções de controle de acesso por produto
- [x] Criar API endpoint `/api/user/products`
- [x] Criar script de teste automatizado
- [x] Escrever documentação completa
- [x] Criar queries SQL úteis

### 🔄 Fase 2: Configuração (PRÓXIMOS PASSOS)

- [ ] **Aplicar Migration no Supabase**
  - Ir para: Supabase Dashboard > SQL Editor
  - Copiar conteúdo de: `supabase/migrations/add_user_products_table.sql`
  - Executar SQL
  - Verificar: Tabela `user_products` foi criada

- [ ] **Testar Localmente**
  - Executar: `npm run dev`
  - Executar: `npm run test:order-bumps`
  - Verificar: Todos os testes passaram
  - Verificar: 3 produtos registrados no Supabase

- [ ] **Configurar IDs dos Produtos na Hotmart**
  - Anotar IDs dos produtos:
    - Produto Principal: ________________
    - Order Bump 1: ________________
    - Order Bump 2: ________________
    - Order Bump 3: ________________
  - Configurar esses IDs no código se necessário

### 🧪 Fase 3: Testes em Produção

- [ ] **Deploy para Produção**
  - Fazer commit das mudanças
  - Fazer push para repositório
  - Verificar: Deploy automático concluído

- [ ] **Aplicar Migration em Produção**
  - Ir para: Supabase Produção > SQL Editor
  - Executar: `add_user_products_table.sql`
  - Verificar: Tabela criada sem erros

- [ ] **Testar com Webhook Real da Hotmart**
  - Ir para: Hotmart Dashboard > Configurações > Webhook
  - Clicar em "Enviar Teste"
  - Verificar: Webhook recebido e processado
  - Verificar: Produto registrado em `user_products`

- [ ] **Fazer Compra de Teste**
  - Fazer checkout de teste com order bump
  - Verificar: 2 webhooks recebidos (principal + bump)
  - Verificar: 2 produtos registrados no banco
  - Verificar: Usuário tem acesso aos 2 produtos

### 🎨 Fase 4: Frontend (OPCIONAL)

- [ ] **Dashboard de Produtos**
  - Criar página mostrando produtos do usuário
  - Usar endpoint: `GET /api/user/products`
  - Separar produtos principais de order bumps

- [ ] **Controle de Acesso por Produto**
  - Atualizar páginas de conteúdo
  - Verificar acesso antes de mostrar conteúdo
  - Usar: `checkUserProductAccess(email, productId)`

- [ ] **Navegação por Produto**
  - Menu lateral com produtos
  - Filtrar conteúdos por produto
  - Indicar produtos com order bump

## 🔍 Como Verificar Cada Passo

### Verificar Migration Aplicada

```sql
-- No Supabase SQL Editor
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_name = 'user_products'
);
-- Deve retornar: true
```

### Verificar Produtos Registrados

```sql
-- Ver produtos de teste
SELECT
    ua.email,
    up.product_id,
    up.is_order_bump,
    up.status
FROM user_products up
JOIN users_access ua ON up.user_id = ua.id
WHERE ua.email LIKE '%test%'
ORDER BY up.purchase_date DESC;
```

### Verificar Webhooks Recebidos

```sql
-- Ver últimos webhooks
SELECT
    event_type,
    subscriber_email,
    (payload->'data'->'product'->>'id') as product_id,
    (payload->'data'->'order_bump'->>'is_order_bump') as is_bump,
    processed,
    created_at
FROM hotmart_webhooks
ORDER BY created_at DESC
LIMIT 10;
```

### Testar API Localmente

```bash
# 1. Login (obter cookie de sessão)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  -c cookies.txt

# 2. Listar produtos
curl http://localhost:3000/api/user/products \
  -b cookies.txt
```

## ⚠️ Troubleshooting

### Problema: Tabela já existe
**Erro:** `relation "user_products" already exists`

**Solução:**
```sql
-- Verificar se tabela tem dados
SELECT COUNT(*) FROM user_products;

-- Se não tem dados, pode dropar e recriar
DROP TABLE IF EXISTS user_products CASCADE;
-- Depois executar migration novamente
```

### Problema: Webhook não processa order bump
**Sintoma:** Campo `is_order_bump` sempre false

**Verificar:**
1. Version do webhook é 2.0.0?
2. Hotmart enviou campo `order_bump`?
3. Logs no servidor mostram o campo?

```sql
-- Ver payload completo do webhook
SELECT
    payload->'data'->'order_bump' as order_bump_field,
    payload
FROM hotmart_webhooks
ORDER BY created_at DESC
LIMIT 1;
```

### Problema: Usuário não tem acesso ao produto
**Sintoma:** `checkUserProductAccess` retorna `hasAccess: false`

**Verificar:**
```sql
-- Ver status do produto
SELECT
    product_id,
    status,
    expiration_date,
    CASE
        WHEN status != 'active' THEN 'Status não é active'
        WHEN expiration_date < NOW() THEN 'Produto expirado'
        ELSE 'Deve ter acesso'
    END as reason
FROM user_products up
WHERE user_id = (SELECT id FROM users_access WHERE email = 'email@example.com')
  AND product_id = 'ORDERBUMP01';
```

## 📞 Suporte

### Documentação
- [ORDER-BUMPS-IMPLEMENTATION.md](ORDER-BUMPS-IMPLEMENTATION.md) - Guia técnico completo
- [ORDER-BUMPS-SUMMARY.md](ORDER-BUMPS-SUMMARY.md) - Resumo da implementação
- [order-bumps-queries.sql](supabase/order-bumps-queries.sql) - Queries úteis

### Logs para Monitorar
```bash
# Ver logs do servidor
npm run dev

# Procurar por:
# ✅ [Hotmart Webhook] Product registered: PRODUCT_ID for user EMAIL (Order Bump: true/false)
# ✅ [Hotmart Webhook] Signature validated successfully
# ❌ [Hotmart Webhook] Error...
```

### Comandos Úteis
```bash
# Testar webhooks localmente
npm run test:order-bumps

# Testar webhook geral
npm run test:hotmart

# Verificar resultados no banco
npm run check:webhooks

# Verificar erros
npm run check:errors
```

## 🎯 Critérios de Sucesso

### ✅ Implementação Completa Quando:

1. [ ] Tabela `user_products` criada no Supabase
2. [ ] Webhook processa produtos individuais
3. [ ] Campo `is_order_bump` registrado corretamente
4. [ ] `parent_transaction_id` vinculado ao produto principal
5. [ ] API `/api/user/products` retorna lista correta
6. [ ] Função `checkUserProductAccess` funciona
7. [ ] Refund de um produto não afeta outros
8. [ ] Testes automatizados passam
9. [ ] Documentação completa e clara

### 🎉 Pronto para Produção Quando:

1. [ ] Todos os itens acima completos
2. [ ] Testado com webhooks reais da Hotmart
3. [ ] Compra de teste completa (principal + bump)
4. [ ] Verificado acesso por produto no frontend
5. [ ] Equipe treinada em troubleshooting

---

**Última Atualização:** 2025-12-19
**Status Atual:** ✅ Desenvolvimento Completo - Pronto para Configuração
