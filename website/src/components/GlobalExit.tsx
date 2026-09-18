import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function GlobalExit() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div 
      className="fixed bottom-12 left-12 z-[99999] flex items-center justify-center cursor-pointer mix-blend-difference text-white pointer-events-auto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/')}
    >
      <motion.div 
        layout
        className="flex items-center justify-center overflow-hidden bg-white/60 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-colors"
        initial={{ width: 14, height: 14 }}
        animate={{ 
          width: hovered ? 140 : 14, 
          height: hovered ? 48 : 14,
          backgroundColor: hovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.6)",
          color: hovered ? "#000" : "#fff"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <AnimatePresence>
          {hovered && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-bold tracking-[0.3em] uppercase whitespace-nowrap flex items-center gap-2"
            >
              <span className="text-lg leading-none">&larr;</span> EXIT
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
