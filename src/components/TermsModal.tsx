'use client';

import { useState } from 'react';
import { acceptTermsAndResponsibility } from '@/app/actions/terms';
import { toast } from 'sonner';
import { ShieldCheck, ArrowRight, Loader2, Scale } from 'lucide-react';

interface TermsModalProps {
  hasAcceptedTerms: boolean;
  onAccepted?: () => void;
}

export default function TermsModal({ hasAcceptedTerms, onAccepted }: TermsModalProps) {
  const [isOpen, setIsOpen] = useState(!hasAcceptedTerms);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setLoading(true);
    try {
      const res = await acceptTermsAndResponsibility();
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Termo de ciência e responsabilidade aceito.');
        setIsOpen(false);
        if (onAccepted) {
          onAccepted();
        }
      }
    } catch (err) {
      toast.error('Erro de conexão ao salvar termo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] shadow-2xl animate-in scale-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de fundo */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600/20 via-sky-500/20 to-indigo-600/20 blur-2xl -z-10" />

        {/* Cabeçalho */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-primary">Conformidade Legal & LGPD</span>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">
              Termo de Ciência, Responsabilidade e Uso Legítimo
            </h3>
          </div>
        </div>

        {/* Conteúdo do Termo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed pr-5">
          <p>
            Ao criar uma conta e utilizar os serviços desta plataforma, o usuário declara estar ciente de que o acesso e o tratamento de informações pessoais de terceiros estão sujeitos à <strong>Lei nº 13.709/2018 (LGPD)</strong> e às demais normas aplicáveis.
          </p>

          <p>
            O usuário compromete-se a utilizar os serviços exclusivamente para <strong>finalidades legítimas, específicas e juridicamente fundamentadas</strong>.
          </p>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
            É <strong>expressamente proibida</strong> a utilização de informações obtidas por meio da plataforma para perseguição, ameaças, fraudes, discriminação, exposição indevida de dados pessoais, engenharia social ou outras atividades ilícitas.
          </div>

          <p>
            O usuário assume responsabilidade pelas próprias condutas, declarações e operações de tratamento que realizar, inclusive eventual compartilhamento posterior das informações, nos limites previstos na legislação.
          </p>

          <p>
            A responsabilidade por danos será apurada conforme a atuação de cada parte e os artigos 42 e 43 da LGPD, sem exclusão das obrigações legais da empresa operadora.
          </p>

          <p>
            A plataforma poderá solicitar comprovação da finalidade da consulta, limitar funcionalidades, suspender acessos em situações justificadas e adotar medidas legalmente cabíveis para prevenir ou investigar utilizações abusivas.
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
            Ao prosseguir, o usuário confirma que leu e aceita os Termos de Uso e declara ciência da Política de Privacidade.
          </p>
        </div>

        {/* Rodapé com Botão */}
        <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-end">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-medium shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <span>Prosseguir</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
