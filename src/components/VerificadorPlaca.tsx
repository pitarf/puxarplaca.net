'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function VerificadorPlaca() {
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState<'vazio' | 'mercosul' | 'antiga' | 'invalido' | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.replace(/-/g, '').replace(/\s+/g, '').toUpperCase();

    if (!clean) {
      setResult('vazio');
      return;
    }

    if (clean.length !== 7) {
      setResult('invalido');
      return;
    }

    if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean)) {
      setResult('mercosul');
    } else if (/^[A-Z]{3}[0-9]{4}$/.test(clean)) {
      setResult('antiga');
    } else {
      setResult('invalido');
    }
  };

  return (
    <section id="verificador-placa" className="py-16 md:py-20 bg-white border-b border-[#E1EAF0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30 inline-block">
            Ferramenta Gratuita
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#135A80]">
            Verificar placa de veículo gratuitamente
          </h2>
          <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
            Antes de iniciar uma consulta veicular, confira se a placa foi digitada em um formato compatível com os padrões brasileiros. O verificador gratuito analisa os caracteres informados e identifica a estrutura de numeração reconhecida.
          </p>
        </div>

        <div className="bg-[#F7FAFC] border border-[#E1EAF0] rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-sm">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label htmlFor="verificador-input" className="block text-xs font-bold uppercase tracking-wider text-[#135A80]">
                Digite a placa
              </label>
              <input
                id="verificador-input"
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''));
                  setResult(null);
                }}
                placeholder="ABC1D23 ou ABC-1234"
                maxLength={8}
                className="w-full bg-white border-2 border-[#E1EAF0] focus:border-[#1F8FCC] focus:ring-4 focus:ring-[#1F8FCC]/15 rounded-2xl py-3.5 px-4 text-[#172B3A] placeholder-[#667A85]/60 outline-none text-base font-mono font-bold uppercase tracking-wider transition-all min-h-[48px]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] bg-[#135A80] hover:bg-[#1F8FCC] text-white font-bold text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl transition-all shadow-md active:scale-[0.99]"
            >
              Verificar formato
            </button>
          </form>

          {/* Resultado da verificação */}
          {result && (
            <div className="mt-6 pt-5 border-t border-[#E1EAF0] animate-in fade-in duration-200">
              {result === 'antiga' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Padrão tradicional reconhecido</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    A sequência informada corresponde à estrutura de três letras e quatro números (LLL-NNNN). Exemplo: ABC-1234.
                  </p>
                </div>
              )}

              {result === 'mercosul' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Padrão Mercosul reconhecido</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    A sequência informada corresponde à estrutura de três letras, um número, uma letra e dois números (LLLNLNN). Exemplo: ABC1D23.
                  </p>
                </div>
              )}

              {result === 'invalido' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>Formato não reconhecido</span>
                  </div>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Confira a sequência informada e tente novamente. Certifique-se de que a placa possui 7 caracteres alfa-numéricos no padrão brasileiro.
                  </p>
                </div>
              )}

              {result === 'vazio' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left text-xs text-amber-800 font-medium">
                  Informe uma placa para verificar o formato.
                </div>
              )}

              {/* Aviso e CTA */}
              <div className="mt-4 pt-3 border-t border-dashed border-[#E1EAF0] text-left space-y-3">
                <p className="text-[11px] text-[#667A85] leading-relaxed">
                  <strong>Aviso:</strong> Esta verificação identifica somente o formato. Não confirma registro ativo, regularidade, proprietário ou informações oficiais do veículo.
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-[#135A80]">Quer conhecer os relatórios disponíveis?</span>
                  <a
                    href="#consultar-placa"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] transition-colors"
                  >
                    <span>Continuar para consulta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
