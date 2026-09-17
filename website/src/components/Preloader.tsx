import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 99) {
        current = 99;
        clearInterval(interval);
        setTimeout(() => {
          setProgress(100);
          setTimeout(onComplete, 800);
        }, 500);
      }
      setProgress(Math.min(current, 99));
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: '-100vh' }}
      transition={{ duration: 1.2, ease: [0.87, 0, 0.13, 1] }}
      className="fixed inset-0 z-[200] bg-background flex flex-col justify-end p-8 md:p-16 text-primary pointer-events-none"
    >
      <div className="flex justify-between items-end overflow-hidden">
        <motion.span 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-[8vw] md:text-[6vw] leading-none tracking-tighter text-metallic"
        >
          FORGELYNC
        </motion.span>
        <div className="font-mono text-2xl md:text-5xl font-light mb-2 w-32 text-right">
          {Math.round(progress)}%
        </div>
      </div>
    </motion.div>
  );
}
