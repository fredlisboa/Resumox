# Hotmart Integration Guide

This document provides complete instructions for setting up, testing, and managing the Hotmart integration in your NeuroReset MVP.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Webhook Configuration](#webhook-configuration)
5. [Testing Locally](#testing-locally)
6. [Deploying to Vercel](#deploying-to-vercel)
7. [Monitoring & Debugging](#monitoring--debugging)
8. [Event Types](#event-types)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Hotmart integration allows automatic user access management based on purchase events from the Hotmart platform. When a customer purchases your product on Hotmart, they automatically get access to your NeuroReset platform.

### Key Features

- ✅ **Automatic user provisioning** on purchase approval
- ✅ **HMAC-SHA256 signature validation** for security
- ✅ **Multi-event support** (approved, refunded, canceled, chargeback)
- ✅ **Session management** (automatically revoke access on refunds)
- ✅ **Subscription support** with subscriber codes
- ✅ **Audit trail** via `hotmart_webhooks` table
- ✅ **Idempotent processing** (safe to retry)

---

## Prerequisites

Before setting up the integration, ensure you have:

1. **Hotmart Account** with API access
2. **Hotmart Product** created and configured
3. **Supabase Database** with the required schema
4. **Vercel Account** (for production deployment)

### Required Database Tables

The integration requires these tables (already included in your schema):

- `users_access` - Stores customer access data
- `hotmart_webhooks` - Webhook audit trail
- `user_sessions` - Active user sessions
- `product_contents` - Digital content delivery

---

## Environment Setup

### Local Development (.env.local)

Your `.env.local` file has been configured with:

```bash
# Hotmart Configuration
HOTMART_CLIENT_ID=65729951-eb44-4767-9e04-a81585928c4a
HOTMART_CLIENT_SECRET=d0a776aa-81d0-401b-9643-19c21635b9f0
HOTMART_BASIC_AUTH=Basic NjU3Mjk5NTEtZWI0NC00NzY3LTllMDQtYTgxNTg1OTI4YzRhOmQwYTc3NmFhLTgxZDAtNDAxYi05NjQzLTE5YzIxNjM1YjlmMA==
HOTMART_WEBHOOK_SECRET=wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780
HOTMART_API_KEY=65729951-eb44-4767-9e04-a81585928c4a
```

**Important:** Never commit `.env.local` to version control!

### Vercel Environment Variables

Add these variables in your Vercel project settings:

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable for **Production**, **Preview**, and **Development** environments:

| Variable Name | Value | Type |
|---------------|-------|------|
| `HOTMART_CLIENT_ID` | `65729951-eb44-4767-9e04-a81585928c4a` | Secret |
| `HOTMART_CLIENT_SECRET` | `d0a776aa-81d0-401b-9643-19c21635b9f0` | Secret |
| `HOTMART_BASIC_AUTH` | `Basic NjU3...` (full value) | Secret |
| `HOTMART_WEBHOOK_SECRET` | `wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780` | Secret |
| `HOTMART_API_KEY` | `65729951-eb44-4767-9e04-a81585928c4a` | Secret |

After adding variables, **redeploy** your application.

---

## Webhook Configuration

### Webhook Endpoint

Your webhook endpoint is available at:

```
POST https://your-domain.vercel.app/api/webhook/hotmart
```

**Local testing URL:**
```
POST http://localhost:3000/api/webhook/hotmart
```

### Configure in Hotmart Dashboard

1. Log in to [Hotmart Dashboard](https://app-vlc.hotmart.com/)
2. Go to **Tools** → **Webhooks**
3. Click **Create New Webhook**
4. Configure:
   - **URL:** `https://your-domain.vercel.app/api/webhook/hotmart`
   - **Events:** Select all purchase events:
     - Purchase approved
     - Purchase complete
     - Purchase refunded
     - Purchase canceled
     - Purchase chargeback
     - Subscription cancellation
   - **Version:** 2.0
   - **Secret Token:** `wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780`

5. Save and test the webhook

### Security: HMAC Signature Validation

The webhook validates signatures using the `x-hotmart-hottok` header:

```typescript
// Hotmart sends this header
x-hotmart-hottok: <hmac-sha256-signature>

// Your API validates it against HOTMART_WEBHOOK_SECRET
const hash = crypto.createHmac('sha256', HOTMART_WEBHOOK_SECRET)
  .update(rawPayload)
  .digest('hex')

if (hash === signature) {
  // Valid request from Hotmart
}
```

---

## Testing Locally

### Step 1: Verify Setup

Run the verification script to check all requirements:

```bash
npm run verify:hotmart
```

This checks:
- ✅ Environment variables
- ✅ Database connection
- ✅ Database schema
- ✅ Webhook endpoint accessibility
- ✅ Existing webhook data

**Expected output:**
```
╔═══════════════════════════════════════════════════════════════════════════╗
║              HOTMART INTEGRATION SETUP VERIFICATION                       ║
╚═══════════════════════════════════════════════════════════════════════════╝

CHECKING ENVIRONMENT VARIABLES
================================================================================
✅ NEXT_PUBLIC_SUPABASE_URL: https://xftofv...
✅ SUPABASE_SERVICE_ROLE_KEY: sb_secret__I...
✅ HOTMART_WEBHOOK_SECRET: d0a776aa-81...
✅ HOTMART_CLIENT_ID: 65729951-eb...
✅ HOTMART_CLIENT_SECRET: d0a776aa-81...

🎉 All checks passed! Hotmart integration is properly configured.
```

### Step 2: Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

### Step 3: Run Webhook Tests

**Test all events:**
```bash
npm run test:hotmart
```

**Test specific event:**
```bash
npm run test:hotmart approved    # PURCHASE_APPROVED
npm run test:hotmart refunded    # PURCHASE_REFUNDED
npm run test:hotmart canceled    # PURCHASE_CANCELED
npm run test:hotmart chargeback  # PURCHASE_CHARGEBACK
```

**Expected output:**
```
╔═══════════════════════════════════════════════════════════════════════════╗
║                   HOTMART WEBHOOK INTEGRATION TEST                        ║
╚═══════════════════════════════════════════════════════════════════════════╝

Configuration:
  Webhook Secret: d0a776aa-8...
  Webhook URL: http://localhost:3000/api/webhook/hotmart
  Test Email: teste@example.com

Running full test suite...

[Test 1/7] Creating new purchase...
================================================================================
Testing Event: PURCHASE_APPROVED
================================================================================
Email: user1@test.com
Transaction: TEST-PURCHASE_APPROVED-1734567890123
Signature: a3b4c5d6e7f8...

Response Status: 200 OK
Response Body: { "success": true, "message": "Webhook processed" }
✅ SUCCESS: PURCHASE_APPROVED event processed successfully

...

TEST SUMMARY
================================================================================
✅ PURCHASE_APPROVED (new user) - Status: 200
✅ PURCHASE_COMPLETE (existing user) - Status: 200
✅ PURCHASE_REFUNDED - Status: 200
✅ PURCHASE_APPROVED (reactivation) - Status: 200
✅ PURCHASE_CANCELED - Status: 200
✅ PURCHASE_CHARGEBACK - Status: 200
✅ SUBSCRIPTION_CANCELLATION - Status: 200

Total Tests: 7
Successful: 7
Failed: 0
Success Rate: 100.0%

🎉 All tests passed successfully!
```

### Step 4: Verify Database Changes

Check your Supabase database to confirm:

1. **hotmart_webhooks table:**
   - New rows created for each test event
   - `processed: true`
   - `processed_at` timestamp set

2. **users_access table:**
   - Test users created/updated
   - Correct `status_compra` values
   - `hotmart_transaction_id` recorded
   - `data_expiracao` set to 1 year from purchase

3. **user_sessions table:**
   - Sessions deactivated for refunded/canceled purchases

---

## Deploying to Vercel

### Pre-deployment Checklist

- ✅ All environment variables configured in Vercel
- ✅ Local tests passing (`npm run test:hotmart`)
- ✅ Supabase database accessible from Vercel
- ✅ Latest code pushed to repository

### Deployment Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure Hotmart integration"
   git push origin main
   ```

2. **Automatic Deployment:**
   - Vercel will automatically deploy from your connected repository
   - Monitor deployment in Vercel dashboard

3. **Verify Production Webhook:**
   ```bash
   curl -X GET https://your-domain.vercel.app/api/webhook/hotmart
   ```

   Expected: `405 Method Not Allowed` (GET not supported, only POST)

4. **Test Production Webhook:**
   ```bash
   WEBHOOK_URL=https://your-domain.vercel.app/api/webhook/hotmart npm run test:hotmart approved
   ```

5. **Update Hotmart Dashboard:**
   - Go to Hotmart webhook settings
   - Update URL to production: `https://your-domain.vercel.app/api/webhook/hotmart`
   - Test the webhook using Hotmart's "Send Test Event" button

---

## Monitoring & Debugging

### Webhook Logs

**View recent webhooks in Supabase:**

```sql
SELECT
  created_at,
  event_type,
  subscriber_email,
  transaction_id,
  processed,
  error_message
FROM hotmart_webhooks
ORDER BY created_at DESC
LIMIT 20;
```

**Filter by email:**
```sql
SELECT * FROM hotmart_webhooks
WHERE subscriber_email = 'customer@example.com'
ORDER BY created_at DESC;
```

**Find failed webhooks:**
```sql
SELECT * FROM hotmart_webhooks
WHERE processed = true AND error_message IS NOT NULL
ORDER BY created_at DESC;
```

### User Access Status

**Check user status:**
```sql
SELECT
  email,
  status_compra,
  product_name,
  data_compra,
  data_expiracao,
  hotmart_transaction_id
FROM users_access
WHERE email = 'customer@example.com';
```

**Find all active users:**
```sql
SELECT email, product_name, data_expiracao
FROM users_access
WHERE status_compra = 'active'
  AND data_expiracao > NOW()
ORDER BY data_compra DESC;
```

### Vercel Logs

View real-time logs in Vercel dashboard:

1. Go to **Deployments** → Select your deployment
2. Click **Functions** tab
3. Find `/api/webhook/hotmart` function
4. View logs for requests and errors

---

## Event Types

### PURCHASE_APPROVED / PURCHASE_COMPLETE

**Triggered when:** Customer completes a successful purchase

**Actions:**
- ✅ Create new user or update existing user
- ✅ Set `status_compra = 'active'`
- ✅ Set `data_expiracao` to 1 year from purchase
- ✅ Store `hotmart_transaction_id` and `product_id`
- ✅ Clear any login blocks
- ✅ Reset `tentativas_login` counter

**Payload example:**
```json
{
  "event": "PURCHASE_APPROVED",
  "version": "2.0.0",
  "data": {
    "product": {
      "id": "12345",
      "name": "Seu Produto"
    },
    "buyer": {
      "email": "cliente@example.com",
      "name": "Cliente Teste"
    },
    "purchase": {
      "transaction": "HP123456789",
      "status": "approved",
      "order_date": 1734567890123,
      "approved_date": 1734567890456
    }
  }
}
```

---

### PURCHASE_REFUNDED

**Triggered when:** Purchase is refunded by Hotmart or seller

**Actions:**
- ✅ Set `status_compra = 'refunded'`
- ✅ Deactivate all user sessions (logs user out)
- ✅ User cannot log in until new purchase

**Impact:** Immediate access revocation

---

### PURCHASE_CANCELED / PURCHASE_DELAYED

**Triggered when:** Payment fails or purchase is canceled

**Actions:**
- ✅ Set `status_compra = 'cancelled'`
- ✅ Deactivate all user sessions
- ✅ User cannot access the platform

---

### PURCHASE_CHARGEBACK

**Triggered when:** Customer disputes the charge with their bank

**Actions:**
- ✅ Set `status_compra = 'chargeback'`
- ✅ Deactivate all user sessions
- ✅ Permanent block (requires manual intervention)

**Note:** Chargebacks are serious and may require additional verification before reactivating access.

---

### SUBSCRIPTION_CANCELLATION

**Triggered when:** Recurring subscription is canceled

**Actions:**
- ✅ Set `status_compra = 'cancelled'`
- ✅ User keeps access until `data_expiracao`
- ✅ No renewal will occur

---

## Troubleshooting

### Issue: Webhook returns 401 "Invalid signature"

**Cause:** HMAC signature mismatch

**Solutions:**
1. Verify `HOTMART_WEBHOOK_SECRET` matches Hotmart configuration
2. Check if Hotmart is sending the `x-hotmart-hottok` header
3. Ensure no extra whitespace in environment variable
4. Test with `npm run test:hotmart` to verify local signature generation

---

### Issue: Webhook returns 500 "Internal server error"

**Cause:** Database connection or query error

**Solutions:**
1. Check Supabase credentials are correct
2. Verify `SUPABASE_SERVICE_ROLE_KEY` has admin permissions
3. Check database schema is up to date
4. Review Vercel function logs for specific error

---

### Issue: User created but cannot log in

**Possible causes:**

1. **Access expired:**
   ```sql
   UPDATE users_access
   SET data_expiracao = NOW() + INTERVAL '1 year'
   WHERE email = 'user@example.com';
   ```

2. **User blocked:**
   ```sql
   UPDATE users_access
   SET bloqueado_ate = NULL, tentativas_login = 0
   WHERE email = 'user@example.com';
   ```

3. **Status not active:**
   ```sql
   UPDATE users_access
   SET status_compra = 'active'
   WHERE email = 'user@example.com';
   ```

---

### Issue: Webhook not receiving events from Hotmart

**Solutions:**

1. **Verify webhook URL is correct in Hotmart dashboard**
2. **Check Hotmart webhook is active** (not paused)
3. **Test manually in Hotmart:** Use "Send Test Event" button
4. **Check firewall/security settings** on Vercel (should allow Hotmart IPs)
5. **Enable webhook logs in Hotmart** to see delivery attempts

---

### Issue: Multiple webhooks for same transaction

**Expected behavior:** The system is idempotent - duplicate webhooks are safe

**What happens:**
- First webhook creates/updates user
- Subsequent webhooks update the same record
- `hotmart_webhooks` table stores all attempts for audit

**If problematic:**
```sql
-- Find duplicate transactions
SELECT transaction_id, COUNT(*) as count
FROM hotmart_webhooks
GROUP BY transaction_id
HAVING COUNT(*) > 1;
```

---

## API Reference

### POST /api/webhook/hotmart

**Headers:**
```
Content-Type: application/json
x-hotmart-hottok: <hmac-sha256-signature>
User-Agent: Hotmart-Webhook/2.0
```

**Request Body:**
```json
{
  "event": "PURCHASE_APPROVED",
  "version": "2.0.0",
  "data": {
    "product": { "id": "string", "name": "string" },
    "buyer": { "email": "string", "name": "string" },
    "purchase": {
      "transaction": "string",
      "status": "string",
      "order_date": 1234567890,
      "approved_date": 1234567890,
      "subscription": {
        "subscriber_code": "string",
        "status": "string"
      }
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid signature"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Internal server error"
}
```

---

## Security Best Practices

1. ✅ **Always validate HMAC signatures** - Never skip signature validation in production
2. ✅ **Use HTTPS only** - Hotmart webhooks require SSL/TLS
3. ✅ **Keep secrets secure** - Never expose `HOTMART_WEBHOOK_SECRET` in client code
4. ✅ **Monitor webhook failures** - Set up alerts for repeated failures
5. ✅ **Rate limit if needed** - Protect against webhook flooding (already handled by Vercel)
6. ✅ **Audit trail** - `hotmart_webhooks` table keeps complete history
7. ✅ **Idempotency** - Safe to replay webhooks without side effects

---

## Testing Checklist

Before going live, verify:

- [ ] Environment variables configured in Vercel
- [ ] `npm run verify:hotmart` passes all checks
- [ ] `npm run test:hotmart` successfully tests all events
- [ ] Production webhook URL configured in Hotmart
- [ ] Test purchase completed successfully on Hotmart
- [ ] User can log in after purchase
- [ ] User access revoked after refund test
- [ ] Webhook logs visible in Supabase
- [ ] Monitoring/alerting configured for errors

---

## Support & Resources

- **Hotmart API Documentation:** https://developers.hotmart.com/
- **Supabase Documentation:** https://supabase.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **Your webhook endpoint:** `/app/api/webhook/hotmart/route.ts`

---

## Next Steps

1. ✅ Complete local testing with `npm run test:hotmart`
2. ✅ Deploy to Vercel with environment variables
3. ✅ Configure webhook URL in Hotmart dashboard
4. ✅ Perform test purchase on Hotmart
5. ✅ Monitor webhook logs for first real transactions
6. ✅ Set up alerts for webhook failures

**Your Hotmart integration is ready to go live! 🚀**
