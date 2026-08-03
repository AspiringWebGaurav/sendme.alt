import { NextResponse } from 'next/server';
import { database } from '@/services/firebase-admin';

export async function POST(req: Request) {
  try {
    const { hwid, os, status } = await req.json();

    if (!hwid) {
      return NextResponse.json({ error: 'Missing HWID' }, { status: 400 });
    }

    const nodeRef = database.ref(`nodes/${hwid}`);
    
    // Check if it already exists
    const snapshot = await nodeRef.once('value');
    if (!snapshot.exists()) {
      await nodeRef.set({
        status: status || 'active',
        os: os || 'Unknown',
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
