'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, 
  Layers, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Zap, 
  CreditCard 
} from 'lucide-react';

interface StepCard {
  number: string;
  badge: string;
  title: string;
  description: string;
  tag: string;
  details: string[];
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    numBg: string;
  };
}

export default function ComoFuncionaStacking() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.stack-card'));
    if (cards.length === 0) return;

    let ticking = false;

    function updateCards() {
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          const currentRect = card.getBoundingClientRect();
          const nextRect = nextCard.getBoundingClientRect();

          // O próximo card começa a cobrir o atual quando o topo do próximo atinge a base do atual
          const overlap = currentRect.bottom - nextRect.top;
          const totalHeight = currentRect.height;

          if (overlap > 0) {
            const progress = Math.min(Math.max(overlap / (totalHeight * 0.85), 0), 1);
            const scale = 1 - (progress * 0.04); // Redução suave de 4%
            const brightness = 1 - (progress * 0.15); // Suave escurecimento óptico de 15%
            const translateY = progress * -4;

            card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            card.style.filter = `brightness(${brightness})`;
          } else {
            card.style.transform = 'scale(1) translateY(0px)';
            card.style.filter = 'brightness(1)';
          }
        } else {
          card.style.transform = 'scale(1) translateY(0px)';
          card.style.filter = 'brightness(1)';
        }
      });

      ticking = false;
    }

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateCards);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    updateCards();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  const steps: StepCard[] = [
    {
      number: '01',
      badge: 'Etapa Inicial',
      title: 'Informe a placa do veículo',
      description: 'Digite a placa no padrão Mercosul (ex: ABC1D23) ou tradicional (ex: ABC-1234) diretamente no campo de consulta na primeira dobra. A plataforma aceita qualquer formato com validação e identificação automática.',
      tag: 'Formato Mercosul e Tradicional',
      details: [
        'Formatação inteligente em tempo real',
        'Compatibilidade com carros, motos e caminhões',
        'Identificação prévia sem cobrança de créditos'
      ],
      color: {
        bg: 'bg-white',
        border: 'border-[#E1EAF0]',
        text: 'text-[#135A80]',
        accent: 'text-[#1F8FCC]',
        numBg: 'bg-[#EFF8FD]'
      }
    },
    {
      number: '02',
      badge: 'Opções e Tarifas',
      title: 'Conheça as opções disponíveis',
      description: 'Nosso motor de busca valida a existência do veículo nas bases e apresenta os módulos de dados disponíveis para consulta. Você tem transparência total sobre o conteúdo que será entregue antes de contratar.',
      tag: 'Transparência de Módulos',
      details: [
        'Dados Técnicos, Renavam e Chassi',
        'Situação de Licenciamento, Débitos e IPVA',
        'Histórico de Restrições Judiciais (Renajud)'
      ],
      color: {
        bg: 'bg-[#EFF8FD]',
        border: 'border-[#73CEFF]/40',
        text: 'text-[#135A80]',
        accent: 'text-[#1F8FCC]',
        numBg: 'bg-white'
      }
    },
    {
      number: '03',
      badge: 'Entrega Imediata',
      title: 'Acesse o relatório completo',
      description: 'Adicione saldo com Pix instantâneo no valor do módulo desejado e receba o relatório formatado na tela em segundos, com possibilidade de salvar, imprimir ou consultar novamente sem custo dentro de 48 horas.',
      tag: 'Pagamento Pix & Cache 48h',
      details: [
        'Sem mensalidade ou planos recorrentes',
        'Relatório limpo e legível para celular e desktop',
        'Cache inteligente: 48h no histórico sem duplicar custo'
      ],
      color: {
        bg: 'bg-gradient-to-br from-[#135A80] to-[#1F8FCC]',
        border: 'border-[#1F8FCC]',
        text: 'text-white',
        accent: 'text-[#73CEFF]',
        numBg: 'bg-white/10'
      }
    }
  ];

  return (
    <section id="como-funciona" className="py-12 md:py-16 bg-[#F7FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Sticky com Efeito Blur */}
        <div className="services-sticky-header rounded-2xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30 inline-block mb-1.5">
                Passo a Passo
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
                Como funciona a consulta veicular
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#667A85] max-w-md">
              Realize sua checagem de placa em três etapas simples e transparentes, sem burocracia ou contratos mensais.
            </p>
          </div>
        </div>

        {/* Container dos Stacking Cards com Offsets Escalonados */}
        <div className="stacking-container relative max-w-4xl mx-auto">
          
          {/* CARD 01 */}
          <div 
            className="stack-card sticky top-[135px] sm:top-[165px] md:top-[190px] z-10 w-full rounded-3xl bg-white border border-[#E1EAF0] shadow-[0_15px_40px_rgba(19,90,128,0.08)] p-6 sm:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-[#EFF8FD] text-[#135A80] font-black text-xl flex items-center justify-center border border-[#E1EAF0]">
                    01
                  </span>
                  <span className="text-xs font-bold text-[#1F8FCC] uppercase tracking-wider bg-[#EFF8FD] px-3 py-1 rounded-full">
                    {steps[0].badge}
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black text-[#135A80]">
                  {steps[0].title}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                  {steps[0].description}
                </p>

                <div className="pt-2">
                  <Link
                    href="#consulta"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] transition-colors"
                  >
                    <span>Ir para o campo de placa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 bg-[#F7FAFC] rounded-2xl p-5 border border-[#E1EAF0] space-y-3">
                <span className="text-[11px] font-bold text-[#135A80] uppercase tracking-wider block border-b border-[#E1EAF0] pb-2">
                  {steps[0].tag}
                </span>
                <ul className="space-y-2 text-xs text-[#667A85]">
                  {steps[0].details.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CARD 02 */}
          <div 
            className="stack-card sticky top-[155px] sm:top-[185px] md:top-[215px] z-20 w-full rounded-3xl bg-[#EFF8FD] border border-[#73CEFF]/50 shadow-[0_20px_50px_rgba(19,90,128,0.12)] p-6 sm:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-white text-[#1F8FCC] font-black text-xl flex items-center justify-center border border-[#73CEFF]/40 shadow-xs">
                    02
                  </span>
                  <span className="text-xs font-bold text-[#135A80] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#73CEFF]/30">
                    {steps[1].badge}
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black text-[#135A80]">
                  {steps[1].title}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                  {steps[1].description}
                </p>

                <div className="pt-2">
                  <Link
                    href="#consultas-veiculares"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] transition-colors"
                  >
                    <span>Ver tabela de relatórios</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 bg-white rounded-2xl p-5 border border-[#73CEFF]/40 shadow-xs space-y-3">
                <span className="text-[11px] font-bold text-[#135A80] uppercase tracking-wider block border-b border-[#E1EAF0] pb-2">
                  {steps[1].tag}
                </span>
                <ul className="space-y-2 text-xs text-[#667A85]">
                  {steps[1].details.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F8FCC] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CARD 03 */}
          <div 
            className="stack-card sticky top-[175px] sm:top-[205px] md:top-[240px] z-30 w-full rounded-3xl bg-gradient-to-br from-[#135A80] via-[#174664] to-[#1F8FCC] text-white border border-[#1F8FCC] shadow-[0_25px_60px_rgba(19,90,128,0.25)] p-6 sm:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-white/15 text-[#73CEFF] font-black text-xl flex items-center justify-center border border-white/20 backdrop-blur-xs">
                    03
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                    {steps[2].badge}
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {steps[2].title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {steps[2].description}
                </p>

                <div className="pt-2">
                  <Link
                    href="#consulta"
                    className="inline-flex items-center gap-2 bg-white text-[#135A80] hover:bg-[#EFF8FD] font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <span>Iniciar Consulta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 bg-white/10 rounded-2xl p-5 border border-white/15 backdrop-blur-xs space-y-3">
                <span className="text-[11px] font-bold text-[#73CEFF] uppercase tracking-wider block border-b border-white/10 pb-2">
                  {steps[2].tag}
                </span>
                <ul className="space-y-2 text-xs text-slate-100">
                  {steps[2].details.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#73CEFF] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
