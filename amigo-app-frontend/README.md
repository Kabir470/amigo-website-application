# Amigo — Hospital Medicine Delivery Robot Control Panel

A modern, secure Next.js web application to manage and monitor an autonomous IoT medicine-delivery robot used in a hospital ward.

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + custom glassmorphism design
- **Backend:** Next.js API routes (Edge-compatible)
- **Database:** Firebase Firestore (real-time via `onSnapshot`)
- **Auth:** Firebase Authentication (email/password)
- **Admin SDK:** firebase-admin for server-side token verification
- **Hosting:** Vercel + Firebase

---

## Project Structure

```
amigo-app/
├── app/
│   ├── api/
│   │   ├── robot/scan/route.ts       # RFID scan ingestion (device auth)
│   │   ├── robot/telemetry/route.ts  # Robot heartbeat/telemetry
│   │   ├── deliveries/route.ts       # Delivery status updates
│   │   └── users/route.ts            # User management (admin only)
│   ├── dashboard/
│   │   ├── layout.tsx                # Auth guard + sidebar layout
│   │   ├── page.tsx                  # Main dashboard (live stats)
│   │   ├── patients/page.tsx         # Patient & bed CRUD
│   │   ├── deliveries/page.tsx       # Delivery queue + overrides
│   │   ├── robot/page.tsx            # Robot monitor & control
│   │   ├── alerts/page.tsx           # Real-time alerts
│   │   ├── users/page.tsx            # Staff management (admin)
│   │   ├── audit/page.tsx            # Audit log (admin)
│   │   └── settings/page.tsx         # System config (admin)
│   ├── login/page.tsx                # Login page
│   └── layout.tsx                    # Root layout + AuthProvider
├── components/
│   └── Sidebar.tsx                   # Role-based navigation sidebar
├── lib/
│   ├── firebase/
│   │   ├── client.ts                 # Firebase client SDK
│   │   └── admin.ts                  # Firebase Admin SDK (server-only)
│   ├── auth/
│   │   ├── AuthContext.tsx           # React auth context + hooks
│   │   └── verifyToken.ts            # Server-side token verification
│   └── utils.ts                      # Helpers (cn, formatTimestamp, etc.)
├── types/index.ts                    # TypeScript types
├── firestore.rules                   # Firestore Security Rules
├── .env.local                        # Environment variables (never commit)
└── next.config.ts                    # Security headers + Next.js config
```

---

## Setup

### 1. Firebase Project

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Email/Password**
3. Enable **Firestore Database** (start in production mode)
4. Generate a **Service Account key** (Project Settings → Service Accounts → Generate new private key)

### 2. Environment Variables

Copy `.env.local` and fill in your values:

```bash
# Firebase Client SDK (safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin SDK (server-only — NEVER expose)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Robot device auth key (generate a strong random string)
ROBOT_API_KEY=your_strong_random_key_here
```

### 3. Deploy Firestore Rules

```bash
firebase login
firebase use --add   # select your project
firebase deploy --only firestore:rules
```

### 4. Create First Admin User

In Firebase Console → Authentication, create a user manually.  
Then in Firestore, create a document at `/users/{uid}`:
```json
{
  "name": "Admin Name",
  "email": "admin@hospital.com",
  "role": "admin",
  "createdAt": <server timestamp>
}
```

Then set the custom claim via the API or Firebase Admin SDK console.

### 5. Run Locally

```bash
cd amigo-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/login`.

---

## Robot Integration

The robot communicates with two secure endpoints:

### Scan Event (RFID read)
```
POST /api/robot/scan
Headers: x-api-key: <ROBOT_API_KEY>
Body: { robotId, rfidTagId, bedId, timestamp }
```

### Telemetry (heartbeat)
```
POST /api/robot/telemetry
Headers: x-api-key: <ROBOT_API_KEY>
Body: { robotId, batteryLevel, status, currentRoute }
```

> All robot ↔ backend traffic must be over HTTPS/TLS. Never embed the API key in client-side code.

---

## Roles

| Feature | Admin | Nurse |
|---------|-------|-------|
| View dashboard | ✅ | ✅ |
| View patients/beds | ✅ | ✅ |
| Add/edit/delete patients | ✅ | ❌ |
| View deliveries | ✅ | ✅ |
| Mark delivery complete/fail | ✅ | ✅ |
| View robot status | ✅ | ✅ |
| Manual robot override | ✅ | ❌ |
| Robot config push | ✅ | ❌ |
| View alerts | ✅ | ✅ |
| Acknowledge alerts | ✅ | ✅ |
| Manage users | ✅ | ❌ |
| View audit log | ✅ | ❌ |
| System settings | ✅ | ❌ |

---

## Security Notes

- Firestore Security Rules enforce role-based access **server-side** — frontend checks alone are never trusted
- Every API route re-verifies the Firebase ID token on every request (not just login)
- The robot uses a device-specific API key stored in environment variables, never in client code
- All robot payloads are validated and sanitized before writing to Firestore
- Rate limiting is applied on robot endpoints (60 requests/min per robot)
- All admin actions are logged to `/auditLogs`
- Security headers (CSP, HSTS, X-Frame-Options) are set in `next.config.ts`
