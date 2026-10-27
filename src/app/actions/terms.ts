'use server';

import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Registra o aceite do Termo de Ciência, Responsabilidade e Uso Legítimo
 */
export async function acceptTermsAndResponsibility() {
  const session = await verifySession();
  if (!session) return { error: 'Sessão expirada. Faça login novamente.' };

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        hasAcceptedTerms: true,
        termsAcceptedAt: new Date(),
      },
    });

    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        message: 'Usuário aceitou o Termo de Ciência, Responsabilidade e Uso Legítimo.',
        context: { userId: session.userId }
      }
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erro ao aceitar termos:', error);
    return { error: 'Erro ao registrar aceite. Tente novamente.' };
  }
}
