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
  type Database,
  type DatabaseReference,
} from 'firebase/database'

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error('Missing required Firebase configuration. Please check your environment variables.')
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase (prevent duplicate initialization)
// Initialize immediately - Firebase SDK handles SSR gracefully
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const database: Database = getDatabase(app)

export { database, ref, set, get, remove, onValue, type DatabaseReference }
