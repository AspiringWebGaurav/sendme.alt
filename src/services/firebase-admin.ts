/**
 * sendme.alt - Firebase Admin (Server-Side)
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import admin from 'firebase-admin'

// Initialize Firebase Admin
if (!admin.apps.length) {
 const privateKey = process.env.FIREBASE_PRIVATE_KEY
 ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
 : undefined

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    console.warn('⚠️ Missing required Firebase Admin environment variables. Admin SDK skipped during build.')
  } else if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
    console.warn('⚠️ Missing NEXT_PUBLIC_FIREBASE_DATABASE_URL environment variable.')
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      })
    } catch (error: any) {
      console.warn('⚠️ Firebase Admin SDK initialization error:', error.message)
    }
  }
}

export const adminDb = admin.apps.length ? admin.database() : null as unknown as admin.database.Database
export const adminAuth = admin.apps.length ? admin.auth() : null as unknown as admin.auth.Auth
