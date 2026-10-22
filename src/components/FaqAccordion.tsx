'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Como funciona a consulta de veículo pela placa?',
      answer: 'Basta digitar a placa no formato Mercosul (ex: ABC1D23) ou tradicional (ex: ABC-1234). O sistema acessa bases oficiais estaduais e nacionais do Senatran para identificar a situação cadastral, características do veículo e restrições registradas.'
    },
    {
      question: 'Quais informações podem ser obtidas em uma consulta veicular?',
      answer: 'Conforme os módulos selecionados, você pode consultar: dados técnicos (marca, modelo, ano de fabricação, cor, motor, chassi e renavam), situação do licenciamento, débitos e multas (estaduais, federais e municipais), IPVA, restrições judiciais (Renajud), alienação fiduciária, histórico de proprietário e registros de furto/roubo.'
    },
    {
      question: 'A consulta de placa é gratuita ou paga?',
      answer: 'A verificação inicial da placa e a identificação do veículo são gratuitas na pré-visualização. Para acessar o relatório técnico completo e os módulos detalhados, o usuário escolhe os serviços desejados de forma transparente, pagando apenas pelo que contratar via recarga Pix sem mensalidades.'
    },
    {
      question: 'Quais formatos de placa são aceitos?',
      answer: 'A plataforma suporta tanto o padrão Mercosul vigente (três letras, um número, uma letra e dois números, como ABC1D23) quanto o padrão brasileiro anterior (três letras e quatro números, como ABC-1234), com formatação automática.'
    },
    {
      question: 'Como funciona a recarga e o pagamento?',
      answer: 'O pagamento é feito via Pix instantâneo pela carteira da plataforma. Você adiciona créditos no valor desejado e utiliza apenas conforme a necessidade. O saldo não expira.'
    },
    {
      question: 'O que fazer se a consulta de uma placa não apresentar dados?',
      answer: 'Caso a placa seja muito recente ou o Detran de origem esteja com instabilidade temporária nas bases governamentais, nosso sistema conta com fallback automático para a base nacional do Senatran. Se ainda assim nenhuma informação for localizada, o seu saldo não é debitado.'
    },
    {
      question: 'A plataforma realiza outros tipos de consultas cadastrais?',
      answer: 'Sim. Embora nosso principal foco seja a consulta veicular por placa, disponibilizamos também módulos complementares para verificação de CPF, CNPJ, telefones e processos judiciais para validação de segurança.'
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3.5 text-left">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
              isOpen
                ? 'bg-white border-[#1F8FCC]/40 shadow-sm'
                : 'bg-white border-[#E1EAF0] hover:border-[#73CEFF]'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-6 py-4.5 flex items-center justify-between text-left font-semibold text-[#172B3A] hover:text-[#135A80] transition-colors focus:outline-none"
            >
              <span className="pr-4 text-sm md:text-base font-bold flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isOpen ? 'bg-[#1F8FCC]' : 'bg-[#E1EAF0]'}`}></span>
                {faq.question}
              </span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-[#1F8FCC] shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#667A85] shrink-0" />
              )}
            </button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[300px] border-t border-[#EFF8FD]' : 'max-h-0'
              }`}
            >
              <div className="px-6 py-4 text-[#667A85] text-sm leading-relaxed bg-[#F7FAFC]/50">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
