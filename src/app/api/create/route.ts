/**
 * sendme.alt - Create Session API
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { generateToken, tokenToFirebaseKey } from '@/lib/token'
import { APP_CONFIG } from '@/lib/constants'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { offer, fileInfo } = body

    if (!offer || !fileInfo) {
      return NextResponse.json(
        { success: false, error: 'Missing offer or file info' },
        { status: 400 }
      )
    }

    // Generate unique token
    let token = generateToken()
    let firebaseKey = tokenToFirebaseKey(token)
    let attempts = 0

    // Ensure uniqueness (rare collision)
    while (attempts < 5) {
      const snapshot = await adminDb.ref(`sessions/${firebaseKey}`).get()
      if (!snapshot.exists()) break
      token = generateToken()
      firebaseKey = tokenToFirebaseKey(token)
      attempts++
    }

    if (attempts >= 5) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique token' },
        { status: 500 }
      )
    }

    const expiresAt = Date.now() + (APP_CONFIG.TOKEN_EXPIRY_MINUTES * 60 * 1000)

    // Create session
    const sessionData = {
      createdAt: Date.now(),
      expiresAt,
      status: 'waiting',
      file: fileInfo,
      sender: {
        offer,
        candidates: [],
      },
    }

    await adminDb.ref(`sessions/${firebaseKey}`).set(sessionData)

    return NextResponse.json({
      success: true,
      token,
      expiresAt,
    })
  } catch (error) {
    // Log error server-side only (not in browser console)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
