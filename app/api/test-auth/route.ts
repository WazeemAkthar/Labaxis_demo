import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'This is a test endpoint to check if API routes work',
    timestamp: new Date().toISOString()
  });
}
