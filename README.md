# sendme.alt

🚀 Blazing fast P2P file transfer for the web.

**No signup. No cloud. Just fast transfers. Max file size: 3GB.**

Created by **Gaurav Patil** | [gauravpatil.online](https://gauravpatil.online)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sendme.alt)

---

## ✨ Features

- ✅ **One-page interface** - Simple and clean
- ✅ **P2P direct transfer** - Files go directly between devices
- ✅ **No file storage** - Privacy-first, zero data retention
- ✅ **Works everywhere** - Mobile (70%+ users), tablet, desktop
- ✅ **60 FPS smooth UI** - Buttery smooth animations
- ✅ **Single-word tokens** - Easy to share (e.g., "oceanriver")
- ✅ **Free forever** - No limits, no ads, no tracking
- ✅ **Up to 3GB files** - Large file support
- ✅ **Cancel anytime** - Robust transfer cancellation
- ✅ **Mobile-first** - Optimized for mobile screens

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **WebRTC** - Peer-to-peer file transfer
- **Firebase** - Real-time signaling (free tier)
- **Tailwind CSS 4** - Utility-first styling
- **TypeScript 5** - Type safety
- **Framer Motion** - 60 FPS animations

---

## 📦 Deploy to Vercel

This project is **Vercel-ready** with no cron jobs or background tasks required.

### Quick Deploy

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub repository
3. Add all environment variables (see below)
4. Deploy!

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

**Required:**
- All `NEXT_PUBLIC_FIREBASE_*` variables (client-side)
- All `FIREBASE_*` variables (server-side)

**Optional:**
- `CLEANUP_SECRET` - Secret token for cleanup API (if using automated cleanup)

### Cleanup Expired Sessions

Expired sessions are automatically cleaned up when:
- Sessions are accessed (validate/create endpoints)
- Manual cleanup via `/api/cleanup` endpoint

**No cron jobs needed!** The app handles cleanup automatically.

To manually trigger cleanup:
```bash
curl -X GET https://your-domain.vercel.app/api/cleanup \
  -H "Authorization: Bearer YOUR_CLEANUP_SECRET"
```

---

## 🔧 Environment Variables

Create `.env.local` file for local development:

```env
# Firebase Client (Public - safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (Server-side only - keep secret!)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your-service-account@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional: Cleanup API Secret
CLEANUP_SECRET=your_random_secret_token_here
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Realtime Database**
4. Get client config: Project Settings → General → Your apps
5. Get admin credentials: Project Settings → Service Accounts → Generate new private key

---

## 📱 How It Works

### Send Mode
1. Drop or select a file (max 3GB)
2. Click "Generate Share Code"
3. Get a single-word token (e.g., "happycloud")
4. Share the token with recipient
5. File transfers directly via P2P
6. Cancel anytime during transfer
7. Auto-cleanup after 5 minutes

### Receive Mode
1. Enter the token you received
2. Click "Receive File"
3. File downloads directly
4. Cancel anytime during transfer
5. Done!

---

## 🔒 Privacy

- **No accounts** - Just share and receive
- **No storage** - Files never touch our servers
- **Auto-cleanup** - All data deleted after 5 minutes
- **End-to-end encrypted** - WebRTC DTLS encryption
- **No tracking** - Zero analytics or cookies

---

## 📄 License

MIT License - Copyright (c) 2026 Gaurav Patil

See [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

Inspired by the alt-sendme desktop app.

Built from scratch for the web with modern technologies.

---

## 💬 Support

For issues or questions, visit [gauravpatil.online](https://gauravpatil.online)

---

**Made with ❤️ by Gaurav Patil**
