import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';
import { CanvasScrub } from './CanvasScrub';
import { GlobalExit } from '../../components/GlobalExit';

// --- Premium Custom Cursor ---
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      setIsHovering(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a'
      );
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-[#1A1A1A] rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
        scale: isHovering ? 3 : 1,
        backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,1)"
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
    />
  );
}

export default function NexusApp() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll strictly within the Hero section (now 1200vh for 2x slower scrub)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  // Track global scroll for navbar and footer
  const { scrollYProgress: globalProgress } = useScroll();

  useMotionValueEvent(globalProgress, "change", (latest) => {
    setIsScrolled(latest > 0.01);
  });

  // Re-map 5 beats across the 0 to 1 progress of the massive 1200vh hero section
  const b1Op = useTransform(heroProgress, [0, 0.05, 0.15, 1], [1, 1, 0, 0]);
  const b1Y = useTransform(heroProgress, [0, 0.15], [0, -100]);
  const b1Rotate = useTransform(heroProgress, [0, 0.15], [0, -10]);

  const b2Op = useTransform(heroProgress, [0, 0.15, 0.25, 0.35, 1], [0, 0, 1, 0, 0]);
  const b2Y = useTransform(heroProgress, [0.15, 0.25, 0.35], [100, 0, -100]);
  const b2Skew = useTransform(heroProgress, [0.15, 0.25, 0.35], [-15, 0, 15]);

  const b3Op = useTransform(heroProgress, [0, 0.35, 0.45, 0.55, 1], [0, 0, 1, 0, 0]);
  const b3Y = useTransform(heroProgress, [0.35, 0.45, 0.55], [100, 0, -100]);
  const b3Scale = useTransform(heroProgress, [0.35, 0.45, 0.55], [0.8, 1, 1.2]);

  const b4Op = useTransform(heroProgress, [0, 0.55, 0.65, 0.75, 1], [0, 0, 1, 0, 0]);
  const b4Y = useTransform(heroProgress, [0.55, 0.65, 0.75], [100, 0, -100]);
  const b4Rotate = useTransform(heroProgress, [0.55, 0.65, 0.75], [-5, 0, 5]);

  const b5Op = useTransform(heroProgress, [0, 0.75, 0.85, 1], [0, 0, 1, 1]);
  const b5Y = useTransform(heroProgress, [0.75, 0.85, 1], [100, 0, 0]);
  const b5Scale = useTransform(heroProgress, [0.75, 0.85, 1], [0.9, 1, 1]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;

    const lenis = new Lenis({
      duration: 2.0, // Increased duration for a heavier, steadier scroll feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slows down raw wheel input
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="relative w-full bg-[#F4F4F2] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#F4F4F2] cursor-none">
      <CustomCursor />
      <GlobalExit />
      
      {/* Floating Navbar without the 'uncool' background band */}
      <motion.nav 
        animate={{ 
          paddingTop: isScrolled ? "1.5rem" : "2.5rem",
          paddingBottom: isScrolled ? "1.5rem" : "2.5rem",
        }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full px-8 md:px-16 flex justify-between items-center z-[100] pointer-events-auto text-white mix-blend-difference"
      >
        <div className="flex items-center gap-12">
          <div 
            className="font-display font-bold text-xl md:text-2xl tracking-tighter uppercase cursor-pointer"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            NEXUS
          </div>
        </div>
        <div className="hidden md:flex items-center gap-12 text-xs tracking-[0.2em] uppercase font-bold">
          <button className="hover:opacity-50 transition-opacity">VISION</button>
          <button className="hover:opacity-50 transition-opacity">PROPERTIES</button>
          <button className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all">INQUIRE</button>
        </div>
      </motion.nav>

      {/* HERO SCROLL WORLD - 1200vh for incredibly slow, steady scrubbing */}
      <div ref={heroRef} className="relative w-full h-[1200vh]">
        
        {/* Sticky Container */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#F4F4F2]">
          
          <div className="absolute inset-0 z-0">
            {/* 75 frames total, skipping 50 at start, ending before the final logo */}
            <CanvasScrub frameCount={75} startFrameOffset={50} targetRef={heroRef} />
            {/* Very subtle gradient overlay to guarantee white text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
          </div>

          <motion.section style={{ opacity: b1Op, y: b1Y, rotateX: b1Rotate, perspective: 1000 }} className="absolute inset-0 z-10 flex flex-col justify-center items-end px-8 md:px-24 pointer-events-none text-right drop-shadow-2xl">
            <div className="max-w-3xl text-white">
              <p className="font-mono text-sm tracking-[0.4em] uppercase mb-6 opacity-80">01 / The Material</p>
              <h2 className="font-serif italic text-6xl md:text-[9rem] leading-[0.85] tracking-tight">Uncompromising <br/> Foundation.</h2>
              <p className="mt-8 text-lg md:text-2xl opacity-90 font-light leading-relaxed tracking-wide ml-auto">Every surface, from hand-carved Italian travertine to aerospace-grade acoustic glass, reflects pure light and silence.</p>
            </div>
          </motion.section>

          <motion.section style={{ opacity: b2Op, y: b2Y, skewY: b2Skew }} className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-24 pointer-events-none drop-shadow-2xl">
            <div className="max-w-3xl text-white">
              <p className="font-mono text-sm tracking-[0.4em] uppercase mb-6 opacity-80">02 / The Boundary</p>
              <h2 className="font-serif italic text-6xl md:text-[9rem] leading-[0.85] tracking-tight">Seamless <br/> Flow.</h2>
              <p className="mt-8 text-lg md:text-2xl opacity-90 font-light leading-relaxed tracking-wide">Interior walls dissolve into the environment. The landscape outside becomes the living wallpaper of your sanctuary.</p>
            </div>
          </motion.section>

          <motion.section style={{ opacity: b3Op, y: b3Y, scale: b3Scale }} className="absolute inset-0 z-10 flex flex-col justify-center items-end px-8 md:px-24 pointer-events-none text-right drop-shadow-2xl">
            <div className="max-w-3xl text-white">
              <p className="font-mono text-sm tracking-[0.4em] uppercase mb-6 opacity-80">03 / The Scale</p>
              <h2 className="font-serif italic text-6xl md:text-[9rem] leading-[0.85] tracking-tight">Grand <br/> Elevations.</h2>
              <p className="mt-8 text-lg md:text-2xl opacity-90 font-light leading-relaxed tracking-wide ml-auto">Double-height ceilings and cantilevered terraces create an impossible sense of scale, defying gravity itself.</p>
            </div>
          </motion.section>

          <motion.section style={{ opacity: b4Op, y: b4Y, rotateZ: b4Rotate }} className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-24 pointer-events-none drop-shadow-2xl">
            <div className="max-w-3xl text-white">
              <p className="font-mono text-sm tracking-[0.4em] uppercase mb-6 opacity-80">04 / The Technology</p>
              <h2 className="font-serif italic text-6xl md:text-[9rem] leading-[0.85] tracking-tight">Invisible <br/> Control.</h2>
              <p className="mt-8 text-lg md:text-2xl opacity-90 font-light leading-relaxed tracking-wide">State-of-the-art climate, lighting, and security systems integrated invisibly into the architecture.</p>
            </div>
          </motion.section>

          <motion.section style={{ opacity: b5Op, y: b5Y, scale: b5Scale }} className="absolute inset-0 z-10 flex flex-col justify-center items-center px-8 md:px-24 pointer-events-auto drop-shadow-2xl">
            <div className="text-center text-white">
              <p className="font-mono text-sm tracking-[0.4em] uppercase mb-6 opacity-90">05 / The Destination</p>
              <h2 className="font-serif italic text-[9vw] leading-[0.9] tracking-tighter mb-16">Own the <br/> Horizon.</h2>
              <button onClick={() => window.scrollTo({ top: heroRef.current?.offsetHeight, behavior: 'smooth' })} className="border border-white/40 bg-black/20 backdrop-blur-md text-white px-12 py-5 text-sm tracking-[0.3em] uppercase font-bold hover:bg-white hover:text-black transition-all rounded-full shadow-2xl hover:scale-105 transform duration-500">
                Explore Properties
              </button>
            </div>
          </motion.section>

        </div>
      </div>

      {/* MASSIVE MARQUEE SEPARATOR - Inverted for light theme */}
      <div className="w-full overflow-hidden bg-[#1A1A1A] text-[#F4F4F2] py-6 whitespace-nowrap flex items-center border-y border-[#1A1A1A]">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="font-display font-bold text-5xl uppercase tracking-tighter flex gap-12"
        >
          <span>AVAILABLE NOW</span><span>&bull;</span>
          <span>PENTHOUSE SUITES</span><span>&bull;</span>
          <span>SKY VILLAS</span><span>&bull;</span>
          <span>AVAILABLE NOW</span><span>&bull;</span>
          <span>PENTHOUSE SUITES</span><span>&bull;</span>
          <span>SKY VILLAS</span><span>&bull;</span>
          <span>AVAILABLE NOW</span><span>&bull;</span>
          <span>PENTHOUSE SUITES</span><span>&bull;</span>
          <span>SKY VILLAS</span>
        </motion.div>
      </div>

      {/* CONTENT BELOW HERO (SHOP / DO MORE) - Light Theme */}
      <div className="relative w-full bg-[#F4F4F2] z-20 overflow-hidden">
        
        {/* Abstract Background Element - Minimal dark tone */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E5E5E3] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <section className="max-w-7xl mx-auto px-8 py-32 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
            <h2 className="font-display font-medium text-6xl md:text-8xl leading-[0.9] tracking-tight">The <br/>Collection</h2>
            <p className="max-w-sm text-[#2A2A28]/50 text-lg font-light leading-relaxed">
              Curated spaces designed for the absolute pinnacle of luxury living. Discover our remaining inventory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {/* Property 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer"
            >
              <div className="w-full aspect-[3/4] bg-[#EAE8E5] overflow-hidden mb-8 relative">
                {/* Premium reverse-zoom hover effect with dark overlay */}
                <img src="/frames/0050.jpg" alt="Villa 01" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700 ease-out" />
                
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-black px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full shadow-sm">Available</div>
                
                {/* Sliding UI element on hover */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[0.16,1,0.3,1]">
                  <div className="w-full bg-white/90 backdrop-blur-md text-black px-6 py-4 rounded-full flex justify-between items-center text-sm tracking-widest uppercase font-bold">
                    <span>View Property</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                  <h3 className="text-4xl font-serif italic mb-2 text-[#2A2A28]">Penthouse 01</h3>
                  <p className="text-[#2A2A28]/40 text-sm tracking-[0.2em] uppercase font-bold">West Tower</p>
                </div>
                <div className="md:text-right">
                  <p className="text-3xl font-light mb-1 text-[#2A2A28]">$8.5M</p>
                  <p className="text-[#2A2A28]/40 text-sm">4 Bed &middot; 5 Bath &middot; 4,200 sqft</p>
                </div>
              </div>
            </motion.div>

            {/* Property 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer md:mt-32"
            >
              <div className="w-full aspect-[3/4] bg-[#EAE8E5] overflow-hidden mb-8 relative">
                <img src="/frames/0120.jpg" alt="Villa 02" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700 ease-out" />
                
                <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-sm text-white px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full shadow-sm">Reserved</div>

                <div className="absolute bottom-6 left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[0.16,1,0.3,1]">
                  <div className="w-full bg-white/90 backdrop-blur-md text-black px-6 py-4 rounded-full flex justify-between items-center text-sm tracking-widest uppercase font-bold">
                    <span>View Property</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                  <h3 className="text-4xl font-serif italic mb-2 text-[#2A2A28]">Sky Villa 04</h3>
                  <p className="text-[#2A2A28]/40 text-sm tracking-[0.2em] uppercase font-bold">East Tower</p>
                </div>
                <div className="md:text-right">
                  <p className="text-3xl font-light mb-1 text-[#2A2A28]">$12.2M</p>
                  <p className="text-[#2A2A28]/40 text-sm">5 Bed &middot; 6 Bath &middot; 6,100 sqft</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Architectural Footer */}
        <footer className="w-full relative overflow-hidden bg-[#EAE8E5] border-t border-[#1A1A1A]/10">
          
          <div className="px-8 md:px-12 py-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#1A1A1A]/50">Architectural Masterpiece</span>
              <h3 className="font-serif italic text-3xl md:text-5xl text-[#1A1A1A]">The Pinnacle of <br/> Modern Living.</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 text-xs tracking-[0.2em] uppercase font-bold text-[#1A1A1A]">
              <div className="flex flex-col gap-4">
                <span className="text-[#1A1A1A]/40 mb-2">Social</span>
                <a href="#" className="hover:text-black transition-colors">Instagram</a>
                <a href="#" className="hover:text-black transition-colors">Twitter</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#1A1A1A]/40 mb-2">Professional</span>
                <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-black transition-colors">ArchDaily</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#1A1A1A]/40 mb-2">Inquiries</span>
                <a href="#" className="hover:text-black transition-colors">Sales</a>
                <a href="#" className="hover:text-black transition-colors">Press</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#1A1A1A]/40 mb-2">Legal</span>
                <a href="#" className="hover:text-black transition-colors">Privacy</a>
                <a href="#" className="hover:text-black transition-colors">Terms</a>
              </div>
            </div>
          </div>

          {/* Massive Full-Bleed Logo */}
          <div className="w-full overflow-hidden flex justify-center items-end mt-12 pb-4">
            <h2 className="font-display font-bold text-[28vw] leading-[0.75] tracking-tighter uppercase text-[#1A1A1A] select-none">
              NEXUS
            </h2>
          </div>
          
          <div className="w-full border-t border-[#1A1A1A]/10 px-8 py-6 flex justify-between items-center text-[10px] text-[#1A1A1A]/40 tracking-widest uppercase font-mono">
            <span>&copy; 2026 Nexus Residences.</span>
            <span>All rights reserved.</span>
          </div>
        </footer>
      </div>
      
    </div>
  );
}
