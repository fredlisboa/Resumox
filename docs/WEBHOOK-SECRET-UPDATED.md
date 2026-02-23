# ✅ Hotmart Webhook Secret Updated

## What Changed

The Hotmart webhook secret token has been updated to the correct value:

**Old value (incorrect):** `d0a776aa-81d0-401b-9643-19c21635b9f0`
**New value (correct):** `wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780`

---

## Files Updated

### 1. Environment Configuration
- ✅ [.env.local](.env.local:10) - Updated `HOTMART_WEBHOOK_SECRET`

### 2. Test Scripts
- ✅ [scripts/test-hotmart-webhook.ts](scripts/test-hotmart-webhook.ts:17) - Updated fallback value

### 3. Documentation
- ✅ [HOTMART-INTEGRATION.md](HOTMART-INTEGRATION.md) - Updated all references (3 locations)
- ✅ [HOTMART-SETUP-COMPLETE.md](HOTMART-SETUP-COMPLETE.md) - Updated all references (2 locations)

---

## ✅ Verification Test Passed

Test completed successfully with the new webhook secret:

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                   HOTMART WEBHOOK INTEGRATION TEST                        ║
╚═══════════════════════════════════════════════════════════════════════════╝

Configuration:
  Webhook Secret: wmozIn6FBo...
  Webhook URL: http://localhost:3000/api/webhook/hotmart
  Test Email: teste@example.com

================================================================================
Testing Event: PURCHASE_APPROVED
================================================================================
Email: teste@example.com
Transaction: TEST-PURCHASE_APPROVED-1766147606124
Signature: f3501352bc63757c8227a44988648d9ac4afa3915a7371460d6b93a980a572da

Response Status: 200 OK
✅ SUCCESS: PURCHASE_APPROVED event processed successfully

Total Tests: 1
Successful: 1
Failed: 0
Success Rate: 100.0%

🎉 All tests passed successfully!
```

**HMAC-SHA256 signature validation working correctly! ✅**

---

## 🚀 Next Steps for Production

### 1. Update Vercel Environment Variables

**IMPORTANT:** You must update the webhook secret in your Vercel dashboard:

1. Go to [Vercel Dashboard](https://vercel.com) → Your Project → Settings → Environment Variables
2. Find `HOTMART_WEBHOOK_SECRET`
3. **Edit** or **Delete and Re-add** with the new value:
   ```
   wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780
   ```
4. Apply to **Production**, **Preview**, and **Development** environments
5. **Redeploy** your application for changes to take effect

### 2. Configure in Hotmart Dashboard

When setting up the webhook in Hotmart, use this secret token:

```
wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780
```

**Webhook Configuration in Hotmart:**
1. URL: `https://your-domain.vercel.app/api/webhook/hotmart`
2. Version: 2.0
3. **Secret Token:** `wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780`
4. Events: All purchase events selected

---

## 🧪 Testing Commands

```bash
# Verify setup
npm run verify:hotmart

# Test all webhook events
npm run test:hotmart

# Test specific event
npm run test:hotmart approved

# Check webhook results in database
npm run check:webhooks
```

---

## ⚠️ Important Notes

1. **The webhook secret MUST match exactly** between:
   - Your `.env.local` file (local development)
   - Vercel environment variables (production)
   - Hotmart webhook configuration

2. **HMAC signature validation** uses this secret to verify that webhook requests are genuinely from Hotmart

3. **If signatures don't match**, webhooks will be rejected with `401 Unauthorized`

4. **Never commit** the webhook secret to version control (`.env.local` is in `.gitignore`)

---

## 🔐 Security

This webhook secret is used for HMAC-SHA256 signature validation:

```typescript
// Hotmart sends this header
x-hotmart-hottok: <hmac-sha256-signature>

// Your API validates it
const hash = crypto.createHmac('sha256', HOTMART_WEBHOOK_SECRET)
  .update(rawPayload)
  .digest('hex')

if (hash === signature) {
  // ✅ Valid request from Hotmart
} else {
  // ❌ Invalid signature - reject request
}
```

This ensures only Hotmart can send valid webhook requests to your API.

---

## ✅ Summary

- **Local environment:** Updated and tested ✅
- **Test script:** Updated and tested ✅
- **Documentation:** Updated ✅
- **Webhook validation:** Working correctly ✅

**Action Required:** Update the `HOTMART_WEBHOOK_SECRET` in Vercel and redeploy! 🚀
