import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Car, ShieldCheck } from 'lucide-react';

interface FooterProps {
  logoUrl?: string | null;
}

export default async function Footer({ logoUrl }: FooterProps) {
  const dbPages = await prisma.page.findMany({
    where: { 
      published: true, 
      showInFooter: true,
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: new Date() } }
      ]
    },
    select: { title: true, slug: true },
    orderBy: { title: 'asc' }
  });

  const legalKeywords = ['termo', 'política', 'privacidade', 'cookies', 'proteção', 'lgpd', 'legal', 'reembolso'];
  const empresaPages: { label: string, href: string }[] = [];
  const legalPages: { label: string, href: string }[] = [];

  for (const p of dbPages) {
    const isLegal = legalKeywords.some(kw => p.title.toLowerCase().includes(kw));
    if (isLegal) {
      legalPages.push({ label: p.title, href: `/${p.slug}` });
    } else {
      empresaPages.push({ label: p.title, href: `/${p.slug}` });
    }
  }

  // Bloco 24: Colunas revisadas de acordo com o PROMPT_SUPREMO_HOMEPAGE.md
  const footerLinks = {
    consultas: [
      { label: 'Consultar placa', href: '/#consultar-placa' },
      { label: 'Dados técnicos', href: '/#relatorios-precos' },
      { label: 'Documentação', href: '/#relatorios-precos' },
      { label: 'Débitos e multas', href: '/#debitos-veiculares' },
      { label: 'Restrições veiculares', href: '/#restricoes-veiculares' },
    ],
    ferramentas: [
      { label: 'Verificar placa', href: '/#verificador-placa' },
      { label: 'Conversor Mercosul', href: '/#conversor-mercosul' },
      { label: 'Checklist de veículo usado', href: '/#checklist-veiculo' },
      { label: 'Perguntas frequentes', href: '/#faq' },
    ],
    outros: [
      { label: 'Consulta CPF', href: '/dashboard' },
      { label: 'Consulta CNPJ', href: '/dashboard/empresas' },
      { label: 'Consulta telefone', href: '/dashboard' },
      { label: 'Consulta por nome', href: '/dashboard' },
    ],
    institucional: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Contato', href: '/contato' },
      { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
      { label: 'Termos de Uso', href: '/termos' },
      { label: 'Proteção de Dados (LGPD)', href: '/protecao-de-dados' },
    ]
  };

  return (
    <footer className="bg-[#135A80] text-white border-t border-[#1F8FCC]/20 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid de Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10 text-left">
          
          {/* Coluna da Marca */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="PuxarPlaca" 
                  className="h-8 w-auto object-contain brightness-0 invert" 
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#26B3FF] flex items-center justify-center text-[#135A80]">
                  <Car className="w-5 h-5 text-[#135A80]" />
                </div>
              )}
              <span className="text-xl font-black text-white tracking-tight">
                Puxar<span className="text-[#73CEFF]">Placa</span>
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-[#73CEFF]/90 max-w-sm leading-relaxed">
              Plataforma independente especializada em consultas veiculares por placa, ferramentas de verificação de formato e informações educativas sobre veículos.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#73CEFF] font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-[#26B3FF]" />
              <span>Ambiente criptografado e conformidade com a LGPD</span>
            </div>
          </div>

          {/* Coluna 1 — Consultas */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-[#73CEFF] tracking-wider uppercase">
              Consultas
            </h4>
            <ul className="space-y-2 text-xs">
              {footerLinks.consultas.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 2 — Ferramentas */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-[#73CEFF] tracking-wider uppercase">
              Ferramentas
            </h4>
            <ul className="space-y-2 text-xs">
              {footerLinks.ferramentas.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Outros Serviços & Institucional */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-[#73CEFF] tracking-wider uppercase">
              Institucional
            </h4>
            <ul className="space-y-2 text-xs">
              {footerLinks.institucional.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/blog" 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Blog Informativo
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Texto final Bloco 24 */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-[#73CEFF]/70">
          <p className="max-w-2xl leading-relaxed">
            PuxarPlaca — Plataforma independente de consultas online. As informações disponíveis dependem da modalidade contratada, dos registros acessíveis e das condições legais aplicáveis.
          </p>
          <div className="text-[11px] font-mono text-white/60 shrink-0">
            © {new Date().getFullYear()} PuxarPlaca.net
          </div>
        </div>

      </div>
    </footer>
  );
}
