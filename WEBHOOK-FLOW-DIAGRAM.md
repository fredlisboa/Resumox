# Hotmart Webhook Processing Flow - Before & After Fix

## PROBLEM: What Happened with kriziarc9@gmail.com

### Timeline of Webhook Arrivals

```
Time: 16:16:19 - Webhook #1 (Order Bump - Metaforas Emocionales)
├─ Product: 6558460
├─ Transaction: HP3733587466
├─ is_order_bump: true (detected via checkout session)
├─ parent_transaction: HP3753209659
└─ Result: ✅ Created ACTIVE entry (no locked entry existed yet)

Time: 16:16:21 - Webhook #2 (Order Bump - NeuroAfetividad Infantil)
├─ Product: 6558441
├─ Transaction: HP3732817968
├─ is_order_bump: true
└─ Result: ✅ Created ACTIVE entry

Time: 16:16:24 - Webhook #3 (Order Bump - Coloreando Emociones)
├─ Product: 6558478
├─ Transaction: HP3739743448
├─ is_order_bump: true
└─ Result: ✅ Created ACTIVE entry

Time: 16:16:28 - Webhook #4 (Order Bump - Preguntas Poderosas)
├─ Product: 6557903
├─ Transaction: HP3738973950
├─ is_order_bump: true
└─ Result: ✅ Created ACTIVE entry

Time: 16:31:24 - Webhook #5 (Main Product - DUPLICATE!)
├─ Product: 6557472 (Kit Inteligencia Emocional)
├─ Transaction: HP3753209659
├─ is_order_bump: false
└─ Result: ❌ PROBLEM!
    ├─ Created main product (active)
    └─ Created ALL order bumps as LOCKED (duplicates!)
        ├─ HP3753209659-OB-6557903 (locked) - DUPLICATE of HP3738973950 (active)
        ├─ HP3753209659-OB-6558441 (locked) - DUPLICATE of HP3732817968 (active)
        ├─ HP3753209659-OB-6558478 (locked) - DUPLICATE of HP3739743448 (active)
        └─ HP3753209659-OB-6558460 (locked) - DUPLICATE of HP3733587466 (active)
```

### Database State BEFORE Fix

```
user_products table for kriziarc9@gmail.com:

┌────────┬─────────────────────────────┬──────────┬─────────────────────────────┬──────────┐
│ Idx    │ Product Name                │ Status   │ Transaction ID              │ Is Bump  │
├────────┼─────────────────────────────┼──────────┼─────────────────────────────┼──────────┤
│ 0      │ Metaforas Emocionales       │ active   │ HP3733587466                │ true     │ ✅ OK
│ 1      │ NeuroAfetividad Infantil    │ active   │ HP3732817968                │ true     │ ✅ OK
│ 2      │ Coloreando Emociones        │ active   │ HP3739743448                │ true     │ ✅ OK
│ 3      │ Preguntas Poderosas...      │ active   │ HP3738973950                │ true     │ ✅ OK
│ 4      │ Kit Inteligencia Emocional  │ active   │ HP3753209659                │ false    │ ✅ OK
├────────┼─────────────────────────────┼──────────┼─────────────────────────────┼──────────┤
│ 5      │ Preguntas Poderosas...      │ locked   │ HP3753209659-OB-6557903     │ true     │ ❌ DUPLICATE
│ 6      │ NeuroAfetividad Infantil    │ locked   │ HP3753209659-OB-6558441     │ true     │ ❌ DUPLICATE
│ 7      │ Coloreando Emociones        │ locked   │ HP3753209659-OB-6558478     │ true     │ ❌ DUPLICATE
│ 8      │ Metaforas Emocionales       │ locked   │ HP3753209659-OB-6558460     │ true     │ ❌ DUPLICATE
│ 9      │ Ferramentas de Regulacao... │ locked   │ HP3753209659-OB-6558403     │ true     │ ⚠️  NEVER PURCHASED
└────────┴─────────────────────────────┴──────────┴─────────────────────────────┴──────────┘

Total: 10 entries (5 correct, 4 duplicate locked, 1 legitimate locked)
Issue: User has access but system shows locked entries
```

---

## SOLUTION: Code Changes Flow

### Fix #1: Early Exit if Main Product Already Exists

#### BEFORE (Buggy Code):
```typescript
if (!isOrderBump && isMainProduct(productId)) {
  // Insert main product
  await insertMainProduct()

  // PROBLEM: Always creates locked bumps, even if duplicates
  for (const orderBump of getOrderBumpsForProduct(productId)) {
    await insertLockedOrderBump(orderBump)
  }
}
```

#### AFTER (Fixed Code):
```typescript
if (!isOrderBump && isMainProduct(productId)) {
  // NEW: Check if main product already exists
  const existingMainProduct = await checkExisting()

  if (existingMainProduct) {
    // Update main product if needed
    await updateMainProduct()

    // CRITICAL: Skip locked bump creation entirely
    console.log('⚠️  SKIPPING order bump creation - main product already exists')
    return // Exit early - prevents duplicates
  }

  // Only create locked bumps if this is the FIRST time processing main product
  await insertMainProduct()
  for (const orderBump of getOrderBumpsForProduct(productId)) {
    await insertLockedOrderBump(orderBump)
  }
}
```

**What this fixes**: Duplicate webhooks for main product won't create duplicate locked entries.

---

### Fix #2: Check for Active Bumps Before Creating Locked Entries

#### BEFORE (Buggy Code):
```typescript
for (const orderBump of orderBumps) {
  // PROBLEM: Always creates locked entry, even if active exists
  await insertLockedOrderBump(orderBump)
}
```

#### AFTER (Fixed Code):
```typescript
for (const orderBump of orderBumps) {
  // NEW: Check if order bump is already ACTIVE
  const existingActive = await checkActiveOrderBump(orderBump.product_id)

  if (existingActive) {
    console.log('⚠️  Order bump already ACTIVE, skipping')
    continue // Skip this bump
  }

  // Only create locked if not already active
  await insertLockedOrderBump(orderBump)
}
```

**What this fixes**: If order bump webhook arrives before main product, locked entry won't be created.

---

### Fix #3: Idempotency Check for Order Bump Activation

#### BEFORE (Buggy Code):
```typescript
else if (isOrderBump) {
  // PROBLEM: No check if already processed
  const existingOrderBump = await findOrderBump()

  if (existingOrderBump) {
    await updateToActive(existingOrderBump)
  } else {
    await insertActiveOrderBump()
  }
}
```

#### AFTER (Fixed Code):
```typescript
else if (isOrderBump) {
  // NEW: Check if already processed this exact transaction
  const alreadyActive = await checkAlreadyProcessed(transactionId)

  if (alreadyActive) {
    console.log('⚠️  Already processed, skipping')
    return // Exit early - idempotency
  }

  const existingOrderBump = await findOrderBump()

  if (existingOrderBump) {
    await updateToActive(existingOrderBump)
  } else {
    await insertActiveOrderBump()
  }
}
```

**What this fixes**: Duplicate order bump webhooks won't be processed twice.

---

## RESULT: Fixed Database State

### After Running Cleanup Script

```
user_products table for kriziarc9@gmail.com:

┌────────┬─────────────────────────────┬──────────┬─────────────────────────────┬──────────┐
│ Idx    │ Product Name                │ Status   │ Transaction ID              │ Is Bump  │
├────────┼─────────────────────────────┼──────────┼─────────────────────────────┼──────────┤
│ 0      │ Kit Inteligencia Emocional  │ active   │ HP3753209659                │ false    │ ✅ Main Product
│ 1      │ Metaforas Emocionales       │ active   │ HP3733587466                │ true     │ ✅ Order Bump (purchased)
│ 2      │ NeuroAfetividad Infantil    │ active   │ HP3732817968                │ true     │ ✅ Order Bump (purchased)
│ 3      │ Coloreando Emociones        │ active   │ HP3739743448                │ true     │ ✅ Order Bump (purchased)
│ 4      │ Preguntas Poderosas...      │ active   │ HP3738973950                │ true     │ ✅ Order Bump (purchased)
│ 5      │ Ferramentas de Regulacao... │ locked   │ HP3753209659-OB-6558403     │ true     │ ⚠️  Available (not purchased yet)
└────────┴─────────────────────────────┴──────────┴─────────────────────────────┴──────────┘

Total: 6 entries (5 active, 1 locked)
✅ User has full access to all purchased products
✅ One locked entry for unpurchased order bump (correct behavior)
```

---

## Test Scenarios - Before vs After Fix

### Scenario 1: Normal Flow (Main Product → Order Bumps)

#### BEFORE Fix:
```
1. Main Product Webhook → Creates main (active) + all bumps (locked) ✅
2. Order Bump Webhook → Updates locked to active ✅
Result: Works correctly (no issue)
```

#### AFTER Fix:
```
1. Main Product Webhook → Creates main (active) + all bumps (locked) ✅
2. Order Bump Webhook → Updates locked to active ✅
Result: Works correctly (no change)
```

**Verdict**: No regression, works as expected.

---

### Scenario 2: Reverse Flow (Order Bumps → Main Product)

#### BEFORE Fix:
```
1. Order Bump Webhook → Creates bump (active) ✅
2. Main Product Webhook → Creates main (active) + ALL bumps (locked) ❌
   └─ PROBLEM: Creates duplicate locked bump!
Result: User has both active AND locked entry for same product
```

#### AFTER Fix:
```
1. Order Bump Webhook → Creates bump (active) ✅
2. Main Product Webhook → Creates main (active), SKIPS locked bump creation ✅
   └─ FIX: Detects existing active bump, skips locked creation
Result: User has only active entry (correct)
```

**Verdict**: ✅ Fixed! No more duplicates.

---

### Scenario 3: Duplicate Main Product Webhook

#### BEFORE Fix:
```
1. Main Product Webhook #1 → Creates main (active) + all bumps (locked) ✅
2. Main Product Webhook #2 → Creates main (active) + all bumps (locked) ❌
   └─ PROBLEM: Creates duplicate locked bumps!
Result: Multiple locked entries for each bump
```

#### AFTER Fix:
```
1. Main Product Webhook #1 → Creates main (active) + all bumps (locked) ✅
2. Main Product Webhook #2 → Detects existing main product, SKIPS locked creation ✅
   └─ FIX: Early exit prevents duplicate locked bumps
Result: Only one set of locked bumps (correct)
```

**Verdict**: ✅ Fixed! Duplicate webhooks handled correctly.

---

### Scenario 4: Duplicate Order Bump Webhook

#### BEFORE Fix:
```
1. Order Bump Webhook #1 → Creates bump (active) ✅
2. Order Bump Webhook #2 → Updates bump (active) or creates duplicate ⚠️
Result: May process same purchase twice
```

#### AFTER Fix:
```
1. Order Bump Webhook #1 → Creates bump (active) ✅
2. Order Bump Webhook #2 → Detects already processed, returns early ✅
   └─ FIX: Idempotency check prevents duplicate processing
Result: Only one active entry (correct)
```

**Verdict**: ✅ Fixed! Idempotent processing.

---

## Summary

### Root Causes
1. ❌ No check if main product already exists before creating locked bumps
2. ❌ No check if order bumps already active before creating locked entries
3. ❌ No idempotency check for duplicate webhooks

### Fixes Applied
1. ✅ Early exit if main product already exists → Prevents duplicate locked bumps
2. ✅ Skip locked creation if active bump exists → Handles reverse webhook order
3. ✅ Idempotency check by transaction ID → Prevents duplicate processing
4. ✅ Smart duplicate cleanup during activation → Self-healing behavior

### Impact
- ✅ Prevents all future duplicate locked entries
- ✅ Fixes existing users with cleanup script
- ✅ Maintains all user access (no data loss)
- ✅ Improves webhook resilience and reliability

---

**Last Updated**: 2026-01-05
