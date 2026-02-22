# Avisos (Notifications) System

Complete guide to the notification system that replaced the "Materiales" section.

## Overview

The Avisos system allows administrators to send notifications to users through the app, with support for:
- Rich HTML content
- Image attachments
- Call-to-action buttons
- User targeting and segmentation
- Push notifications (mobile & web)
- Analytics and read tracking
- Scheduled notifications

## Components

### Frontend Components

#### 1. AvisosSection (`components/AvisosSection.tsx`)
Main component that displays the list of notifications.

**Features:**
- Fetches notifications from API
- Displays notification cards
- Shows unread count badge
- Opens modal for full notification view
- Marks notifications as read automatically
- Loading and error states

#### 2. AvisoCard (`components/AvisoCard.tsx`)
Individual notification card component.

**Features:**
- Visual indicators for unread notifications
- Priority badges (urgent, high)
- Notification type labels
- Thumbnail images
- Relative time display
- Click to expand

#### 3. Dashboard Integration (`app/dashboard/page.tsx`)
The dashboard now has an "Avisos" tab instead of "Materiales".

**Changes:**
- Tab renamed from "Materiales" to "Avisos"
- State changed from `'downloads'` to `'avisos'`
- Renders `AvisosSection` component

### Backend API Routes

#### 1. GET `/api/avisos`
Fetches notifications for the current user.

**Features:**
- Returns only sent and active notifications
- Filters by user targeting (if configured)
- Includes read status for each notification
- Ordered by sent_at (newest first)

**Response:**
```json
{
  "success": true,
  "avisos": [
    {
      "id": "uuid",
      "title": "Nueva actualización",
      "short_notification": "Se ha lanzado...",
      "full_content": "<p>Contenido completo...</p>",
      "notification_type": "update",
      "priority": "normal",
      "sent_at": "2025-01-15T10:00:00Z",
      "image_url": "https://...",
      "cta_text": "Ver más",
      "cta_url": "https://...",
      "is_read": false,
      "read_at": null
    }
  ]
}
```

#### 2. POST `/api/avisos/mark-read`
Marks a notification as read for the current user.

**Request:**
```json
{
  "aviso_id": "uuid",
  "clicked": false  // optional, true if CTA was clicked
}
```

**Response:**
```json
{
  "success": true,
  "message": "Aviso marcado como lido"
}
```

**Analytics:**
- Creates/updates record in `aviso_reads` table
- Increments `total_read` counter on aviso
- Increments `total_clicked` if CTA was clicked

#### 3. POST `/api/avisos/create`
Creates and sends a new notification (admin only).

**Request:**
```json
{
  "title": "Título de la notificación",
  "short_notification": "Texto corto para push",
  "full_content": "<p>Contenido HTML completo</p>",
  "notification_type": "general",
  "priority": "normal",
  "scheduled_for": "2025-01-20T15:00:00Z",  // optional
  "target_user_ids": ["uuid1", "uuid2"],    // optional
  "target_product_ids": ["PROD01"],         // optional
  "image_url": "https://...",               // optional
  "thumbnail_url": "https://...",           // optional
  "cta_text": "Ver más",                    // optional
  "cta_url": "https://...",                 // optional
  "send_push": true,                        // optional
  "metadata": {}                            // optional
}
```

**Notification Types:**
- `general`: General announcements
- `announcement`: Important announcements
- `update`: System updates
- `urgent`: Urgent messages
- `event`: Event notifications
- `promocion`: Promotional offers

**Priority Levels:**
- `low`: Low priority (gray badge)
- `normal`: Normal priority (blue badge)
- `high`: High priority (orange badge)
- `urgent`: Urgent priority (red badge)

**Targeting:**
- Leave both targeting fields empty to send to all users
- `target_user_ids`: Array of specific user UUIDs
- `target_product_ids`: Sends to users who own these products

**Response:**
```json
{
  "success": true,
  "aviso": { /* created aviso object */ },
  "message": "Aviso criado e enviado com sucesso"
}
```

### Admin Interface

#### Admin Page (`app/admin/avisos/page.tsx`)
Full-featured form for creating and sending notifications.

**Access:** Navigate to `/admin/avisos`

**Features:**
- Rich form with all notification options
- HTML content editor
- Real-time character counter
- Image URL inputs
- CTA configuration
- User/product targeting
- Scheduling
- Push notification toggle
- Success/error messages

**Form Fields:**
1. **Basic Info**
   - Title (required)
   - Notification type
   - Priority

2. **Content**
   - Short notification (max 150 chars, for push)
   - Full HTML content

3. **Media**
   - Thumbnail URL
   - Full image URL

4. **Call to Action**
   - Button text
   - Button URL

5. **Targeting**
   - User IDs (comma-separated)
   - Product IDs (comma-separated)

6. **Scheduling**
   - Date/time picker
   - Leave empty for immediate send

7. **Push Notifications**
   - Checkbox to enable push

### Database Schema

#### `avisos` Table
Main notifications table.

```sql
CREATE TABLE avisos (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_notification TEXT NOT NULL,
    full_content TEXT NOT NULL,
    notification_type VARCHAR(50),
    priority VARCHAR(20),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20),
    target_user_ids UUID[],
    target_product_ids VARCHAR(255)[],
    total_recipients INT,
    total_sent INT,
    total_read INT,
    total_clicked INT,
    push_notification_sent BOOLEAN,
    push_notification_payload JSONB,
    image_url TEXT,
    thumbnail_url TEXT,
    cta_text VARCHAR(100),
    cta_url TEXT,
    metadata JSONB,
    created_by UUID,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### `aviso_reads` Table
Tracks individual user reads.

```sql
CREATE TABLE aviso_reads (
    id UUID PRIMARY KEY,
    aviso_id UUID REFERENCES avisos(id),
    user_id UUID REFERENCES auth.users(id),
    read_at TIMESTAMP,
    clicked BOOLEAN,
    clicked_at TIMESTAMP,
    device_type VARCHAR(50),
    created_at TIMESTAMP,
    UNIQUE(aviso_id, user_id)
);
```

## Usage Examples

### Example 1: Send Immediate Notification to All Users

```bash
curl -X POST https://your-app.com/api/avisos/create \\
  -H "Content-Type: application/json" \\
  -H "Cookie: session=..." \\
  -d '{
    "title": "Nueva función disponible",
    "short_notification": "Descubre las nuevas características que hemos añadido",
    "full_content": "<h2>Novedades</h2><p>Hemos añadido nuevas funcionalidades...</p>",
    "notification_type": "update",
    "priority": "normal",
    "send_push": true
  }'
```

### Example 2: Schedule Notification for Specific Users

```bash
curl -X POST https://your-app.com/api/avisos/create \\
  -H "Content-Type: application/json" \\
  -H "Cookie: session=..." \\
  -d '{
    "title": "Recordatorio de evento",
    "short_notification": "Tu evento comienza en 1 hora",
    "full_content": "<p>No olvides unirte al evento...</p>",
    "notification_type": "event",
    "priority": "high",
    "scheduled_for": "2025-01-20T14:00:00Z",
    "target_user_ids": ["uuid1", "uuid2"],
    "cta_text": "Unirse ahora",
    "cta_url": "https://your-app.com/events/123"
  }'
```

### Example 3: Product-Specific Promotion

```bash
curl -X POST https://your-app.com/api/avisos/create \\
  -H "Content-Type: application/json" \\
  -H "Cookie: session=..." \\
  -d '{
    "title": "Oferta exclusiva para ti",
    "short_notification": "50% de descuento en upgrade premium",
    "full_content": "<h2>Oferta Especial</h2><p>Como usuario de nuestro producto básico...</p>",
    "notification_type": "promocion",
    "priority": "high",
    "target_product_ids": ["BASIC_PRODUCT"],
    "image_url": "https://your-app.com/promo-banner.jpg",
    "cta_text": "Actualizar ahora",
    "cta_url": "https://pay.hotmart.com/..."
  }'
```

## Migration from Materiales

The "Materiales" section has been replaced with "Avisos". Here's what changed:

### Before (Materiales)
- Tab name: "Materiales"
- Function: Download PDF files
- Content: Static list of PDF materials
- Data source: `product_contents` table (filtered by `content_type = 'pdf'`)

### After (Avisos)
- Tab name: "Avisos"
- Function: View notifications and announcements
- Content: Dynamic notifications from admin
- Data source: `avisos` table

### Migration Steps Completed

1. ✅ Created `avisos` and `aviso_reads` tables
2. ✅ Updated dashboard tab from "Materiales" to "Avisos"
3. ✅ Created `AvisosSection` and `AvisoCard` components
4. ✅ Implemented API routes for fetching and creating notifications
5. ✅ Built admin interface for managing notifications
6. ✅ Added read tracking and analytics

### What You Need to Do

1. **Run Database Migration**
   ```bash
   # Apply the migration to create avisos tables
   psql -d your_database -f supabase/migrations/add_avisos_system.sql
   ```

2. **Configure Admin Access**
   - Update the `isAdmin()` function in `app/api/avisos/create/route.ts`
   - Implement proper admin role checking
   - Options:
     - Create `admin_users` table
     - Use Supabase user metadata
     - Check email against allowlist

3. **Test the System**
   - Access `/admin/avisos` to create test notification
   - Check `/dashboard` and click "Avisos" tab
   - Verify notification appears and can be read

4. **Optional: Setup Push Notifications**
   - Follow [PUSH_NOTIFICATIONS.md](./PUSH_NOTIFICATIONS.md) guide
   - Configure Firebase Cloud Messaging
   - Add device token management
   - Enable push sending in admin panel

## Analytics

The system tracks:
- **Total Recipients**: How many users should receive the notification
- **Total Sent**: How many were successfully sent (for push)
- **Total Read**: How many users opened the notification
- **Total Clicked**: How many clicked the CTA button

Access analytics by querying the `avisos` table:

```sql
SELECT
  title,
  sent_at,
  total_recipients,
  total_read,
  total_clicked,
  ROUND((total_read::float / NULLIF(total_recipients, 0)) * 100, 2) as read_rate,
  ROUND((total_clicked::float / NULLIF(total_read, 0)) * 100, 2) as click_rate
FROM avisos
WHERE status = 'sent'
ORDER BY sent_at DESC;
```

## Security Considerations

1. **Admin Access**: Only authenticated admins can create notifications
2. **Content Validation**: Sanitize HTML to prevent XSS
3. **Rate Limiting**: Prevent notification spam
4. **RLS Policies**: Users can only see notifications targeted to them
5. **Device Tokens**: Protected by Row Level Security

## Future Enhancements

Potential improvements:
- [ ] Rich text editor for full_content
- [ ] Image upload instead of URL input
- [ ] Notification templates
- [ ] A/B testing support
- [ ] Scheduled notification management UI
- [ ] Analytics dashboard
- [ ] User notification preferences
- [ ] In-app notification center with history
- [ ] Email notifications as fallback
- [ ] Notification categories/filters
- [ ] Export analytics to CSV
- [ ] Bulk import from CSV

## Troubleshooting

### Notifications not appearing
1. Check user is authenticated
2. Verify notification status is 'sent'
3. Check targeting settings (user/product IDs)
4. Review browser console for API errors

### Admin page not accessible
1. Verify you're logged in
2. Check `isAdmin()` function implementation
3. Review server logs for auth errors

### Read tracking not working
1. Check browser console for API errors
2. Verify `/api/avisos/mark-read` endpoint
3. Check database RLS policies

## Support

For issues or questions:
1. Check server logs: `npm run dev` output
2. Review browser console for errors
3. Verify database migrations were applied
4. Check API responses in Network tab
