# 🧪 Guia de Testes - Insomnia

## 📦 Configuração Inicial

### 1. Aplicar Migration no Supabase

Antes de testar, certifique-se de que a tabela `user_products` existe:

```bash
# Copiar e executar no Supabase SQL Editor
cat supabase/migrations/add_user_products_table.sql
```

### 2. Importar Collection no Insomnia

1. Abrir Insomnia
2. Menu: `Application` > `Preferences` > `Data` > `Import Data`
3. Selecionar: `insomnia-order-bumps-test.json`
4. Coleção "LT Entregaveis - Order Bumps" será criada

### 3. Configurar Environment

No Insomnia, editar o environment:

```json
{
  "base_url": "https://seu-dominio.vercel.app",
  "webhook_secret": "wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780"
}
```

**⚠️ IMPORTANTE:** Use o mesmo `webhook_secret` configurado no `.env.local` ou Vercel

## 🔐 Como Gerar a Assinatura HMAC-SHA256zz

### Opção 1: Usar o Vercel (Sem Assinatura)

Para testes em produção, você pode desabilitar temporariamente a validação de assinatura:

1. Comentar a validação no código (NÃO RECOMENDADO EM PRODUÇÃO)
2. Ou adicionar um endpoint de teste que não valida assinatura

### Opção 2: Calcular Assinatura Manualmente

Use este script Node.js:

```javascript
const crypto = require('crypto');

const payload = `{"id":"6b7f691a-55c3-407e-8333-911498d72f35",...}`; // Payload completo
const secret = 'wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780';

const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

console.log('Assinatura:', signature);
```

### Opção 3: Usar Plugin do Insomnia (RECOMENDADO)

1. Instalar plugin "Insomnia Plugin HMAC"
2. Configurar para calcular automaticamente

## 🧪 Sequência de Testes

### Teste 1: Produto Principal

**Endpoint:** POST `/api/webhook/hotmart`

**Payload:** Use "1. Main Product (Kit Inteligencia Emocional)"

**Resultado Esperado:**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

**Verificar no Supabase:**

```sql
-- Ver webhook registrado
SELECT * FROM hotmart_webhooks
WHERE subscriber_email = 'psicologosunidosoficial@gmail.com'
ORDER BY created_at DESC LIMIT 1;

-- Ver usuário criado
SELECT * FROM users_access
WHERE email = 'psicologosunidosoficial@gmail.com';

-- Ver produto registrado
SELECT * FROM user_products up
JOIN users_access ua ON up.user_id = ua.id
WHERE ua.email = 'psicologosunidosoficial@gmail.com'
ORDER BY up.purchase_date DESC;
```

**Resultado Esperado no Banco:**
- 1 registro em `users_access`
- 1 registro em `user_products` com `is_order_bump = false`
- `product_id = '6557472'`
- `transaction_id = 'HP0630882632'`

---

### Teste 2: Order Bump (5-10 segundos depois)

⏱️ **IMPORTANTE:** Aguardar 5-10 segundos após o Teste 1

**Endpoint:** POST `/api/webhook/hotmart`

**Payload:** Use "2. Order Bump (Ferramentas de Regulacao)"

**Resultado Esperado:**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

**Verificar no Supabase:**

```sql
-- Ver TODOS os produtos do usuário
SELECT
    up.product_id,
    up.product_name,
    up.is_order_bump,
    up.parent_transaction_id,
    up.hotmart_transaction_id,
    up.status,
    up.purchase_date
FROM user_products up
JOIN users_access ua ON up.user_id = ua.id
WHERE ua.email = 'psicologosunidosoficial@gmail.com'
ORDER BY up.purchase_date ASC;
```

**Resultado Esperado no Banco:**
- Mesmo 1 registro em `users_access`
- **2 registros** em `user_products`:
  1. Product ID `6557472` (is_order_bump: `false`)
  2. Product ID `6558403` (is_order_bump: `true`, parent: `HP0630882632`)

---

### Teste 3: Listar Produtos via API

**Pré-requisito:** Fazer login primeiro

#### 3a. Login

**Endpoint:** POST `/api/auth/login`

**Body:**
```json
{
  "email": "psicologosunidosoficial@gmail.com"
}
```

**Resultado:** Cookie de sessão será salvo automaticamente

#### 3b. Listar Produtos

**Endpoint:** GET `/api/user/products`

**Headers:** (Cookie automático)

**Resultado Esperado:**
```json
{
  "success": true,
  "data": {
    "total": 2,
    "mainProducts": [
      {
        "id": "uuid...",
        "productId": "6557472",
        "productName": "Kit Inteligencia Emocional",
        "transactionId": "HP0630882632",
        "purchaseDate": "2024-12-19...",
        "status": "active"
      }
    ],
    "orderBumps": [
      {
        "id": "uuid...",
        "productId": "6558403",
        "productName": "Ferramentas de Regulacao Emocional",
        "transactionId": "HP0635884368",
        "parentTransactionId": "HP0630882632",
        "purchaseDate": "2024-12-19...",
        "status": "active"
      }
    ]
  }
}
```

## 🔍 Como Funciona a Detecção de Order Bumps

O sistema usa **detecção inteligente** porque a Hotmart não marca corretamente o campo `is_order_bump`:

### Estratégia 1: Campo `is_order_bump` (se disponível)
```json
{
  "purchase": {
    "order_bump": {
      "is_order_bump": true,
      "parent_purchase_transaction": "HP123..."
    }
  }
}
```

### Estratégia 2: Checkout Session ID (`sck`)
O sistema busca webhooks recentes com **mesmo `sck`** mas **transaction diferente**:

```
Webhook 1: sck=332n23f3l7o, transaction=HP0630882632 → Produto Principal
Webhook 2: sck=332n23f3l7o, transaction=HP0635884368 → Order Bump!
           ↑ mesmo checkout                ↑ transação diferente
```

## 📊 Logs para Monitorar

### No Console do Servidor (Vercel/Local)

```
✅ [Hotmart Webhook] Signature validated successfully
✅ [Hotmart Webhook] Product: 6557472 | Is Order Bump: false | Parent: N/A
✅ [Hotmart Webhook] Product registered: 6557472 for user psicologosunidosoficial@gmail.com (Order Bump: false)

...5 segundos depois...

✅ [Hotmart Webhook] Signature validated successfully
✅ [Hotmart Webhook] Order bump detected via checkout session: 332n23f3l7o
✅ [Hotmart Webhook] Parent transaction: HP0630882632
✅ [Hotmart Webhook] Product: 6558403 | Is Order Bump: true | Parent: HP0630882632
✅ [Hotmart Webhook] Product registered: 6558403 for user psicologosunidosoficial@gmail.com (Order Bump: true)
```

## 🐛 Troubleshooting

### Erro: "Invalid signature"

**Causa:** Assinatura HMAC incorreta ou `webhook_secret` diferente

**Solução:**
1. Verificar se `HOTMART_WEBHOOK_SECRET` é o mesmo no Vercel e no Insomnia
2. Calcular assinatura corretamente
3. Para testes, pode comentar temporariamente a validação

### Erro: "Tabela user_products não existe"

**Causa:** Migration não foi aplicada

**Solução:**
```bash
# Executar no Supabase SQL Editor
cat supabase/migrations/add_user_products_table.sql
```

### Order Bump não detectado (`is_order_bump = false`)

**Causa:** Webhook chegou muito rápido ou muito devagar

**Solução:**
- Aguardar 5-10 segundos entre webhooks
- Sistema busca webhooks dos últimos 5 minutos
- Verificar que `origin.sck` é o mesmo

### Apenas 1 produto registrado

**Causa:** Segundo webhook não foi enviado ou falhou

**Solução:**
```sql
-- Verificar webhooks recebidos
SELECT
    event_type,
    transaction_id,
    (payload->'data'->'product'->>'id') as product_id,
    processed,
    error_message
FROM hotmart_webhooks
WHERE subscriber_email = 'psicologosunidosoficial@gmail.com'
ORDER BY created_at DESC;
```

## 🧹 Limpar Dados de Teste

```sql
-- Remover produtos de teste
DELETE FROM user_products
WHERE user_id IN (
    SELECT id FROM users_access
    WHERE email = 'psicologosunidosoficial@gmail.com'
);

-- Remover usuário de teste
DELETE FROM users_access
WHERE email = 'psicologosunidosoficial@gmail.com';

-- Remover webhooks de teste
DELETE FROM hotmart_webhooks
WHERE subscriber_email = 'psicologosunidosoficial@gmail.com';
```

## ✅ Checklist de Sucesso

- [ ] Migration aplicada no Supabase
- [ ] Collection importada no Insomnia
- [ ] Environment configurado com URL e secret corretos
- [ ] Teste 1: Produto principal criado
- [ ] Teste 2: Order bump detectado e registrado
- [ ] Banco: 2 produtos registrados (1 principal + 1 bump)
- [ ] API: `/api/user/products` retorna 2 produtos
- [ ] Logs: Sistema detectou order bump via checkout session

## 📝 Notas Importantes

1. **Tempo entre webhooks:** Aguardar 5-10 segundos é crucial
2. **Mesmo email:** Ambos webhooks devem ter mesmo `buyer.email`
3. **Mesmo sck:** Campo `origin.sck` deve ser idêntico
4. **Transações diferentes:** Cada produto tem seu próprio `transaction`

---

**Próximo Passo:** Após testes bem-sucedidos, configurar webhook real na Hotmart!
