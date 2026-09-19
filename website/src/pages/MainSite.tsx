import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import { WebGLScene } from '../components/WebGLScene';
import { TextReveal } from '../components/TextReveal';
import { Magnetic } from '../components/Magnetic';
import { Preloader } from '../components/Preloader';
import { Marquee } from '../components/Marquee';
import { ProjectList } from '../components/ProjectList';
import { ScrambleText } from '../components/ScrambleText';
import { CursorText } from '../components/CursorText';
import { Expertise } from '../components/Expertise';
import { Services } from '../components/Services';
import { Process } from '../components/Process';
import { ContactModal } from '../components/ContactModal';
import { ArrowRight } from 'lucide-react';

function MainSite() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [btnMousePos, setBtnMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoverCta, setIsHoverCta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Initialize smooth scroll and restore position
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    // Restore scroll position if returning from a template
    const savedScroll = sessionStorage.getItem('mainSiteScroll');
    if (savedScroll) {
      const yPos = parseFloat(savedScroll);
      // Wait a tiny bit for the DOM to be ready, then restore
      requestAnimationFrame(() => {
        window.scrollTo(0, yPos);
        lenis.scrollTo(yPos, { immediate: true });
        // Clear it so it only applies once
        sessionStorage.removeItem('mainSiteScroll');
      });
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  const [showMesh, setShowMesh] = useState(0);

  // Intense Physics for Cursor
  const blobSpringConfig = { damping: 15, stiffness: 120, mass: 1.2 }; // Heavy, sloshing mercury
  const blobX = useSpring(0, blobSpringConfig);
  const blobY = useSpring(0, blobSpringConfig);

  const coreSpringConfig = { damping: 40, stiffness: 800, mass: 0.1 }; // Instant snap
  const coreX = useSpring(0, coreSpringConfig);
  const coreY = useSpring(0, coreSpringConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      blobX.set(e.clientX - 32);
      blobY.set(e.clientY - 32);
      coreX.set(e.clientX - 3);
      coreY.set(e.clientY - 3);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [blobX, blobY, coreX, coreY]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      <motion.div 
        ref={containerRef} 
        className="relative w-full min-h-[400vh] text-primary cursor-none selection:bg-accent selection:text-metallic bg-transparent"
      >
        
        {/* Melting Metallic Cursor */}
        <motion.div 
          className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[100] flex items-center justify-center melting-cursor hidden md:flex"
          style={{ x: blobX, y: blobY }}
          animate={{ scale: isHoverCta ? 0 : (isHovering ? 2.5 : 1), opacity: isHoverCta ? 0 : 1 }}
          transition={{ scale: { type: "spring", stiffness: 200, damping: 20, mass: 0.1 } }}
        >
          <CursorText isHovering={isHovering && !isHoverCta} />
        </motion.div>
        
        {/* Cursor Core */}
        <motion.div 
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[101] mix-blend-difference hidden md:block"
          style={{ x: coreX, y: coreY }}
          animate={{ scale: isHovering ? 0 : 1 }}
          transition={{ scale: { type: "spring", stiffness: 700, damping: 30, mass: 0.1 } }}
        />

        {/* 3D WebGL Background (Transitions between images based on scroll, with an override for the mesh panel) */}
        <motion.div className="fixed inset-0 z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 1], fov: 45 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <WebGLScene mouseX={mousePos.x} mouseY={mousePos.y} scrollProgress={scrollProgress} showMesh={showMesh} />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Nav (Outside skewed container so it remains truly fixed) */}
        <nav className="fixed top-0 w-full px-6 md:px-6 py-4 md:px-12 md:py-6 md:py-8 flex justify-between items-center  z-50 pointer-events-none">
          <Magnetic>
            <div className="font-display font-bold text-2xl tracking-tighter uppercase pointer-events-auto cursor-none">
              Forgelync.
            </div>
          </Magnetic>
          <div className="flex gap-8 items-center pointer-events-auto">
            <div className="hidden md:flex gap-12 items-center">
              {[
                { name: 'Studio', href: '#studio' },
                { name: 'Manifesto', href: '#manifesto' },
                { name: 'Architectures', href: '#architectures' }
              ].map((item) => (
                <Magnetic key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-xs font-bold tracking-[0.2em] uppercase hover:text-accent transition-colors cursor-none"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.querySelector(item.href);
                      if (target) {
                        window.scrollTo({
                          top: target.getBoundingClientRect().top + window.scrollY,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  >
                    {item.name}
                  </a>
                </Magnetic>
              ))}
            </div>
            <Magnetic>
              <button 
                className="group relative overflow-hidden flex items-center justify-center border border-white/40 bg-white/5 backdrop-blur-md text-white hover:text-black hover:border-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] px-6 py-3 md:px-8 md:py-3.5 rounded-full font-sans text-[13px] uppercase tracking-widest font-black cursor-none"
                style={{ transform: 'translateZ(0)' }}
                onMouseEnter={() => setIsHoverCta(true)}
                onMouseLeave={() => setIsHoverCta(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setBtnMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onClick={() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                  });
                }}
              >
                <span className="relative z-10 transition-colors duration-700">Initiate</span>
                {/* Inner clipped liquid metal puddle - replaced with sharp vector circle */}
                <motion.div 
                  className="absolute pointer-events-none bg-white z-0"
                  animate={{ 
                    x: btnMousePos.x - 100, 
                    y: btnMousePos.y - 100,
                    scale: isHoverCta ? 3 : 0,
                    opacity: isHoverCta ? 1 : 0
                  }}
                  style={{ width: 200, height: 200, top: 0, left: 0, borderRadius: '50%' }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </button>
            </Magnetic>
          </div>
        </nav>

        {/* Content Layers */}
        <motion.div className="relative z-10 pointer-events-none">

          {/* S1: Hero */}
          <section id="studio" className="h-[100vh] flex flex-col justify-center px-8 md:px-16 max-w-[1800px] mx-auto pointer-events-none ">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={!loading ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="font-serif italic font-light text-white/50 text-2xl md:text-3xl mb-8 tracking-wide"
            >
              Redefining Digital Physics
            </motion.div>
            <motion.div 
              style={{
                x: (mousePos.x - window.innerWidth / 2) * -0.05,
                y: (mousePos.y - window.innerHeight / 2) * -0.05
              }}
              className="py-4 w-full"
            >
              <h1 className="font-display font-bold text-[13vw] md:text-[14vw] leading-[1.1] tracking-tighter text-metallic">
                {!loading && <TextReveal text="Digital" delay={0.2} />}
              </h1>
              <h1 className="font-display font-bold text-[12vw] md:text-[13vw] leading-[1.1] tracking-tighter text-metallic md:indent-[4vw]">
                {!loading && <TextReveal text="Masterpieces." delay={0.4} />}
              </h1>
            </motion.div>
          </section>

          {/* S2: The Shift (Manifesto) */}
          <section id="manifesto" className="h-[150vh] flex flex-col justify-center px-8 md:px-24 max-w-7xl mx-auto text-right pointer-events-none relative z-20">
            <div className="ml-auto md:w-3/4 flex flex-col gap-12 py-8">
              <h2 className="font-display font-bold text-[8vw] md:text-8xl leading-[1.1] tracking-tighter  text-metallic pb-4">
                <ScrambleText text="We don't build" />
                <br/>
                <span className="italic font-serif font-light text-secondary">
                  <ScrambleText text="websites." delay={0.3} />
                </span>
              </h2>
              <p className="text-zinc-300 text-xl md:text-3xl font-normal leading-relaxed max-w-2xl ml-auto ">
                We engineer digital monopolies. We don't just design graphics; we architect high-converting WebGL ecosystems and absolute brand authority. If you want a template, look elsewhere. If you want to dominate your industry, command premium pricing, and permanently break the internet—you've found your partner.
              </p>
            </div>
          </section>
        </motion.div>

        {/* New Horizontal Expertise Section - Out in the open for guaranteed sticky behavior */}
        <Expertise />

        {/* Services Section */}
        <Services setShowMesh={setShowMesh} />

        {/* Project List (Live Architectures) */}
        <motion.div className="relative z-10 pointer-events-none">
          <section id="architectures" className="relative z-30 px-8 bg-transparent">
            <ProjectList setIsHovering={setIsHovering} />
          </section>

          {/* Roadmap / Process Section */}
          <Process />

        {/* Marquee Section */}
          <section className="py-24 pointer-events-auto  overflow-hidden text-transparent" style={{ WebkitTextStroke: '2px white' }}>
             <Marquee baseVelocity={-2}>ENGINEERING DIGITAL MONOPOLIES</Marquee>
             <Marquee baseVelocity={2}>UNCOMPROMISING BRAND ARCHITECTURE</Marquee>
          </section>

          {/* S3: Call to Action (Shader is now fully on the Silk image) */}
          <section className="h-[150vh] flex flex-col justify-end pb-16 md:pb-32 px-8 md:px-24 max-w-7xl mx-auto pointer-events-none relative z-20 ">
            <div className="flex flex-col gap-16 py-8">
              <h2 className="font-display font-bold text-[10vw] leading-[1.1] tracking-tighter text-metallic pb-4">
                Ready to break<br/>
                <span className="italic font-serif font-light text-secondary">the internet?</span>
              </h2>
              
              <div className="flex items-center gap-12 pointer-events-auto">
                <Magnetic>
                  <button 
                    onClick={() => setIsContactOpen(true)}
                    className="group relative px-6 py-4 md:px-12 md:py-6 border border-white/30 overflow-hidden cursor-none bg-transparent"
                    style={{ transform: 'translateZ(0)' }}
                    onMouseEnter={() => setIsHoverCta(true)}
                    onMouseLeave={() => setIsHoverCta(false)}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setBtnMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-6 font-mono text-sm tracking-[0.3em] uppercase font-bold text-white transition-colors duration-700 group-hover:text-background">
                      START PROJECT
                      <ArrowRight size={16} className="group-hover:translate-x-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    </span>
                    
                    {/* Inner clipped liquid metal puddle - replaced with sharp vector circle */}
                    <motion.div 
                      className="absolute pointer-events-none bg-white z-0"
                      animate={{ 
                        x: btnMousePos.x - 200, 
                        y: btnMousePos.y - 200,
                        scale: isHoverCta ? 3 : 0,
                        opacity: isHoverCta ? 1 : 0
                      }}
                      style={{ width: 400, height: 400, top: 0, left: 0, borderRadius: '50%' }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                  </button>
                </Magnetic>
              </div>
            </div>
          </section>

          <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </motion.div>
      </motion.div>
    </>
  );
}

export default MainSite;
