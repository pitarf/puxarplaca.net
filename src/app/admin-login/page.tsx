'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAdminPassword } from '@/app/actions/admin';
import { ShieldCheck, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

/**
 * Página de Checkpoint do Admin.
 * Solicita a senha secundária definida no ENV para liberar o acesso ao painel.
 */
export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    try {
      const res = await verifyAdminPassword(password);
      if (res.success) {
        toast.success('Acesso liberado!');
        if (res.role === 'SEO') {
          router.push('/admin/configuracoes');
        } else {
          router.push('/admin');
        }
        router.refresh(); // Garante que o layout reavalie o cookie
      } else {
        toast.error(res.error || 'Erro ao verificar senha.');
      }
    } catch (err) {
      toast.error('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black flex items-center justify-center p-3 sm:p-4 relative overflow-hidden transition-colors duration-300 w-full">
      {/* Botão de Alternar Tema no canto superior direito */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/10 shadow-sm p-0.5">
        <ThemeToggle />
      </div>

      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-red-500/5 dark:bg-red-600/10 rounded-full blur-[100px] sm:blur-[130px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] -z-10" />

      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4 sm:mb-6 shadow-2xl shadow-red-500/5">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Área Restrita</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">Insira a senha de acesso para liberar o painel.</p>
        </div>

        <div className="bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-bold text-slate-600 dark:text-gray-400 ml-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-black/80 focus:outline-none focus:border-red-500/50 transition-all text-xs sm:text-sm"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-red-900/20 hover:from-red-500 hover:to-red-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <>
                  Verificar Identidade
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 dark:border-white/5 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white text-xs sm:text-sm font-medium transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>

        <p className="text-center mt-6 sm:mt-8 text-slate-400 dark:text-gray-600 text-[11px] sm:text-xs">
          PuxarPlaca © 2026 • Segurança Nível Militar
        </p>
      </div>
    </div>
  );
}
