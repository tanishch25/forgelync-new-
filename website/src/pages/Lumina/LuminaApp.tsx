import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import Lenis from 'lenis';
import { PerfumeScene } from './PerfumeScene';
import { GlobalExit } from '../../components/GlobalExit';

function LoadingScreen() {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  // Safety fallback in case useProgress misses the cache hit
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-[#FCFAF8] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <div className="font-serif text-4xl mb-6 tracking-[0.3em] uppercase text-[#1A1918]">Lumina</div>
            <div className="w-64 h-[1px] bg-[#1A1918]/10 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#C4A358]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
            <div className="mt-6 font-sans text-[9px] tracking-[0.4em] text-[#1A1918]/60 uppercase font-bold">
              {progress < 100 ? `Extracting Essence — ${Math.round(progress)}%` : 'Ready'}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LuminaApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Force instant scroll to top before Lenis mounts to avoid page flying up
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;

    // Smooth scrolling setup
    const lenis = new Lenis({
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Navbar theme setup
    const handleScroll = () => {
      const footer = document.getElementById('lumina-footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        // If the top of the footer is above the middle of the screen
        if (rect.top <= window.innerHeight * 0.5) {
          setNavTheme('dark');
        } else {
          setNavTheme('light');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full bg-[#FCFAF8] text-[#1A1918] selection:bg-[#E6A845] selection:text-white font-sans"
    >
      <GlobalExit />
      <LoadingScreen />

      {/* Cinematic Film Grain Overlay (Fixed CSS blend glitch) */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Awwwards-Tier Navbar with Dynamic Color Theme */}
      <nav className={`fixed top-0 left-0 w-full px-8 md:px-12 py-6 flex justify-between items-center z-[100] backdrop-blur-md pointer-events-auto transition-all duration-700 ${navTheme === 'dark' ? 'bg-[#1A1918]/80 text-[#F8F6F0] border-b border-[#F8F6F0]/10' : 'bg-[#FCFAF8]/30 text-[#1A1918] border-b border-[#1A1918]/5'}`}>
        <div 
          className="font-serif font-medium text-2xl tracking-[0.3em] uppercase cursor-pointer hover:text-[#C4A358] transition-colors duration-500" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          Lumina
        </div>
        <div className="hidden md:flex gap-12 font-sans text-[11px] tracking-[0.3em] uppercase font-bold items-center">
          <button onClick={() => window.scrollTo({top: window.innerHeight * 1.0, behavior: 'smooth'})} className="hover:text-[#C4A358] transition-colors duration-300">The Glass</button>
          <button onClick={() => window.scrollTo({top: window.innerHeight * 2.0, behavior: 'smooth'})} className="hover:text-[#C4A358] transition-colors duration-300">The Essence</button>
          <button onClick={() => document.getElementById('boutique')?.scrollIntoView({behavior: 'smooth'})} className={`border px-6 py-3 transition-all duration-500 ease-out ${navTheme === 'dark' ? 'border-[#F8F6F0]/20 hover:bg-[#F8F6F0] hover:text-[#1A1918]' : 'border-[#1A1918]/20 hover:bg-[#1A1918] hover:text-[#FCFAF8]'}`}>Boutique</button>
        </div>
      </nav>

      {/* 400vh Container for Scroll-bound 3D Scene */}
      <div ref={containerRef} className="relative w-full h-[400vh]" style={{ background: 'radial-gradient(circle at 50% 0%, #FFFFFF 0%, #FAF8F2 40%, #EFEBE0 100%)' }}>
        
        {/* Sticky 3D Product Viewer - Stops at 400vh! */}
        <div className="sticky top-0 h-screen w-full z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <PerfumeScene />
            </Suspense>
          </Canvas>
        </div>

        {/* Content Story Layers (Absolute over the 400vh container) */}
        <div className="absolute top-0 left-0 w-full z-10 pointer-events-none mix-blend-multiply">
          
          {/* S1: Hero Title */}
          <section className="h-screen flex flex-col items-center justify-start pt-[22vh] px-8 text-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <h2 className="font-sans text-xs font-bold tracking-[0.5em] uppercase mb-8 text-[#8B7355]">
                The Signature Scent
              </h2>
              <h1 className="font-serif text-[18vw] md:text-[14vw] leading-none tracking-tighter font-light">
                L'ESSENCE
              </h1>
            </motion.div>
          </section>

          {/* S2: The Glass (Offset Left) */}
          <section className="h-screen flex flex-col justify-center px-8 md:px-24 max-w-7xl mx-auto pointer-events-none">
            <div className="max-w-md md:mr-auto">
              <motion.h3 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl font-serif leading-tight font-light mb-8"
              >
                Mastery of <br/>
                <span className="italic text-[#8B7355]">Form.</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="text-xs font-sans text-[#5A554C] leading-[2em] font-bold uppercase tracking-[0.2em]"
              >
                Heavy crystal glass. Hand-polished to flawless transparency. The vessel itself is a work of architectural precision, designed to hold liquid gold.
              </motion.p>
            </div>
          </section>

          {/* S3: The Essence (Offset Right) */}
          <section className="h-screen flex flex-col justify-center px-8 md:px-24 max-w-7xl mx-auto items-end pointer-events-none text-right">
            <div className="max-w-md md:ml-auto">
              <motion.h3 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl font-serif leading-tight font-light mb-8"
              >
                Liquid <br/>
                <span className="italic text-[#8B7355]">Gold.</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="text-xs font-sans text-[#5A554C] leading-[2em] font-bold uppercase tracking-[0.2em]"
              >
                Rare amber, Madagascar vanilla, and smoky cedarwood. A fragrance profile that lingers like a permanent memory.
              </motion.p>
            </div>
          </section>

          {/* S4: CTA */}
          <section className="h-screen flex flex-col items-center justify-end pb-[15vh] px-8 text-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <h1 className="font-serif text-[12vw] md:text-[8vw] leading-none tracking-tighter font-light mb-16">
                EXPERIENCE IT.
              </h1>
              <button className="pointer-events-auto font-sans text-xs font-bold tracking-[0.3em] uppercase border-b border-[#2C2A26] pb-3 hover:text-[#8B7355] hover:border-[#8B7355] transition-colors duration-500">
                Pre-order the Collection
              </button>
            </motion.div>
          </section>
        </div>
      </div>

      {/* S5: The Store (Crazy shopping place) */}
      <section className="relative z-20 min-h-screen bg-[#F0EBE1] pointer-events-auto py-32 overflow-hidden border-t border-[#8B7355]/20">
        
        {/* Massive Scrolling Background Typography */}
        <div className="absolute top-[20%] left-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.03]">
          <motion.div 
            animate={{ x: [0, -1000] }} 
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="text-[30vw] font-serif leading-none whitespace-nowrap"
          >
            THE BOUTIQUE • L'ESSENCE • THE BOUTIQUE • L'ESSENCE
          </motion.div>
        </div>

        <div className="max-w-[95vw] mx-auto relative z-10 px-4 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
            <div>
              <h2 className="font-sans text-xs font-bold tracking-[0.5em] uppercase mb-6 text-[#8B7355]">
                Exclusive Archive
              </h2>
              <h3 className="font-serif text-6xl md:text-8xl font-light tracking-tight leading-none">
                Curated <br/><span className="italic text-[#8B7355]">Excellence.</span>
              </h3>
            </div>
            <button className="font-sans text-xs font-bold tracking-[0.2em] uppercase border-b border-[#2C2A26] pb-1 hover:text-[#8B7355] hover:border-[#8B7355] transition-colors">
              Explore All Works
            </button>
          </div>

          {/* Asymmetrical Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            
            {/* Massive Hero Product (Left) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="md:col-span-7 group cursor-pointer relative"
            >
              <div className="relative overflow-hidden aspect-[4/5] bg-[#E8E4D8]">
                <img 
                  src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  alt="NOIR"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[2px]">
                  <button className="bg-white text-[#2C2A26] font-sans text-sm font-bold tracking-[0.3em] uppercase py-5 px-10 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 hover:bg-[#2C2A26] hover:text-white">
                    Acquire Noir
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 -translate-x-4 md:-translate-x-12 translate-y-1/2 bg-[#F0EBE1] p-8 pr-12 shadow-2xl">
                <div className="text-[10px] tracking-widest text-[#5A554C] mb-4">EDITION 01</div>
                <h4 className="font-serif text-4xl md:text-6xl mb-2 group-hover:text-[#8B7355] transition-colors">L'ESSENCE NOIR</h4>
                <span className="font-sans text-xs tracking-[0.3em] font-bold">$240 USD</span>
              </div>
            </motion.div>

            {/* Stacked Secondary Products (Right) */}
            <div className="md:col-span-5 flex flex-col gap-24 mt-32 md:mt-16">
              
              {[
                { name: "BLANC", price: "$210", edition: "02", image: "https://images.pexels.com/photos/177332/pexels-photo-177332.jpeg?auto=compress&cs=tinysrgb&w=800" },
                { name: "ROSE", price: "$260", edition: "03", image: "https://images.pexels.com/photos/258244/pexels-photo-258244.jpeg?auto=compress&cs=tinysrgb&w=800" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.3, duration: 1 }}
                  className={`group cursor-pointer flex flex-col ${i === 1 ? 'md:ml-24' : ''}`}
                >
                  <div className="relative overflow-hidden aspect-square mb-8 bg-[#E8E4D8]">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[2px]">
                      <button className="bg-white text-[#2C2A26] font-sans text-xs font-bold tracking-widest uppercase py-4 px-8 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 hover:bg-[#2C2A26] hover:text-white">
                        Add to Bag
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-b border-[#2C2A26]/20 pb-4">
                    <div>
                      <div className="text-[10px] tracking-widest text-[#5A554C] mb-2">EDITION {item.edition}</div>
                      <h4 className="font-serif text-3xl group-hover:text-[#8B7355] transition-colors">{item.name}</h4>
                    </div>
                    <span className="font-sans text-xs tracking-widest font-bold">{item.price}</span>
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* S6: Epic Footer */}
      <footer id="lumina-footer" className="relative z-20 bg-[#1A1918] text-[#F8F6F0] py-32 px-8 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 border-b border-[#F8F6F0]/10 pb-16">
          <div className="max-w-md">
            <h4 className="font-serif text-3xl mb-6">Join the Inner Circle.</h4>
            <p className="font-sans text-xs tracking-widest text-[#F8F6F0]/60 leading-relaxed mb-8">
              Subscribe to receive exclusive access to limited editions, private events, and the Lumina journal.
            </p>
            <div className="flex border-b border-[#F8F6F0]/30 pb-2">
              <input type="email" placeholder="Email Address" className="bg-transparent outline-none font-sans text-xs tracking-widest w-full text-[#F8F6F0] placeholder-[#F8F6F0]/40" />
              <button className="font-sans text-xs tracking-[0.2em] font-bold hover:text-[#8B7355] transition-colors">SUBMIT</button>
            </div>
          </div>
          
          <div className="flex gap-16 font-sans text-xs tracking-widest uppercase">
            <div className="flex flex-col gap-4">
              <span className="text-[#8B7355] font-bold mb-2">Explore</span>
              <a href="#" className="hover:text-[#F8F6F0]/60 transition-colors">The House</a>
              <a href="#" className="hover:text-[#F8F6F0]/60 transition-colors">Collections</a>
              <a href="#" className="hover:text-[#F8F6F0]/60 transition-colors">Bespoke</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#8B7355] font-bold mb-2">Legal</span>
              <a href="#" className="hover:text-[#F8F6F0]/60 transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#F8F6F0]/60 transition-colors">Terms</a>
            </div>
          </div>
        </div>
        
        {/* Massive Footer Logo */}
        <div className="max-w-7xl mx-auto pt-16 flex flex-col md:flex-row justify-between items-end">
          <h1 className="font-serif text-[20vw] md:text-[15vw] leading-[0.8] tracking-tighter font-light opacity-90">
            LUMINA
          </h1>
          <span className="font-sans text-[10px] tracking-widest text-[#F8F6F0]/40 uppercase pb-4">
            © 2026 Lumina Paris. All Rights Reserved.
          </span>
        </div>
      </footer>

    </motion.div>
  );
}
