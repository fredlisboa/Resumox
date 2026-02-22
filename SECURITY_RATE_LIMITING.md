# IP-Based Rate Limiting - Security Documentation

## Overview

The login system now uses **IP-based rate limiting** instead of email-based rate limiting. This provides enhanced security against brute force attacks and unauthorized access attempts.

## How It Works

### Multi-Layer Security Approach

The new rate limiting system uses three layers of protection:

1. **IP Address Tracking** (Primary)
2. **User Agent Tracking** (Secondary)
3. **Email + IP Combination** (Tertiary)

### Rate Limiting Rules

#### 1. Standard Rate Limiting
- **Limit**: 5 failed login attempts per IP address per hour
- **Action**: Block IP for 1 hour
- **Message**: "Muitas tentativas de login. Tente novamente mais tarde."

#### 2. Suspicious Activity Detection
- **Trigger**: Same IP attempting to login with 3+ different email addresses within 1 hour
- **Action**: Block IP for 24 hours
- **Reason**: Potential credential stuffing or brute force attack

#### 3. Remaining Attempts Display
- Users see: "Você tem X tentativas restantes"
- Calculation: `5 - (failed attempts from this IP in last hour)`

## Database Schema

### New Table: `ip_rate_limits`

```sql
CREATE TABLE public.ip_rate_limits (
    id UUID PRIMARY KEY,
    ip_address INET NOT NULL UNIQUE,
    blocked_until TIMESTAMP,
    blocked_reason VARCHAR(255),  -- 'too_many_attempts' or 'suspicious_activity'
    attempt_count INT DEFAULT 0,
    unique_emails_attempted INT DEFAULT 0,
    last_attempt TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Existing Table: `login_attempts`

Still tracks all login attempts with:
- Email address
- IP address
- User agent
- Success/failure status
- Timestamp

## Implementation Details

### Rate Limit Check Flow

```
1. Check if IP is currently blocked
   ↓
2. Count failed attempts from this IP in last hour
   ↓
3. Check for suspicious activity (multiple emails from same IP)
   ↓ (If 3+ unique emails attempted)
   → Block for 24 hours
   ↓
4. Check if IP exceeded 5 attempts
   ↓ (If ≥5 attempts)
   → Block for 1 hour
   ↓
5. Update IP rate limit counter
   ↓
6. Return remaining attempts: 5 - failed_attempts
```

### Successful Login

When a user successfully logs in:
- IP rate limit record is deleted
- User's `tentativas_login` is reset to 0
- User's `bloqueado_ate` is cleared

## Benefits Over Email-Based Rate Limiting

### Previous Approach (Email-Based)
❌ Attackers could try multiple emails from the same IP
❌ No detection of suspicious patterns
❌ Each email had separate rate limit counters

### New Approach (IP-Based)
✅ Blocks attackers at the network level
✅ Detects suspicious behavior (multiple email attempts)
✅ Legitimate users from the same location are unaffected
✅ More resistant to credential stuffing attacks
✅ Shared IPs (cafes, offices) are handled properly

## Migration Instructions

### Step 1: Apply Database Migration

Run the migration script in Supabase SQL Editor:

```bash
# File: supabase/migrations/add_ip_rate_limiting.sql
```

Or manually execute in Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `supabase/migrations/add_ip_rate_limiting.sql`
3. Click "Run"

### Step 2: Verify Tables Created

Check that the following exists:
- Table: `public.ip_rate_limits`
- Indexes: `idx_ip_rate_limits_ip`, `idx_ip_rate_limits_blocked`
- Updated function: `cleanup_old_login_attempts()`

### Step 3: Deploy Updated Code

The following files have been updated:
- `lib/auth.ts` - New `checkRateLimit()` function
- `supabase/schema.sql` - Complete schema with new table

### Step 4: Test the New System

#### Test Case 1: Normal Login
1. Attempt login with valid email
2. Should work normally
3. Verify remaining attempts shown on error

#### Test Case 2: Rate Limiting
1. Attempt 5 failed logins from same IP
2. 6th attempt should be blocked
3. Should display: "Muitas tentativas de login"
4. Block should last 1 hour

#### Test Case 3: Suspicious Activity
1. Attempt logins with 3+ different emails from same IP
2. Should be blocked for 24 hours
3. Database should record `blocked_reason: 'suspicious_activity'`

## Monitoring & Maintenance

### View Blocked IPs

```sql
SELECT
    ip_address,
    blocked_reason,
    attempt_count,
    unique_emails_attempted,
    blocked_until
FROM public.ip_rate_limits
WHERE blocked_until > NOW()
ORDER BY blocked_until DESC;
```

### Manual IP Unblock

```sql
DELETE FROM public.ip_rate_limits
WHERE ip_address = '123.456.789.012';
```

### View Recent Login Attempts

```sql
SELECT
    email,
    ip_address,
    success,
    attempted_at,
    user_agent
FROM public.login_attempts
WHERE attempted_at > NOW() - INTERVAL '1 hour'
ORDER BY attempted_at DESC;
```

### Cleanup Old Records

The `cleanup_old_login_attempts()` function automatically:
- Deletes login attempts older than 24 hours
- Removes expired IP blocks older than 24 hours

Schedule this to run periodically (e.g., via cron job).

## API Response Changes

### Before (Email-Based)
```json
{
  "error": "E-mail não encontrado",
  "remainingAttempts": 4
}
```

### After (IP-Based)
```json
{
  "error": "E-mail não encontrado",
  "remainingAttempts": 4  // Now based on IP, not email
}
```

### Blocked Response
```json
{
  "error": "Muitas tentativas de login. Tente novamente mais tarde.",
  "blockedUntil": "2025-12-18T15:30:00.000Z",
  "remainingAttempts": 0
}
```

## Security Considerations

### Advantages
1. **DDoS Protection**: Prevents excessive requests from single source
2. **Credential Stuffing Defense**: Detects automated attacks
3. **Brute Force Protection**: Limits guessing attempts
4. **Pattern Detection**: Identifies suspicious behavior

### Edge Cases Handled
1. **Shared IPs**: Users from same network can each try 5 times
2. **Dynamic IPs**: Rate limits reset after IP change
3. **VPNs**: Each VPN IP treated separately
4. **Proxy Servers**: Handled like any other IP

### Potential Issues
1. **Corporate NATs**: Many users behind same IP might trigger limits
   - Solution: Monitor and whitelist corporate IPs if needed
2. **IP Spoofing**: Not possible in HTTP/HTTPS context
3. **IPv6**: Fully supported (using INET type)

## Future Enhancements

Possible improvements:
- [ ] IP whitelist for trusted networks
- [ ] Geographic blocking (block specific countries)
- [ ] CAPTCHA after 3 failed attempts
- [ ] Email notification on suspicious activity
- [ ] Admin dashboard to view and manage blocks
- [ ] Honeypot fields to catch bots

## Support

If you encounter issues:
1. Check Supabase logs for errors
2. Verify migration was applied successfully
3. Test rate limiting with actual failed login attempts
4. Monitor `ip_rate_limits` table for correct data

For questions, refer to the main documentation or contact support.
