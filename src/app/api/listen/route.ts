/**
 * sendme.alt - Server-Sent Events Listener
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import { adminDb } from '@/lib/firebase-admin'
import { tokenToFirebaseKey } from '@/lib/token'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const role = searchParams.get('role') as 'sender' | 'receiver'

  if (!token || !role) {
    return new Response('Missing token or role', { status: 400 })
  }

  const firebaseKey = tokenToFirebaseKey(token)
  const sessionRef = adminDb.ref(`sessions/${firebaseKey}`)

  // Create SSE stream
  const encoder = new TextEncoder()
  let interval: NodeJS.Timeout

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))

      let listener: ((snapshot: any) => void) | null = null
      let cleanedUp = false
      
      const cleanup = () => {
        if (cleanedUp) return
        cleanedUp = true
        
        if (listener) {
          sessionRef.off('value', listener)
          listener = null
        }
        if (interval) {
          clearInterval(interval)
          interval = undefined as any
        }
        try {
          controller.close()
        } catch (err) {
          // Controller may already be closed
        }
      }
      
      // Listen to session changes
      listener = sessionRef.on('value', (snapshot) => {
        if (cleanedUp) return
        
        try {
          const session = snapshot.val()

          if (!session) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'expired' })}\n\n`))
            cleanup()
            return
          }

          // Check expiry
          if (session.expiresAt < Date.now()) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'expired' })}\n\n`))
            sessionRef.remove()
            cleanup()
            return
          }

          // Send update based on role
          if (role === 'sender') {
            // Sender needs answer and receiver's ICE candidates
            const update = {
              type: 'update',
              status: session.status,
              answer: session.receiver?.answer || null,
              candidates: session.receiver?.candidates 
                ? Object.values(session.receiver.candidates)
                : [],
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`))
          } else {
            // Receiver needs sender's ICE candidates
            const update = {
              type: 'update',
              status: session.status,
              candidates: session.sender?.candidates 
                ? Object.values(session.sender.candidates)
                : [],
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`))
          }
        } catch (err) {
          // If enqueue fails, clean up
          cleanup()
        }
      })

      // Cleanup on stream close
      interval = setInterval(() => {
        if (cleanedUp) return
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'))
        } catch (err) {
          // If heartbeat fails, connection is closed
          cleanup()
        }
      }, 30000)

      // Handle cleanup
      request.signal.addEventListener('abort', cleanup)
    },

    cancel() {
      if (interval) {
        clearInterval(interval)
      }
      // Note: listener cleanup handled by abort handler
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
