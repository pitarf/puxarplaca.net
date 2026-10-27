'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowUp } from 'lucide-react';

export default function StickyPlateCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Exibe a barra apenas após scrollar 600px (fora da primeira dobra)
      if (window.scrollY > 600) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHero = () => {
    const el = document.getElementById('consultar-placa');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Tenta focar no input se existir
      const input = document.getElementById('placa-input');
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
      <button
        onClick={scrollToHero}
        className="w-full bg-[#135A80] hover:bg-[#1F8FCC] text-white font-black text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between transition-all active:scale-[0.98]"
        aria-label="Voltar para consultar placa"
      >
        <span className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#73CEFF]" />
          <span>Consultar placa</span>
        </span>
        <span className="flex items-center gap-1 text-[10px] text-[#73CEFF] font-semibold">
          <span>Início</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </span>
      </button>
    </div>
  );
}
