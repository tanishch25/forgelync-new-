import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const projects = [
  { title: "NEXUS", client: "AI Research", img: "/monolith.jpg" },
  { title: "LUMINA", client: "Fashion House", img: "/silk.jpg" },
  { title: "FORGELYNC", client: "B2B Engine", img: "/mesh.jpg" },
  { title: "ECLIPSE", client: "Web3 Studio", img: "/spikes.jpg" }
];

export function ProjectList({ setIsHovering }: { setIsHovering: (val: boolean) => void }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const cursorRotate = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 150); // offset by half of image width
      cursorY.set(e.clientY - 200); // offset by half of image height
      cursorRotate.set(((e.clientX / window.innerWidth) - 0.5) * 15); // Dynamic lean physics
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY, cursorRotate]);

  return (
    <div className="w-full max-w-5xl mx-auto my-32  pointer-events-auto">
      
      {/* Floating Image Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-[90] overflow-hidden rounded-lg mix-blend-normal"
        style={{ x: cursorX, y: cursorY, rotate: cursorRotate }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: activeImage ? 1 : 0, scale: activeImage ? 1 : 0.8 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {activeImage && (
          <img src={activeImage} className="w-full h-full object-cover" alt="Project preview" />
        )}
      </motion.div>

      <div className="flex flex-col border-t border-white/20">
        {projects.map((project, i) => (
          <div 
            key={i}
            className="flex justify-between items-center py-8 border-b border-white/20 cursor-none group"
            onMouseEnter={() => {
              setActiveImage(project.img);
              setIsHovering(true);
            }}
            onMouseLeave={() => {
              setActiveImage(null);
              setIsHovering(false);
            }}
          >
            <h3 className="font-display font-bold text-5xl md:text-7xl text-metallic group-hover:translate-x-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
              {project.title}
            </h3>
            <span className="font-mono text-sm tracking-widest text-white/50 group-hover:-translate-x-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] uppercase">
              {project.client}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
