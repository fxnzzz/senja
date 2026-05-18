import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, X, ArrowRight, MapPin, Coffee, Volume2, VolumeX } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..600;1,300..500&family=Inter:wght@200..500&display=swap');
  :root { --c-bg: #030303; --c-surf: #0a0a0a; --c-txt: #E8E3D9; --c-mut: #7A7065; --c-gld: #C29452; --c-brd: rgba(255,255,255,0.08); }
  * { cursor: none !important; box-sizing: border-box; }
  body { background: var(--c-bg); color: var(--c-txt); font-family: 'Inter', sans-serif; overflow-x: hidden; scroll-behavior: smooth; }
  .f-serif { font-family: 'Cormorant Garamond', serif; }
  .film-grain { position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.04; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: var(--c-bg); } ::-webkit-scrollbar-thumb { background: #222; } ::-webkit-scrollbar-thumb:hover { background: var(--c-gld); }
  .no-bar::-webkit-scrollbar { display: none; } .no-bar { -ms-overflow-style: none; scrollbar-width: none; }
  .rev { opacity: 0; transform: translateY(60px); transition: all 1.8s cubic-bezier(0.19,1,0.22,1); } .rev.active { opacity: 1; transform: translateY(0); }
  .rev-c { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); transition: clip-path 1.5s cubic-bezier(0.19,1,0.22,1); } .rev-c.active { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  @keyframes mq { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .anim-mq { display: inline-block; white-space: nowrap; animation: mq 25s linear infinite; }
  @keyframes stm { 0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; } 40% { opacity: 0.15; } 100% { transform: translateY(-30vh) scale(2.5) rotate(15deg); opacity: 0; } }
  .stm-p { position: absolute; bottom: -10%; background: radial-gradient(circle, rgba(232,227,217,0.08) 0%, transparent 60%); border-radius: 50%; filter: blur(25px); animation: stm 12s infinite ease-in; pointer-events: none; }
  .img-z { overflow: hidden; } .img-z img { transition: transform 1.5s cubic-bezier(0.19,1,0.22,1); } .img-z:hover img { transform: scale(1.08); }
  .txt-out { color: transparent; -webkit-text-stroke: 1px var(--c-brd); }
  @keyframes slideDown { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } } 
  @keyframes slowPan { from { transform: scale(1.05) translate(0, 0); } to { transform: scale(1.1) translate(-2%, 2%); } }
  @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } 
  input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.3; cursor: none; }
`;

const MENU = [
  { id: 1, n: 'V60 Pour Over', o: 'Ethiopia Yirgacheffe', d: 'Floral notes, bergamot, bright acidity. Brewed deliberately.', p: 45000, img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800' },
  { id: 2, n: 'Charcoal Noir', o: 'House Blend', d: 'Activated charcoal, double espresso, textured micro-foam.', p: 55000, img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800' },
  { id: 3, n: 'Senja Signature', o: 'Single Origin', d: '12-hour cold brew, sea salt brown sugar foam, smoked cinnamon.', p: 60000, img: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=800' },
  { id: 4, n: 'Matcha Presso', o: 'Uji, Japan', d: 'Ceremonial grade matcha layered over dark roast espresso.', p: 58000, img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800' },
  { id: 5, n: 'Artisan Pastry', o: 'Local Bakery', d: 'Laminated dough, french butter, dark chocolate center.', p: 35000, img: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&q=80&w=800' },
];

const GALLERY = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
];

// Reusable SVG icons for socials to avoid import errors from package updates
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);
const TwitterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>);

const fmt = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p);

const useReveal = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(e => e.forEach(en => en.isIntersecting && en.target.classList.add('active')), { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.rev, .rev-c').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

const useCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let frame;
    const move = e => { frame = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY })); };
    window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(frame); };
  }, []);
  return pos;
};

const CursorUI = ({ pos, variant }) => (
  <>
    <div className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference hidden md:flex items-center justify-center transition-all duration-300 ease-out"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`, width: variant === 'hover' ? '80px' : variant === 'drag' ? '60px' : '16px', height: variant === 'hover' ? '80px' : variant === 'drag' ? '60px' : '16px', border: variant === 'default' ? '1px solid var(--c-gld)' : 'none', backgroundColor: variant !== 'default' ? 'var(--c-txt)' : 'transparent', borderRadius: '50%' }}>
      {variant === 'drag' && <span className="text-black text-[10px] uppercase tracking-widest font-semibold mix-blend-normal">Drag</span>}
      {variant === 'hover' && <span className="text-black text-[10px] uppercase tracking-widest font-semibold mix-blend-normal">View</span>}
    </div>
    <div className="fixed top-0 left-0 w-1 h-1 rounded-full bg-[var(--c-gld)] pointer-events-none z-[10000] hidden md:block" style={{ transform: `translate3d(${pos.x - 2}px, ${pos.y - 2}px, 0)` }} />
  </>
);

const Navigation = ({ cartLen, onMenu, onCart, sVariant }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-1000 ${scrolled ? 'py-4 bg-[#030303]/90 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="px-6 md:px-12 flex justify-between items-center max-w-[1800px] mx-auto">
        <button onClick={onMenu} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')} className="group flex items-center gap-4 border-none outline-none bg-transparent">
          <div className="flex flex-col gap-1.5 items-start"><span className="w-8 h-[1px] bg-white group-hover:w-4 transition-all duration-500"></span><span className="w-4 h-[1px] bg-white group-hover:w-8 transition-all duration-500"></span></div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--c-mut)] group-hover:text-white transition-colors hidden sm:block">Explore</span>
        </button>
        <a href="#" className="f-serif text-2xl md:text-3xl tracking-[0.2em] uppercase absolute left-1/2 -translate-x-1/2 text-white" onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')}>Senja</a>
        <button onClick={onCart} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')} className="group flex items-center gap-3 relative border-none outline-none bg-transparent">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--c-mut)] group-hover:text-white transition-colors hidden sm:block mt-1">Cart [{cartLen}]</span>
          <div className="relative">
            <ShoppingCart size={18} strokeWidth={1.5} className="text-white group-hover:text-[var(--c-gld)] transition-colors" />
            {cartLen > 0 && <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-[var(--c-gld)] text-black text-[8px] font-bold flex items-center justify-center rounded-full">{cartLen}</span>}
          </div>
        </button>
      </div>
    </nav>
  );
};

const FullScreenMenu = ({ isOpen, close, sVariant }) => (
  <div className={`fixed inset-0 bg-[#030303] z-[60] transition-transform duration-1000 ease-[cubic-bezier(0.86,0,0.07,1)] flex flex-col ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
    <div className="p-8 md:p-12 flex justify-between items-center">
      <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--c-mut)]">Index</span>
      <button onClick={close} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')} className="text-white hover:text-[var(--c-gld)] transition-colors bg-transparent border-none"><X size={32} strokeWidth={1} /></button>
    </div>
    <div className="flex-1 flex flex-col justify-center px-12 md:px-32 gap-4">
      {['Our Story', 'Curations', 'Atmosphere', 'Reservation'].map((item, idx) => (
        <a key={idx} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={close} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')}
          className="group f-serif text-5xl md:text-8xl lg:text-[9rem] tracking-tighter text-[var(--c-mut)] hover:text-white transition-all duration-700 flex items-center gap-8 w-fit"
          style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100px)', opacity: isOpen ? 1 : 0, transitionDelay: `${idx * 0.1 + 0.4}s` }}>
          <span className="text-[14px] font-sans tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-[var(--c-gld)]">0{idx + 1}</span>{item}
        </a>
      ))}
    </div>
  </div>
);

const HeroSection = ({ sVariant }) => {
  const [snd, setSnd] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let frame;
    const fn = () => { frame = requestAnimationFrame(() => setScrollY(window.scrollY)); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(frame); };
  }, []);

  return (
    <header className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 opacity-60">
        <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=2000" alt="Dark Espresso" className="w-full h-full object-cover transform scale-105 animate-[slowPan_30s_ease-out_infinite_alternate]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-black/40 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none mix-blend-screen opacity-50">
        <div className="stm-p w-64 h-64 left-[20%]" style={{ animationDelay: '0s', animationDuration: '14s' }} />
        <div className="stm-p w-96 h-96 left-[50%]" style={{ animationDelay: '4s', animationDuration: '18s' }} />
        <div className="stm-p w-72 h-72 left-[70%]" style={{ animationDelay: '2s', animationDuration: '15s' }} />
      </div>
      <div className="absolute top-1/3 left-6 md:left-12 z-20 hidden md:block"><p className="text-[9px] uppercase tracking-[0.5em] text-[var(--c-mut)] -rotate-90 origin-left">Est. 2024</p></div>
      <button onClick={() => setSnd(!snd)} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')} className="absolute bottom-12 right-6 md:right-12 z-20 flex items-center gap-3 text-[var(--c-mut)] hover:text-white transition-colors bg-transparent border-none">
        <span className="text-[9px] uppercase tracking-widest hidden sm:block">Ambient</span>{snd ? <Volume2 size={16} strokeWidth={1.5} /> : <VolumeX size={16} strokeWidth={1.5} />}
      </button>
      <div className="relative z-20 text-center flex flex-col items-center w-full px-4" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
        <p className="rev text-[10px] md:text-xs tracking-[0.5em] uppercase text-[var(--c-mut)] mb-6 md:mb-10 font-light">Artisan Roastery & Cafe</p>
        <h1 className="f-serif text-[22vw] sm:text-[18vw] lg:text-[15rem] leading-[0.7] tracking-tighter mix-blend-screen flex flex-col items-center pointer-events-none">
          <span className="rev text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" style={{ transitionDelay: '0.2s' }}>Kopi</span>
          <span className="rev text-[var(--c-gld)] italic pr-8 md:pr-24 drop-shadow-[0_0_30px_rgba(194,148,82,0.1)]" style={{ transitionDelay: '0.4s' }}>Senja.</span>
        </h1>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center rev" style={{ transitionDelay: '0.8s' }}>
        <span className="text-[9px] uppercase tracking-[0.4em] text-[var(--c-mut)] mb-4 writing-vertical-rl">Scroll</span>
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[var(--c-brd)] to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-[var(--c-gld)] animate-[slideDown_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </header>
  );
};

const StorySection = () => (
  <section id="our-story" className="py-32 md:py-48 px-6 md:px-12 max-w-[1800px] mx-auto relative z-10 bg-[var(--c-bg)]">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-6 items-center">
      <div className="md:col-span-5 md:col-start-2 relative z-30">
        <div className="rev flex items-center gap-4 mb-8"><span className="w-12 h-[1px] bg-[var(--c-gld)]" /><span className="text-[10px] tracking-[0.3em] uppercase text-[var(--c-gld)]">The Narrative</span></div>
        <h2 className="rev f-serif text-5xl md:text-6xl lg:text-8xl leading-[0.9] mb-12 tracking-tight">The <br /><span className="italic text-[var(--c-mut)] ml-12">Pursuit</span> <br />of Quiet.</h2>
        <div className="rev space-y-6 max-w-md ml-auto md:ml-12 border-l border-[var(--c-brd)] pl-6">
          <p className="text-[var(--c-mut)] text-sm md:text-base font-light leading-relaxed">In a city that never stops, Senja was conceived as a sanctuary. We blend the meticulous precision of Japanese coffee culture with the raw, textural warmth of modern underground design.</p>
          <p className="text-[var(--c-mut)] text-sm md:text-base font-light leading-relaxed">Every bean is ethically sourced, roasted in-house to capture its narrative, and brewed with deliberate slowness. It's not just coffee; it's a moment reclaimed from the noise.</p>
        </div>
      </div>
      <div className="md:col-span-6 md:col-start-7 relative min-h-[60vh] md:min-h-0">
        <div className="rev-c absolute top-0 right-0 w-[85%] aspect-[3/4] img-z z-10 border border-[var(--c-brd)]">
          <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=1000" alt="Dark Roasted Beans" className="w-full h-full object-cover filter contrast-[1.1] brightness-90 grayscale-[20%]" />
        </div>
        <div className="rev-c absolute top-1/2 md:top-auto md:bottom-24 -left-6 md:-left-24 w-1/2 md:w-[55%] aspect-square img-z z-20 shadow-2xl border border-[var(--c-brd)]" style={{ transitionDelay: '0.2s' }}>
          <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800" alt="Pour Over Detail" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" />
        </div>
        <div className="absolute -right-8 top-1/4 z-30 hidden lg:block rotate-90 origin-left"><span className="text-[10px] tracking-[0.4em] text-[var(--c-brd)] uppercase">Handcrafted Daily</span></div>
      </div>
    </div>
  </section>
);

const CurationsSection = ({ addCart, sVariant }) => (
  <section id="curations" className="py-32 relative z-10 bg-[#020202]">
    <div className="px-6 md:px-12 max-w-[1800px] mx-auto mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-8">
      <div className="rev"><h2 className="f-serif text-5xl md:text-7xl tracking-tighter">The <br /><span className="italic text-[var(--c-gld)]">Curations</span>.</h2></div>
      <div className="flex items-center gap-4 rev border border-[var(--c-brd)] px-6 py-3 rounded-full w-fit"><span className="text-[10px] tracking-[0.2em] uppercase text-[var(--c-mut)]">Horizontal Scroll</span><ArrowRight size={14} className="text-white" /></div>
    </div>
    <div className="w-full overflow-x-auto snap-x snap-mandatory no-bar pl-6 md:pl-12 pb-12 flex gap-4 md:gap-8" onMouseEnter={() => sVariant('drag')} onMouseLeave={() => sVariant('default')}>
      {MENU.map((item, i) => (
        <div key={item.id} className="rev flex-shrink-0 w-[80vw] sm:w-[350px] md:w-[420px] snap-center group relative h-[60vh] md:h-[70vh] border border-[var(--c-brd)] overflow-hidden bg-[#0a0a0a]" style={{ transitionDelay: `${i * 0.1}s` }}>
          <img src={item.img} alt={item.n} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-40 grayscale-[30%] group-hover:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/60 to-[#030303] opacity-90" />
          <div className="absolute bottom-0 left-0 w-full p-8 transition-transform duration-700 group-hover:translate-y-full">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--c-gld)] mb-3 block">{item.o}</span><h3 className="f-serif text-3xl text-white">{item.n}</h3>
          </div>
          <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/40 backdrop-blur-[2px]">
            <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 delay-100">
              <h3 className="f-serif text-3xl md:text-4xl text-white mb-4">{item.n}</h3><p className="text-[var(--c-mut)] text-sm font-light mb-8 leading-relaxed max-w-[90%]">{item.d}</p>
              <div className="flex justify-between items-center border-t border-[var(--c-brd)] pt-6">
                <span className="text-sm font-mono tracking-widest text-white">{fmt(item.p)}</span>
                <button onClick={(e) => { e.stopPropagation(); addCart(item); }} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('drag')} className="text-[10px] uppercase tracking-[0.2em] text-[var(--c-gld)] hover:text-white transition-colors flex items-center gap-2 bg-transparent border-none">Add +</button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex-shrink-0 w-6 md:w-12 h-full" />
    </div>
  </section>
);

const AtmosphereSection = ({ setLb, sVariant }) => (
  <section id="atmosphere" className="py-32 px-6 md:px-12 max-w-[1800px] mx-auto bg-[var(--c-bg)]">
    <div className="rev mb-24 max-w-2xl"><span className="text-[10px] tracking-[0.3em] uppercase text-[var(--c-mut)] block mb-4">Visual Diary</span><h2 className="f-serif text-4xl md:text-6xl text-white leading-tight">Moments captured in <span className="italic text-[var(--c-mut)]">shadow and steam.</span></h2></div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[350px]">
      {GALLERY.map((img, i) => {
        const cls = i === 0 ? "md:col-span-7 md:row-span-2" : i === 1 || i === 2 ? "md:col-span-5" : i === 3 ? "md:col-span-8" : "md:col-span-4";
        return (
          <div key={i} className={`${cls} rev-c relative overflow-hidden group border border-[var(--c-brd)] bg-[#0a0a0a] cursor-pointer`} onClick={() => setLb(img)} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')}>
            <img src={img} alt="Atmosphere" className="w-full h-full object-cover filter grayscale-[60%] contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        );
      })}
    </div>
  </section>
);

const ReservationSection = ({ sVariant }) => {
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formStatus !== 'idle') return;
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1200);
    setTimeout(() => {
      setFormStatus('idle');
      e.target.reset();
    }, 4000);
  };

  return (
    <section id="reservation" className="py-32 md:py-48 relative border-t border-[var(--c-brd)] bg-[#020202]">
      <div className="absolute inset-0 pointer-events-none opacity-10"><img src="https://images.unsplash.com/photo-1495474472201-49b06ecda5df?auto=format&fit=crop&q=80&w=1920" alt="Texture" className="w-full h-full object-cover mix-blend-overlay" /></div>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="rev"><h2 className="f-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-[0.9]">Secure your <br /><span className="italic text-[var(--c-gld)]">moment</span>.</h2><p className="text-[var(--c-mut)] font-light max-w-sm text-sm">Reservations are highly recommended. Walk-ins are accommodated based on availability.</p></div>
        <div className="rev border border-[var(--c-brd)] bg-[#050505]/80 backdrop-blur-md p-8 md:p-16 relative">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-[var(--c-gld)]" /><div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-[var(--c-gld)]" />
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div className="relative group"><input type="text" id="name" required className="w-full bg-transparent border-b border-[var(--c-brd)] py-3 text-white focus:outline-none focus:border-[var(--c-gld)] peer placeholder-transparent transition-colors font-light text-xl" placeholder="Name" /><label className="absolute left-0 top-3 text-[10px] tracking-[0.2em] text-[var(--c-mut)] peer-focus:-top-4 peer-focus:text-[var(--c-gld)] peer-valid:-top-4 peer-valid:text-[var(--c-mut)] transition-all duration-300 uppercase">Name</label></div>
              <div className="grid grid-cols-2 gap-8">
                <div className="relative group"><input type="date" required className="w-full bg-transparent border-b border-[var(--c-brd)] py-3 text-white focus:outline-none focus:border-[var(--c-gld)] peer transition-colors font-light text-sm" /><label className="absolute left-0 -top-4 text-[10px] tracking-[0.2em] text-[var(--c-mut)] uppercase">Date</label></div>
                <div className="relative group">
                  <select className="w-full bg-transparent border-b border-[var(--c-brd)] py-3 text-white focus:outline-none focus:border-[var(--c-gld)] appearance-none transition-colors cursor-none rounded-none font-light text-sm">{[1, 2, 3, 4].map(n => <option key={n} value={n} className="bg-[#050505]">{n} Guest{n > 1 ? 's' : ''}</option>)}</select>
                  <label className="absolute left-0 -top-4 text-[10px] tracking-[0.2em] text-[var(--c-mut)] uppercase">Guests</label>
                </div>
              </div>
            </div>
            <div className="pt-8">
              <button type="submit" disabled={formStatus !== 'idle'} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')} className="group relative w-full flex justify-between items-center border border-[var(--c-brd)] p-6 hover:border-[var(--c-gld)] transition-colors overflow-hidden bg-transparent">
                <span className={`relative z-10 text-[10px] uppercase tracking-[0.3em] transition-colors delay-100 ${formStatus === 'sent' ? 'text-[var(--c-gld)]' : 'text-white group-hover:text-black'}`}>
                  {formStatus === 'idle' && 'Submit Request'}
                  {formStatus === 'sending' && 'Securing...'}
                  {formStatus === 'sent' && 'Request Confirmed'}
                </span>
                <ArrowRight size={16} className={`relative z-10 transition-colors delay-100 ${formStatus === 'sent' ? 'text-[var(--c-gld)]' : 'text-[var(--c-mut)] group-hover:text-black'}`} />
                <div className="absolute inset-0 bg-[var(--c-gld)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default function KopiSenjaApp() {
  const [cart, setCart] = useState([]);
  const [ui, setUi] = useState({ menu: false, cart: false, lb: null, cursor: 'default' });
  const pos = useCursor();
  
  useReveal();

  useEffect(() => { 
    try {
      const s = localStorage.getItem('ksCart'); 
      if (s) setCart(JSON.parse(s)); 
    } catch (e) { console.error("Error loading cart", e); }
  }, []);

  useEffect(() => { 
    localStorage.setItem('ksCart', JSON.stringify(cart)); 
  }, [cart]);

  const updateUi = useCallback((k, v) => setUi(p => ({ ...p, [k]: v })), []);
  const sVariant = useCallback((v) => updateUi('cursor', v), [updateUi]);
  
  const addCart = useCallback((item) => {
    setCart(p => p.find(i => i.id === item.id) ? p.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...p, { ...item, qty: 1 }]);
    updateUi('cart', true);
  }, [updateUi]);
  
  const rmCart = (id) => setCart(p => p.filter(i => i.id !== id));
  const tot = cart.reduce((s, i) => s + (i.p * i.qty), 0);

  return (
    <div className="relative min-h-screen selection:bg-[var(--c-gld)] selection:text-black bg-[var(--c-bg)]">
      <style>{STYLES}</style>
      <div className="film-grain" />
      <CursorUI pos={pos} variant={ui.cursor} />
      <Navigation cartLen={cart.length} onMenu={() => updateUi('menu', true)} onCart={() => updateUi('cart', true)} sVariant={sVariant} />
      <FullScreenMenu isOpen={ui.menu} close={() => updateUi('menu', false)} sVariant={sVariant} />
      
      <main>
        <HeroSection sVariant={sVariant} />
        <StorySection />
        
        <section className="py-24 md:py-32 border-y border-[var(--c-brd)] bg-[#050505] overflow-hidden flex items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-bg)] via-transparent to-[var(--c-bg)] z-10 pointer-events-none" />
          <div className="w-full whitespace-nowrap"><div className="anim-mq"><span className="f-serif text-[12vw] txt-out uppercase tracking-tighter mr-8 opacity-40">Single Origin • Slow Pour • Handcrafted • </span><span className="f-serif text-[12vw] txt-out uppercase tracking-tighter opacity-40">Single Origin • Slow Pour • Handcrafted • </span></div></div>
        </section>

        <CurationsSection addCart={addCart} sVariant={sVariant} />
        <AtmosphereSection setLb={(img) => updateUi('lb', img)} sVariant={sVariant} />
        <ReservationSection sVariant={sVariant} />
      </main>

      {/* Cart Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#050505] border-l border-[var(--c-brd)] z-[1000] shadow-2xl transform transition-transform duration-700 flex flex-col ${ui.cart ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b border-[var(--c-brd)] flex justify-between items-center bg-[#020202]">
          <h2 className="f-serif text-2xl text-white">Receipt</h2>
          <button onClick={() => updateUi('cart', false)} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')} className="text-[var(--c-mut)] hover:text-white transition-colors bg-transparent border-none"><X size={24} strokeWidth={1} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-bar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--c-mut)] opacity-50 space-y-4">
              <Coffee size={32} strokeWidth={1} />
              <p className="text-[10px] uppercase tracking-widest">Empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-6 items-center group">
                <img src={item.img} alt={item.n} className="w-20 h-24 object-cover filter grayscale-[30%] border border-[var(--c-brd)]" />
                <div className="flex-1">
                  <h4 className="f-serif text-lg text-white mb-1">{item.n}</h4>
                  <p className="text-[10px] text-[var(--c-mut)] tracking-widest uppercase mb-2">Qty: {item.qty}</p>
                  <p className="text-sm font-mono text-white/80">{fmt(item.p * item.qty)}</p>
                </div>
                <button onClick={() => rmCart(item.id)} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')} className="text-[9px] uppercase tracking-[0.2em] text-[var(--c-mut)] hover:text-red-500 transition-colors bg-transparent border-none">Remove</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-8 border-t border-[var(--c-brd)] bg-[#020202]">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--c-brd)]">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--c-mut)]">Total</span>
              <span className="font-mono text-xl text-white">{fmt(tot)}</span>
            </div>
            <button onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')} className="w-full bg-white text-black py-5 uppercase text-[10px] tracking-[0.3em] font-semibold hover:bg-[var(--c-gld)] transition-colors border-none">Checkout</button>
          </div>
        )}
      </div>
      {ui.cart && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] transition-opacity" onClick={() => updateUi('cart', false)} />}

      {/* Lightbox Modal */}
      {ui.lb && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-12" onClick={() => updateUi('lb', null)}>
          <button className="absolute top-8 right-8 text-[var(--c-mut)] hover:text-white transition-colors bg-transparent border-none" onClick={() => updateUi('lb', null)} onMouseEnter={() => sVariant('hover')} onMouseLeave={() => sVariant('default')}><X size={32} strokeWidth={1} /></button>
          <img src={ui.lb} alt="Enlarged view" className="max-w-full max-h-[90vh] object-contain shadow-2xl animate-[scaleIn_0.6s_cubic-bezier(0.19,1,0.22,1)]" />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#020202] pt-32 pb-12 border-t border-[var(--c-brd)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03] z-0"><h1 className="f-serif text-[30vw] leading-none tracking-tighter uppercase text-white">Senja</h1></div>
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 mb-32">
           <div className="md:col-span-5 space-y-8"><a href="#" className="f-serif text-4xl tracking-[0.2em] uppercase block text-white">Senja.</a><p className="text-[var(--c-mut)] text-sm max-w-sm font-light leading-relaxed">A sanctuary for the senses. Where time slows down, shadows lengthen, and every pour tells a meticulous story.</p></div>
           <div className="md:col-span-3 md:col-start-7 space-y-6"><h4 className="text-[9px] uppercase tracking-[0.4em] text-[var(--c-mut)] border-b border-[var(--c-brd)] pb-4 inline-block">Location</h4><p className="text-sm text-white font-light leading-loose">Jl. Senopati No. 88<br/>Jakarta Selatan, 12190<br/>Indonesia</p><a href="#" className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--c-gld)] hover:text-white transition-colors mt-4"><MapPin size={12} /> Directions</a></div>
           <div className="md:col-span-2 md:col-start-11 space-y-6">
             <h4 className="text-[9px] uppercase tracking-[0.4em] text-[var(--c-mut)] border-b border-[var(--c-brd)] pb-4 inline-block">Social</h4>
             <ul className="space-y-4">
               <li><a href="#" className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[var(--c-gld)] transition-colors flex items-center gap-3"><InstagramIcon /> Instagram</a></li>
               <li><a href="#" className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[var(--c-gld)] transition-colors flex items-center gap-3"><TwitterIcon /> Twitter</a></li>
             </ul>
           </div>
        </div>
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[var(--c-brd)] text-[9px] tracking-[0.3em] uppercase text-[var(--c-mut)]">
          <p>&copy; {new Date().getFullYear()} Kopi Senja.</p>
          <div className="flex gap-8 mt-4 md:mt-0"><a href="#" className="hover:text-white transition-colors">Privacy</a><a href="#" className="hover:text-white transition-colors">Terms</a></div>
        </div>
      </footer>
    </div>
  );
}