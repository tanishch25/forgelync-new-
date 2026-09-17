import { useRef } from 'react';
import { motion, useScroll, useTransform, useVelocity, useAnimationFrame, useSpring, wrap, useMotionValue } from 'framer-motion';

export function Marquee({ children, baseVelocity = 100 }: { children: React.ReactNode, baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const directionFactor = useRef<number>(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    
    // Reverse direction based on scroll direction
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    
    // Add velocity to speed
    moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get());
    
    baseX.set(baseX.get() + moveBy);
  });

  const xTransform = useTransform(baseX, (v) => `${wrap(-20, -50, v)}%`);

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap relative">
      <motion.div 
        className="font-display font-bold text-[12vw] uppercase tracking-tighter flex whitespace-nowrap flex-nowrap"
        style={{ x: xTransform }}
      >
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
      </motion.div>
    </div>
  );
}
