# Rate Limiting Improvements & CAPTCHA Integration

## Summary of the Issue

The user got stuck in a re-blocking loop where:
1. Each failed login attempt counted toward rate limit
2. Checking if blocked while blocked created NEW blocks
3. User couldn't login even after clearing database

**Root cause:** Rate limiting was too aggressive and didn't distinguish between malicious attacks and legitimate users who made mistakes.

---

## Recommended Solutions

### Option 1: Cloudflare Turnstile (RECOMMENDED - FREE)

Cloudflare Turnstile is a **free**, privacy-friendly alternative to reCAPTCHA.

**Benefits:**
- ✅ Free forever
- ✅ No "I'm not a robot" checkbox (invisible challenge)
- ✅ Privacy-focused (no tracking cookies)
- ✅ Easy to implement
- ✅ Better UX than reCAPTCHA

**Implementation:**

1. **Get Turnstile Keys** (Free):
   - Go to https://dash.cloudflare.com
   - Navigate to Turnstile
   - Create a new site
   - Copy Site Key and Secret Key

2. **Install Package:**
```bash
npm install @marsidev/react-turnstile
```

3. **Add to Environment Variables:**
```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

4. **Update Login Page** (`app/page.tsx`):
```typescript
import { Turnstile } from '@marsidev/react-turnstile'

export default function LoginPage() {
  const [turnstileToken, setTurnstileToken] = useState('')

  // ... existing code ...

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!turnstileToken) {
      setError('Por favor, complete a verificação de segurança')
      return
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        turnstileToken
      })
    })
    // ... rest of code
  }

  return (
    // ... existing JSX ...
    <form onSubmit={handleSubmit}>
      {/* Email input */}

      {/* Add Turnstile */}
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={setTurnstileToken}
        options={{
          theme: 'light',
          size: 'normal'
        }}
      />

      {/* Submit button */}
    </form>
  )
}
```

5. **Verify Token on Server** (`app/api/auth/login/route.ts`):
```typescript
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip
      })
    }
  )

  const data = await response.json()
  return data.success
}

export async function POST(request: NextRequest) {
  const { email, turnstileToken } = await request.json()
  const ipAddress = getClientIP(request)

  // Verify Turnstile BEFORE rate limiting
  const isHuman = await verifyTurnstile(turnstileToken, ipAddress)
  if (!isHuman) {
    return NextResponse.json(
      { error: 'Verificação de segurança falhou. Tente novamente.' },
      { status: 400 }
    )
  }

  // ... rest of login logic
}
```

---

### Option 2: Google reCAPTCHA v3 (Invisible)

**Benefits:**
- ✅ Invisible (no user interaction)
- ✅ Industry standard
- ❌ Requires Google account
- ❌ Privacy concerns (Google tracking)

**Implementation:**

1. Get keys from https://www.google.com/recaptcha/admin
2. Install: `npm install react-google-recaptcha-v3`
3. Similar integration to Turnstile

---

### Option 3: hCaptcha

**Benefits:**
- ✅ Privacy-focused
- ✅ Free tier available
- ✅ Pays websites (small amounts)
- ❌ More intrusive than Turnstile

---

## Improved Rate Limiting Strategy

Instead of current aggressive blocking, implement **progressive rate limiting**:

### New Rules:

1. **First 3 attempts:** No blocking, just count
2. **After 3 failed attempts:** Show CAPTCHA (Turnstile)
3. **After 5 failed attempts + failed CAPTCHA:** Block for 15 minutes
4. **After 10 failed attempts:** Block for 1 hour
5. **Suspicious activity (3+ emails):** Require CAPTCHA for all attempts from that IP

### Benefits:
- ✅ Legitimate users who typo their email can retry
- ✅ CAPTCHA stops bots before blocking
- ✅ Shorter initial block times
- ✅ Progressive escalation

---

## Implementation Plan

### Phase 1: Add Turnstile (Recommended First Step)

```bash
npm install @marsidev/react-turnstile
```

Add to `.env.local`:
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=xxx
TURNSTILE_SECRET_KEY=xxx
```

### Phase 2: Update Rate Limiting Logic

Keep existing system but:
1. Increase threshold from 5 to 10 attempts
2. Reduce block time from 1 hour to 15 minutes
3. Only block IPs that also fail CAPTCHA

### Phase 3: Add Progressive Blocking

Show CAPTCHA after 3 attempts instead of immediate blocking.

---

## Quick Fix: Improve Current System (No CAPTCHA)

If you want to keep it simple without CAPTCHA:

**Changes to make:**
1. ✅ Increase failed attempts threshold: 5 → 10
2. ✅ Reduce block time: 1 hour → 15 minutes
3. ✅ Don't count attempts while already blocked
4. ✅ Add admin override/whitelist

---

## Cost Comparison

| Solution | Cost | Privacy | UX | Difficulty |
|----------|------|---------|----|-----------|
| **Turnstile** | FREE | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Easy |
| reCAPTCHA v3 | FREE | ⭐⭐⭐ | ⭐⭐⭐⭐ | Easy |
| hCaptcha | FREE | ⭐⭐⭐⭐ | ⭐⭐⭐ | Easy |
| Custom SMS | $$ | ⭐⭐⭐⭐⭐ | ⭐⭐ | Hard |

---

## Recommended Approach

**Best balance of security, UX, and cost:**

1. **Immediately:** Re-enable rate limiting with relaxed settings (10 attempts, 15 min block)
2. **This week:** Add Cloudflare Turnstile (2 hours of work)
3. **Later:** Implement progressive blocking (show CAPTCHA after 3 attempts)

Would you like me to implement any of these solutions?
