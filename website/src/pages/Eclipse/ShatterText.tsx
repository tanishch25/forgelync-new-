import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function ShatterHoverText({ text, className }: { text: string, className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {text.split('').map((char, index) => (
        <ShatterChar key={index} char={char} />
      ))}
    </div>
  );
}

function ShatterChar({ char }: { char: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 10 });
  const springY = useSpring(y, { stiffness: 300, damping: 10 });
  const springRotate = useSpring(rotate, { stiffness: 300, damping: 10 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const dist = Math.sqrt(distX * distX + distY * distY);

    if (dist < 100) {
      // Repel away from cursor aggressively
      const angle = Math.atan2(distY, distX);
      const force = (100 - dist) * 1.5;
      x.set(-Math.cos(angle) * force);
      y.set(-Math.sin(angle) * force);
      rotate.set((Math.random() - 0.5) * force * 2);
    } else {
      x.set(0);
      y.set(0);
      rotate.set(0);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY, rotate: springRotate, display: 'inline-block', whiteSpace: 'pre' }}
    >
      {char}
    </motion.span>
  );
}
