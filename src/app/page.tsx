import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import NavbarClient from '@/components/NavbarClient';
import Footer from '@/components/Footer';
import FaqAccordion from '@/components/FaqAccordion';
import HomeSearchBox from '@/components/HomeSearchBox';
import VerificadorPlaca from '@/components/VerificadorPlaca';
import ConversorMercosul from '@/components/ConversorMercosul';
import ChecklistVeiculo from '@/components/ChecklistVeiculo';
import StickyPlateCta from '@/components/StickyPlateCta';
import { 
  Car, 
  Bike, 
  Truck, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CreditCard, 
  Scale, 
  Lock, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  FileSearch, 
  Building2, 
  Users, 
  Phone, 
  HelpCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const title = "Consultar Placa de Veículo Online | PuxarPlaca";
  const description = "Consulte a placa de carro, moto ou caminhão no PuxarPlaca. Conheça relatórios veiculares, dados técnicos, débitos, restrições e preços disponíveis.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://puxarplaca.net/"
    },
    robots: "index, follow, max-image-preview:large",
    openGraph: {
      title,
      description: "Informe uma placa e conheça as opções de consulta veicular, relatórios disponíveis e informações sobre veículos.",
      url: "https://puxarplaca.net/",
      siteName: "PuxarPlaca",
      images: [
        {
          url: "https://puxarplaca.net/og-puxarplaca.jpg",
          width: 1200,
          height: 630,
          alt: "PuxarPlaca - Consultar Placa de Veículo Online"
        }
      ],
      type: "website",
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Informe uma placa e conheça as opções de consulta veicular, relatórios disponíveis e informações sobre veículos.",
      images: ["https://puxarplaca.net/og-puxarplaca.jpg"]
    }
  };
}

export default async function Home() {
  const [settings, pricings, latestArticles, menuPages] = await Promise.all([
    prisma.systemSetting.findFirst(),
    prisma.modulePricing.findMany(),
    prisma.article.findMany({
      where: {
        published: true,
        OR: [
          { publishedAt: null },
          { publishedAt: { lte: new Date() } }
        ]
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: { title: true, slug: true, metaDescription: true, createdAt: true }
    }),
    prisma.page.findMany({
      where: {
        published: true,
        showInMenu: true,
        OR: [
          { publishedAt: null },
          { publishedAt: { lte: new Date() } }
        ]
      },
      select: { title: true, slug: true },
      orderBy: { title: 'asc' }
    })
  ]);

  const getPrice = (id: string, defaultPrice: number) => {
    const found = pricings.find(p => p.id === id);
    return found ? found.price : defaultPrice;
  };

  // Valores reais do banco de dados (Bloco 08)
  const reportCards = [
    {
      id: 'veiculo_basico',
      title: 'Dados básicos e técnicos',
      desc: 'Consulte as categorias de informações técnicas disponíveis para o veículo pesquisado, como marca, modelo, ano, combustível, cor e demais características incluídas no módulo.',
      price: getPrice('veiculo_basico', 1.00),
      btnText: 'Consultar dados técnicos',
      badge: 'Técnico'
    },
    {
      id: 'veiculo_documentacao',
      title: 'Situação e documentação',
      desc: 'Conheça as modalidades de pesquisa relacionadas à situação cadastral e documental do veículo. A abrangência depende das fontes disponíveis e dos requisitos de acesso.',
      price: getPrice('veiculo_documentacao', 1.00),
      btnText: 'Ver consulta documental',
      badge: 'Cadastral'
    },
    {
      id: 'veiculo_debitos',
      title: 'Débitos, multas e IPVA',
      desc: 'Confira os serviços disponíveis para verificar informações relacionadas a débitos, multas, licenciamento e tributos veiculares. Os requisitos variam conforme o serviço e o estado.',
      price: getPrice('veiculo_debitos', 1.50),
      btnText: 'Ver módulos de débitos',
      badge: 'Financeiro'
    },
    {
      id: 'veiculo_restricoes',
      title: 'Restrições e bloqueios',
      desc: 'Conheça as modalidades disponíveis relacionadas a gravames, alienação fiduciária, restrições administrativas, judiciais (Renajud) e outros registros de restrição.',
      price: getPrice('veiculo_restricoes', 2.00),
      btnText: 'Consultar restrições',
      badge: 'Segurança'
    },
    {
      id: 'veiculo_proprietario',
      title: 'Informações complementares',
      desc: 'Apresenta somente categorias efetivamente disponibilizadas e autorizadas pelo sistema. Sem promessas de identificação irrestrita ou acesso a dados privados de terceiros.',
      price: getPrice('veiculo_proprietario', 1.50),
      btnText: 'Ver informações disponíveis',
      badge: 'Complementar'
    },
    {
      id: 'relatorio_combinado',
      title: 'Relatório veicular combinado',
      desc: 'Reúne os módulos técnicos, documentais, de débitos e restrições em uma consulta consolidada para facilitar sua checagem prévia com transparência total.',
      price: 5.00, // soma dos módulos ou valor combinado do pacote
      btnText: 'Conhecer relatório completo',
      badge: 'Mais Completo'
    }
  ];

  // Schema JSON-LD (Bloco 29.3)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'PuxarPlaca',
    'url': 'https://puxarplaca.net/',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://puxarplaca.net/cadastro?src=home-placa&placa={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'PuxarPlaca',
    'url': 'https://puxarplaca.net/',
    'logo': settings?.logoUrl || 'https://puxarplaca.net/og-puxarplaca.jpg',
    'description': 'Plataforma Independente de Consulta Veicular especializada em informações veiculares por placa, verificação de formato e orientação educativa.'
  };

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://puxarplaca.net/#webpage',
    'url': 'https://puxarplaca.net/',
    'name': 'Consultar Placa de Veículo Online | PuxarPlaca',
    'inLanguage': 'pt-BR',
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'PuxarPlaca',
      'url': 'https://puxarplaca.net/'
    },
    'description': 'Consulte a placa de carro, moto ou caminhão no PuxarPlaca. Conheça relatórios veiculares, dados técnicos, débitos, restrições e preços disponíveis.'
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#172B3A]">
      
      {/* Dados Estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />

      {/* BLOCO 01 — HEADER COMPACTO */}
      <NavbarClient 
        logoUrl={settings?.logoUrl} 
        siteTitle={settings?.siteTitle}
        menuPages={menuPages}
      />

      {/* =========================================================================
          BLOCO 02: HERO PRINCIPAL E FORMULÁRIO (ID: consultar-placa)
          + BLOCO 03: ÁREA DE RETORNO DA BUSCA (Dentro de HomeSearchBox)
          + BLOCO 04: CARD ILUSTRATIVO
         ========================================================================= */}
      <section id="consultar-placa" className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-br from-[#135A80] via-[#1F8FCC] to-[#26B3FF] text-white">
        {/* Efeitos de iluminação de fundo */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-10 left-0 w-72 h-72 bg-[#73CEFF]/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Coluna da Esquerda: Conversão Máxima (Mobile First) */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Texto acima do título */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xs mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-[#73CEFF] animate-pulse"></span>
                <span>CONSULTA VEICULAR ONLINE</span>
              </div>

              {/* H1 Supremo Único e Curto */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Consultar placa de veículo online
              </h1>

              {/* Descrição Comercial Curta */}
              <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Digite a placa de um carro, moto ou caminhão e conheça as opções de consulta veicular disponíveis no PuxarPlaca.
              </p>

              {/* FORMULÁRIO DE CONSULTA + ÁREA DE RETORNO IMEDIATA (Blocos 02 e 03) */}
              <div className="pt-2">
                <HomeSearchBox />
              </div>

              {/* Itens de Confiança */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2.5 gap-x-5 text-xs text-white/85 font-medium border-t border-white/15">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#73CEFF]" />
                  <span>Plataforma Independente</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#73CEFF]" />
                  <span>Formatos Mercosul e Padrão</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#73CEFF]" />
                  <span>Preços Visíveis sem Assinatura</span>
                </div>
              </div>
            </div>

            {/* BLOCO 04: CARD ILUSTRATIVO (Desktop ao lado, Mobile abaixo da conversão) */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto pt-6 lg:pt-0">
              <div className="bg-white rounded-3xl border border-[#E1EAF0] p-6 shadow-[0_20px_50px_rgba(19,90,128,0.15)] space-y-4 text-left">
                
                {/* Cabeçalho do Card */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E1EAF0]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                      <Car className="w-5 h-5 text-[#135A80]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#135A80]">Exemplo de relatório veicular</h4>
                      <span className="text-[10px] text-[#667A85] font-semibold">Tipo: exemplo demonstrativo</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-white border-2 border-[#135A80] rounded-md text-xs font-mono font-black text-[#172B3A] tracking-wider shadow-2xs">
                    ABC1D23
                  </div>
                </div>

                {/* Dados ilustrativos com transparência estrita */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#F7FAFC]">
                    <span className="text-[#667A85] font-medium">Marca e modelo:</span>
                    <span className="font-semibold text-[#667A85] italic">não consultados</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F7FAFC]">
                    <span className="text-[#667A85] font-medium">Ano:</span>
                    <span className="font-semibold text-[#667A85] italic">não consultado</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F7FAFC]">
                    <span className="text-[#667A85] font-medium">Situação documental:</span>
                    <span className="font-semibold text-[#667A85] italic">não consultada</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F7FAFC]">
                    <span className="text-[#667A85] font-medium">Débitos:</span>
                    <span className="font-semibold text-[#667A85] italic">não consultados</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#667A85] font-medium">Restrições:</span>
                    <span className="font-semibold text-[#667A85] italic">não consultadas</span>
                  </div>
                </div>

                {/* Legenda Obrigatória Conforme Especificação */}
                <div className="bg-[#EFF8FD] p-3 rounded-xl border border-[#73CEFF]/30 text-center">
                  <p className="text-[11px] font-bold text-[#135A80]">
                    Demonstração de interface. Nenhuma consulta real foi executada.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Onda decorativa de rodapé do hero */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
          <svg className="relative block w-full h-10 sm:h-16 text-white" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
            <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* =========================================================================
          BLOCO 05 — COMO CONSULTAR UMA PLACA (ID: como-consultar)
         ========================================================================= */}
      <section id="como-consultar" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Orientações Iniciais
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Como consultar a placa de um veículo?
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              Consultar uma placa significa iniciar uma pesquisa utilizando a identificação de um veículo. Esse tipo de consulta pode ajudar a verificar determinadas características técnicas, informações documentais e outras categorias de registros disponíveis, dependendo do serviço contratado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-[#F7FAFC] p-6 rounded-3xl border border-[#E1EAF0] space-y-3">
              <h3 className="text-base font-bold text-[#135A80]">
                O que preciso para consultar um veículo?
              </h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Para iniciar pelo formulário principal, basta informar a placa brasileira completa. Algumas modalidades específicas ou serviços oficiais podem exigir também o Renavam, identificação do proprietário ou autenticação.
              </p>
            </div>

            <div className="bg-[#F7FAFC] p-6 rounded-3xl border border-[#E1EAF0] space-y-3">
              <h3 className="text-base font-bold text-[#135A80]">
                A placa permite identificar qualquer informação?
              </h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Não. A placa é um identificador importante, mas não oferece acesso irrestrito a todos os registros do veículo. A disponibilidade depende da modalidade de consulta, das fontes utilizadas e dos requisitos legais aplicáveis.
              </p>
            </div>

            <div className="bg-[#F7FAFC] p-6 rounded-3xl border border-[#E1EAF0] space-y-3">
              <h3 className="text-base font-bold text-[#135A80]">
                Posso consultar carro e moto?
              </h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Sim, o formulário aceita os padrões brasileiros de placa utilizados por diferentes categorias de veículos (carros, motos e caminhões). Entretanto, a cobertura de registros precisa ser confirmada conforme o tipo de veículo e o serviço contratado.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 06 — PASSO A PASSO (ID: como-funciona) - 6 PASSOS
         ========================================================================= */}
      <section id="como-funciona" className="py-16 md:py-24 bg-[#F7FAFC] border-b border-[#E1EAF0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#E1EAF0] shadow-xs">
              Fluxo Transparente
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Como funciona a consulta veicular no PuxarPlaca?
            </h2>
            <p className="text-sm sm:text-base text-[#667A85]">
              Entenda cada etapa do processo antes de iniciar sua consulta pela placa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            
            {/* Passo 1 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-3 relative overflow-hidden">
              <span className="text-3xl font-black text-[#1F8FCC]/20 absolute top-4 right-4 font-mono">01</span>
              <h3 className="text-base font-bold text-[#172B3A]">Passo 1 — Informe a placa</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Digite os sete caracteres no formulário da página inicial. O sistema verifica o formato para orientar a continuação da pesquisa.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-3 relative overflow-hidden">
              <span className="text-3xl font-black text-[#1F8FCC]/20 absolute top-4 right-4 font-mono">02</span>
              <h3 className="text-base font-bold text-[#172B3A]">Passo 2 — Acesse a plataforma</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Crie sua conta ou entre com suas credenciais. O cadastro permite utilizar os serviços disponíveis no painel de forma segura.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-3 relative overflow-hidden">
              <span className="text-3xl font-black text-[#1F8FCC]/20 absolute top-4 right-4 font-mono">03</span>
              <h3 className="text-base font-bold text-[#172B3A]">Passo 3 — Escolha a modalidade</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Conheça as opções de consulta de dados técnicos, documentação, débitos e restrições efetivamente oferecidas.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-3 relative overflow-hidden">
              <span className="text-3xl font-black text-[#1F8FCC]/20 absolute top-4 right-4 font-mono">04</span>
              <h3 className="text-base font-bold text-[#172B3A]">Passo 4 — Confira o preço</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Antes de contratar, verifique quais informações estão incluídas e quanto custa o módulo selecionado.
              </p>
            </div>

            {/* Passo 5 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-3 relative overflow-hidden">
              <span className="text-3xl font-black text-[#1F8FCC]/20 absolute top-4 right-4 font-mono">05</span>
              <h3 className="text-base font-bold text-[#172B3A]">Passo 5 — Confirme a contratação</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Utilize o saldo ou método de pagamento disponibilizado na plataforma (recarga via Pix sem mensalidade).
              </p>
            </div>

            {/* Passo 6 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-3 relative overflow-hidden">
              <span className="text-3xl font-black text-[#1F8FCC]/20 absolute top-4 right-4 font-mono">06</span>
              <h3 className="text-base font-bold text-[#172B3A]">Passo 6 — Visualize o resultado</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Após a execução efetiva, o sistema apresenta as informações retornadas pela modalidade contratada. O resultado pode ser parcial ou indisponível.
              </p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <a
              href="#consultar-placa"
              className="inline-flex items-center gap-2 bg-[#135A80] hover:bg-[#1F8FCC] text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-2xl shadow-md transition-all active:scale-[0.99]"
            >
              <span>Consultar placa agora</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 07 — INFORMAÇÕES VEICULARES (ID: informacoes-veiculares)
         ========================================================================= */}
      <section id="informacoes-veiculares" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Categorias de Registros
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Quais informações podem aparecer em uma consulta de placa?
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              As consultas veiculares podem ser organizadas por categorias. Conhecer essas diferenças é importante para selecionar o serviço adequado e compreender os limites dos resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Marca, modelo e ano</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Os dados técnicos podem incluir marca, modelo, ano de fabricação, ano-modelo, combustível, cor e categoria do veículo. Essas informações podem ajudar na conferência das características anunciadas durante uma negociação.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Chassi e Renavam</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                O chassi é um identificador relacionado à estrutura e à identificação do veículo. O Renavam é utilizado no registro nacional de veículos automotores. Determinadas modalidades podem apresentar informações relacionadas a esses identificadores, conforme suas regras de acesso.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Situação documental</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                As informações documentais podem envolver referências sobre registro, circulação ou licenciamento. Nem todas as consultas disponibilizam confirmação atualizada de regularidade.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Multas e débitos</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Dependendo da modalidade, podem estar disponíveis informações relacionadas a obrigações administrativas e financeiras. Para confirmar valores oficiais de multas, IPVA e licenciamento, pode ser necessário utilizar os serviços dos órgãos competentes.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Restrições financeiras</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Algumas modalidades podem apresentar referências relacionadas a alienação fiduciária, gravames ou outras condições financeiras registradas. Esses registros devem ser interpretados conforme a fonte e a data de referência.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Restrições administrativas ou judiciais</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Uma consulta específica pode abranger determinadas restrições que afetem o veículo. A ausência de um apontamento em uma fonte não garante ausência de restrições em todos os sistemas.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left">
            <strong>Importante:</strong> As categorias acima representam possibilidades de pesquisa veicular. Não significa que todos os módulos disponibilizem todas as informações simultaneamente.
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 08 — RELATÓRIOS E PREÇOS (ID: relatorios-precos)
         ========================================================================= */}
      <section id="relatorios-precos" className="py-16 md:py-24 bg-[#F7FAFC] border-b border-[#E1EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#E1EAF0] shadow-xs">
              Catálogo Transparente
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Relatórios de consulta veicular disponíveis
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              Nem toda pesquisa exige as mesmas informações. Uma pessoa pode precisar apenas de características técnicas, enquanto outra deseja verificar informações documentais ou possíveis restrições. No PuxarPlaca, cada modalidade apresenta claramente seu conteúdo e preço antes da contratação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportCards.map((card) => (
              <div 
                key={card.id}
                className="bg-white rounded-3xl p-7 border border-[#E1EAF0] hover:border-[#1F8FCC]/40 hover:shadow-lg transition-all flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#135A80] bg-[#EFF8FD] px-3 py-1 rounded-full border border-[#73CEFF]/30">
                      {card.badge}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-[#667A85] block">Valor do módulo</span>
                      <span className="text-xl font-black text-[#135A80]">
                        R$ {card.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#172B3A]">
                    {card.title}
                  </h3>

                  <p className="text-xs text-[#667A85] leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F7FAFC]">
                  <a
                    href="#consultar-placa"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-[#1F8FCC] bg-[#EFF8FD] hover:bg-[#1F8FCC] hover:text-white transition-all text-center"
                  >
                    <span>{card.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Dúvidas comerciais Bloco 08 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-6 border-t border-[#E1EAF0]">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-[#135A80]">Como funciona o pagamento?</h3>
              <p className="text-xs text-[#667A85] leading-relaxed">
                Após acessar a plataforma e selecionar a modalidade desejada, você recarrega saldo via Pix instantâneo e contrata somente o relatório que precisar.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-[#135A80]">Preciso pagar mensalidade?</h3>
              <p className="text-xs text-[#667A85] leading-relaxed">
                Não existe mensalidade obrigatória ou assinatura recorrente. Você utiliza seu saldo sob demanda e sem prazos de validade abusivos.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-[#135A80]">O que acontece quando não há resultado?</h3>
              <p className="text-xs text-[#667A85] leading-relaxed">
                A política da plataforma respeita as regras apresentadas antes da contratação: caso ocorra falha de consulta nas fontes parceiras, o usuário recebe assistência pelo suporte.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 09 — VERIFICADOR GRATUITO DE PLACA (ID: verificador-placa)
         ========================================================================= */}
      <VerificadorPlaca />

      {/* =========================================================================
          BLOCO 10 — PLACA MERCOSUL (ID: placa-mercosul)
         ========================================================================= */}
      <section id="placa-mercosul" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Padrões Nacionais
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Placa Mercosul: entenda o novo padrão de identificação
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              A placa Mercosul utiliza uma combinação de letras e números diferente do padrão tradicional brasileiro. Enquanto o modelo antigo utiliza três letras seguidas de quatro números, o padrão Mercosul utiliza três letras, um número, uma letra e dois números.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1EAF0]">
                <h3 className="text-base font-bold text-[#135A80]">Como é uma placa antiga?</h3>
                <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded border border-[#E1EAF0] text-[#172B3A]">ABC-1234</span>
              </div>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Estrutura <strong>LLL-NNNN</strong>, onde L representa letra e N representa número. Esse padrão foi utilizado no Brasil por décadas e permanece válido para veículos que ainda não passaram por transferência ou mudança de município.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1EAF0]">
                <h3 className="text-base font-bold text-[#135A80]">Como é uma placa Mercosul?</h3>
                <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded border border-[#1F8FCC]/40 text-[#1F8FCC]">ABC1D23</span>
              </div>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Estrutura <strong>LLLNLNN</strong> (três letras, um número, uma letra e dois números). O padrão Mercosul possui características gráficas específicas, incluindo faixa superior azul e emblema oficial.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-3">
              <h3 className="text-base font-bold text-[#135A80]">A placa antiga ainda pode ser consultada?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Sim. O formulário da plataforma reconhece o formato tradicional, desde que o serviço escolhido seja compatível com o registro informado. O formato antigo, isoladamente, não indica irregularidade cadastral.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-3">
              <h3 className="text-base font-bold text-[#135A80]">A placa mostra o estado atual do veículo?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Não necessariamente. Os caracteres da placa não devem ser utilizados como prova de localização atual ou residência do proprietário. No padrão Mercosul, a cidade não consta na estampa física da placa.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 11 — CONVERSOR DE PLACA ANTIGA PARA MERCOSUL (ID: conversor-mercosul)
         ========================================================================= */}
      <ConversorMercosul />

      {/* =========================================================================
          BLOCO 12 — CONSULTAR MULTAS, IPVA E LICENCIAMENTO (ID: debitos-veiculares)
         ========================================================================= */}
      <section id="debitos-veiculares" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Débitos e Pendências
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Como consultar multas, IPVA e licenciamento de um veículo?
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              Antes de comprar ou transferir um veículo, é importante conferir sua situação documental e possíveis pendências administrativas. Entretanto, cada órgão possui seus próprios procedimentos de consulta, e nem sempre a placa é a única informação exigida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Como consultar multas pela placa?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                As informações sobre multas podem estar disponíveis nos serviços do órgão responsável pela autuação ou em sistemas integrados. Dependendo da consulta, podem ser exigidos placa, Renavam ou autenticação.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Como consultar IPVA?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                O IPVA é administrado de acordo com as regras estaduais. Para confirmar valores oficiais, parcelamentos e eventuais pendências, utilize o portal oficial da Secretaria da Fazenda do estado competente.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Como consultar licenciamento?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                O licenciamento está relacionado à regularidade documental anual do veículo. Os serviços oficiais do Detran correspondente devem ser utilizados para confirmar os procedimentos e a situação atualizada.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Consigo descobrir todos os débitos apenas com a placa?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Não necessariamente. Algumas verificações exigem informações adicionais (como Renavam ou CPF do titular). Um relatório privado deve informar claramente quais categorias foram efetivamente consultadas.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="#consultar-placa"
              className="inline-flex items-center gap-2 bg-[#1F8FCC] hover:bg-[#135A80] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-md transition-all"
            >
              <span>Conhecer relatórios de débitos</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 13 — RESTRIÇÕES VEICULARES (ID: restricoes-veiculares)
         ========================================================================= */}
      <section id="restricoes-veiculares" className="py-16 md:py-24 bg-[#F7FAFC] border-b border-[#E1EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#E1EAF0] shadow-xs">
              Segurança e Bloqueios
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Como verificar restrições de um veículo pela placa?
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              A pesquisa de restrições veiculares pode ser importante durante a avaliação de um automóvel usado. Existem categorias diferentes de restrições, e cada uma possui consequências e fontes de registro próprias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Alienação fiduciária</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Ocorre em operações de financiamento bancário. O registro dessa condição é relevante para negociações e procedimentos de transferência de propriedade.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Restrições judiciais</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                São limitações decorrentes de decisões judiciais (Renajud). O acesso e a atualização de registros dependem dos sistemas e serviços autorizados.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Restrições administrativas</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Podem envolver impedimentos relacionados a bloqueios de guincho, falta de transferência ou pendências junto aos órgãos de trânsito.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Roubo e furto</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                A existência de restrições ativas de roubo ou furto pode ser verificada por canais oficiais específicos, como o Sinesp Cidadão.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Gravame</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                O gravame representa a existência de uma condição financeira registrada sobre o veículo junto ao Sistema Nacional de Gravames (SNG).
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Interpretação consciente</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                A ausência de uma restrição em determinado relatório não representa garantia absoluta de inexistência de problemas em todos os órgãos.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="#consultar-placa"
              className="inline-flex items-center gap-2 bg-[#135A80] hover:bg-[#1F8FCC] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-md transition-all"
            >
              <span>Ver opções de consulta de restrições</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 14 — CHECKLIST PARA COMPRA DE VEÍCULO USADO (ID: checklist-veiculo)
         ========================================================================= */}
      <ChecklistVeiculo />

      {/* =========================================================================
          BLOCO 15 — CONSULTA POR TIPO DE VEÍCULO
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#F7FAFC] border-b border-[#E1EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#E1EAF0] shadow-xs">
              Segmentos
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Consulta de placa de carro, moto e caminhão
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              O formato de placa é utilizado em diferentes categorias de veículos, mas a relevância de cada informação pode variar conforme a finalidade da pesquisa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                <Car className="w-5 h-5 text-[#135A80]" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Consultar placa de carro</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                A consulta de um carro pode envolver informações técnicas, características, documentação e registros disponíveis sobre sua situação. Antes de comprar, avalie também a conservação física e o histórico de manutenção.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                <Bike className="w-5 h-5 text-[#135A80]" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Consultar placa de moto</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                A pesquisa de uma motocicleta pode envolver dados de identificação e documentação, conforme as modalidades oferecidas. A verificação física dos identificadores de motor e quadro também é essencial.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                <Truck className="w-5 h-5 text-[#135A80]" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Consultar placa de caminhão</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                A consulta de caminhões e veículos pesados exige atenção a características técnicas (como eixos e tipo de carroceria), categoria de uso e documentação específica.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="#consultar-placa"
              className="inline-flex items-center gap-2 bg-[#1F8FCC] hover:bg-[#135A80] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-md transition-all"
            >
              <span>Começar consulta pela placa</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 16 — FONTES OFICIAIS DE INFORMAÇÕES VEICULARES (ID: fontes-oficiais)
         ========================================================================= */}
      <section id="fontes-oficiais" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Canais Governamentais
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Onde consultar informações oficiais sobre veículos?
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              Diversos órgãos públicos disponibilizam serviços relacionados à identificação, documentação e situação de veículos no Brasil. O PuxarPlaca é uma plataforma independente. Sua atuação não deve ser confundida com a dos órgãos responsáveis pelo registro e fiscalização do trânsito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-3">
              <h3 className="text-base font-bold text-[#135A80]">Senatran e Renavam</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                A Secretaria Nacional de Trânsito disponibiliza consultas relacionadas aos dados e ao histórico de veículos registrados na base Renavam. A utilização do serviço oficial pode exigir autenticação Gov.br, placa, Renavam e CPF ou CNPJ do proprietário.
              </p>
              <a
                href="https://www.gov.br/pt-br/servicos/consultar-dados-de-veiculo-na-base-renavam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F8FCC] hover:text-[#135A80] transition-colors"
              >
                <span>Acessar portal Senatran / Gov.br</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-3">
              <h3 className="text-base font-bold text-[#135A80]">Sinesp Cidadão</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                O Sinesp Cidadão (do Ministério da Justiça e Segurança Pública) oferece consulta pública de determinadas restrições de roubo e furto de veículos pela placa.
              </p>
              <a
                href="https://www.gov.br/pt-br/servicos/consultar-veiculo?id=7632&origem=servico"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F8FCC] hover:text-[#135A80] transition-colors"
              >
                <span>Acessar serviço Sinesp Cidadão</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-3">
              <h3 className="text-base font-bold text-[#135A80]">Detrans estaduais</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Os Departamentos Estaduais de Trânsito disponibilizam serviços relacionados a documentos, licenciamento, registro e procedimentos administrativos. As condições de acesso variam entre os estados da federação.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-3">
              <h3 className="text-base font-bold text-[#135A80]">Secretarias da Fazenda</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                As Secretarias da Fazenda estaduais (Sefaz) são referências oficiais para verificações relacionadas ao lançamento, parcelamento e pagamento de IPVA e taxas vinculadas.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-[#EFF8FD] border border-[#73CEFF]/30 text-xs text-[#135A80] text-left">
            <strong>Aviso institucional:</strong> O PuxarPlaca é uma iniciativa privada e independente. Os links acima são fornecidos como referências externas de utilidade pública e não configuram parceria institucional comercial.
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 17 — COMO INTERPRETAR UM RELATÓRIO VEICULAR
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#F7FAFC] border-b border-[#E1EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#E1EAF0] shadow-xs">
              Leitura Consciente
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Como entender os resultados de uma consulta pela placa?
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              Os resultados de uma consulta veicular precisam ser interpretados conforme a categoria pesquisada e a abrangência da fonte utilizada. Uma informação retornada pode ser útil, mas nem sempre representa confirmação completa ou atualizada da situação de um veículo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2">
              <h3 className="text-base font-bold text-[#135A80]">Dados encontrados</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Indica que o serviço retornou determinados registros para a placa consultada. O relatório identifica quais campos possuem informações e quais não foram consultados.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2">
              <h3 className="text-base font-bold text-[#135A80]">Resultado parcial</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Algumas informações podem estar disponíveis enquanto outras permanecem ausentes. Nunca preenchemos campos vazios com dados fictícios.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2">
              <h3 className="text-base font-bold text-[#135A80]">Nenhum registro encontrado</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                A ausência de resultados pode ocorrer por limitações de cobertura regional, indisponibilidade temporária de bases ou divergências no identificador.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2">
              <h3 className="text-base font-bold text-[#135A80]">Informações divergentes</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Divergências entre documentos, informações do vendedor e registros consultados devem ser verificadas presencialmente por meios apropriados.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2">
              <h3 className="text-base font-bold text-[#135A80]">Atualização dos registros</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Os resultados refletem datas de atualização de cada fonte de dados integrada. A data de referência é exibida com transparência.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-2">
              <h3 className="text-base font-bold text-[#135A80]">Dados pessoais</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                O tratamento de dados pessoais respeita os limites da LGPD e as normas de segurança para finalidades legítimas.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 18 — BENEFÍCIOS DO PUXARPLACA (ID: beneficios)
         ========================================================================= */}
      <section id="beneficios" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Diferenciais Legítimos
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Por que utilizar o PuxarPlaca?
            </h2>
            <p className="text-sm sm:text-base text-[#667A85]">
              Recursos construídos para oferecer transparência, rapidez e controle total da sua consulta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E1EAF0] flex items-center justify-center text-[#1F8FCC] shadow-xs">
                <Car className="w-5 h-5 text-[#1F8FCC]" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Pesquisa iniciada pela placa</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Informe a identificação do veículo e conheça as modalidades de consulta disponíveis sem complicação.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E1EAF0] flex items-center justify-center text-[#1F8FCC] shadow-xs">
                <Layers className="w-5 h-5 text-[#1F8FCC]" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Relatórios organizados</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Encontre explicações sobre as diferenças entre informações técnicas, documentação, débitos e restrições.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E1EAF0] flex items-center justify-center text-[#1F8FCC] shadow-xs">
                <CreditCard className="w-5 h-5 text-[#1F8FCC]" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Preços apresentados antes</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Confira o valor do serviço escolhido antes de confirmar a contratação, sem cobranças inesperadas.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E1EAF0] flex items-center justify-center text-[#1F8FCC] shadow-xs">
                <Sparkles className="w-5 h-5 text-[#1F8FCC]" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Ferramentas gratuitas</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Utilize o verificador de formato e o conversor Mercosul sem precisar contratar uma consulta ou criar conta.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E1EAF0] flex items-center justify-center text-[#1F8FCC] shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#1F8FCC]" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Orientação para compra</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Consulte o checklist educativo para organizar uma análise inicial de veículo usado antes de fechar negócio.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E1EAF0] flex items-center justify-center text-[#1F8FCC] shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#1F8FCC]" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Informações com contexto</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Entenda os limites das pesquisas e saiba quando recorrer aos canais oficiais competentes.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 19 — OUTROS SERVIÇOS CADASTRAIS (ID: outros-servicos)
         ========================================================================= */}
      <section id="outros-servicos" className="py-16 md:py-24 bg-[#F7FAFC] border-b border-[#E1EAF0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#667A85] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#E1EAF0] shadow-xs">
              Módulos Complementares
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Conheça outras consultas disponíveis na plataforma
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              Além das modalidades de consulta veicular, a plataforma disponibiliza outros serviços cadastrais complementares diretamente no painel autenticado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                  <Users className="w-5 h-5 text-[#135A80]" />
                </div>
                <h3 className="text-base font-bold text-[#172B3A]">Consulta CPF</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Conheça as modalidades disponíveis para pesquisas cadastrais iniciadas por CPF no painel do usuário.
                </p>
              </div>
              <Link 
                href="/dashboard" 
                className="text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] inline-flex items-center gap-1 pt-2"
              >
                <span>Consultar CPF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                  <Building2 className="w-5 h-5 text-[#135A80]" />
                </div>
                <h3 className="text-base font-bold text-[#172B3A]">Consulta CNPJ</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Pesquise informações cadastrais de empresas (QSA, filiais e dados cadastrais) conforme os serviços oferecidos.
                </p>
              </div>
              <Link 
                href="/dashboard/empresas" 
                className="text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] inline-flex items-center gap-1 pt-2"
              >
                <span>Consultar CNPJ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                  <Phone className="w-5 h-5 text-[#135A80]" />
                </div>
                <h3 className="text-base font-bold text-[#172B3A]">Consulta telefone</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Conheça os serviços de pesquisa iniciados por número telefônico com DDD diretamente no ambiente autenticado.
                </p>
              </div>
              <Link 
                href="/dashboard" 
                className="text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] inline-flex items-center gap-1 pt-2"
              >
                <span>Consultar telefone</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                  <FileSearch className="w-5 h-5 text-[#135A80]" />
                </div>
                <h3 className="text-base font-bold text-[#172B3A]">Consulta por nome</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Conheça as modalidades de pesquisa iniciadas por nome, observando as limitações legais de identificação.
                </p>
              </div>
              <Link 
                href="/dashboard" 
                className="text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] inline-flex items-center gap-1 pt-2"
              >
                <span>Consultar por nome</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 20 — PRIVACIDADE E RESPONSABILIDADE (ID: privacidade)
         ========================================================================= */}
      <section id="privacidade" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Proteção e Conformidade
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Consulta veicular e proteção de dados pessoais
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              As consultas relacionadas a veículos podem envolver informações técnicas, documentais e dados associados a titulares. A utilização dessas informações observa as diretrizes da LGPD (Lei Geral de Proteção de Dados Pessoais).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Posso descobrir o endereço do proprietário pela placa?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                O acesso a informações pessoais de proprietários depende de requisitos legais específicos. A plataforma não oferece acesso indiscriminado a endereços residenciais ou dados privados de terceiros.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">A placa permite rastrear um veículo em tempo real?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Não. A consulta cadastral por placa não representa um serviço de rastreamento por GPS ou monitoramento de localização em tempo real.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Posso utilizar os resultados para qualquer finalidade?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                Não. O uso dos dados obtidos deve observar a finalidade legítima de prevenção a fraudes automotivas, segurança em transações de compra e venda e os termos de uso da plataforma.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E1EAF0] bg-[#F7FAFC] space-y-2.5">
              <h3 className="text-base font-bold text-[#135A80]">Como solicitar informações sobre meus dados?</h3>
              <p className="text-xs sm:text-sm text-[#667A85] leading-relaxed">
                A plataforma disponibiliza um canal de contato funcional para solicitações e esclarecimentos relacionados aos direitos dos titulares de dados previstos na lei.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#1F8FCC]">
            <Link href="/politica-de-privacidade" className="hover:underline">Política de Privacidade</Link>
            <span className="text-[#A0B0BA]">•</span>
            <Link href="/termos" className="hover:underline">Termos de Uso</Link>
            <span className="text-[#A0B0BA]">•</span>
            <Link href="/protecao-de-dados" className="hover:underline">Proteção de Dados (LGPD)</Link>
            <span className="text-[#A0B0BA]">•</span>
            <Link href="/contato" className="hover:underline">Contato</Link>
            <span className="text-[#A0B0BA]">•</span>
            <Link href="/sobre" className="hover:underline">Sobre o PuxarPlaca</Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 21 — FAQ COMPLETO PARA SEO (ID: faq) - 26 ITENS
         ========================================================================= */}
      <section id="faq" className="py-16 md:py-24 bg-[#F7FAFC] border-b border-[#E1EAF0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#E1EAF0] shadow-xs">
              Respostas Claras
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Perguntas frequentes sobre consulta de placa
            </h2>
            <p className="text-sm sm:text-base text-[#667A85]">
              Esclareça todas as dúvidas sobre formatos, custos, débitos e restrições antes de contratar.
            </p>
          </div>

          <FaqAccordion />

        </div>
      </section>

      {/* =========================================================================
          BLOCO 22 — CONTEÚDOS EDUCATIVOS (ID: conteudos)
         ========================================================================= */}
      <section id="conteudos" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Central Educativa
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Aprenda mais sobre placas e consultas veiculares
            </h2>
            <p className="text-sm sm:text-base text-[#667A85] leading-relaxed">
              Entender como funcionam as placas brasileiras, os registros veiculares e a documentação ajuda a escolher a consulta adequada e a interpretar os resultados corretamente.
            </p>
          </div>

          {latestArticles && latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {latestArticles.map((art) => (
                <article key={art.slug} className="bg-[#F7FAFC] p-6 rounded-3xl border border-[#E1EAF0] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#1F8FCC]">Artigo</span>
                    <h3 className="text-base font-bold text-[#172B3A] line-clamp-2">{art.title}</h3>
                    <p className="text-xs text-[#667A85] line-clamp-3 leading-relaxed">
                      {art.metaDescription || 'Confira nosso guia completo sobre checagem de dados veiculares, regras de placas e documentação.'}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${art.slug}`}
                    className="text-xs font-bold text-[#135A80] hover:text-[#1F8FCC] inline-flex items-center gap-1 pt-2"
                  >
                    <span>Ler artigo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-[#F7FAFC] p-6 rounded-3xl border border-[#E1EAF0] space-y-2.5">
                <h3 className="text-base font-bold text-[#135A80]">Como consultar placa de veículo online</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Guia passo a passo sobre a identificação e os registros veiculares disponíveis em pesquisas pela placa.
                </p>
                <a href="#consultar-placa" className="text-xs font-bold text-[#1F8FCC] inline-flex items-center gap-1 pt-1">
                  <span>Consultar agora</span> <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="bg-[#F7FAFC] p-6 rounded-3xl border border-[#E1EAF0] space-y-2.5">
                <h3 className="text-base font-bold text-[#135A80]">Como funciona a placa Mercosul</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Entenda a regra de substituição de caracteres numéricos por letras e como converter os formatos.
                </p>
                <a href="#conversor-mercosul" className="text-xs font-bold text-[#1F8FCC] inline-flex items-center gap-1 pt-1">
                  <span>Ver conversor</span> <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="bg-[#F7FAFC] p-6 rounded-3xl border border-[#E1EAF0] space-y-2.5">
                <h3 className="text-base font-bold text-[#135A80]">O que verificar antes de comprar um usado</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Itens fundamentais para inspecionar em documentos, débitos e conservação física do automóvel.
                </p>
                <a href="#checklist-veiculo" className="text-xs font-bold text-[#1F8FCC] inline-flex items-center gap-1 pt-1">
                  <span>Acessar checklist</span> <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] transition-colors"
            >
              <span>Acessar todos os artigos no Blog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 23 — CTA FINAL
         ========================================================================= */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-[#135A80] via-[#1F8FCC] to-[#26B3FF] text-white overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto text-white border border-white/20 shadow-md">
            <Car className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Comece sua consulta de placa agora
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-xl mx-auto leading-relaxed">
            Informe a placa do veículo e conheça as modalidades de pesquisa disponíveis no PuxarPlaca. Confira as características de cada relatório, os valores e as condições antes de contratar.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#consultar-placa"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#135A80] hover:bg-[#EFF8FD] font-black text-xs uppercase tracking-wider py-4 px-8 rounded-2xl shadow-xl transition-all active:scale-[0.99]"
            >
              <span>Consultar placa agora</span>
              <ArrowRight className="w-4 h-4 text-[#1F8FCC]" />
            </a>

            <Link
              href="/cadastro?src=home-cta-final"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-2xl border border-white/30 backdrop-blur-md transition-all active:scale-[0.99]"
            >
              <span>Criar conta</span>
            </Link>
          </div>

          <p className="text-[11px] text-white/80 max-w-md mx-auto pt-2">
            A disponibilidade de resultados depende dos serviços contratados e dos registros existentes nas bases integradas.
          </p>

        </div>
      </section>

      {/* =========================================================================
          BLOCO 24 — FOOTER REVISADO
         ========================================================================= */}
      <Footer logoUrl={settings?.logoUrl} />

      {/* BLOCO 31 — BOTÃO FLUTUANTE MOBILE */}
      <StickyPlateCta />

    </div>
  );
}
