import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function getJwtSecret(): Uint8Array {
  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.NEXT_PHASE) {
      console.warn("⚠️ AVISO DE SEGURANÇA: JWT_SECRET não está definido no .env. Usando chave de fallback.");
    }
  }
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'secret_jwt_key_totem_pagliaro_2026'
  );
}

export const JWT_SECRET = getJwtSecret();

export async function verifyAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
