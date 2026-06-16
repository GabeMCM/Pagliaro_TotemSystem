import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '../../../../lib/auth-check';

export async function GET() {
  const payload = await verifyAdminAuth();
  
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: payload.userId,
      nome: payload.nome,
      username: payload.username,
      role: payload.role
    }
  });
}
