import { NextResponse } from 'next/server';
import { trackContactClick } from '@/lib/tracking';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await trackContactClick(body.action, body.page || 'unknown', body.toolName || undefined);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'tracking failed' }, { status: 400 });
  }
}
