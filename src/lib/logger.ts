import prisma from './prisma';

export async function logAction(
  userId: string | null,
  userName: string | null,
  action: 'CRIOU' | 'ATUALIZOU' | 'EXCLUIU' | 'LOGIN' | 'SETUP' | 'OUTRO',
  target: string,
  details: string
) {
  try {
    await prisma.systemLog.create({
      data: {
        userId,
        userName,
        action,
        target,
        details,
      },
    });
  } catch (error) {
    console.error('Falha ao registrar log de auditoria:', error);
  }
}
