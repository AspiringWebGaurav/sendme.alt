/**
 * sendme.alt - Validate Token API
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { tokenToFirebaseKey, isValidToken } from '@/lib/token'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token || !isValidToken(token)) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid token format',
      })
    }

    const firebaseKey = tokenToFirebaseKey(token)
    const snapshot = await adminDb.ref(`sessions/${firebaseKey}`).get()

    if (!snapshot.exists()) {
      return NextResponse.json({
        valid: false,
        error: 'Token not found',
      })
    }

    const session = snapshot.val()

    // Check expiry
    if (session.expiresAt < Date.now()) {
      // Delete expired session
      await adminDb.ref(`sessions/${firebaseKey}`).remove()
      return NextResponse.json({
        valid: false,
        error: 'Token expired',
      })
    }

    return NextResponse.json({
      valid: true,
      session,
    })
  } catch (error) {
    // Log error server-side only (not in browser console)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
