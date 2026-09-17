import { motion } from 'framer-motion';

const services = [
  { num: "01", title: "DIGITAL ARCHITECTURE", desc: "We construct bespoke web applications with uncompromising structural integrity. Performance meets award-winning design." },
  { num: "02", title: "WEBGL & SHADERS", desc: "Melting GPUs with 60fps cinematic 3D experiences, custom GLSL pipelines, and real-time physics." },
  { num: "03", title: "MOTION IDENTITY", desc: "Physics-based interaction design that feels alive. We don't just move pixels, we give them weight and intent." },
  { num: "04", title: "E-COMMERCE IMMERSION", desc: "High-conversion platforms wrapped in brutalist aesthetics. Sell out of stock while breaking the internet." }
];

export function Services() {
  return (
    <section className="py-32 md:py-48 px-8 md:px-24 max-w-7xl mx-auto relative z-20 pointer-events-auto ">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
        
        {/* Header Column */}
        <div className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-48"
          >
            <h2 className="font-display text-[8vw] lg:text-[4vw] leading-[0.8] font-bold uppercase tracking-tighter text-metallic mb-8">
              Core<br/><span className="italic text-secondary">Competencies.</span>
            </h2>
            <p className="text-zinc-300 text-xl font-normal">
              Our studio operates at the absolute edge of web capabilities. We do not do standard.
            </p>
          </motion.div>
        </div>

        {/* List Column */}
        <div className="lg:w-2/3 flex flex-col w-full">
          {services.map((srv, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col py-12 border-b border-white/20 cursor-none"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8 w-full">
                <span className="font-mono text-xl text-white/30 group-hover:text-accent transition-colors duration-500">
                  {srv.num}
                </span>
                <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-metallic group-hover:text-accent group-hover:translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {srv.title}
                </h3>
              </div>
              <div className="overflow-hidden h-0 group-hover:h-auto group-hover:mt-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100">
                <p className="text-zinc-300 font-normal text-xl md:text-2xl max-w-2xl md:ml-[3.25rem] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 ease-out">
                  {srv.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
