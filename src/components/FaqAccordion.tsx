'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS_DATA: FaqItem[] = [
  {
    id: 1,
    question: '1. Como consultar a placa de um veículo online?',
    answer: 'Digite os sete caracteres da placa no formulário do PuxarPlaca. Depois de conferir o formato, continue para conhecer as modalidades de consulta disponíveis, seus preços e as condições de contratação.'
  },
  {
    id: 2,
    question: '2. O que significa puxar placa?',
    answer: 'Puxar placa é uma expressão popular utilizada para descrever a pesquisa de informações relacionadas a um veículo a partir de sua placa de identificação.'
  },
  {
    id: 3,
    question: '3. Como consultar placa de carro?',
    answer: 'Informe a placa completa do automóvel, confira o formato e escolha o serviço de consulta desejado.'
  },
  {
    id: 4,
    question: '4. Posso consultar placa de moto?',
    answer: 'Sim. As motocicletas também utilizam identificação por placa, mas a disponibilidade de registros depende da cobertura do serviço.'
  },
  {
    id: 5,
    question: '5. É possível consultar placa de caminhão?',
    answer: 'É possível iniciar a pesquisa informando a placa, desde que a categoria esteja coberta pela modalidade contratada.'
  },
  {
    id: 6,
    question: '6. A consulta de placa é gratuita?',
    answer: 'O verificador de formato e o conversor Mercosul são ferramentas gratuitas previstas na homepage. Os relatórios cadastrais podem ser pagos, conforme os valores apresentados no catálogo.'
  },
  {
    id: 7,
    question: '7. Quanto custa consultar uma placa?',
    answer: 'O preço depende da modalidade escolhida. Os valores reais são apresentados no catálogo antes da confirmação da contratação.'
  },
  {
    id: 8,
    question: '8. Como descobrir marca e modelo pela placa?',
    answer: 'Determinadas modalidades de consulta podem apresentar marca e modelo a partir dos registros disponíveis. A existência dessas informações depende do serviço e das fontes utilizadas.'
  },
  {
    id: 9,
    question: '9. Como consultar multas pela placa?',
    answer: 'A consulta pode ser realizada por serviços autorizados ou canais oficiais do órgão responsável. Alguns sistemas exigem Renavam ou autenticação adicional.'
  },
  {
    id: 10,
    question: '10. Como consultar IPVA de um veículo?',
    answer: 'A consulta oficial deve ser feita conforme as regras da Secretaria da Fazenda do estado competente. Os dados necessários podem incluir placa, Renavam ou outras informações.'
  },
  {
    id: 11,
    question: '11. Como descobrir o Renavam pela placa?',
    answer: 'A disponibilidade dessa informação depende das regras do serviço utilizado. Não existe garantia de acesso irrestrito ao Renavam de qualquer veículo.'
  },
  {
    id: 12,
    question: '12. Posso descobrir o nome do proprietário pela placa?',
    answer: 'O acesso a dados pessoais vinculados a veículos possui limitações legais. A placa não autoriza a divulgação indiscriminada da identidade ou do endereço de terceiros.'
  },
  {
    id: 13,
    question: '13. Como consultar se um veículo foi roubado?',
    answer: 'O Sinesp Cidadão oferece um serviço oficial para verificar determinadas restrições de roubo ou furto a partir da placa.'
  },
  {
    id: 14,
    question: '14. Como verificar restrições judiciais?',
    answer: 'É necessário utilizar serviços autorizados e compreender a abrangência das informações efetivamente consultadas nas bases judiciais.'
  },
  {
    id: 15,
    question: '15. O que é alienação fiduciária?',
    answer: 'É uma modalidade de garantia frequentemente utilizada em financiamentos, que pode produzir efeitos relevantes sobre a negociação e transferência de um veículo.'
  },
  {
    id: 16,
    question: '16. O que é placa Mercosul?',
    answer: 'É um padrão de identificação veicular que utiliza três letras, um número, uma letra e dois números (LLLNLNN), além de características gráficas próprias.'
  },
  {
    id: 17,
    question: '17. Como converter placa antiga para Mercosul?',
    answer: 'A conversão utiliza uma tabela oficial que substitui um dos números por uma letra correspondente. O conversor gratuito do PuxarPlaca apresenta essa equivalência sem consultar bases cadastrais.'
  },
  {
    id: 18,
    question: '18. Posso consultar placa antiga?',
    answer: 'O formulário reconhece o padrão tradicional brasileiro de três letras e quatro números (LLL-NNNN). A disponibilidade de informações depende da modalidade de consulta.'
  },
  {
    id: 19,
    question: '19. Como verificar se um veículo está licenciado?',
    answer: 'Utilize os serviços oficiais correspondentes ao registro do veículo no Detran. Algumas modalidades de consulta também podem apresentar referências documentais, conforme disponibilidade.'
  },
  {
    id: 20,
    question: '20. Um relatório sem restrições garante que o veículo está regular?',
    answer: 'Não. A ausência de apontamentos em uma consulta não representa garantia absoluta de regularidade em todos os sistemas e órgãos fiscalizadores.'
  },
  {
    id: 21,
    question: '21. É possível consultar o histórico de acidentes pela placa?',
    answer: 'Somente quando houver uma modalidade legítima e uma fonte capaz de fornecer esse tipo de informação. A ausência de registros não comprova que o veículo nunca sofreu acidentes.'
  },
  {
    id: 22,
    question: '22. Como funciona o pagamento?',
    answer: 'A contratação segue os métodos disponibilizados no painel (recarga de saldo via Pix sem mensalidade obrigatória).'
  },
  {
    id: 23,
    question: '23. Preciso criar uma conta?',
    answer: 'As modalidades pagas exigem cadastro. O verificador gratuito de placa e o conversor de formato não exigem login.'
  },
  {
    id: 24,
    question: '24. O que acontece se não houver resultado?',
    answer: 'A plataforma apresenta o retorno verdadeiro da pesquisa. As regras de cobrança ou atendimento seguem as condições informadas para a modalidade contratada.'
  },
  {
    id: 25,
    question: '25. O PuxarPlaca é um serviço oficial do governo?',
    answer: 'Não. O PuxarPlaca é uma plataforma independente de tecnologia veicular, sem vínculo institucional com órgãos públicos.'
  },
  {
    id: 26,
    question: '26. Como começar minha consulta?',
    answer: 'Digite a placa no campo principal da homepage, confira o formato e continue para conhecer as opções de consulta disponíveis.'
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 text-left">
      {FAQS_DATA.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.id}
            className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
              isOpen
                ? 'bg-white border-[#1F8FCC]/40 shadow-sm'
                : 'bg-white border-[#E1EAF0] hover:border-[#73CEFF]'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-[#172B3A] hover:text-[#135A80] transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="pr-4 text-xs sm:text-sm font-bold flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isOpen ? 'bg-[#1F8FCC]' : 'bg-[#E1EAF0]'}`}></span>
                {faq.question}
              </span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-[#1F8FCC] shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#667A85] shrink-0" />
              )}
            </button>

            {/* Renderização acessível com SSR do conteúdo no DOM */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'block border-t border-[#EFF8FD]' : 'hidden'
              }`}
            >
              <div className="px-5 py-3.5 text-[#667A85] text-xs sm:text-sm leading-relaxed bg-[#F7FAFC]/60">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
