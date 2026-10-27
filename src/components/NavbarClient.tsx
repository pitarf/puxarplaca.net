'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Car, ArrowRight } from 'lucide-react';

interface NavbarClientProps {
  logoUrl?: string | null;
  siteTitle?: string | null;
  menuPages?: Array<{ title: string; slug: string }>;
}

export default function NavbarClient({ logoUrl, siteTitle, menuPages = [] }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 40);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      const params = new URLSearchParams(window.location.search);
      const source = params.get('src') || params.get('utm_source');
      if (source) {
        document.cookie = `trafficSource=${encodeURIComponent(source)}; path=/; max-age=2592000; SameSite=Lax`;
      }
      const ref = params.get('ref');
      if (ref) {
        document.cookie = `referral=${encodeURIComponent(ref)}; path=/; max-age=2592000; SameSite=Lax`;
      }

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const getHref = (hash: string) => {
    return pathname === '/' ? hash : `/${hash}`;
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#135A80]/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-white/95 backdrop-blur-md border-b border-[#E1EAF0] shadow-2xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between transition-all">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={siteTitle || "PuxarPlaca"} 
              className={`h-7 sm:h-8 w-auto object-contain transition-all ${isScrolled ? 'brightness-0 invert' : ''}`}
            />
          ) : (
            <div 
              className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md transition-all group-hover:scale-105 ${
                isScrolled 
                  ? 'bg-white text-[#135A80]' 
                  : 'bg-gradient-to-br from-[#135A80] to-[#1F8FCC] text-white shadow-[#135A80]/20'
              }`}
            >
              <Car className="w-4 h-4" />
            </div>
          )}
          <div className="flex flex-col">
            <span 
              className={`text-lg sm:text-xl font-black tracking-tight leading-none transition-colors ${
                isScrolled ? 'text-white' : 'text-[#135A80]'
              }`}
            >
              Puxar<span className={isScrolled ? 'text-[#73CEFF]' : 'text-[#1F8FCC]'}>Placa</span>
            </span>
            <span 
              className={`text-[9px] font-bold tracking-wider uppercase mt-0.5 transition-colors ${
                isScrolled ? 'text-[#73CEFF]/80' : 'text-[#667A85]'
              }`}
            >
              Consulta Veicular
            </span>
          </div>
        </Link>

        {/* Links de navegação desktop — Bloco 01 */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link 
            href={getHref('#consultar-placa')} 
            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
              isScrolled ? 'text-[#73CEFF] hover:text-white' : 'text-[#1F8FCC] hover:text-[#135A80]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isScrolled ? 'bg-[#73CEFF]' : 'bg-[#1F8FCC]'}`}></span>
            Consultar Placa
          </Link>
          <Link 
            href={getHref('#como-funciona')} 
            className={`text-xs font-semibold transition-colors ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Como Funciona
          </Link>
          <Link 
            href={getHref('#relatorios-precos')} 
            className={`text-xs font-semibold transition-colors ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Relatórios e Preços
          </Link>
          <Link 
            href={getHref('#placa-mercosul')} 
            className={`text-xs font-semibold transition-colors ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Placa Mercosul
          </Link>
          <Link 
            href={getHref('#faq')} 
            className={`text-xs font-semibold transition-colors ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Perguntas Frequentes
          </Link>
        </nav>

        {/* Ações desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <Link 
            href="/login" 
            className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
              isScrolled ? 'text-white hover:text-[#73CEFF]' : 'text-[#172B3A] hover:text-[#1F8FCC]'
            }`}
          >
            Entrar
          </Link>
          <Link 
            href="/cadastro" 
            className={`text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 ${
              isScrolled
                ? 'bg-white text-[#135A80] hover:bg-[#EFF8FD]'
                : 'bg-[#1F8FCC] hover:bg-[#135A80] text-white shadow-[#1F8FCC]/20'
            }`}
          >
            <span>Criar Conta</span>
            <ArrowRight className={`w-3 h-3 ${isScrolled ? 'text-[#1F8FCC]' : 'text-white'}`} />
          </Link>
        </div>

        {/* Botão Mobile */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`focus:outline-none p-1.5 transition-colors ${
              isScrolled ? 'text-white hover:text-[#73CEFF]' : 'text-[#135A80] hover:text-[#1F8FCC]'
            }`}
            aria-label="Abrir menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu retrátil mobile compacto — Bloco 01 */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full border-b shadow-xl overflow-hidden transition-all duration-300 ease-in-out z-50 ${
          isScrolled 
            ? 'bg-[#135A80] border-white/10 text-white' 
            : 'bg-white border-[#E1EAF0] text-[#172B3A]'
        } ${
          isOpen ? 'max-h-[500px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-5 pt-3 pb-6 space-y-2.5">
          <Link
            href={getHref('#consultar-placa')}
            onClick={() => setIsOpen(false)}
            className={`block text-sm font-bold py-2 border-b ${
              isScrolled ? 'text-[#73CEFF] border-white/10' : 'text-[#1F8FCC] border-[#EFF8FD]'
            }`}
          >
            🔍 Consultar Placa
          </Link>
          <Link
            href={getHref('#como-funciona')}
            onClick={() => setIsOpen(false)}
            className={`block text-xs font-semibold py-2 ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Como Funciona
          </Link>
          <Link
            href={getHref('#relatorios-precos')}
            onClick={() => setIsOpen(false)}
            className={`block text-xs font-semibold py-2 ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Relatórios e Preços
          </Link>
          <Link
            href={getHref('#verificador-placa')}
            onClick={() => setIsOpen(false)}
            className={`block text-xs font-semibold py-2 ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Verificador de Placa
          </Link>
          <Link
            href={getHref('#conversor-mercosul')}
            onClick={() => setIsOpen(false)}
            className={`block text-xs font-semibold py-2 ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Conversor Mercosul
          </Link>
          <Link
            href={getHref('#checklist-veiculo')}
            onClick={() => setIsOpen(false)}
            className={`block text-xs font-semibold py-2 ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Checklist para Compra
          </Link>
          <Link
            href={getHref('#faq')}
            onClick={() => setIsOpen(false)}
            className={`block text-xs font-semibold py-2 ${
              isScrolled ? 'text-white/80 hover:text-white' : 'text-[#667A85] hover:text-[#135A80]'
            }`}
          >
            Perguntas Frequentes
          </Link>
          
          <div className={`pt-3 border-t flex flex-col gap-2 ${isScrolled ? 'border-white/10' : 'border-[#E1EAF0]'}`}>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className={`text-center font-bold py-2.5 rounded-xl border transition-colors text-xs ${
                isScrolled
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-[#E1EAF0] text-[#172B3A] hover:bg-[#F7FAFC]'
              }`}
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setIsOpen(false)}
              className={`text-center font-bold py-2.5 rounded-xl shadow-md transition-colors text-xs ${
                isScrolled
                  ? 'bg-white text-[#135A80] hover:bg-[#EFF8FD]'
                  : 'bg-[#1F8FCC] hover:bg-[#135A80] text-white'
              }`}
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
