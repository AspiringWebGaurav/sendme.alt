/**
 * sendme.alt - Signal API (ICE candidates and answer)
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import { NextResponse } from 'next/server'
import { adminDb } from '@/services/firebase-admin'
import { tokenToFirebaseKey } from '@/core/token/token'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, type, data, role } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing token' },
        { status: 400 }
      )
    }

    const firebaseKey = tokenToFirebaseKey(token)
    const sessionRef = adminDb.ref(`sessions/${firebaseKey}`)

    // ── Validate session exists before writing (prevents orphan creation) ──
    const snapshot = await sessionRef.get()
    if (!snapshot.exists()) {
      // Do NOT write — this would create an orphan node in Firebase
      return NextResponse.json({ success: true })
    }

    // ── Auto-delete if session has expired (TTL enforcement) ──
    const sessionData = snapshot.val()
    if (sessionData.expiresAt && sessionData.expiresAt < Date.now()) {
      await sessionRef.remove()
      return NextResponse.json({ success: true })
    }

    if (type === 'answer') {
      // Receiver sending answer
      await sessionRef.child('receiver').update({
        answer: data,
        candidates: [],
      })
      await sessionRef.update({ status: 'connected' })
    } else if (type === 'ice') {
      // Add ICE candidate
      const candidatesRef = role === 'sender'
        ? sessionRef.child('sender/candidates')
        : sessionRef.child('receiver/candidates')

      await candidatesRef.push(data)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    // Log error server-side only (not in browser console)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
