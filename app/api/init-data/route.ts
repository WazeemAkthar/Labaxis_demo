import { NextResponse } from 'next/server';

// This endpoint won't work because API routes run on the server
// and don't have access to the Firebase client SDK auth context
// Instead, we'll initialize data directly from the client

export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'Please use client-side initialization instead'
  }, { status: 400 });
}
