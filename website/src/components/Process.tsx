import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const phases = [
  {
    num: "01",
    title: "THE BLUEPRINT",
    desc: "We dismantle your existing brand and rebuild its core DNA. No templates. Pure bespoke architectural planning and relentless strategy.",
    img: "/core.jpg"
  },
  {
    num: "02",
    title: "THE FORGE",
    desc: "Heavy computational engineering. We melt GPUs to forge interactive WebGL ecosystems and fluid architectures that defy standard web limitations.",
    img: "/spikes.jpg"
  },
  {
    num: "03",
    title: "THE TAKEOVER",
    desc: "We launch a digital monolith. An inescapable, high-conversion brand presence that dominates your market and permanently breaks the internet.",
    img: "/mesh.jpg"
  }
];

export function Process() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="process" className="py-16 md:py-48 px-6 md:px-24 max-w-7xl mx-auto relative z-20 pointer-events-auto">
      <div className="flex flex-col gap-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-5xl md:text-[8vw] lg:text-[4vw] leading-[1.1] font-bold uppercase tracking-tighter text-metallic mb-6">
            Our <span className="italic text-secondary">Roadmap.</span>
          </h2>
          <p className="text-zinc-400 text-xl md:text-2xl font-light max-w-2xl">
            Exactly what happens when we take over. A systematic blueprint for absolute digital dominance.
          </p>
        </motion.div>

        {/* Roadmap Interactive Rows */}
        <div ref={containerRef} className="flex flex-col w-full border-t border-white/20">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between py-12 md:py-20 border-b border-white/20 hover:border-white/60 transition-colors duration-500 cursor-none relative overflow-hidden group"
            >
              {/* Cinematic Image Reveal */}
              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <img 
                  src={phase.img} 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out mix-blend-screen opacity-20" 
                  alt={phase.title} 
                />
                {/* Gradient overlay to ensure text stays readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
              </div>

              {/* Subtle hover background slide (fallback/extra depth) */}
              <div className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 relative z-10 w-full md:w-auto mb-8 md:mb-0">
                <span className="font-display font-bold text-7xl md:text-8xl text-white/10 group-hover:text-accent transition-colors duration-500 group-hover:-translate-y-2 transform ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {phase.num}
                </span>
                <h3 className="font-display font-bold text-4xl md:text-6xl text-metallic group-hover:text-white group-hover:translate-x-4 md:group-hover:translate-x-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] uppercase tracking-tighter">
                  {phase.title}
                </h3>
              </div>

              <div className="relative z-10 md:max-w-md w-full pl-0 md:pl-8">
                <p className="text-zinc-500 text-lg md:text-xl font-light group-hover:text-zinc-200 transition-colors duration-500 leading-relaxed md:group-hover:-translate-x-4 transform ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {phase.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
