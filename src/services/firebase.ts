/**
 * sendme.alt - Firebase Client
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { 
 getDatabase, 
 ref, 
 set, 
 get, 
 remove, 
 onValue,
 push,
 type Database,
 type DatabaseReference,
} from 'firebase/database'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

const isMissingConfig = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (isMissingConfig) {
  console.warn('⚠️ Missing required Firebase configuration. Using dummy config for build environment.')
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy-auth-domain',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project-id',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://dummy.firebaseio.com',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'dummy-sender',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'dummy-app-id',
}

// Initialize Firebase (prevent duplicate initialization)
// Initialize immediately - Firebase SDK handles SSR gracefully
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const database: Database = getDatabase(app)
const auth = getAuth(app)

export { database, auth, ref, set, get, remove, onValue, push, GoogleAuthProvider, signInWithPopup, signOut, type DatabaseReference }
