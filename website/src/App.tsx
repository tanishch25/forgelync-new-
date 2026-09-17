import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useTransform, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import { WebGLScene } from './components/WebGLScene';
import { TextReveal } from './components/TextReveal';
import { Magnetic } from './components/Magnetic';
import { Preloader } from './components/Preloader';
import { Marquee } from './components/Marquee';
import { ProjectList } from './components/ProjectList';
import { ScrambleText } from './components/ScrambleText';
import { CursorText } from './components/CursorText';
import { Expertise } from './components/Expertise';
import { Services } from './components/Services';
import { ArrowRight } from 'lucide-react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [btnMousePos, setBtnMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoverCta, setIsHoverCta] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize smooth scroll
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

  // Panel 5 (Neural Network) is visible during the expertise horizontal scroll.
  // It is the very last panel. We trigger the background override only when it's fully in view.
  const showMeshTransform = useTransform(
    scrollYProgress,
    [0.55, 0.6, 0.7, 0.75],
    [0, 1, 1, 0]
  );
  
  const [showMesh, setShowMesh] = useState(0);
  useMotionValueEvent(showMeshTransform, "change", (latest) => {
    setShowMesh(latest);
  });

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
          className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[100] flex items-center justify-center melting-cursor"
          style={{ x: blobX, y: blobY }}
          animate={{ scale: isHoverCta ? 0 : (isHovering ? 2.5 : 1), opacity: isHoverCta ? 0 : 1 }}
          transition={{ scale: { type: "spring", stiffness: 200, damping: 20, mass: 0.1 } }}
        >
          <CursorText isHovering={isHovering && !isHoverCta} />
        </motion.div>
        
        {/* Cursor Core */}
        <motion.div 
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[101] mix-blend-difference"
          style={{ x: coreX, y: coreY }}
          animate={{ scale: isHovering ? 0 : 1 }}
          transition={{ scale: { type: "spring", stiffness: 700, damping: 30, mass: 0.1 } }}
        />

        {/* 3D WebGL Background (Transitions between images based on scroll, with an override for the mesh panel) */}
        <motion.div className="fixed inset-0 z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 1], fov: 45 }}>
            <Suspense fallback={null}>
              <WebGLScene mouseX={mousePos.x} mouseY={mousePos.y} scrollProgress={scrollProgress} showMesh={showMesh} />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Nav (Outside skewed container so it remains truly fixed) */}
        <nav className="fixed top-0 w-full px-8 md:px-12 py-8 flex justify-between items-center  z-50 pointer-events-none">
          <Magnetic>
            <div className="font-display font-bold text-2xl tracking-tighter uppercase pointer-events-auto cursor-none">
              Forgelync.
            </div>
          </Magnetic>
          <div className="flex gap-12 items-center pointer-events-auto">
            {[
              { name: 'Studio', href: '#studio' },
              { name: 'Manifesto', href: '#manifesto' },
              { name: 'Archive', href: '#archive' }
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
            >
              <h1 className="font-display font-bold text-[16vw] leading-[0.75] tracking-tighter text-metallic">
                {!loading && <TextReveal text="Digital" delay={0.2} />}
              </h1>
              <h1 className="font-display font-bold text-[16vw] leading-[0.75] tracking-tighter text-metallic md:indent-[12vw]">
                {!loading && <TextReveal text="Masterpieces." delay={0.4} />}
              </h1>
            </motion.div>
          </section>

          {/* S2: The Shift (Manifesto) */}
          <section id="manifesto" className="h-[150vh] flex flex-col justify-center px-8 md:px-24 max-w-7xl mx-auto text-right pointer-events-none relative z-20">
            <div className="ml-auto md:w-3/4 flex flex-col gap-12">
              <h2 className="font-display font-bold text-[8vw] md:text-8xl leading-[0.85] tracking-tighter  text-metallic">
                <ScrambleText text="We don't build" />
                <br/>
                <span className="italic font-serif font-light text-secondary">
                  <ScrambleText text="templates." delay={0.3} />
                </span>
              </h2>
              <p className="text-zinc-300 text-xl md:text-3xl font-normal leading-relaxed max-w-2xl ml-auto ">
                We engineer immersive visual ecosystems for brands that demand to be remembered. By blending advanced WebGL shaders, cinematic motion, and brutalist typography, we construct web experiences that leave a permanent mark.
              </p>
            </div>
          </section>
        </motion.div>

        {/* New Horizontal Expertise Section - Out in the open for guaranteed sticky behavior */}
        <Expertise />

        {/* Services Section */}
        <Services />

        {/* Project List and Marquee */}
        <motion.div className="relative z-10 pointer-events-none">
          {/* Project List Section */}
          <section id="archive" className="relative z-30 px-8 bg-transparent">
            <ProjectList setIsHovering={setIsHovering} />
          </section>

          {/* Marquee Section */}
          <section className="py-24 pointer-events-auto  overflow-hidden text-transparent" style={{ WebkitTextStroke: '2px white' }}>
             <Marquee baseVelocity={-2}>AWWWARDS LEVEL CRAZY SHIT</Marquee>
             <Marquee baseVelocity={2}>BREAKING THE MIND SINCE 2026</Marquee>
          </section>

          {/* S3: Call to Action (Shader is now fully on the Silk image) */}
          <section className="h-[150vh] flex flex-col justify-end pb-32 px-8 md:px-24 max-w-7xl mx-auto pointer-events-none relative z-20 ">
            <div className="flex flex-col gap-16">
              <h2 className="font-display font-bold text-[12vw] leading-[0.8] tracking-tighter text-metallic">
                Ready to break<br/>
                <span className="italic font-serif font-light text-secondary">the internet?</span>
              </h2>
              
              <div className="flex items-center gap-12 pointer-events-auto">
                <Magnetic>
                  <button 
                    className="group relative px-12 py-6 border border-white/30 overflow-hidden cursor-none bg-transparent"
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
                    
                    {/* Inner clipped liquid metal puddle */}
                    <motion.div 
                      className="absolute pointer-events-none melting-cursor z-0"
                      animate={{ 
                        x: btnMousePos.x - 32, 
                        y: btnMousePos.y - 32,
                        scale: isHoverCta ? 25 : 0,
                        opacity: isHoverCta ? 1 : 0
                      }}
                      style={{ width: 64, height: 64, top: 0, left: 0, borderRadius: '50%' }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                  </button>
                </Magnetic>
              </div>
            </div>
          </section>

        </motion.div>
      </motion.div>
    </>
  );
}

export default App;
