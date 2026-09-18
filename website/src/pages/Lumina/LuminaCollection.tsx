import { motion } from 'framer-motion';

const DUMMY_IMAGES = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop', // Fashion model
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2187&auto=format&fit=crop', // Couture
  'https://images.unsplash.com/photo-1509631179647-0c952806c9a0?q=80&w=2048&auto=format&fit=crop', // Silk
];

export function LuminaCollection() {
  return (
    <section className="py-32 px-8 md:px-16 max-w-7xl mx-auto pointer-events-auto">
      <div className="flex flex-col gap-32">
        {DUMMY_IMAGES.map((src, index) => (
          <div 
            key={index} 
            className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="w-full md:w-1/2 overflow-hidden aspect-[3/4]">
              <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                src={src} 
                alt={`Collection 0${index + 1}`}
                className="w-full h-full object-cover filter contrast-125 saturate-50"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <motion.h3 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-serif text-4xl md:text-6xl text-lumina-text mb-6 font-light"
              >
                Look 0{index + 1}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="font-sans text-sm tracking-[0.2em] uppercase text-lumina-text/60 leading-relaxed max-w-sm"
              >
                {index === 0 && "Structured wool tailoring paired with fluid silk underlays. A study in absolute contrast."}
                {index === 1 && "The silhouette is dissolved into mathematical perfection. Cashmere and spun gold."}
                {index === 2 && "Weightless architecture. The final form requires no structure, only tension."}
              </motion.p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
