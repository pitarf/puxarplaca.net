'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, ShieldAlert, ArrowRight, UserPlus, LogIn, AlertCircle, Car, User, Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function HomeSearchBox() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [platePattern, setPlatePattern] = useState<'mercosul' | 'antiga' | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchStage, setSearchStage] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');

  // Normalização e digitação livre
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSearchStage('idle');
    setProgress(0);
    
    // Converte para maiúsculas
    let raw = e.target.value.toUpperCase();
    if (raw.length > 8) raw = raw.slice(0, 8);
    setValue(raw);

    // Identificação visual opcional (Mercosul ou Antiga)
    const clean = raw.replace(/[^A-Z0-9]/g, '');
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

    const clean = value.trim().toUpperCase();

    // Se o usuário não digitou nada, avisa apenas para preencher o campo
    if (!clean) {
      setError('Digite a placa do veículo para consultar.');
      setSearchStage('error');
      return;
    }

    // Sem travas rígidas de validação: qualquer coisa digitada ativa a simulação
    setSearchStage('loading');
    setLoading(true);
    setProgress(15);

    // Salva a placa temporariamente em sessionStorage para uso no cadastro
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('puxarplaca_last_search', clean);
      } catch (err) {
        // ignore
      }
    }

    // Animação de progresso de 3 segundos (3000ms)
    const startTime = Date.now();
    const duration = 3000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 98);
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          setSearchStage('found');
        }, 200);
      }
    }, 100);
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
            className="w-full min-h-[50px] bg-[#1F8FCC] hover:bg-[#135A80] text-white font-black text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg shadow-[#1F8FCC]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Localizando registros veiculares...</span>
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

      {/* BLOCO 03: ÁREA DE RETORNO DA BUSCA */}
      {searchStage === 'loading' && (
        <div className="bg-white border-2 border-[#1F8FCC]/30 rounded-2xl p-5 sm:p-6 shadow-xl text-left space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#135A80]">
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#1F8FCC] animate-spin" />
              Buscando na base de dados nacional...
            </span>
            <span className="font-mono text-[#1F8FCC]">{progress}%</span>
          </div>

          {/* Barra de Progresso Animada */}
          <div className="w-full bg-[#EFF8FD] rounded-full h-3 overflow-hidden border border-[#73CEFF]/30 p-0.5">
            <div
              className="bg-gradient-to-r from-[#1F8FCC] to-[#135A80] h-full rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#667A85] pt-1">
            <span>Cruzando dados do veículo e proprietário</span>
            <span>Placa: <strong className="font-mono text-[#172B3A]">{cleanPlaca}</strong></span>
          </div>
        </div>
      )}

      {searchStage === 'error' && error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-left shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-bold text-red-900">Atenção ao preenchimento</p>
            <p className="text-red-700 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {searchStage === 'found' && (
        <div className="bg-white border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl text-left space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Header de Sucesso */}
          <div className="flex items-start gap-3 pb-3 border-b border-[#E1EAF0]">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
                <span>Registros localizados com sucesso</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-[#135A80]">
                Dados do Veículo e do Proprietário encontrados!
              </h4>
              <p className="text-xs text-[#667A85]">
                Placa: <span className="font-mono font-bold text-[#135A80] bg-[#EFF8FD] px-1.5 py-0.5 rounded border border-[#73CEFF]/30">{cleanPlaca}</span> ({platePattern === 'mercosul' ? 'Mercosul' : 'Tradicional'})
              </p>
            </div>
          </div>

          {/* Cards do que foi encontrado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E1EAF0] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#172B3A]">Dados do Veículo</p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ficha técnica, chassi e restrições
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E1EAF0] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#172B3A]">Dados do Proprietário</p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Identificação e situação cadastral
                </p>
              </div>
            </div>
          </div>

          {/* Box de Preço e Oferta */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#EFF8FD] to-blue-50/50 border border-[#73CEFF]/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#667A85] block">
                Valor do relatório completo:
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-[#135A80]">R$ 3,00</span>
                <span className="text-xs text-[#667A85] font-medium">pagamento único via PIX</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Consulta Pronta
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#667A85] leading-relaxed">
            <p>
              Crie sua conta em menos de 1 minuto para desbloquear o relatório completo deste veículo por apenas <strong>R$ 3,00</strong>.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Link
              href={`/cadastro?src=home-placa&placa=${encodeURIComponent(cleanPlaca)}`}
              className="flex-1 bg-[#1F8FCC] hover:bg-[#135A80] text-white font-black py-3.5 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1F8FCC]/25 transition-all uppercase tracking-wide text-center"
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar conta e ver dados (R$ 3,00)</span>
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
  );
}

