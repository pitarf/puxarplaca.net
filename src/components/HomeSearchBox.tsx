'use client';

import { useState } from 'react';
import { Search, Loader2, CheckCircle2, ShieldAlert, ArrowRight, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomeSearchBox() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [platePattern, setPlatePattern] = useState<'mercosul' | 'antiga' | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Normalização conforme regras do Bloco 02
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSearched(false);
    
    // Converte para maiúsculas e remove caracteres indesejados (mantém apenas A-Z, 0-9 e hífen)
    let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);
    setValue(raw);

    // Validação de formato em tempo real
    const clean = raw.replace(/-/g, '').replace(/\s+/g, '');
    if (clean.length === 7) {
      if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean)) {
        setPlatePattern('mercosul');
      } else if (/^[A-Z]{3}[0-9]{4}$/.test(clean)) {
        setPlatePattern('antiga');
      } else {
        setPlatePattern(null);
      }
    } else {
      setPlatePattern(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = value.replace(/-/g, '').replace(/\s+/g, '').toUpperCase();

    if (!clean) {
      setError('Informe uma placa para começar.');
      setSearched(true);
      return;
    }

    if (clean.length !== 7) {
      setError('Não reconhecemos o formato informado. Confira os sete caracteres e tente novamente.');
      setSearched(true);
      return;
    }

    const isMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean);
    const isAntiga = /^[A-Z]{3}[0-9]{4}$/.test(clean);

    if (!isMercosul && !isAntiga) {
      setError('Não reconhecemos o formato informado. Confira os sete caracteres e tente novamente.');
      setSearched(true);
      return;
    }

    setPlatePattern(isMercosul ? 'mercosul' : 'antiga');
    setLoading(true);

    // Salva a placa temporariamente em sessionStorage para preservar no fluxo de cadastro
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('puxarplaca_last_search', clean);
      } catch (err) {
        // ignore
      }
    }

    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 400);
  };

  const cleanPlaca = value.replace(/-/g, '').replace(/\s+/g, '').toUpperCase();

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Bloco 02: FORMULÁRIO PRINCIPAL */}
      <div className="bg-white text-[#172B3A] border border-white/50 rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(19,90,128,0.22)] transition-all">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="placa-input" className="block text-xs font-bold uppercase tracking-wider text-[#135A80]">
              Placa do veículo
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1.5 bg-[#EFF8FD] text-[#135A80] px-2.5 py-1.5 rounded-lg border border-[#73CEFF]/40 text-xs font-black tracking-wider uppercase pointer-events-none select-none">
                <span>BR</span>
              </div>

              <input
                id="placa-input"
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder="ABC1D23 ou ABC-1234"
                maxLength={8}
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-white border-2 border-[#E1EAF0] focus:border-[#1F8FCC] focus:ring-4 focus:ring-[#1F8FCC]/15 rounded-2xl py-3.5 pl-18 pr-4 text-[#172B3A] placeholder-[#667A85]/60 outline-none text-base sm:text-lg font-mono font-black uppercase tracking-wider transition-all min-h-[52px]"
              />
            </div>
          </div>

          {/* Botão de conversão destacado - 100% da largura */}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[50px] bg-[#1F8FCC] hover:bg-[#135A80] text-white font-black text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg shadow-[#1F8FCC]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Validando formato...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Consultar placa</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-3.5 pt-3 border-t border-[#F7FAFC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-[#667A85]">
          <span>Aceita placas brasileiras tradicionais e Mercosul.</span>
          <span className="font-semibold text-[#135A80]">Confira os relatórios e preços antes de contratar.</span>
        </div>
      </div>

      {/* BLOCO 03: ÁREA DE RETORNO DA BUSCA (Exibida imediatamente após o formulário) */}
      {searched && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          {error ? (
            /* Estado 2 ou Estado 1: Erro de formato */
            <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-left shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-bold text-red-900">Atenção ao preenchimento</p>
                <p className="text-red-700 leading-relaxed">{error}</p>
              </div>
            </div>
          ) : (
            /* Estado 3 e 4: Formato reconhecido & Próxima etapa (Cadastro/Login) */
            <div className="bg-white border-2 border-[#1F8FCC]/40 rounded-2xl p-5 sm:p-6 shadow-xl text-left space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-[#E1EAF0]">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-[#135A80]">
                    Formato de placa reconhecido
                  </h4>
                  <p className="text-xs text-[#667A85] mt-0.5">
                    Padrão identificado: <strong className="text-[#172B3A] uppercase">{platePattern === 'mercosul' ? 'Mercosul (LLLNLNN)' : 'Tradicional (LLLNNNN)'}</strong> — Placa: <span className="font-mono font-bold text-[#135A80] bg-[#EFF8FD] px-1.5 py-0.5 rounded border border-[#73CEFF]/30">{cleanPlaca}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-[#172B3A] leading-relaxed">
                <p className="font-bold text-[#135A80]">Continue para escolher seu relatório</p>
                <p className="text-[#667A85]">
                  A placa informada possui um formato compatível com os padrões brasileiros suportados. Crie sua conta ou faça login para conhecer os módulos disponíveis e conferir os valores antes de contratar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <Link
                  href={`/cadastro?src=home-placa&placa=${encodeURIComponent(cleanPlaca)}`}
                  className="flex-1 bg-[#1F8FCC] hover:bg-[#135A80] text-white font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all uppercase tracking-wide text-center"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Criar conta e continuar</span>
                </Link>

                <Link
                  href={`/login?src=home-placa&placa=${encodeURIComponent(cleanPlaca)}`}
                  className="bg-[#EFF8FD] hover:bg-[#E1EAF0] text-[#135A80] font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#73CEFF]/40 transition-all text-center"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Já tenho conta</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
