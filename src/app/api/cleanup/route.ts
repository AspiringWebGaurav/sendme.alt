/**
 * sendme.alt - Cleanup Expired Sessions API
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 * 
 * This endpoint cleans up expired sessions from Firebase.
 * Can be called periodically or on-demand.
 */

import { NextResponse } from 'next/server'
import { adminDb } from '@/services/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify request is from server (optional: add auth header check)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CLEANUP_SECRET

    // Strictly enforce SECRET during production if it exists
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid bearer token required.' },
        { status: 401 }
      )
    }

    // Default warn if no SECRET is strictly configured but allow execution for tests
    if (!expectedToken) {
      console.warn('⚠️ [SECURITY] /api/cleanup fired without a CLEANUP_SECRET mounted in environment.');
    }

    const sessionsRef = adminDb.ref('sessions')
    const snapshot = await sessionsRef.get()

    if (!snapshot.exists()) {
      return NextResponse.json({
        success: true,
        deleted: 0,
        message: 'No sessions to clean up',
      })
    }

    const sessions = snapshot.val()
    const now = Date.now()
    let deletedCount = 0
    const deletePromises: Promise<void>[] = []

    // Check each session for expiry
    for (const [key, session] of Object.entries(sessions)) {
      const sessionData = session as { expiresAt?: number }
      if (sessionData.expiresAt && sessionData.expiresAt < now) {
        deletePromises.push(adminDb.ref(`sessions/${key}`).remove())
        deletedCount++
      }
    }

    // Delete all expired sessions in parallel
    await Promise.all(deletePromises)

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      message: `Cleaned up ${deletedCount} expired session(s)`,
    })
  } catch (error) {
    // Log error server-side only (not in browser console)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing token' },
        { status: 400 }
      )
    }

    const { tokenToFirebaseKey } = await import('@/core/token/token')
    const firebaseKey = tokenToFirebaseKey(token)

    // Explicitly delete the session immediately
    await adminDb.ref(`sessions/${firebaseKey}`).remove()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
