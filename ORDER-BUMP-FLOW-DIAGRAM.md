# Order Bump Flow Diagram

## 📊 Complete Flow Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOTMART PURCHASE                         │
│                                                                  │
│  User buys:                                                      │
│  1. Main Product (NeuroReset - ID: 6557972)                     │
│  2. Order Bump (Protocolo Descompresión - ID: ORDERBUMP01)     │
│                                                                  │
│  Checkout Session: SESSION-ABC-123                              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  WEBHOOK 1: MAIN PRODUCT                         │
│  POST /api/webhook/hotmart                                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│           ORDER BUMP DETECTION (Webhook Handler)                 │
│                                                                  │
│  1. Check Hotmart flag: is_order_bump = false ❌                │
│  2. Check checkout session: SESSION-ABC-123                      │
│  3. Search recent webhooks with same session: None found         │
│  4. RESULT: This is MAIN PRODUCT ✅                             │
│                                                                  │
│  Logs:                                                           │
│  [Hotmart Webhook] Is Order Bump: ❌ NO                         │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE: users_access                        │
│                                                                  │
│  INSERT/UPDATE:                                                  │
│    email: user@example.com                                       │
│    status_compra: active                                         │
│    product_id: 6557972                                           │
│    hotmart_transaction_id: HP-MAIN-123                          │
└─────────────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE: user_products                       │
│                                                                  │
│  INSERT:                                                         │
│    product_id: 6557972                                           │
│    is_order_bump: false ❌                                      │
│    status: active ✅                                            │
│    parent_transaction_id: null                                   │
│                                                                  │
│  Logs:                                                           │
│  [Hotmart Webhook] ✅ Product registered: MAIN PRODUCT          │
└─────────────────────────────────────────────────────────────────┘

                 ⏱️ Few seconds later...

┌─────────────────────────────────────────────────────────────────┐
│                 WEBHOOK 2: ORDER BUMP                            │
│  POST /api/webhook/hotmart                                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│           ORDER BUMP DETECTION (Webhook Handler)                 │
│                                                                  │
│  1. Check Hotmart flag: is_order_bump = false ❌                │
│  2. Check checkout session: SESSION-ABC-123 ✅                  │
│  3. Search recent webhooks with same session:                    │
│     Found: HP-MAIN-123 (5 seconds ago) ✅                       │
│  4. RESULT: This is ORDER BUMP ✅                               │
│                                                                  │
│  Logs:                                                           │
│  [Hotmart Webhook] ✅ Order bump DETECTED                       │
│  [Hotmart Webhook] Parent transaction: HP-MAIN-123               │
│  [Hotmart Webhook] Is Order Bump: ✅ YES                        │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE: user_products                       │
│                                                                  │
│  INSERT:                                                         │
│    product_id: ORDERBUMP01                                       │
│    is_order_bump: true ✅                                       │
│    status: active ✅                                            │
│    parent_transaction_id: HP-MAIN-123                           │
│                                                                  │
│  Logs:                                                           │
│  [Hotmart Webhook] ✅ Product registered: ORDER BUMP            │
└─────────────────────────────────────────────────────────────────┘

                 Now user has 2 active products!

┌─────────────────────────────────────────────────────────────────┐
│           USER LOGS IN TO MEMBERS AREA                           │
│  GET /api/contents                                               │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FETCH USER'S ACTIVE PRODUCTS                    │
│                                                                  │
│  SELECT * FROM user_products                                     │
│  WHERE user_id = '...' AND status = 'active'                     │
│                                                                  │
│  RESULT:                                                         │
│    activeProductIds = ['6557972', 'ORDERBUMP01'] ✅             │
│                                                                  │
│  Logs:                                                           │
│  [Contents API] Active products: ["6557972", "ORDERBUMP01"]      │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FETCH ALL ACTIVE CONTENTS                     │
│                                                                  │
│  SELECT * FROM product_contents                                  │
│  WHERE is_active = true                                          │
│                                                                  │
│  RESULTS:                                                        │
│    - 12 contents with product_id=6557972, status='principal'    │
│    - 2 contents with product_id=6557972, status='bonus'         │
│    - 1 content with product_id=ORDERBUMP01, status='order_bump' │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              PROCESS EACH CONTENT (Filter & Map)                 │
│                                                                  │
│  FOR EACH content:                                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Content #1: NeuroReset - Calma Mental                  │    │
│  │   product_id: 6557972                                   │    │
│  │   status: 'principal'                                   │    │
│  │                                                         │    │
│  │   ✅ INCLUDE (user owns 6557972)                        │    │
│  │   is_locked: false                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Content #13: Bono 1 - El Escudo Anti-Estrés           │    │
│  │   product_id: 6557972                                   │    │
│  │   status: 'bonus'                                       │    │
│  │                                                         │    │
│  │   ✅ INCLUDE (user owns 6557972)                        │    │
│  │   is_locked: false                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Content #15: Protocolo de Descompresión Somática      │    │
│  │   product_id: ORDERBUMP01                               │    │
│  │   status: 'order_bump'                                  │    │
│  │                                                         │    │
│  │   🔍 Check: Is this an order bump?                     │    │
│  │      isOrderBump = (status === 'order_bump') ✅        │    │
│  │                                                         │    │
│  │   🔍 Check: Does user own ORDERBUMP01?                 │    │
│  │      userOwnsOrderBump =                                │    │
│  │        activeProductIds.includes('ORDERBUMP01') ✅      │    │
│  │                                                         │    │
│  │   🔍 Calculate lock status:                            │    │
│  │      isLocked = isOrderBump && !userOwnsOrderBump       │    │
│  │      isLocked = true && !true                           │    │
│  │      isLocked = false ✅                                │    │
│  │                                                         │    │
│  │   ✅ INCLUDE + UNLOCKED                                 │    │
│  │   is_locked: false                                      │    │
│  │   checkout_url: null                                    │    │
│  │                                                         │    │
│  │   Logs:                                                 │    │
│  │   [Contents API] Order Bump: Protocolo...               │    │
│  │   [Contents API]   - User owns: true                    │    │
│  │   [Contents API]   - Is locked: false                   │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RETURN TO FRONTEND                            │
│                                                                  │
│  {                                                               │
│    success: true,                                                │
│    contents: [                                                   │
│      {                                                           │
│        id: "...",                                                │
│        title: "NeuroReset - Calma Mental",                       │
│        status: "principal",                                      │
│        is_locked: false ✅                                      │
│      },                                                          │
│      ...                                                         │
│      {                                                           │
│        id: "...",                                                │
│        title: "Protocolo de Descompresión Somática",            │
│        status: "order_bump",                                     │
│        is_locked: false ✅                                      │
│        checkout_url: null                                        │
│      }                                                           │
│    ],                                                            │
│    productCount: 2                                               │
│  }                                                               │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND DISPLAY                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ 📌 NeuroReset - Calma Mental              [▶ Play]   │      │
│  │    Audio • 15:23                                      │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ 🎁 Bono 1 - El Escudo Anti-Estrés         [▶ Play]   │      │
│  │    PDF • 2.5 MB                                       │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ 🔓 Protocolo de Descompresión Somática   [▶ Play]   │      │
│  │    PDF • 3.1 MB                                       │      │
│  │    Previously: 🔒 BLOQUEADO - now UNLOCKED! ✅       │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Alternative Scenario: User WITHOUT Order Bump

```
User has only MAIN PRODUCT (didn't buy order bump)

┌─────────────────────────────────────────────────────────────────┐
│              FETCH USER'S ACTIVE PRODUCTS                        │
│                                                                  │
│  activeProductIds = ['6557972'] ❌ (no ORDERBUMP01)             │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              PROCESS ORDER BUMP CONTENT                          │
│                                                                  │
│  Content: Protocolo de Descompresión Somática                   │
│    product_id: ORDERBUMP01                                       │
│    status: 'order_bump'                                          │
│                                                                  │
│  🔍 isOrderBump = true ✅                                       │
│  🔍 userOwnsOrderBump =                                          │
│      activeProductIds.includes('ORDERBUMP01')                    │
│      ['6557972'].includes('ORDERBUMP01') = false ❌             │
│                                                                  │
│  🔒 isLocked = true && !false = true ✅                         │
│                                                                  │
│  Result:                                                         │
│    is_locked: true ✅                                           │
│    checkout_url: "https://pay.hotmart.com/A102740797J" ✅       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND DISPLAY                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ 🔒 Protocolo de Descompresión Somática               │      │
│  │    PDF • 3.1 MB                                       │      │
│  │                                                       │      │
│  │    [🔓 DESBLOQUEAR AHORA]  ← Redirects to checkout   │      │
│  │                                                       │      │
│  │    Red border, 60% opacity, locked badge             │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Decision Points

### 1. Order Bump Detection (Webhook)
```
IF Hotmart flag is_order_bump = true
    → It's an order bump ✅
ELSE IF checkout session matches recent webhook
    → It's an order bump ✅
ELSE
    → It's main product
```

### 2. Content Unlocking (API)
```
IF content.status !== 'order_bump'
    → Check if user owns content.product_id
ELSE (it's an order bump)
    → Lock ONLY if user doesn't own content.product_id
```

---

## 📊 Database State After Purchase

```
users_access
┌─────────────┬──────────────────┬───────────────┬────────────┐
│ id          │ email            │ status_compra │ product_id │
├─────────────┼──────────────────┼───────────────┼────────────┤
│ user-123    │ user@example.com │ active        │ 6557972    │
└─────────────┴──────────────────┴───────────────┴────────────┘

user_products
┌──────────┬────────────┬──────────────┬───────┬────────────────────┐
│ user_id  │ product_id │ is_order_bump│ status│ parent_transaction │
├──────────┼────────────┼──────────────┼───────┼────────────────────┤
│ user-123 │ 6557972    │ false        │ active│ null               │
│ user-123 │ ORDERBUMP01│ true ✅      │ active│ HP-MAIN-123        │
└──────────┴────────────┴──────────────┴───────┴────────────────────┘

product_contents
┌──────────────┬─────────────────────────┬────────────┬──────────┐
│ product_id   │ title                   │ status     │ is_active│
├──────────────┼─────────────────────────┼────────────┼──────────┤
│ 6557972      │ NeuroReset - Calma...   │ principal  │ true     │
│ 6557972      │ Track01 - Dormir...     │ principal  │ true     │
│ 6557972      │ Bono 1 - El Escudo...   │ bonus      │ true     │
│ ORDERBUMP01  │ Protocolo de Descom...  │ order_bump │ true     │
└──────────────┴─────────────────────────┴────────────┴──────────┘
```

---

## ✅ Summary

**The Fix:** Changed unlocking logic from:
```typescript
// ❌ BEFORE: Always locked
const isLocked = content.status === 'order_bump'

// ✅ AFTER: Lock only if user doesn't own it
const isLocked = isOrderBump && !userOwnsOrderBump
```

**The Result:**
- Users who buy order bumps can access the content ✅
- Users who don't buy order bumps see locked content with checkout button ✅
- Everything is tracked correctly in the database ✅
