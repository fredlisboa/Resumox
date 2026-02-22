# Push Notifications Integration Guide

This document explains how to integrate push notifications into the Avisos system.

## Overview

The Avisos system supports push notifications through Firebase Cloud Messaging (FCM) for both web and mobile platforms. This guide covers the setup and implementation.

## Database Schema

The notifications system uses two main tables:

### `avisos` Table
Stores all notifications with the following key fields:
- `title`: Notification title
- `short_notification`: HTML text for push (max 150 chars recommended)
- `full_content`: Full HTML content for detailed view
- `notification_type`: general, announcement, update, urgent, event, promocion
- `priority`: low, normal, high, urgent
- `push_notification_sent`: Boolean flag
- `push_notification_payload`: JSONB field storing FCM/APNS payload
- `target_user_ids`: Array of specific user UUIDs (optional)
- `target_product_ids`: Array of product IDs for targeting (optional)

### `aviso_reads` Table
Tracks user interactions:
- `aviso_id`: Reference to the notification
- `user_id`: User who read the notification
- `read_at`: Timestamp
- `clicked`: Boolean for CTA clicks
- `device_type`: web, ios, or android

## Firebase Cloud Messaging Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Add your web app and mobile apps (iOS/Android)
4. Download configuration files:
   - `google-services.json` for Android
   - `GoogleService-Info.plist` for iOS
   - Web config object for web app

### 2. Environment Variables

Add to your `.env.local`:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Web Config (for client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

### 3. Install Dependencies

```bash
npm install firebase-admin
npm install firebase
```

### 4. Create Firebase Admin Service

Create `lib/firebase-admin.ts`:

```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}

export const messaging = getMessaging()
```

### 5. Create Push Notification Service

Create `lib/push-notifications.ts`:

```typescript
import { messaging } from './firebase-admin'
import { supabaseAdmin } from './supabase'

interface PushNotificationOptions {
  title: string
  body: string
  imageUrl?: string
  clickUrl?: string
  icon?: string
  badge?: string
}

interface SendToUserOptions extends PushNotificationOptions {
  userId: string
}

interface SendToMultipleOptions extends PushNotificationOptions {
  userIds: string[]
}

interface SendToTopicOptions extends PushNotificationOptions {
  topic: string
}

// Store device tokens in a new table
async function getUserDeviceTokens(userId: string): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from('user_device_tokens')
    .select('token')
    .eq('user_id', userId)
    .eq('is_active', true)

  return data?.map(d => d.token) || []
}

export async function sendPushToUser(options: SendToUserOptions) {
  const tokens = await getUserDeviceTokens(options.userId)

  if (tokens.length === 0) {
    console.log('No device tokens found for user:', options.userId)
    return { success: false, reason: 'no_tokens' }
  }

  const message = {
    notification: {
      title: options.title,
      body: options.body,
      imageUrl: options.imageUrl
    },
    data: {
      click_action: options.clickUrl || '',
      icon: options.icon || '/icon-192x192.png',
      badge: options.badge || '/badge-72x72.png'
    },
    tokens
  }

  try {
    const response = await messaging.sendMulticast(message)
    console.log('Successfully sent push notification:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error }
  }
}

export async function sendPushToMultiple(options: SendToMultipleOptions) {
  const allTokens: string[] = []

  for (const userId of options.userIds) {
    const tokens = await getUserDeviceTokens(userId)
    allTokens.push(...tokens)
  }

  if (allTokens.length === 0) {
    return { success: false, reason: 'no_tokens' }
  }

  // FCM allows max 500 tokens per request
  const batchSize = 500
  const results = []

  for (let i = 0; i < allTokens.length; i += batchSize) {
    const batch = allTokens.slice(i, i + batchSize)

    const message = {
      notification: {
        title: options.title,
        body: options.body,
        imageUrl: options.imageUrl
      },
      data: {
        click_action: options.clickUrl || '',
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/badge-72x72.png'
      },
      tokens: batch
    }

    try {
      const response = await messaging.sendMulticast(message)
      results.push(response)
    } catch (error) {
      console.error('Error sending batch:', error)
    }
  }

  return { success: true, results }
}

export async function sendPushToTopic(options: SendToTopicOptions) {
  const message = {
    notification: {
      title: options.title,
      body: options.body,
      imageUrl: options.imageUrl
    },
    data: {
      click_action: options.clickUrl || '',
      icon: options.icon || '/icon-192x192.png',
      badge: options.badge || '/badge-72x72.png'
    },
    topic: options.topic
  }

  try {
    const response = await messaging.send(message)
    console.log('Successfully sent to topic:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Error sending to topic:', error)
    return { success: false, error }
  }
}
```

### 6. Create Device Token Table

Add this migration:

```sql
-- Table for storing user device tokens
CREATE TABLE IF NOT EXISTS public.user_device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('web', 'ios', 'android')),
    device_info JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, token)
);

CREATE INDEX idx_user_device_tokens_user_id ON public.user_device_tokens(user_id);
CREATE INDEX idx_user_device_tokens_is_active ON public.user_device_tokens(is_active);

-- Enable RLS
ALTER TABLE public.user_device_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tokens"
    ON public.user_device_tokens
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

### 7. Client-Side Firebase Setup

Create `lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission()

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      })

      // Save token to backend
      await saveDeviceToken(token)

      return token
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error)
  }

  return null
}

async function saveDeviceToken(token: string) {
  await fetch('/api/user/device-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      device_type: 'web'
    })
  })
}

export function onMessageListener() {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
}
```

### 8. Service Worker for Web Push

Create `public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.data.icon || '/icon-192x192.png',
    badge: payload.data.badge || '/badge-72x72.png',
    image: payload.notification.image,
    data: {
      url: payload.data.click_action
    }
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  }
})
```

### 9. Update API to Send Push

Update `app/api/avisos/create/route.ts` to actually send push:

```typescript
// Import push service
import { sendPushToMultiple, sendPushToTopic } from '@/lib/push-notifications'

// In the POST handler, after creating the aviso:
if (send_push && status === 'sent') {
  const pushPayload = {
    title: title,
    body: short_notification.replace(/<[^>]*>/g, ''), // Strip HTML
    imageUrl: thumbnail_url || image_url || undefined,
    clickUrl: cta_url || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?tab=avisos`,
  }

  let pushResult

  if (target_user_ids && target_user_ids.length > 0) {
    // Send to specific users
    pushResult = await sendPushToMultiple({
      ...pushPayload,
      userIds: target_user_ids
    })
  } else {
    // Send to all users via topic
    pushResult = await sendPushToTopic({
      ...pushPayload,
      topic: 'all-users'
    })
  }

  // Update aviso with push result
  await supabaseAdmin
    .from('avisos')
    .update({
      push_notification_sent: pushResult.success,
      push_notification_payload: pushPayload
    })
    .eq('id', aviso.id)
}
```

## Testing

1. **Test Web Push**:
   - Open your app in browser
   - Allow notifications when prompted
   - Create a notification from admin panel
   - Check browser notifications

2. **Test Mobile Push**:
   - Install app on iOS/Android device
   - Login and allow notifications
   - Send notification from admin
   - Verify receipt on device

## Topics

Users can be subscribed to topics for easier targeting:

- `all-users`: All app users
- `premium-users`: Users with premium products
- `product-{PRODUCT_ID}`: Users with specific product

## Troubleshooting

### No notifications received
- Check browser/device notification permissions
- Verify FCM credentials are correct
- Check device token is saved in database
- Review Firebase Cloud Messaging logs

### Notifications delayed
- FCM has built-in delays for battery optimization
- Set high priority for urgent notifications
- Consider using data-only messages for immediate delivery

## Best Practices

1. **Respect User Preferences**: Always allow users to opt-out
2. **Rate Limiting**: Don't send too many notifications
3. **Meaningful Content**: Only send valuable updates
4. **Proper Targeting**: Use segmentation to send relevant content
5. **Test Before Sending**: Use test users/devices before production
6. **Monitor Analytics**: Track open rates and engagement
7. **Handle Failures**: Implement retry logic for failed sends

## Security

- Keep Firebase credentials secure (never commit to git)
- Use Row Level Security for device tokens
- Validate notification content to prevent XSS
- Implement rate limiting on notification creation
- Audit who can send notifications (admin only)
