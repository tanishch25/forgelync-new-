import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const projects = [
  { title: "NEXUS", client: "Real Estate Architecture", img: "/frames/0100.jpg", link: "/template-3" },
  { title: "LUMINA", client: "Luxury Fragrance", img: "/lumina-preview.jpg", link: "/template-1" },
  { title: "ECLIPSE", client: "Brutalist Web3", img: "/eclipse-preview.jpg", link: "/template-2" }
];

export function ProjectList({ setIsHovering }: { setIsHovering: (val: boolean) => void }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const navigate = useNavigate();
  
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
    <div className="w-full max-w-5xl mx-auto my-32 pointer-events-auto">
      
      {/* Floating Image Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-[90] overflow-hidden rounded-lg mix-blend-normal shadow-2xl hidden md:block"
        style={{ x: cursorX, y: cursorY, rotate: cursorRotate }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: activeImage ? 1 : 0, scale: activeImage ? 1 : 0.8 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {activeImage && (
          <div className="w-full h-full relative">
            <img src={activeImage} className="w-full h-full object-cover" alt="Project preview" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 text-black px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl animate-pulse">
                Click to Enter
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Context Header */}
      <div className="mb-16 flex flex-col gap-4">
        <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter text-metallic">
          Live <span className="italic text-secondary">Architectures.</span>
        </h2>
        <p className="text-zinc-400 max-w-xl text-lg font-light">
          Explore our fully interactive digital ecosystems. Each environment below is a live, functional demonstration of our brand architecture and WebGL engineering capabilities.
        </p>
      </div>

      <div className="flex flex-col border-t border-white/20">
        {projects.map((project, i) => (
          <div 
            key={i}
            onClick={() => {
              if (project.link) {
                // Save scroll position before navigating away
                sessionStorage.setItem('mainSiteScroll', window.scrollY.toString());
                navigate(project.link);
              }
            }}
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
            <h3 className={`font-display font-bold text-4xl md:text-7xl text-metallic group-hover:translate-x-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${project.link ? 'group-hover:text-white' : ''}`}>
              {project.title}
            </h3>
            <span className="font-mono text-sm tracking-widest text-white/50 group-hover:-translate-x-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] uppercase flex flex-col items-end gap-2">
              <span>{project.client}</span>
              <span className="font-serif italic text-metallic lowercase text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                enter live
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
