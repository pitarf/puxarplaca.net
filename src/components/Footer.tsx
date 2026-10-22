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

  const footerLinks = {
    veiculos: [
      { label: 'Consulta de Placa', href: '/#consulta' },
      { label: 'Dados Técnicos e Renavam', href: '/#consultas-veiculares' },
      { label: 'Multas e Débitos Estaduais', href: '/#consultas-veiculares' },
      { label: 'Histórico de Proprietários', href: '/#consultas-veiculares' },
      { label: 'Restrições Judiciais e Renajud', href: '/#consultas-veiculares' },
    ],
    outros: [
      { label: 'Consulta CPF', href: '/consulta-cpf' },
      { label: 'Consulta Telefone', href: '/consulta-telefone' },
      { label: 'Consulta CNPJ', href: '/consulta-cnpj' },
      { label: 'Consulta por Nome', href: '/consulta-nome' },
      { label: 'Processos Judiciais', href: '/#outros-servicos' },
    ],
    empresa: [
      ...empresaPages,
      { label: 'Blog Informativo', href: '/blog' }
    ],
    legal: legalPages
  };

  return (
    <footer className="bg-[#135A80] text-white border-t border-[#1F8FCC]/20 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid de Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          
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
            
            <p className="text-sm text-[#73CEFF]/90 max-w-sm leading-relaxed">
              Plataforma tecnológica especializada em checagem veicular e validação de informações cadastrais por placa em bases oficiais.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#73CEFF] font-medium pt-2">
              <ShieldCheck className="w-4 h-4 text-[#26B3FF]" />
              <span>Ambiente com criptografia SSL e conformidade LGPD</span>
            </div>
          </div>

          {/* Coluna Consultas Veiculares */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-[#73CEFF] tracking-wider uppercase">
              Consultas Veiculares
            </h4>
            <ul className="space-y-2 text-xs">
              {footerLinks.veiculos.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-200 hover:text-[#26B3FF] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna Outros Serviços */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-[#73CEFF] tracking-wider uppercase">
              Outros Serviços
            </h4>
            <ul className="space-y-2 text-xs">
              {footerLinks.outros.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-200 hover:text-[#26B3FF] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna Legal & Institucional */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-[#73CEFF] tracking-wider uppercase">
              Termos e Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/sobre" className="text-slate-200 hover:text-[#26B3FF] transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="text-slate-200 hover:text-[#26B3FF] transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/politica-de-cookies" className="text-slate-200 hover:text-[#26B3FF] transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/protecao-de-dados" className="text-slate-200 hover:text-[#26B3FF] transition-colors">
                  Canal LGPD
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-slate-200 hover:text-[#26B3FF] transition-colors">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#73CEFF]/70 gap-4">
          <p>
            © {new Date().getFullYear()} PuxarPlaca. Todos os direitos reservados.
          </p>
          <p className="text-center md:text-right text-[11px]">
            As consultas utilizam dados de fontes públicas governamentais e de trânsito em estrita conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
          </p>
        </div>

      </div>
    </footer>
  );
}
