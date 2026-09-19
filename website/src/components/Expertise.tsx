import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Expertise() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // 5 panels = 500vw width, so we need to move by -80% to reach the end
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section ref={sectionRef} className="h-[500vh] relative z-20 pointer-events-auto">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex w-[500vw] h-full items-center">
          
          {/* Panel 1: Intro Text */}
          <div className="w-[100vw] flex-shrink-0 h-full flex flex-col justify-center px-8 md:px-24 ">
            <h2 className="font-display text-5xl md:text-[8vw] font-bold leading-[0.9] tracking-tighter uppercase mb-8 text-metallic pb-4">
              Brand<br/><span className="text-secondary italic">Architecture.</span>
            </h2>
            <p className="text-2xl md:text-4xl font-normal max-w-3xl text-zinc-300 leading-relaxed">
              We don't just build websites; we build scalable revenue engines. From bulletproof strategy to hyper-immersive WebGL environments, we ensure every pixel drives conversion and solidifies your market authority.
            </p>
          </div>

          {/* Panel 2: Spikes (Massive) */}
          <div className="w-[100vw] flex-shrink-0 h-full flex items-center justify-center px-4 md:px-12">
            <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
              <motion.img 
                src="/spikes.jpg" 
                alt="Chrome Spikes" 
                className="w-full h-full object-cover grayscale"
                style={{ scale: useTransform(scrollYProgress, [0.1, 0.4], [1.8, 1.1]) }}
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              <h3 className="absolute bottom-12 left-12 font-display text-4xl md:text-7xl font-bold uppercase tracking-widest text-metallic ">
                Uncompromising Architecture
              </h3>
            </div>
          </div>

          {/* Panel 3: Monolith (Massive) */}
          <div className="w-[100vw] flex-shrink-0 h-full flex items-center justify-center px-4 md:px-12">
            <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
              <motion.img 
                src="/monolith.jpg" 
                alt="Cyber Monolith" 
                className="w-full h-full object-cover"
                style={{ scale: useTransform(scrollYProgress, [0.3, 0.6], [1.8, 1.1]) }}
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              <h3 className="absolute top-12 right-12 font-display text-4xl md:text-7xl font-bold uppercase tracking-widest text-metallic  text-right">
                Absolute<br/>Authority
              </h3>
            </div>
          </div>

          {/* Panel 4: Text + Core (Split massive) */}
          <div className="w-[100vw] flex-shrink-0 h-full flex flex-col md:flex-row items-center justify-center px-8 md:px-12 gap-12">
            <div className="flex-1 ">
              <h2 className="font-display text-5xl md:text-[8vw] font-bold leading-[0.9] tracking-tighter uppercase mb-8 text-metallic pb-4">
                The<br/><span className="text-secondary italic">Asset.</span>
              </h2>
              <p className="text-2xl md:text-4xl font-normal max-w-2xl text-zinc-300 leading-relaxed">
                Your brand is your ultimate financial asset. We don't do fragmented services. We fuse elite strategy and motion design into a singular ecosystem built to close deals before you even speak.
              </p>
            </div>
            <div className="flex-1 h-[60vh] md:h-[85vh] w-full overflow-hidden">
              <motion.img 
                src="/core.jpg" 
                alt="Glass Core" 
                className="w-full h-full object-cover"
                style={{ 
                  scale: useTransform(scrollYProgress, [0.5, 0.8], [1.8, 1.1]),
                  rotate: useTransform(scrollYProgress, [0.5, 0.8], [0, 10])
                }}
              />
            </div>
          </div>

          {/* Panel 5: Chrome Mesh (Full Bleed) */}
          <div className="w-[100vw] flex-shrink-0 h-full relative overflow-hidden">
            <motion.img 
              src="/mesh.jpg" 
              alt="Chrome Mesh" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ scale: useTransform(scrollYProgress, [0.7, 1], [1.5, 1]) }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
              <h3 className="font-display text-[10vw] font-bold uppercase tracking-tighter text-metallic ">
                Neural Networks
              </h3>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
