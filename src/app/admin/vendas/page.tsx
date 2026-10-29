import { getSalesHistory, getPendingDeposits, requireAdmin } from '@/app/actions/admin';
import { DollarSign } from 'lucide-react';
import VendasClient from './VendasClient';

export const dynamic = 'force-dynamic';

/**
 * Página do painel administrativo que exibe o histórico de vendas.
 * Esta página é um Server Component que busca em paralelo os dados de vendas confirmadas e solicitações de Pix pendentes.
 */
export default async function AdminVendasPage() {
  await requireAdmin();
  // Busca em paralelo para excelente desempenho em produção
  const [sales, pending] = await Promise.all([
    getSalesHistory(),
    getPendingDeposits()
  ]);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-6 sm:mb-8 border-b border-slate-200 dark:border-white/10 pb-4 sm:pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 sm:gap-3">
          <DollarSign className="text-green-500 w-7 h-7 sm:w-8 sm:h-8" />
          Histórico de Vendas
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1.5 sm:mt-2 text-xs sm:text-sm">Gerencie recargas Pix, audite faturas e aprove depósitos pendentes manualmente.</p>
      </div>

      <VendasClient initialSales={sales} initialPending={pending} />
    </div>
  );
}
