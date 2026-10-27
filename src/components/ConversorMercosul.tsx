'use client';

import { useState } from 'react';
import { ArrowRightLeft, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

const numToLetter: Record<string, string> = {
  '0': 'A', '1': 'B', '2': 'C', '3': 'D', '4': 'E',
  '5': 'F', '6': 'G', '7': 'H', '8': 'I', '9': 'J'
};

const letterToNum: Record<string, string> = {
  'A': '0', 'B': '1', 'C': '2', 'D': '3', 'E': '4',
  'F': '5', 'G': '6', 'H': '7', 'I': '8', 'J': '9'
};

export default function ConversorMercosul() {
  const [inputVal, setInputVal] = useState('');
  const [conversionType, setConversionType] = useState<'antiga_para_mercosul' | 'mercosul_para_antiga'>('antiga_para_mercosul');
  const [converted, setConverted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setConverted(null);

    const clean = inputVal.replace(/-/g, '').replace(/\s+/g, '').toUpperCase();

    if (!clean) {
      setError('Digite a placa para converter.');
      return;
    }

    if (clean.length !== 7) {
      setError('A placa deve conter exatamente 7 caracteres.');
      return;
    }

    if (conversionType === 'antiga_para_mercosul') {
      // Padrão antigo: LLL-NNNN (índice 4 é o segundo número, que vira letra)
      // Exemplo: ABC1234 -> índice 0,1,2 letras; 3 num; 4 num (vira letra); 5,6 num.
      const isAntiga = /^[A-Z]{3}[0-9]{4}$/.test(clean);
      if (!isAntiga) {
        setError('Para esta conversão, informe uma placa no padrão antigo válido (ex: ABC1234 ou ABC-1234).');
        return;
      }
      const char4 = clean[4]; // 2º dígito numérico (0..9)
      const newChar = numToLetter[char4];
      if (!newChar) {
        setError('Não foi possível converter o caractere na tabela oficial.');
        return;
      }
      const result = clean.slice(0, 4) + newChar + clean.slice(5);
      setConverted(result);
    } else {
      // Padrão Mercosul para antigo: LLLNLNN -> índice 4 é letra (A..J) que vira número
      const isMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean);
      if (!isMercosul) {
        setError('Para esta conversão, informe uma placa no padrão Mercosul (ex: ABC1C34).');
        return;
      }
      const char4 = clean[4];
      const newChar = letterToNum[char4];
      if (!newChar) {
        setError(`A letra "${char4}" na 5ª posição não possui equivalência direta na tabela oficial de conversão (letras válidas: A a J). Placas novas de fábrica com letras de K a Z não derivam de placas antigas.`);
        return;
      }
      const result = clean.slice(0, 4) + newChar + clean.slice(5);
      setConverted(result);
    }
  };

  return (
    <section id="conversor-mercosul" className="py-16 md:py-20 bg-[#F7FAFC] border-b border-[#E1EAF0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#E1EAF0] inline-block shadow-xs">
            Conversor Oficial
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#135A80]">
            Converter placa antiga para o padrão Mercosul
          </h2>
          <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
            Na conversão de uma placa tradicional para o padrão Mercosul, um dos caracteres numéricos (o 2º número) é substituído pela letra correspondente prevista na tabela oficial. Visualize a equivalência de caracteres de forma instantânea.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Card do Conversor */}
          <div className="md:col-span-7 bg-white border border-[#E1EAF0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            
            {/* Seletor de Direção da Conversão */}
            <div className="flex bg-[#EFF8FD] p-1 rounded-xl gap-1 border border-[#E1EAF0]">
              <button
                type="button"
                onClick={() => {
                  setConversionType('antiga_para_mercosul');
                  setConverted(null);
                  setError(null);
                }}
                className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all ${
                  conversionType === 'antiga_para_mercosul'
                    ? 'bg-[#1F8FCC] text-white shadow-xs'
                    : 'text-[#667A85] hover:text-[#135A80]'
                }`}
              >
                Antiga → Mercosul
              </button>
              <button
                type="button"
                onClick={() => {
                  setConversionType('mercosul_para_antiga');
                  setConverted(null);
                  setError(null);
                }}
                className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all ${
                  conversionType === 'mercosul_para_antiga'
                    ? 'bg-[#1F8FCC] text-white shadow-xs'
                    : 'text-[#667A85] hover:text-[#135A80]'
                }`}
              >
                Mercosul → Antiga
              </button>
            </div>

            <form onSubmit={handleConvert} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="conversor-input" className="block text-xs font-bold uppercase tracking-wider text-[#135A80]">
                  {conversionType === 'antiga_para_mercosul' ? 'Digite a placa antiga' : 'Digite a placa Mercosul'}
                </label>
                <input
                  id="conversor-input"
                  type="text"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''));
                    setConverted(null);
                    setError(null);
                  }}
                  placeholder={conversionType === 'antiga_para_mercosul' ? 'Ex: ABC1234' : 'Ex: ABC1C34'}
                  maxLength={8}
                  className="w-full bg-white border-2 border-[#E1EAF0] focus:border-[#1F8FCC] focus:ring-4 focus:ring-[#1F8FCC]/15 rounded-2xl py-3.5 px-4 text-[#172B3A] placeholder-[#667A85]/60 outline-none text-base font-mono font-bold uppercase tracking-wider transition-all min-h-[48px]"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-[#1F8FCC] hover:bg-[#135A80] text-white font-bold text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Converter formato</span>
              </button>
            </form>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {converted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-left space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Equivalência encontrada</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 py-2 border-y border-emerald-200/60 font-mono text-center">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-[#667A85] block font-sans uppercase font-bold">Informada</span>
                    <span className="text-base font-black text-[#172B3A]">{inputVal.toUpperCase()}</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 block font-sans uppercase font-bold">Correspondente</span>
                    <span className="text-base font-black text-emerald-700">{converted}</span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  <strong>Aviso:</strong> A conversão representa somente a equivalência dos caracteres prevista pela regulamentação. Não indica que o veículo possui efetivamente essa placa em seu cadastro atual.
                </p>
              </div>
            )}

            <div className="pt-2 text-left">
              <a
                href="https://operacoes.sp.gov.br/DetranWeb/saibaMaisSobreNovoModeloDePlacas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#667A85] hover:text-[#135A80] transition-colors"
              >
                <span>Fonte oficial de referência: Detran-SP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Tabela de Referência Oficial */}
          <div className="md:col-span-5 bg-white border border-[#E1EAF0] rounded-3xl p-6 sm:p-7 shadow-sm text-left space-y-4">
            <h3 className="text-sm font-bold text-[#135A80] uppercase tracking-wider">
              Tabela de Equivalência Oficial
            </h3>
            <p className="text-xs text-[#667A85] leading-relaxed">
              O segundo dígito numérico da placa antiga é substituído pela letra correspondente no padrão Mercosul (5º caractere da placa):
            </p>

            <div className="overflow-hidden rounded-2xl border border-[#E1EAF0]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EFF8FD] text-[#135A80] font-bold border-b border-[#E1EAF0]">
                  <tr>
                    <th className="py-2.5 px-4">Número (Antiga)</th>
                    <th className="py-2.5 px-4">Letra (Mercosul)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1EAF0] font-mono">
                  {Object.entries(numToLetter).map(([num, letter]) => (
                    <tr key={num} className="hover:bg-[#F7FAFC]">
                      <td className="py-2 px-4 font-bold text-[#172B3A]">{num}</td>
                      <td className="py-2 px-4 font-bold text-[#1F8FCC]">{letter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[#667A85] leading-relaxed pt-1">
              * Nota: Veículos emplacados diretamente no padrão Mercosul podem receber letras de K a Z, sem equivalência histórica em placas antigas.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
