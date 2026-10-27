'use client';

import { useState } from 'react';
import { CheckSquare, Square, RotateCcw, ShieldCheck, ArrowRight } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  label: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Identificação
  { id: 'c1', category: 'Identificação', label: 'Conferi a placa física dianteira e traseira.' },
  { id: 'c2', category: 'Identificação', label: 'Comparei os dados do veículo com o documento (CRLV-e).' },
  { id: 'c3', category: 'Identificação', label: 'Conferi a identificação do chassi e numeração dos vidros.' },
  // Documentação
  { id: 'c4', category: 'Documentação', label: 'Verifiquei o licenciamento do ano corrente.' },
  { id: 'c5', category: 'Documentação', label: 'Consultei informações sobre multas estaduais, federais e débitos.' },
  { id: 'c6', category: 'Documentação', label: 'Conferi possíveis restrições judiciais e administrativas.' },
  // Segurança
  { id: 'c7', category: 'Segurança', label: 'Verifiquei informações disponíveis sobre roubo e furto.' },
  { id: 'c8', category: 'Segurança', label: 'Comparei as informações e histórico apresentados pelo vendedor.' },
  { id: 'c9', category: 'Segurança', label: 'Considerei realizar uma vistoria cautelar independente.' },
  // Conservação
  { id: 'c10', category: 'Conservação', label: 'Avaliei o estado dos pneus, estepe e componentes visíveis.' },
  { id: 'c11', category: 'Conservação', label: 'Conferi registros de manutenção e revisões disponíveis.' },
  { id: 'c12', category: 'Conservação', label: 'Considerei uma avaliação mecânica com profissional de confiança.' },
];

export default function ChecklistVeiculo() {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCheckedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClear = () => {
    setCheckedIds({});
  };

  const checkedCount = Object.values(checkedIds).filter(Boolean).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);

  const categories = ['Identificação', 'Documentação', 'Segurança', 'Conservação'];

  return (
    <section id="checklist-veiculo" className="py-16 md:py-20 bg-white border-b border-[#E1EAF0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30 inline-block">
            Guia Prático
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#135A80]">
            Vai comprar um veículo usado? Confira o que verificar antes
          </h2>
          <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
            Comprar um carro ou moto usado exige atenção à documentação, à identificação do veículo e ao seu estado de conservação. Uma consulta veicular ajuda em determinadas verificações, mas não substitui a análise documental ou uma avaliação técnica independente.
          </p>
        </div>

        {/* Barra de Progresso */}
        <div className="bg-[#F7FAFC] border border-[#E1EAF0] rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E1EAF0]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#135A80]">Progresso da checagem</span>
              <p className="text-lg font-black text-[#172B3A]">
                Você verificou <span className="text-[#1F8FCC]">{checkedCount}</span> de <span className="text-[#135A80]">{totalCount}</span> itens
              </p>
            </div>
            
            {checkedCount > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667A85] hover:text-red-600 transition-colors self-start sm:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar marcações</span>
              </button>
            )}
          </div>

          <div className="w-full bg-[#E1EAF0] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#1F8FCC] to-[#135A80] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Categorias e Itens */}
          <div className="space-y-6 text-left pt-2">
            {categories.map((category) => {
              const items = CHECKLIST_ITEMS.filter(i => i.category === category);
              return (
                <div key={category} className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#135A80] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1F8FCC]"></span>
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const isChecked = !!checkedIds[item.id];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                            isChecked
                              ? 'bg-[#EFF8FD] border-[#73CEFF]/50 text-[#135A80]'
                              : 'bg-white border-[#E1EAF0] text-[#172B3A] hover:border-[#73CEFF]/40'
                          }`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-[#1F8FCC] shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-5 h-5 text-[#A0B0BA] shrink-0 mt-0.5" />
                          )}
                          <span className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'line-through text-[#667A85]' : 'font-medium'}`}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aviso informativo e CTA */}
          <div className="mt-6 pt-5 border-t border-[#E1EAF0] text-left space-y-3">
            <p className="text-[11px] text-[#667A85] leading-relaxed">
              * Este checklist é uma ferramenta meramente organizativa e educativa. A marcação dos itens não confere garantia de regularidade ou segurança da negociação.
            </p>

            <div className="pt-2">
              <a
                href="#consultar-placa"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#1F8FCC] hover:bg-[#135A80] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-[0.99]"
              >
                <span>Consultar placa do veículo</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
