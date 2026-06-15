import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ AVISO DE SEGURANÇA: JWT_SECRET não está definido no .env. Usando chave de fallback insegura.");
}

export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'secret_jwt_key_totem_pagliaro_2026'
);

export async function verifyAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return false;

    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}
