'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, ShieldAlert, Car, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomeSearchBox() {
  const [type, setType] = useState<'placa' | 'cpf' | 'telefone'>('placa');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const steps = [
    'Localizando registro da placa na base veicular...',
    'Consultando dados técnicos e emplacamento...',
    'Verificando histórico de restrições e débitos...',
    'Organizando opções de consulta disponíveis...'
  ];

  const formatCPF = (v: string) => {
    v = v.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    return v
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatTelefone = (v: string) => {
    v = v.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length <= 2) return v;
    if (v.length <= 6) return v.replace(/(\d{2})(\d)/, '$1 $2');
    if (v.length <= 10) {
      return v.replace(/(\d{2})(\d)/, '$1 $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return v.replace(/(\d{2})(\d)/, '$1 $2').replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    let rawVal = e.target.value;

    if (type === 'placa') {
      rawVal = rawVal.toUpperCase().replace(/[^A-Z0-9-]/g, '');
      if (rawVal.length > 8) rawVal = rawVal.slice(0, 8);
      // Autoformatação para formato antigo ABC-1234
      if (rawVal.length === 7 && !rawVal.includes('-')) {
        const isOldPattern = /^[A-Z]{3}[0-9]{4}$/.test(rawVal);
        if (isOldPattern) {
          rawVal = rawVal.replace(/^([A-Z]{3})([0-9]{4})$/, '$1-$2');
        }
      }
      setValue(rawVal);
    } else if (type === 'cpf') {
      setValue(formatCPF(rawVal));
    } else if (type === 'telefone') {
      setValue(formatTelefone(rawVal));
    }
  };

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            setLoading(false);
            setShowResult(true);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (type === 'placa') {
      const cleanPlaca = value.replace(/-/g, '').toUpperCase();
      const isMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(cleanPlaca);
      const isAntiga = /^[A-Z]{3}[0-9]{4}$/.test(cleanPlaca);

      if (!isMercosul && !isAntiga) {
        setError('Insira uma placa válida no padrão Mercosul (ex: ABC1D23) ou tradicional (ex: ABC-1234).');
        return;
      }
    } else if (type === 'cpf') {
      const cleanVal = value.replace(/\D/g, '');
      if (cleanVal.length !== 11) {
        setError('Insira um CPF válido com 11 dígitos.');
        return;
      }
    } else if (type === 'telefone') {
      const cleanVal = value.replace(/\D/g, '');
      if (cleanVal.length !== 10 && cleanVal.length !== 11) {
        setError('Insira um telefone válido com DDD.');
        return;
      }
    }

    setLoading(true);
    setShowResult(false);
  };

  return (
    <div className="w-full bg-white text-[#172B3A] border border-white/40 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(19,90,128,0.25)] max-w-xl mx-auto transition-all">
      {/* Abas com destaque supremo para Placa */}
      <div className="flex bg-[#EFF8FD] p-1.5 rounded-2xl mb-6 gap-1.5 border border-[#E1EAF0]">
        <button
          type="button"
          onClick={() => {
            setType('placa');
            setValue('');
            setError(null);
            setShowResult(false);
          }}
          className={`flex-1 py-3 px-3 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            type === 'placa'
              ? 'bg-[#1F8FCC] text-white shadow-md shadow-[#1F8FCC]/25 scale-[1.01]'
              : 'text-[#667A85] hover:text-[#135A80]'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Consultar Placa</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setType('cpf');
            setValue('');
            setError(null);
            setShowResult(false);
          }}
          className={`py-3 px-4 text-xs md:text-sm font-semibold rounded-xl transition-all ${
            type === 'cpf'
              ? 'bg-[#135A80] text-white shadow-sm'
              : 'text-[#667A85] hover:text-[#135A80]'
          }`}
        >
          CPF
        </button>

        <button
          type="button"
          onClick={() => {
            setType('telefone');
            setValue('');
            setError(null);
            setShowResult(false);
          }}
          className={`py-3 px-4 text-xs md:text-sm font-semibold rounded-xl transition-all ${
            type === 'telefone'
              ? 'bg-[#135A80] text-white shadow-sm'
              : 'text-[#667A85] hover:text-[#135A80]'
          }`}
        >
          Telefone
        </button>
      </div>

      {!loading && !showResult && (
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            {type === 'placa' && (
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#EFF8FD] text-[#135A80] px-2.5 py-1.5 rounded-lg border border-[#73CEFF]/40 text-xs font-black tracking-wider uppercase pointer-events-none">
                <span>BRA</span>
              </div>
            )}

            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder={
                type === 'placa'
                  ? 'Digite a placa (Ex: BRA2E19 ou ABC-1234)'
                  : type === 'cpf'
                  ? 'Digite o CPF (000.000.000-00)'
                  : 'Digite o Telefone com DDD (11 99999-9999)'
              }
              className={`w-full bg-white border border-[#E1EAF0] rounded-2xl py-4 pr-16 text-[#172B3A] placeholder-[#667A85]/70 focus:border-[#1F8FCC] focus:ring-4 focus:ring-[#1F8FCC]/10 outline-none transition-all text-sm md:text-base font-bold tracking-wide ${
                type === 'placa' ? 'pl-20 uppercase font-mono' : 'pl-5'
              }`}
            />
            
            <button
              type="submit"
              disabled={!value.trim()}
              className="absolute right-2 top-2 bottom-2 px-5 bg-[#1F8FCC] hover:bg-[#135A80] text-white rounded-xl transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#1F8FCC]/20 active:scale-95"
              aria-label="Iniciar consulta"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 text-xs font-semibold text-red-600 bg-red-50 p-3.5 rounded-2xl border border-red-200 animate-in fade-in slide-in-from-top-1 duration-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-[#667A85] px-1 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Formato Mercosul e Padrão aceitos
            </span>
            <span className="font-medium text-[#135A80]">Validação instantânea</span>
          </div>
        </form>
      )}

      {loading && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-[#EFF8FD] flex items-center justify-center text-[#1F8FCC]">
              <Car className="w-7 h-7 animate-pulse text-[#1F8FCC]" />
            </div>
            <Loader2 className="w-14 h-14 text-[#26B3FF] animate-spin absolute inset-0 -m-0 opacity-40" />
          </div>
          <div className="space-y-1.5 w-full max-w-sm">
            <p className="text-sm font-bold text-[#172B3A]">{steps[loadingStep]}</p>
            <div className="w-full h-2 bg-[#E1EAF0] rounded-full overflow-hidden mx-auto">
              <div
                className="h-full bg-gradient-to-r from-[#1F8FCC] to-[#26B3FF] transition-all duration-700"
                style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {showResult && (
        <div className="space-y-5 animate-in fade-in duration-500 text-left">
          {/* Card de Identificação da Placa */}
          <div className="flex items-center gap-3.5 bg-[#EFF8FD] border border-[#73CEFF]/50 p-4 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-[#10B981] shrink-0" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-[#135A80] uppercase tracking-wider">
                Veículo Localizado na Base
              </h4>
              <p className="text-sm font-bold text-[#172B3A]">
                Placa consultada: <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#E1EAF0] text-[#135A80]">{value}</span>
              </p>
            </div>
          </div>

          {/* Opções de relatório disponíveis */}
          <div className="bg-[#F7FAFC] border border-[#E1EAF0] rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#135A80] uppercase tracking-wider pb-2 border-b border-[#E1EAF0]">
              <span>Módulos Disponíveis</span>
              <span>Status</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#172B3A]">
                <span className="font-medium">• Dados Técnicos, Ano & Modelo</span>
                <span className="text-[#10B981] font-bold">Disponível</span>
              </div>
              <div className="flex items-center justify-between text-[#172B3A]">
                <span className="font-medium">• Situação, Licenciamento & IPVA</span>
                <span className="text-[#10B981] font-bold">Disponível</span>
              </div>
              <div className="flex items-center justify-between text-[#172B3A]">
                <span className="font-medium">• Débitos, Multas & Restrições</span>
                <span className="text-[#10B981] font-bold">Disponível</span>
              </div>
            </div>
          </div>

          {/* CTA e Ações */}
          <div className="space-y-3 pt-1">
            <Link
              href={`/cadastro?search=${encodeURIComponent(value)}&type=${type}`}
              className="w-full bg-[#1F8FCC] hover:bg-[#135A80] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-[#1F8FCC]/25 flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider text-center group"
            >
              <span>Ver Opções de Consulta</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button
              onClick={() => {
                setValue('');
                setShowResult(false);
              }}
              className="w-full text-xs text-[#667A85] hover:text-[#135A80] font-semibold text-center transition-colors"
            >
              Consultar outra placa de teste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
