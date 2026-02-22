# Implementação de Order Bumps - Hotmart

## Visão Geral

Este documento explica como o sistema foi atualizado para suportar **Order Bumps** da Hotmart, permitindo que cada produto (principal + bumps) seja rastreado individualmente e libere acesso específico ao comprador.

## Como Funciona

### 1. Estrutura de Webhooks da Hotmart

A Hotmart envia **um webhook separado para cada produto comprado**:

- **Produto Principal**: Webhook com `is_order_bump: false`
- **Order Bump 1**: Webhook com `is_order_bump: true` e `parent_purchase_transaction: "HP123..."`
- **Order Bump 2**: Webhook com `is_order_bump: true` e `parent_purchase_transaction: "HP123..."`

**Exemplo de Cenário:**
- Cliente compra **PRINCIPAL01** + **ORDERBUMP01** + **ORDERBUMP02**
- Hotmart envia **3 webhooks separados**:
  1. `PURCHASE_APPROVED` para PRINCIPAL01
  2. `PURCHASE_APPROVED` para ORDERBUMP01 (referenciando transação do PRINCIPAL01)
  3. `PURCHASE_APPROVED` para ORDERBUMP02 (referenciando transação do PRINCIPAL01)

### 2. Estrutura do Payload do Webhook

```json
{
  "event": "PURCHASE_APPROVED",
  "version": "2.0.0",
  "data": {
    "product": {
      "id": "ORDERBUMP01",
      "name": "Bônus Exclusivo #1"
    },
    "buyer": {
      "email": "cliente@example.com",
      "name": "João Silva"
    },
    "purchase": {
      "transaction": "HP12345678901234",
      "status": "approved",
      "order_date": 1734614400000
    },
    "order_bump": {
      "is_order_bump": true,
      "parent_purchase_transaction": "HP98765432109876"
    }
  }
}
```

## Arquitetura do Banco de Dados

### Nova Tabela: `user_products`

Criamos a tabela `user_products` para rastrear **cada produto individualmente**:

```sql
CREATE TABLE public.user_products (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users_access(id),

    -- Identificação do produto
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    hotmart_transaction_id VARCHAR(255) NOT NULL,

    -- Order Bump tracking
    is_order_bump BOOLEAN DEFAULT false,
    parent_transaction_id VARCHAR(255),

    -- Status e datas
    status VARCHAR(50) DEFAULT 'active',
    purchase_date TIMESTAMP,
    expiration_date TIMESTAMP,

    CONSTRAINT unique_user_product_transaction
        UNIQUE(user_id, product_id, hotmart_transaction_id)
);
```

### Relacionamento com Tabela Existente

- **`users_access`**: Mantida para compatibilidade. Armazena dados do produto principal.
- **`user_products`**: Nova tabela que armazena **todos** os produtos (principal + bumps).

## Fluxo de Processamento

### Quando um Webhook Chega

1. **Validação da Assinatura** (HMAC-SHA256)
2. **Extração dos Dados**:
   - Email do comprador
   - ID do produto
   - ID da transação
   - `is_order_bump` e `parent_transaction_id`
3. **Processamento**:
   - Criar/atualizar registro em `users_access` (se produto principal)
   - **Sempre** criar/atualizar registro em `user_products`
4. **Log**: Registrar webhook em `hotmart_webhooks`

### Código Atualizado

#### [app/api/webhook/hotmart/route.ts](app/api/webhook/hotmart/route.ts)

A função `handlePurchaseApproved` foi atualizada:

```typescript
async function handlePurchaseApproved(
  email: string,
  transactionId: string,
  productId: string,
  productName: string,
  subscriberCode?: string,
  isOrderBump: boolean = false,
  parentTransactionId: string | null = null
) {
  // 1. Garantir que usuário existe em users_access
  let userId = await getOrCreateUser(email, ...)

  // 2. Registrar produto individual em user_products
  await supabaseAdmin.from('user_products').insert({
    user_id: userId,
    product_id: productId,
    product_name: productName,
    hotmart_transaction_id: transactionId,
    is_order_bump: isOrderBump,
    parent_transaction_id: parentTransactionId,
    status: 'active',
    purchase_date: now,
    expiration_date: oneYearFromNow
  })
}
```

## Controle de Acesso

### Novas Funções em [lib/auth.ts](lib/auth.ts)

#### 1. Verificar Acesso a Produto Específico

```typescript
import { checkUserProductAccess } from '@/lib/auth'

const result = await checkUserProductAccess('user@example.com', 'ORDERBUMP01')

if (result.hasAccess) {
  // Liberar acesso ao conteúdo do ORDERBUMP01
} else {
  // Negar acesso: result.message
}
```

#### 2. Listar Todos os Produtos do Usuário

```typescript
import { getUserProducts } from '@/lib/auth'

const result = await getUserProducts('user@example.com')

if (result.success) {
  const products = result.products
  // products = [
  //   { product_id: 'PRINCIPAL01', is_order_bump: false, ... },
  //   { product_id: 'ORDERBUMP01', is_order_bump: true, ... },
  //   { product_id: 'ORDERBUMP02', is_order_bump: true, ... }
  // ]
}
```

#### 3. Verificar se Tem Algum Produto Ativo

```typescript
import { hasAnyActiveProduct } from '@/lib/auth'

const hasAccess = await hasAnyActiveProduct('user@example.com')
```

### API Endpoint: Lista de Produtos

**`GET /api/user/products`**

Retorna todos os produtos do usuário autenticado.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total": 3,
    "mainProducts": [
      {
        "id": "uuid-1",
        "productId": "PRINCIPAL01",
        "productName": "Curso Principal",
        "transactionId": "HP98765432109876",
        "purchaseDate": "2024-12-19T10:00:00Z",
        "expirationDate": "2025-12-19T10:00:00Z",
        "status": "active"
      }
    ],
    "orderBumps": [
      {
        "id": "uuid-2",
        "productId": "ORDERBUMP01",
        "productName": "Bônus #1",
        "transactionId": "HP12345678901234",
        "parentTransactionId": "HP98765432109876",
        "purchaseDate": "2024-12-19T10:00:05Z",
        "expirationDate": "2025-12-19T10:00:05Z",
        "status": "active"
      },
      {
        "id": "uuid-3",
        "productId": "ORDERBUMP02",
        "productName": "Bônus #2",
        "transactionId": "HP23456789012345",
        "parentTransactionId": "HP98765432109876",
        "status": "active"
      }
    ]
  }
}
```

## Tratamento de Eventos

### Purchase Approved/Complete
- Cria/atualiza registro em `user_products` com status `active`
- Libera acesso ao produto específico

### Purchase Refunded
- Atualiza status do produto para `refunded` em `user_products`
- Se não há mais produtos ativos, desativa sessões

### Purchase Canceled
- Atualiza status do produto para `cancelled` em `user_products`
- Se não há mais produtos ativos, desativa sessões

### Purchase Chargeback
- Atualiza status do produto para `chargeback` em `user_products`
- Se não há mais produtos ativos, desativa sessões

## Exemplo de Uso no Frontend

### Verificar Acesso a Conteúdo Específico

```typescript
// app/api/contents/route.ts

export async function GET(request: NextRequest) {
  const { valid, user } = await getSessionFromCookie()

  if (!valid) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Pegar product_id da query
  const productId = request.nextUrl.searchParams.get('product_id')

  if (productId) {
    // Verificar acesso ao produto específico
    const access = await checkUserProductAccess(user.email, productId)

    if (!access.hasAccess) {
      return NextResponse.json(
        { error: access.message },
        { status: 403 }
      )
    }
  }

  // Buscar conteúdos do produto
  const { data: contents } = await supabaseAdmin
    .from('product_contents')
    .select('*')
    .eq('product_id', productId)
    .eq('is_active', true)
    .order('order_index')

  return NextResponse.json({ contents })
}
```

## Migração do Banco de Dados

Para aplicar as mudanças no Supabase:

```bash
# 1. Executar a migration no Supabase SQL Editor
cat supabase/migrations/add_user_products_table.sql
# Copiar e executar no SQL Editor do Supabase
```

## Testes

### Script de Teste

Use o script existente para testar webhooks:

```bash
# Testar webhook de produto principal
npm run test:hotmart

# Testar webhook específico
npm run test:hotmart approved
```

### Teste Manual de Order Bumps

Você pode modificar o script `scripts/test-hotmart-webhook.ts` para incluir `order_bump`:

```typescript
const payload = {
  event: 'PURCHASE_APPROVED',
  data: {
    product: { id: 'ORDERBUMP01', name: 'Bônus #1' },
    buyer: { email: 'test@example.com', name: 'Test User' },
    purchase: { transaction: 'HP12345', status: 'approved' },
    order_bump: {
      is_order_bump: true,
      parent_purchase_transaction: 'HP98765'
    }
  }
}
```

## Checklist de Implementação

- [x] Criar tabela `user_products` com suporte a order bumps
- [x] Atualizar interface `HotmartWebhookData` com campo `order_bump`
- [x] Modificar `handlePurchaseApproved` para registrar produtos individuais
- [x] Atualizar handlers de refund/cancel/chargeback
- [x] Criar função `checkUserProductAccess`
- [x] Criar função `getUserProducts`
- [x] Criar função `hasAnyActiveProduct`
- [x] Criar endpoint `/api/user/products`
- [x] Documentar implementação
- [ ] Aplicar migration no Supabase
- [ ] Testar com webhooks reais da Hotmart

## Próximos Passos

1. **Aplicar a Migration**: Execute o SQL no Supabase
2. **Configurar Product IDs**: Defina os IDs dos seus produtos e order bumps na Hotmart
3. **Testar Webhooks**: Use o endpoint de teste da Hotmart
4. **Atualizar Frontend**: Implementar UI para mostrar produtos do usuário
5. **Controle de Acesso**: Implementar verificação por produto nas páginas de conteúdo

## Suporte

Para dúvidas ou problemas:
- Verificar logs em `hotmart_webhooks` table
- Consultar [Hotmart Developers Docs](https://developers.hotmart.com/docs/en/2.0.0/webhook/purchase-webhook/)
- Verificar configuração do webhook no Hotmart Dashboard

## Fontes de Referência

- [Hotmart Changelog](https://developers.hotmart.com/docs/en/changelog)
- [Hotmart Purchase Webhook](https://developers.hotmart.com/docs/en/2.0.0/webhook/purchase-webhook/)
- [Order Bumps Help Center](https://help.hotmart.com/en/article/360019967392)
