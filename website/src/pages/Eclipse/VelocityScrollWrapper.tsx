import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

export function VelocityScrollWrapper({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  
  // Track scroll velocity
  const scrollVelocity = useVelocity(scrollY);
  
  // Smooth out the velocity so it doesn't snap instantly back to 0
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300
  });

  // Map velocity to a skew transform (the faster you scroll, the more the DOM bends)
  const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [5, -5]);
  const scaleVelocity = useTransform(smoothVelocity, [-1000, 0, 1000], [0.98, 1, 0.98]);

  return (
    <motion.div style={{ skewY: skewVelocity, scale: scaleVelocity }} className="w-full origin-center">
      {children}
    </motion.div>
  );
}
