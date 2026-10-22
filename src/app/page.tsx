import Link from 'next/link';
import { prisma } from '../lib/prisma';
import NavbarClient from '@/components/NavbarClient';
import Footer from '@/components/Footer';
import FaqAccordion from '@/components/FaqAccordion';
import HomeSearchBox from '@/components/HomeSearchBox';
import ComoFuncionaStacking from '@/components/ComoFuncionaStacking';
import { Metadata } from 'next';
import { 
  Car,
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  FileText, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  Zap,
  HelpCircle,
  Eye,
  Lock,
  Layers,
  Scale,
  Users,
  Building2,
  FileSearch,
  Check
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const title = "Consulta de Placa de Veículos Online | PuxarPlaca";
  const description = "Consulte informações completas de veículos pela placa: dados técnicos, débitos, multas, restrições e situação cadastral com dados de bases oficiais.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://puxarplaca.net/"
    },
    robots: "index, follow, max-image-preview:large",
    openGraph: {
      title,
      description,
      url: "https://puxarplaca.net/",
      siteName: "PuxarPlaca",
      images: [
        {
          url: "https://puxarplaca.net/og-puxarplaca.jpg",
          width: 1200,
          height: 630,
          alt: "PuxarPlaca - Consulta Veicular Online"
        }
      ],
      type: "website",
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
      take: 3,
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

  const vehicleModules = [
    {
      id: 'veiculo_basico',
      name: 'Dados Básicos e Técnicos',
      desc: 'Placa, Chassi, Renavam, Marca/Modelo, Ano Fab/Mod, Cor, Categoria, Procedência, Tipo, Carroceria e Eixos.',
      price: getPrice('veiculo_basico', 1.00),
      badge: 'Essencial'
    },
    {
      id: 'veiculo_documentacao',
      name: 'Situação e Documentação',
      desc: 'Município/UF de emplacamento, Situação de circulação, Data de Licenciamento e Emissão de CRV.',
      price: getPrice('veiculo_documentacao', 1.00),
      badge: 'Cadastral'
    },
    {
      id: 'veiculo_debitos',
      name: 'Débitos, Multas e IPVA',
      desc: 'Valores e situação de IPVA, Multas Estaduais/Municipais, Licenciamento em atraso, DPVAT e RENAINF/PRF.',
      price: getPrice('veiculo_debitos', 1.50),
      badge: 'Mais Consultado'
    },
    {
      id: 'veiculo_proprietario',
      name: 'Proprietário & Faturamento',
      desc: 'Nome / Razão Social do proprietário atual, documento vinculado, Localidade e dados de faturamento.',
      price: getPrice('veiculo_proprietario', 1.50),
      badge: 'Completo'
    },
    {
      id: 'veiculo_restricoes',
      name: 'Restrições e Alertas de Bloqueio',
      desc: 'Alienação Fiduciária, Ocorrência de Furto/Roubo, Bloqueio de Guincho, Restrições Administrativas e Renajud.',
      price: getPrice('veiculo_restricoes', 2.00),
      badge: 'Segurança'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#172B3A]">
      
      {/* 1. CABEÇALHO */}
      <NavbarClient 
        logoUrl={settings?.logoUrl} 
        siteTitle={settings?.siteTitle}
        menuPages={menuPages}
      />

      {/* =========================================================================
          SEÇÃO 1: HERO E CONSULTA DE PLACA COM ONDA ORGÂNICA (ESTILO APPSIA)
         ========================================================================= */}
      <section id="consulta" className="relative pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden bg-gradient-to-br from-[#135A80] via-[#1F8FCC] to-[#26B3FF] text-white">
        {/* Efeitos de luz e profundidade no fundo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-24 translate-x-24"></div>
        <div className="absolute bottom-12 left-0 w-80 h-80 bg-[#73CEFF]/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Coluna da Esquerda: Textos + Campo de Placa */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge Superior */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-sm mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-[#73CEFF] animate-pulse"></span>
                <span>Plataforma Oficial de Checagem Veicular</span>
              </div>

              {/* Título Principal H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Consulte informações de veículos pela <span className="text-[#73CEFF] underline decoration-[#73CEFF]/40 underline-offset-8">placa</span>
              </h1>

              {/* Texto de Apoio */}
              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Informe a placa do veículo para conhecer as opções de consulta disponíveis e encontrar as informações adequadas à sua necessidade, com dados de fontes oficiais.
              </p>

              {/* CAMPO DE CONSULTA PRINCIPAL */}
              <div className="pt-2">
                <HomeSearchBox />
              </div>

              {/* Elementos de Confiança Comprovados */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-white/80 font-medium border-t border-white/15">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#73CEFF]" />
                  <span>Base Nacional e Estadual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#73CEFF]" />
                  <span>Processamento Imediato</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#73CEFF]" />
                  <span>Sem Mensalidade (Via Pix)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#73CEFF]" />
                  <span>Conformidade com a LGPD</span>
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Mockup Visual Demonstrativo da Consulta */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative mx-auto max-w-md">
                
                {/* Card Demonstrativo da Ficha do Veículo */}
                <div className="bg-white rounded-3xl border border-[#E1EAF0] p-6 shadow-[0_20px_50px_rgba(19,90,128,0.12)] space-y-5 relative">
                  
                  {/* Topo do card com a placa */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#E1EAF0]">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                        <Car className="w-5 h-5 text-[#135A80]" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#667A85] block">Prévia Demonstrativa</span>
                        <h4 className="text-sm font-black text-[#135A80]">Relatório Veicular</h4>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-white border-2 border-[#135A80] rounded-md text-xs font-mono font-black text-[#172B3A] shadow-xs tracking-wider">
                      BRA2E19
                    </div>
                  </div>

                  {/* Informações demonstrativas do veículo */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-[#F7FAFC]">
                      <span className="text-[#667A85] font-medium">Marca / Modelo:</span>
                      <span className="font-bold text-[#172B3A]">VOLKSWAGEN / T-CROSS</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-[#F7FAFC]">
                      <span className="text-[#667A85] font-medium">Ano Fab / Mod:</span>
                      <span className="font-bold text-[#172B3A]">2022 / 2023</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-[#F7FAFC]">
                      <span className="text-[#667A85] font-medium">Combustível / Cor:</span>
                      <span className="font-bold text-[#172B3A]">FLEX / CINZA</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-[#F7FAFC]">
                      <span className="text-[#667A85] font-medium">Município / UF:</span>
                      <span className="font-bold text-[#172B3A]">SÃO PAULO / SP</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-[#F7FAFC]">
                      <span className="text-[#667A85] font-medium">Situação do Veículo:</span>
                      <span className="font-bold text-[#10B981] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> EM CIRCULAÇÃO
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-[#667A85] font-medium">Restrições Judiciais:</span>
                      <span className="font-bold text-[#10B981]">NADA CONSTA</span>
                    </div>
                  </div>

                  {/* Rodapé do Card demonstrativo */}
                  <div className="bg-[#EFF8FD] p-3.5 rounded-2xl flex items-center justify-between text-xs border border-[#73CEFF]/30">
                    <span className="text-[#135A80] font-semibold">Fonte dos Dados:</span>
                    <span className="font-bold text-[#135A80]">Bases Estaduais & Senatran</span>
                  </div>
                </div>

                {/* Badge flutuante de segurança */}
                <div className="absolute -bottom-4 -left-4 bg-white border border-[#E1EAF0] p-3 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667A85] block font-semibold">Tecnologia Híbrida</span>
                    <span className="text-xs font-bold text-[#135A80]">Resposta em Segundos</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Onda Orgânica de Transição (Estilo Curva Appsia) */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
          <svg 
            className="relative block w-full h-12 sm:h-20 md:h-28 text-[#F7FAFC]" 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" 
              fill="currentColor"
            />
          </svg>
        </div>
      </section>


      {/* =========================================================================
          SEÇÃO 2: COMO FUNCIONA (CARROSSEL VERTICAL COM STACKING CARDS)
         ========================================================================= */}
      <ComoFuncionaStacking />


      {/* =========================================================================
          SEÇÃO 3: TIPOS DE CONSULTA DE VEÍCULOS (MÓDULOS REAIS DA APLICAÇÃO)
         ========================================================================= */}
      <section id="consultas-veiculares" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#135A80] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Relatórios e Tarifas
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Opções de consulta veicular disponíveis
            </h2>
            <p className="text-sm sm:text-base text-[#667A85]">
              Escolha apenas os blocos de informações que você precisa. Valores transparentes e sem pegadinhas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicleModules.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl p-7 border border-[#E1EAF0] hover:border-[#1F8FCC]/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#135A80] bg-[#EFF8FD] px-3 py-1 rounded-full border border-[#73CEFF]/30">
                      {item.badge}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-[#667A85] block">A partir de</span>
                      <span className="text-xl font-black text-[#135A80]">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#172B3A]">
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#667A85] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F7FAFC]">
                  <Link
                    href={`/#consulta`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-[#1F8FCC] bg-[#EFF8FD] hover:bg-[#1F8FCC] hover:text-white transition-all"
                  >
                    <span>Consultar este módulo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Card Pacote Completo */}
            <div className="bg-gradient-to-br from-[#135A80] to-[#1F8FCC] text-white rounded-3xl p-7 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white bg-white/20 px-3 py-1 rounded-full">
                    Mais Recomendado
                  </span>
                  <span className="text-xs text-[#73CEFF] font-semibold">Completo</span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  Dossiê Veicular Completo
                </h3>

                <p className="text-xs text-white/80 leading-relaxed">
                  Todos os módulos unificados em um único relatório: Dados técnicos, débitos, multas estaduais/federais, situação de licenciamento, dados de proprietário e restrições Renajud/furto.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <Link
                  href="/#consulta"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold text-[#135A80] bg-white hover:bg-[#EFF8FD] transition-all shadow-md"
                >
                  <span>Consultar placa agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SEÇÃO 4: BENEFÍCIOS DA PLATAFORMA (COM ONDAS ORGÂNICAS E FUNDO GRADIENTE)
         ========================================================================= */}
      <section id="beneficios" className="relative py-20 md:py-28 bg-gradient-to-br from-[#135A80] via-[#1F8FCC] to-[#26B3FF] text-white overflow-hidden">
        {/* Onda Orgânica Superior */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
          <svg 
            className="relative block w-full h-10 sm:h-16 md:h-20 text-white" 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0L60,10.7C120,21,240,43,360,48C480,53,600,43,720,32C840,21,960,10,1080,10.7C1200,11,1320,21,1380,26.7L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" 
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Efeitos de luz no fundo */}
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-white tracking-wider uppercase bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
              Vantagens Exclusivas
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              Por que consultar veículos conosco
            </h2>
            <p className="text-sm sm:text-base text-white/90">
              Recursos pensados para dar segurança e agilidade antes de comprar, vender ou intermediar veículos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 space-y-3 hover:bg-white/15 transition-all shadow-lg">
              <div className="w-11 h-11 rounded-2xl bg-white text-[#135A80] flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-[#135A80]" />
              </div>
              <h3 className="text-base font-bold text-white">Agilidade Máxima</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Integração direta com bases de dados permitindo o retorno dos relatórios em poucos segundos na tela.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 space-y-3 hover:bg-white/15 transition-all shadow-lg">
              <div className="w-11 h-11 rounded-2xl bg-white text-[#1F8FCC] flex items-center justify-center shadow-md">
                <CreditCard className="w-5 h-5 text-[#1F8FCC]" />
              </div>
              <h3 className="text-base font-bold text-white">Sem Mensalidades</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Sem planos fixos ou renovações automáticas. Você recarrega apenas o saldo necessário pelo Pix.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 space-y-3 hover:bg-white/15 transition-all shadow-lg">
              <div className="w-11 h-11 rounded-2xl bg-white text-[#26B3FF] flex items-center justify-center shadow-md">
                <Layers className="w-5 h-5 text-[#26B3FF]" />
              </div>
              <h3 className="text-base font-bold text-white">Módulos Flexíveis</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Contrate apenas a informação que falta para você: seja dados técnicos simples ou débitos completos.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 space-y-3 hover:bg-white/15 transition-all shadow-lg">
              <div className="w-11 h-11 rounded-2xl bg-white text-[#10B981] flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              </div>
              <h3 className="text-base font-bold text-white">Cache Anti-Prejuízo</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Consultas repetidas dentro do prazo de 48h ficam salvas no seu histórico sem gerar custos duplicados.
              </p>
            </div>
          </div>

        </div>

        {/* Onda Orgânica Inferior */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
          <svg 
            className="relative block w-full h-10 sm:h-16 md:h-20 text-white" 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" 
              fill="currentColor"
            />
          </svg>
        </div>
      </section>


      {/* =========================================================================
          SEÇÃO 5: TRANSPARÊNCIA E USO RESPONSÁVEL
         ========================================================================= */}
      <section className="py-14 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EFF8FD] border border-[#73CEFF]/40 rounded-3xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E1EAF0] text-[#135A80] flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-7 h-7 text-[#135A80]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#135A80]">
                  Transparência e Uso Responsável das Informações
                </h3>
                <p className="text-xs md:text-sm text-[#667A85] leading-relaxed max-w-4xl">
                  As consultas disponibilizadas pela plataforma têm como propósito exclusivo a conferência prévia para compra e venda de veículos, prevenção a fraudes automotivas e validação de segurança. Os dados provêm de registros públicos e governamentais oficiais. O usuário assume total responsabilidade pela finalidade legítima de suas consultas, em conformidade com as diretrizes da LGPD (Lei 13.709/2018).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SEÇÃO 6: OUTROS SERVIÇOS DISPONÍVEIS (SECUNDÁRIOS)
         ========================================================================= */}
      <section id="outros-servicos" className="py-16 md:py-24 bg-[#F7FAFC] border-b border-[#E1EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#667A85] tracking-wider uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#E1EAF0]">
              Módulos Complementares
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#135A80]">
              Outros serviços disponíveis na plataforma
            </h2>
            <p className="text-sm text-[#667A85]">
              Além de veículos, nossa infraestrutura oferece checagens cadastrais completas para pessoas físicas, jurídicas e processos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CPF */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                  <Users className="w-5 h-5 text-[#135A80]" />
                </div>
                <h3 className="text-base font-bold text-[#172B3A]">Consulta de CPF</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Validação cadastral de pessoa física, endereços vinculados, telefones e confirmação de titularidade.
                </p>
              </div>
              <Link 
                href="/consulta-cpf" 
                className="text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] inline-flex items-center gap-1 pt-2"
              >
                <span>Conhecer consulta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* CNPJ */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                  <Building2 className="w-5 h-5 text-[#135A80]" />
                </div>
                <h3 className="text-base font-bold text-[#172B3A]">Consulta de CNPJ</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Quadro societário (QSA), filiais, situação na Receita Federal e dados cadastrais de pessoas jurídicas.
                </p>
              </div>
              <Link 
                href="/consulta-cnpj" 
                className="text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] inline-flex items-center gap-1 pt-2"
              >
                <span>Conhecer consulta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Telefone */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                  <FileSearch className="w-5 h-5 text-[#135A80]" />
                </div>
                <h3 className="text-base font-bold text-[#172B3A]">Consulta de Telefone</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Busca de múltiplos candidatos por número de telefone com identificação segura e pré-visualização.
                </p>
              </div>
              <Link 
                href="/consulta-telefone" 
                className="text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] inline-flex items-center gap-1 pt-2"
              >
                <span>Conhecer consulta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Processos Judiciais */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1EAF0] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF8FD] flex items-center justify-center text-[#135A80]">
                  <Scale className="w-5 h-5 text-[#135A80]" />
                </div>
                <h3 className="text-base font-bold text-[#172B3A]">Processos Judiciais</h3>
                <p className="text-xs text-[#667A85] leading-relaxed">
                  Ações cíveis, trabalhistas e execuções em tribunais estaduais e federais com numeração oficial CNJ.
                </p>
              </div>
              <Link 
                href="/dashboard/processos" 
                className="text-xs font-bold text-[#1F8FCC] hover:text-[#135A80] inline-flex items-center gap-1 pt-2"
              >
                <span>Conhecer consulta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          SEÇÃO 7: PERGUNTAS FREQUENTES (FAQ VEICULAR)
         ========================================================================= */}
      <section id="faq" className="py-16 md:py-24 bg-white border-b border-[#E1EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#1F8FCC] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[#73CEFF]/30">
              Tire suas dúvidas
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#135A80]">
              Perguntas Frequentes
            </h2>
            <p className="text-sm sm:text-base text-[#667A85]">
              Tudo o que você precisa saber sobre a consulta de placas e o funcionamento do sistema.
            </p>
          </div>

          <FaqAccordion />

        </div>
      </section>


      {/* =========================================================================
          SEÇÃO 8: CTA FINAL DE CONVERSÃO COM ONDA SUPERIOR (ESTILO APPSIA)
         ========================================================================= */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-gradient-to-br from-[#135A80] via-[#1F8FCC] to-[#26B3FF] text-white overflow-hidden">
        {/* Onda Orgânica Superior */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
          <svg 
            className="relative block w-full h-12 sm:h-20 text-white" 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0L60,10.7C120,21,240,43,360,48C480,53,600,43,720,32C840,21,960,10,1080,10.7C1200,11,1320,21,1380,26.7L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" 
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Efeitos de profundidade e esferas de luz */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -translate-x-12"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#73CEFF]/20 rounded-full blur-3xl pointer-events-none translate-x-24"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto text-white border border-white/25 shadow-lg">
            <Car className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Encontre a consulta veicular ideal para você
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Informe a placa e conheça as opções de consulta disponíveis na plataforma com dados atualizados e segurança total.
          </p>

          <div className="pt-4">
            <Link
              href="/#consulta"
              className="inline-flex items-center gap-2 bg-white text-[#135A80] hover:bg-[#EFF8FD] font-extrabold text-sm uppercase tracking-wider py-4 px-9 rounded-2xl shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              <span>Consultar placa agora</span>
              <ArrowRight className="w-4 h-4 text-[#1F8FCC]" />
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SEÇÃO 9: RODAPÉ INSTITUCIONAL
         ========================================================================= */}
      <Footer logoUrl={settings?.logoUrl} />

    </div>
  );
}
