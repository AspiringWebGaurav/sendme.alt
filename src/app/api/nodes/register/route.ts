import { NextResponse } from 'next/server';
import { adminDb } from '@/services/firebase-admin';

export async function POST(req: Request) {
  try {
    const { hwid, os, status, version } = await req.json();

    if (!hwid) {
      return NextResponse.json({ error: 'Missing HWID' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB not initialized' }, { status: 500 });
    }

    const nodeRef = adminDb.ref(`nodes/${hwid}`);
    
    // Check if it already exists
    const snapshot = await nodeRef.once('value');
    if (!snapshot.exists()) {
      await nodeRef.set({
        status: status || 'active',
        os: os || 'Unknown',
        version: version || '1.0.0',
        lastSeen: Date.now(),
      });
    } else {
      // Just update last seen
      await nodeRef.update({
        lastSeen: Date.now(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Node registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
