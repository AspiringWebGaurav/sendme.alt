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
import { adminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify request is from server (optional: add auth header check)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CLEANUP_SECRET
    
    // Optional: require auth token for security
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
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
