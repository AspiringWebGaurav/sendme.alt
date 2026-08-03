import { NextResponse } from 'next/server';
import { adminAuth } from '@/services/firebase-admin';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { hwid } = await req.json();

    if (!hwid) {
      return NextResponse.json({ error: 'Missing HWID' }, { status: 400, headers: corsHeaders });
    }

    if (!adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin Auth not initialized' }, { status: 500, headers: corsHeaders });
    }

    // Create a custom token for this specific HWID node
    const customToken = await adminAuth.createCustomToken(hwid);

    return NextResponse.json({ token: customToken }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Custom token generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
