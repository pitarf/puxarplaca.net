'use client';

import { useActionState, useEffect, useState, Suspense } from 'react';
import { resetPassword, getPublicBranding } from '@/app/actions/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, CheckCircle2, Car } from 'lucide-react';
import { toast } from 'sonner';

function ResetPasswordContent() {
  const [state, formAction, isPending] = useActionState(resetPassword, null);
  const [branding, setBranding] = useState<{ siteTitle: string; logoUrl: string | null; faviconUrl: string | null }>({
    siteTitle: 'PuxarPlaca',
    logoUrl: null,
    faviconUrl: null,
  });
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  useEffect(() => {
    getPublicBranding().then((res) => {
      if (res) setBranding(res);
    }).catch((err) => console.error('Erro ao carregar branding:', err));
  }, []);

  useEffect(() => {
    if (!token) {
      toast.error('Token de recuperação inválido ou ausente.');
      router.push('/login');
    }
  }, [token, router]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success('Senha redefinida com sucesso!');
    }
  }, [state]);

  if (!token) return null;

  return (
    <div className="glass-panel w-full max-w-md p-8 rounded-2xl">
      <div className="flex flex-col items-center mb-8 text-center">
        <Link href="/" className="mb-6 group">
          {branding.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={branding.siteTitle}
              className="h-10 w-auto object-contain transition-all group-hover:scale-105"
            />
          ) : branding.faviconUrl ? (
            <div className="flex items-center gap-2">
              <img
                src={branding.faviconUrl}
                alt={branding.siteTitle}
                className="w-8 h-8 object-contain transition-all group-hover:scale-105"
              />
              <span className="text-2xl font-black text-[#135A80] dark:text-white">
                Puxar<span className="text-[#1F8FCC]">Placa</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#135A80] to-[#1F8FCC] flex items-center justify-center text-white shadow-md shadow-[#135A80]/20 transition-all group-hover:scale-105">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-[#135A80] dark:text-white">
                Puxar<span className="text-[#1F8FCC]">Placa</span>
              </span>
            </div>
          )}
        </Link>
        <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Criar Nova Senha</h2>
        <p className="text-gray-400 text-sm mt-2">
          Digite sua nova senha abaixo. Certifique-se de usar uma senha forte.
        </p>
      </div>

      {state?.success ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <p className="text-emerald-400 font-medium mb-6">
            Sua senha foi redefinida com sucesso!
          </p>
          <Link href="/login" className="btn-premium inline-block py-2 px-6 rounded-lg font-medium w-full">
            Ir para o Login
          </Link>
        </div>
      ) : (
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="token" value={token} />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                name="password"
                required
                minLength={6}
                className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">A senha deve ter pelo menos 6 caracteres.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                name="confirmPassword"
                required
                minLength={6}
                className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Repita a senha"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full btn-premium py-3 rounded-lg font-medium mt-4 flex items-center justify-center"
          >
            {isPending ? 'Redefinindo...' : 'Confirmar Nova Senha'}
          </button>
        </form>
      )}

      {!state?.success && (
        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
      
      <Suspense fallback={<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
