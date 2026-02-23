# Sistema de Order Bumps com Lock Automático

## 📋 Visão Geral

Este sistema implementa um fluxo onde:
1. **Quando um usuário compra um produto principal**, todos os order bumps relacionados são inseridos automaticamente como **LOCKED** (status = NULL)
2. **Quando um usuário compra um order bump**, o status é atualizado de NULL para **'active'**
3. **Usuários veem apenas os order bumps relacionados ao produto principal que compraram**

---

## 🏗️ Arquitetura

### 1. Mapeamento de Produtos (`lib/product-order-bumps-map.ts`)

Define quais order bumps pertencem a cada produto principal:

```typescript
export const PRODUCT_ORDER_BUMPS_MAP = {
  '6844335': {  // NeuroReset
    product_id: '6844335',
    product_name: 'NeuroReset',
    order_bumps: [
      {
        product_id: '6846443',
        product_name: '🔥 Protocolo de Descompresão Somática - Exclusivo'
      }
    ]
  },
  '6557472': {  // Kit Inteligencia Emocional
    product_id: '6557472',
    product_name: 'Kit Inteligencia Emocional',
    order_bumps: [
      { product_id: '6557903', product_name: 'Preguntas Poderosas...' },
      { product_id: '6558403', product_name: 'Ferramentas de Regulacao...' },
      { product_id: '6558441', product_name: 'NeuroAfetividad Infantil' },
      { product_id: '6558460', product_name: 'Order Bump Product 6558460' },
      { product_id: '6558478', product_name: 'Order Bump Product 6558478' }
    ]
  }
}
```

**Importante**: Adicione novos produtos e order bumps neste arquivo conforme necessário.

---

## 🔄 Fluxo de Webhook

### Cenário 1: Usuário compra apenas o produto principal

**Webhook recebido:**
```json
{
  "event": "PURCHASE_APPROVED",
  "data": {
    "product": { "id": "6557472" },
    "buyer": { "email": "user@example.com" },
    "purchase": {
      "transaction": "HP123456789",
      "order_bump": { "is_order_bump": false }
    }
  }
}
```

**O que acontece:**
1. ✅ Insere produto principal com `status = 'active'`
2. ✅ Insere TODOS os 5 order bumps com `status = NULL` (locked)

**Resultado na tabela `user_products`:**
```
user_id | product_id | product_name                        | status  | is_order_bump | parent_transaction_id
--------|------------|-------------------------------------|---------|---------------|---------------------
uuid    | 6557472    | Kit Inteligencia Emocional          | active  | false         | null
uuid    | 6557903    | Preguntas Poderosas...              | NULL    | true          | HP123456789
uuid    | 6558403    | Ferramentas de Regulacao...         | NULL    | true          | HP123456789
uuid    | 6558441    | NeuroAfetividad Infantil            | NULL    | true          | HP123456789
uuid    | 6558460    | Order Bump Product 6558460          | NULL    | true          | HP123456789
uuid    | 6558478    | Order Bump Product 6558478          | NULL    | true          | HP123456789
```

**O usuário vê:**
- ✅ Conteúdo do produto principal (desbloqueado)
- 🔒 5 order bumps (locked, com botão de compra)

---

### Cenário 2: Usuário compra produto principal + 2 order bumps

**Webhooks recebidos (3 webhooks):**

1. **Webhook 1 - Produto Principal:**
   - Insere produto principal (`status = 'active'`)
   - Insere todos os 5 order bumps (`status = NULL`)

2. **Webhook 2 - Order Bump 1:**
   ```json
   {
     "event": "PURCHASE_APPROVED",
     "data": {
       "product": { "id": "6557903" },
       "purchase": {
         "transaction": "HP123456790",
         "order_bump": {
           "is_order_bump": true,
           "parent_purchase_transaction": "HP123456789"
         }
       }
     }
   }
   ```
   - Atualiza order bump 6557903 de `NULL` → `'active'`

3. **Webhook 3 - Order Bump 2:**
   - Atualiza order bump 6558403 de `NULL` → `'active'`

**Resultado final na tabela `user_products`:**
```
user_id | product_id | product_name                        | status  | is_order_bump
--------|------------|-------------------------------------|---------|---------------
uuid    | 6557472    | Kit Inteligencia Emocional          | active  | false
uuid    | 6557903    | Preguntas Poderosas...              | active  | true  ← DESBLOQUEADO
uuid    | 6558403    | Ferramentas de Regulacao...         | active  | true  ← DESBLOQUEADO
uuid    | 6558441    | NeuroAfetividad Infantil            | NULL    | true  ← LOCKED
uuid    | 6558460    | Order Bump Product 6558460          | NULL    | true  ← LOCKED
uuid    | 6558478    | Order Bump Product 6558478          | NULL    | true  ← LOCKED
```

**O usuário vê:**
- ✅ Conteúdo do produto principal (desbloqueado)
- ✅ 2 order bumps comprados (desbloqueados)
- 🔒 3 order bumps não comprados (locked, com botão de compra)

---

### Cenário 3: Usuário possui 2 produtos principais diferentes

**Usuário comprou:**
- NeuroReset (6844335)
- Kit Inteligencia Emocional (6557472)

**Resultado na tabela `user_products`:**
```
user_id | product_id | product_name                        | status  | parent_transaction_id
--------|------------|-------------------------------------|---------|---------------------
uuid    | 6844335    | NeuroReset                          | active  | null
uuid    | 6846443    | Protocolo de Descompresão...        | NULL    | HP-NEURO-123        ← Order bump do NeuroReset
uuid    | 6557472    | Kit Inteligencia Emocional          | active  | null
uuid    | 6557903    | Preguntas Poderosas...              | NULL    | HP-KIT-456          ← Order bump do Kit
uuid    | 6558403    | Ferramentas de Regulacao...         | NULL    | HP-KIT-456          ← Order bump do Kit
uuid    | 6558441    | NeuroAfetividad Infantil            | NULL    | HP-KIT-456          ← Order bump do Kit
uuid    | 6558460    | Order Bump Product 6558460          | NULL    | HP-KIT-456          ← Order bump do Kit
uuid    | 6558478    | Order Bump Product 6558478          | NULL    | HP-KIT-456          ← Order bump do Kit
```

**O usuário vê:**
- ✅ Conteúdo do NeuroReset (desbloqueado)
- 🔒 1 order bump do NeuroReset (locked)
- ✅ Conteúdo do Kit Inteligencia Emocional (desbloqueado)
- 🔒 5 order bumps do Kit (locked)

**Total: 2 produtos principais + 6 order bumps locked**

---

## 💻 Implementação Técnica

### Webhook Handler (`app/api/webhook/hotmart/route.ts`)

**CASO 1: Produto Principal**
```typescript
if (!isOrderBump && isMainProduct(productId)) {
  // 1. Inserir produto principal com status 'active'
  await supabaseAdmin.from('user_products').insert({
    user_id: userId,
    product_id: productId,
    status: 'active',
    is_order_bump: false,
    parent_transaction_id: null
  })

  // 2. Inserir TODOS os order bumps com status NULL
  const orderBumps = getOrderBumpsForProduct(productId)
  for (const orderBump of orderBumps) {
    await supabaseAdmin.from('user_products').insert({
      user_id: userId,
      product_id: orderBump.product_id,
      status: null,  // NULL = LOCKED
      is_order_bump: true,
      parent_transaction_id: transactionId
    })
  }
}
```

**CASO 2: Order Bump Comprado**
```typescript
else if (isOrderBump) {
  // Atualizar order bump existente de NULL → 'active'
  await supabaseAdmin.from('user_products')
    .update({
      status: 'active',
      hotmart_transaction_id: transactionId
    })
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('is_order_bump', true)
}
```

### Contents API (`app/api/contents/route.ts`)

**Buscar produtos do usuário:**
```typescript
// Buscar produtos ativos E locked (status NULL)
const { data: userProducts } = await supabaseAdmin
  .from('user_products')
  .select('product_id, status, ...')
  .eq('user_id', user.id)
  .in('status', ['active', null])  // ← Incluir NULL (locked)

// Separar por status
const activeProductIds = userProducts
  .filter(p => p.status === 'active')
  .map(p => p.product_id)

const lockedProductIds = userProducts
  .filter(p => p.status === null)
  .map(p => p.product_id)
```

**Filtrar conteúdos:**
```typescript
const processedContents = allContents
  .filter(content => {
    // Mostrar se usuário possui (ativo OU locked)
    return [...activeProductIds, ...lockedProductIds].includes(content.product_id)
  })
  .map(content => {
    const isOrderBump = content.status === 'order_bump'
    const isLocked = isOrderBump && lockedProductIds.includes(content.product_id)

    return {
      ...content,
      is_locked: isLocked,
      checkout_url: isLocked ? CHECKOUT_URL : null
    }
  })
```

---

## ✅ Vantagens do Sistema

1. **Usuários veem apenas order bumps relevantes** ao produto que compraram
2. **Não há confusão** entre order bumps de produtos diferentes
3. **Status NULL indica locked** de forma clara no banco de dados
4. **Fácil de adicionar novos produtos** - basta atualizar o mapeamento
5. **Webhooks independentes** - cada compra é processada individualmente

---

## 🔧 Como Adicionar Novo Produto

1. **Editar `lib/product-order-bumps-map.ts`:**
   ```typescript
   export const PRODUCT_ORDER_BUMPS_MAP = {
     // ... produtos existentes ...

     'NOVO_PRODUCT_ID': {
       product_id: 'NOVO_PRODUCT_ID',
       product_name: 'Nome do Novo Produto',
       order_bumps: [
         {
           product_id: 'OB1_ID',
           product_name: 'Order Bump 1'
         },
         {
           product_id: 'OB2_ID',
           product_name: 'Order Bump 2'
         }
       ]
     }
   }
   ```

2. **Adicionar conteúdos na tabela `product_contents`:**
   ```sql
   -- Produto principal
   INSERT INTO product_contents (product_id, title, status, content_type, ...)
   VALUES ('NOVO_PRODUCT_ID', 'Aula 1', 'principal', 'video', ...);

   -- Order bumps
   INSERT INTO product_contents (product_id, title, status, content_type, ...)
   VALUES ('OB1_ID', 'Bonus 1', 'order_bump', 'video', ...);
   ```

3. **Configurar checkout URLs em `lib/product-config.ts`:**
   ```typescript
   export const ORDER_BUMP_CHECKOUT_URLS = {
     'OB1_ID': 'https://pay.hotmart.com/XXXXX',
     'OB2_ID': 'https://pay.hotmart.com/YYYYY'
   }
   ```

4. **Pronto!** O sistema automaticamente:
   - Inserirá os order bumps locked quando alguém comprar o produto principal
   - Desbloqueará quando o order bump for comprado

---

## 🧪 Testando

### Teste 1: Compra apenas produto principal
```bash
# Simular webhook do produto principal
curl -X POST http://localhost:3000/api/webhook/hotmart \
  -H "Content-Type: application/json" \
  -d '{
    "event": "PURCHASE_APPROVED",
    "data": {
      "product": { "id": "6557472" },
      "buyer": { "email": "test@example.com" },
      "purchase": { "transaction": "TEST123" }
    }
  }'

# Verificar resultado
# - 1 produto principal active
# - 5 order bumps NULL
```

### Teste 2: Compra order bump
```bash
# Simular webhook de order bump
curl -X POST http://localhost:3000/api/webhook/hotmart \
  -H "Content-Type: application/json" \
  -d '{
    "event": "PURCHASE_APPROVED",
    "data": {
      "product": { "id": "6557903" },
      "buyer": { "email": "test@example.com" },
      "purchase": {
        "transaction": "TEST124",
        "order_bump": {
          "is_order_bump": true,
          "parent_purchase_transaction": "TEST123"
        }
      }
    }
  }'

# Verificar resultado
# - Order bump 6557903 agora está active
```

---

## 📊 Status na Tabela user_products

| status | Significado | Visível no app? | Locked? |
|--------|-------------|-----------------|---------|
| `'active'` | Comprado e ativo | ✅ Sim | ❌ Não |
| `null` | Inserido mas não comprado | ✅ Sim | ✅ Sim |
| `'refunded'` | Reembolsado | ❌ Não | - |
| `'cancelled'` | Cancelado | ❌ Não | - |
| `'chargeback'` | Estornado | ❌ Não | - |

---

## 🔍 Queries Úteis

### Ver todos os produtos de um usuário
```sql
SELECT
  product_id,
  product_name,
  status,
  is_order_bump,
  parent_transaction_id
FROM user_products
WHERE user_id = 'USER_UUID'
ORDER BY is_order_bump, product_id;
```

### Ver order bumps locked de um usuário
```sql
SELECT
  product_id,
  product_name,
  parent_transaction_id
FROM user_products
WHERE user_id = 'USER_UUID'
  AND is_order_bump = true
  AND status IS NULL;
```

### Ver quais produtos principais um usuário possui
```sql
SELECT
  product_id,
  product_name,
  hotmart_transaction_id
FROM user_products
WHERE user_id = 'USER_UUID'
  AND is_order_bump = false
  AND status = 'active';
```

---

## 🚨 Importante

1. **Sempre adicione order bumps no mapeamento** antes de vender
2. **Status NULL significa locked**, não erro
3. **Cada produto principal insere seus próprios order bumps** automaticamente
4. **Usuários não veem order bumps de outros produtos** que não compraram
5. **Webhook de order bump atualiza de NULL → active**, não insere novo registro

---

## 📝 Logs de Debug

Ao processar webhooks, você verá:

```
[Hotmart Webhook] ===== REGISTERING PRODUCT =====
[Hotmart Webhook] Product ID: 6557472
[Hotmart Webhook] Is Order Bump: false
[Hotmart Webhook] Is Main Product: true
[Hotmart Webhook] 📦 Main Product Purchase Detected
[Hotmart Webhook] ===== INSERTING MAIN PRODUCT + ALL ORDER BUMPS =====
[Hotmart Webhook] ✅ Main product inserted: 6557472
[Hotmart Webhook] 🔒 Inserting 5 order bumps as LOCKED
[Hotmart Webhook]    ✅ Order bump locked: 6557903 - Preguntas Poderosas...
[Hotmart Webhook]    ✅ Order bump locked: 6558403 - Ferramentas de Regulacao...
[Hotmart Webhook]    ✅ Order bump locked: 6558441 - NeuroAfetividad Infantil
[Hotmart Webhook]    ✅ Order bump locked: 6558460 - Order Bump Product 6558460
[Hotmart Webhook]    ✅ Order bump locked: 6558478 - Order Bump Product 6558478
[Hotmart Webhook] =================================
```

---

## 🎯 Resultado Final

✅ **Usuários veem apenas order bumps relevantes ao produto que compraram**
✅ **Order bumps aparecem locked automaticamente**
✅ **Sistema escalável para múltiplos produtos**
✅ **Fácil manutenção via arquivo de mapeamento**
