# Production Deployment Checklist

## Critical Bugs Fixed

### 1. ✅ Firebase SSR Initialization Issue
**Problem**: Firebase was only initialized client-side, causing the app to freeze during server-side rendering in production.
**Fix**: Removed conditional initialization - Firebase SDK handles SSR properly.
**File**: `src/lib/firebase.ts`

### 2. ✅ Wrong Metadata Base URL
**Problem**: Metadata was using `sendme.alt` instead of production domain.
**Fix**: Updated to use `NEXT_PUBLIC_BASE_URL` environment variable with fallback to `www.send2me.site`.
**Files**: `src/app/layout.tsx`

### 3. ✅ Missing Environment Variable Validation
**Problem**: No validation for required environment variables, causing silent failures.
**Fix**: Added early validation with clear error messages for both client and server Firebase configs.
**Files**: `src/lib/firebase.ts`, `src/lib/firebase-admin.ts`

### 4. ✅ Memory Leak in SSE Listener
**Problem**: Firebase listeners and intervals weren't properly cleaned up when SSE connections closed.
**Fix**: Implemented proper cleanup handlers with duplicate-call protection.
**File**: `src/app/api/listen/route.ts`

## Deployment Steps

### Step 1: Verify Environment Variables
Make sure ALL these environment variables are set in your hosting platform:

**Required Client Variables** (must start with NEXT_PUBLIC_):
- `NEXT_PUBLIC_BASE_URL` = https://www.send2me.site
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Required Server Variables**:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (must include \n for line breaks)

**Optional (Highly Recommended for P2P Reliability)**:
- `NEXT_PUBLIC_TURN_URL`
- `NEXT_PUBLIC_TURN_USERNAME`
- `NEXT_PUBLIC_TURN_CREDENTIAL`
- `CLEANUP_SECRET` (recommended for production)
- `NEXT_PUBLIC_TOKEN_EXPIRY_MINUTES` (default: 5)
- `NEXT_PUBLIC_MAX_FILE_SIZE` (default: 3GB)

### Step 2: Commit and Push
```bash
git add .
git commit -m "Fix production bugs: SSR initialization, metadata URLs, env validation, memory leaks"
git push
```

### Step 3: Deploy
Your hosting platform (Vercel/Netlify/etc.) should automatically deploy.

### Step 4: Verify Production
After deployment, check:
1. ✅ Site loads without freezing
2. ✅ Can select a file
3. ✅ Can generate a token
4. ✅ Can connect as receiver with token
5. ✅ File transfer completes successfully
6. ✅ No console errors in browser DevTools

## Common Issues & Solutions

### Issue: "Missing required Firebase configuration"
**Solution**: Verify all NEXT_PUBLIC_FIREBASE_* environment variables are set correctly in your hosting platform.

### Issue: "Missing required Firebase Admin environment variables"
**Solution**: Verify FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set. For FIREBASE_PRIVATE_KEY, ensure line breaks are properly escaped as \n.

### Issue: Site still freezes
**Solution**: 
1. Check browser console for errors
2. Verify Firebase rules allow read/write access
3. Check that database URL is correct and accessible
4. Ensure all environment variables are deployed (not just set locally)

### Issue: WebRTC connection fails
**Solution**: This is usually network/firewall related, not a code issue. The app includes multiple STUN servers and a free TURN server for fallback.

## Firebase Database Rules

Ensure your Firebase Realtime Database has proper security rules:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true,
        ".indexOn": ["expiresAt", "createdAt"]
      }
    }
  }
}
```

## Performance Notes

- All static pages are pre-rendered
- API routes are dynamic (server-rendered on demand)
- Build size is optimized (~151KB first load)
- File transfers are P2P (don't use server bandwidth)

## Monitoring

Consider setting up:
1. Firebase Database monitoring for active sessions
2. Error tracking (Sentry, etc.)
3. Analytics for usage patterns
4. Automated cleanup job for expired sessions (call /api/cleanup periodically)
