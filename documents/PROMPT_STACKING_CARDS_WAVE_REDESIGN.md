# PROMPT MESTRE: MODERNIZAÇÃO VISUAL COM CARROSSEL VERTICAL (STACKING CARDS), HERO COM ONDAS ORGÂNICAS E NAVBAR DINÂMICA
> **Versão:** 1.0.0  
> **Compatibilidade:** Next.js (App Router), Tailwind CSS v3 / v4, React 18/19, TypeScript  
> **Finalidade:** Prompt de engenharia de software pronto para replicar o design system moderno em qualquer plataforma clone, adaptando apenas as variáveis de cor para a paleta de cada projeto.

---

## 📋 Como Utilizar Este Prompt
Basta copiar o bloco abaixo e colar na sua IA assistente (Antigravity, Claude, ChatGPT, etc.) no novo repositório, preenchendo a seção de **[CONFIGURAÇÃO DA PALETA DE CORES DO SEU PROJETO]** com as cores desejadas.

---

```markdown
<!-- ============================================================================== -->
<!-- INÍCIO DO PROMPT PARA A IA                                                     -->
<!-- ============================================================================== -->

Você é um Arquiteto Frontend Sênior e Engenheiro Especialista em UI/UX de Alto Padrão.
Sua missão é implementar uma modernização visual e de experiência do usuário nesta plataforma, aplicando três grandes pilares arquiteturais:

1. **Navbar Reativa com Scroll Dinâmico:** Fundo branco no topo da página e transição suave para a cor escura institucional de alto contraste ao rolar a página para baixo.
2. **Hero e Seções Alternadas com Ondas Orgânicas (Wave SVG Style):** Fundo gradiente vibrante com transições em curva orgânica suave (estilo do template Appsia) na Hero Section, na Seção de Benefícios (com ondas superior e inferior) e no CTA Final de conversão.
3. **Carrossel Vertical com Stacking Cards (Sticky Scroll a 60 FPS):** Transformação da seção "Como Funciona" em um carrossel vertical onde os cartões sobem e se empilham magneticamente, com escala e profundidade óptica tátil, sem abismos em branco e sem quebras de layout.

---

### 1. CONFIGURAÇÃO DA PALETA DE CORES DO SEU PROJETO
> Substitua os códigos hexadecimais abaixo pelas cores oficiais da marca deste projeto antes de executar:

- **COR_ESCURA_INSTITUCIONAL:** `[#135A80]` (Usada em títulos de destaque, cabeçalho rolado, rodapé e contraste)
- **COR_PRIMARIA_BOTOES:** `[#1F8FCC]` (Usada em botões de ação primários, CTAs e links ativos)
- **COR_VIBRANTE_ACENTOS:** `[#26B3FF]` (Usada em gradientes, indicadores de status e detalhes)
- **COR_CLARA_ACENTOS:** `[#73CEFF]` (Usada em fundos sutis, realces e badges)
- **COR_TEXTO_ESCURO:** `[#172B3A]` (Texto principal legível)
- **COR_TEXTO_MUTED:** `[#667A85]` (Cinza azulado / textos secundários)
- **COR_FUNDO_SUAVE:** `[#F7FAFC]` e `[#EFF8FD]` (Fundos alternativos claros)
- **COR_BORDA:** `[#E1EAF0]`

---

### 2. REGRAS ARQUITETÔNICAS E ANTI-BUGS OBRIGATÓRIOS

1. **Anti-Quebra do Sticky (`overflow-x: clip`):**
   - No `globals.css`, configure obrigatoriamente:
     ```css
     html, body {
       overflow-x: clip;
       max-width: 100%;
       width: 100%;
     }
     ```
   - **Proibição:** Nenhum container ancestral pode ter `overflow: hidden` ou `overflow-x: hidden`, pois isso desativa o `position: sticky` no navegador.

2. **Fórmula de Empilhamento dos Cards (`top` escalonado):**
   - Os cartões da seção de passos devem possuir `top` escalonado progressivamente para que as abas superiores continuem visíveis conforme novos cartões se sobrepõem:
     - Card 01: `top-[135px] sm:top-[165px] md:top-[190px] z-10`
     - Card 02: `top-[155px] sm:top-[185px] md:top-[215px] z-20`
     - Card 03: `top-[175px] sm:top-[205px] md:top-[240px] z-30`

3. **Rolagem Contínua Sem Abismo em Branco:**
   - Cada `.stack-card` deve ter `margin-bottom: 24px !important;` e o último deve ter `margin-bottom: 0 !important;`.
   - O container pai deve ter `padding-bottom: 0 !important;`.

4. **Cabeçalho Sticky com Efeito Blur:**
   - O título e introdução da seção "Como Funciona" devem fixar no topo (`position: sticky; top: 64px / 72px; z-index: 40;`) com `backdrop-filter: blur(12px);`, permitindo que os cartões passem por baixo sem poluir a leitura.

---

### 3. ESPECIFICAÇÃO DE CÓDIGO E COMPONENTES

#### A. Adicionar Estilos no `src/app/globals.css`
Adicione ao final do arquivo:
```css
/* ==========================================================================
   CARROSSEL VERTICAL COM STACKING CARDS (STICKY SCROLL)
   ========================================================================== */
html, body {
  overflow-x: clip;
  max-width: 100%;
  width: 100%;
}

.services-sticky-header {
  position: sticky;
  top: 64px;
  z-index: 40;
  background-color: rgba(247, 250, 252, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding-top: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(225, 234, 240, 0.8);
}

@media (min-width: 768px) {
  .services-sticky-header {
    top: 72px;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
    margin-bottom: 2rem;
  }
}

.stacking-container {
  position: relative;
  padding-bottom: 0 !important;
}

.stack-card {
  transform-origin: top center;
  will-change: transform, filter;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s ease;
  margin-bottom: 24px !important;
}

.stack-card:last-child {
  margin-bottom: 0 !important;
}
```

---

#### B. Componente da Navbar Dinâmica (`src/components/NavbarClient.tsx`)
Implemente o listener de scroll com listener passivo:
- **No topo (`scrollY <= 40`):** Fundo branco `bg-white/95`, logo e links em `[COR_TEXTO_ESCURO]` / `[COR_ESCURA_INSTITUCIONAL]`, e botão em `[COR_PRIMARIA_BOTOES]`.
- **Ao rolar (`scrollY > 40`):** Fundo `bg-[COR_ESCURA_INSTITUCIONAL]/95 backdrop-blur-md shadow-lg`, logo e links em branco com realces em `[COR_CLARA_ACENTOS]`, e botão de ação invertido para fundo branco com texto escuro.

Exemplo de lógica essencial:
```tsx
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 40);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

#### C. Componente do Carrossel Vertical (`src/components/ComoFuncionaStacking.tsx`)
Crie o componente Client-Side com interpolação óptica a 60 FPS:
```tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

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

          const overlap = currentRect.bottom - nextRect.top;
          const totalHeight = currentRect.height;

          if (overlap > 0) {
            const progress = Math.min(Math.max(overlap / (totalHeight * 0.85), 0), 1);
            const scale = 1 - (progress * 0.04);
            const brightness = 1 - (progress * 0.15);
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

  return (
    <section id="como-funciona" className="py-12 md:py-16 bg-[#F7FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Sticky */}
        <div className="services-sticky-header rounded-2xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[COR_PRIMARIA_BOTOES] tracking-wider uppercase bg-[#EFF8FD] px-3.5 py-1.5 rounded-full border border-[COR_CLARA_ACENTOS]/30 inline-block mb-1.5">
                Passo a Passo
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[COR_ESCURA_INSTITUCIONAL]">
                Como funciona o processo de consulta
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[COR_TEXTO_MUTED] max-w-md">
              Processo simplificado em três etapas transparentes e imediatas.
            </p>
          </div>
        </div>

        {/* Stacking Cards */}
        <div className="stacking-container relative max-w-4xl mx-auto">
          {/* Card 01 */}
          <div className="stack-card sticky top-[135px] sm:top-[165px] md:top-[190px] z-10 w-full rounded-3xl bg-white border border-[#E1EAF0] shadow-md p-6 sm:p-10">
            {/* Conteúdo do Card 01 */}
          </div>

          {/* Card 02 */}
          <div className="stack-card sticky top-[155px] sm:top-[185px] md:top-[215px] z-20 w-full rounded-3xl bg-[#EFF8FD] border border-[COR_CLARA_ACENTOS]/50 shadow-lg p-6 sm:p-10">
            {/* Conteúdo do Card 02 */}
          </div>

          {/* Card 03 */}
          <div className="stack-card sticky top-[175px] sm:top-[205px] md:top-[240px] z-30 w-full rounded-3xl bg-gradient-to-br from-[COR_ESCURA_INSTITUCIONAL] to-[COR_PRIMARIA_BOTOES] text-white border border-[COR_PRIMARIA_BOTOES] shadow-xl p-6 sm:p-10">
            {/* Conteúdo do Card 03 */}
          </div>
        </div>

      </div>
    </section>
  );
}
```

---

#### D. Divisores de Ondas Orgânicas (Wave SVGs) na Landing Page (`src/app/page.tsx`)

1. **Na Base da Hero Section:**
   - Adicione antes de fechar a `<section id="consulta">`:
   ```html
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
   ```

2. **Na Seção de Benefícios (Fundo Gradiente + 2 Ondas):**
   - A seção recebe: `bg-gradient-to-br from-[COR_ESCURA_INSTITUCIONAL] via-[COR_PRIMARIA_BOTOES] to-[COR_VIBRANTE_ACENTOS] text-white relative overflow-hidden py-20 md:py-28`.
   - **Onda Superior (curva vinda da seção clara):**
     ```html
     <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
       <svg className="relative block w-full h-10 sm:h-16 md:h-20 text-white" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
         <path d="M0,0L60,10.7C120,21,240,43,360,48C480,53,600,43,720,32C840,21,960,10,1080,10.7C1200,11,1320,21,1380,26.7L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" fill="currentColor"/>
       </svg>
     </div>
     ```
   - **Cards internos:** Use `bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6` para um acabamento glassmorphism elegante.
   - **Onda Inferior (curva voltando para a seção clara):**
     ```html
     <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
       <svg className="relative block w-full h-10 sm:h-16 md:h-20 text-white" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
         <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="currentColor"/>
       </svg>
     </div>
     ```

3. **No CTA Final de Conversão:**
   - Adicione a mesma onda superior para fazer a entrada suave e um botão branco de alto impacto (`bg-white text-[COR_ESCURA_INSTITUCIONAL] shadow-2xl`).

---

### 4. CHECKLIST DE VALIDAÇÃO (QA)
- [ ] O `position: sticky` dos cartões funciona perfeitamente sem travar ou quebrar o scroll?
- [ ] No mobile, os cartões não cobrem o cabeçalho sticky da seção?
- [ ] A Navbar no topo é branca e ao rolar 40px fica na cor escura institucional com contraste nítido?
- [ ] As ondas SVG casam perfeitamente com a cor de fundo das seções vizinhas sem linhas de desfoque ou cortes?
- [ ] O comando de build do Next.js compila com 100% de sucesso?

Execute todas as alterações mantendo 100% das regras de negócio e rotas existentes do projeto.
<!-- ============================================================================== -->
<!-- FIM DO PROMPT PARA A IA                                                        -->
<!-- ============================================================================== -->
```
