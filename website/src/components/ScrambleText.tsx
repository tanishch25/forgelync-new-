import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CHARS = '!<>-_\\\\/[]{}—=+*^?#________';

export function ScrambleText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      let iteration = 0;
      let timeoutId: number;

      const animate = () => {
        const interval = window.setInterval(() => {
          setDisplayText(() =>
            text
              .split('')
              .map((_, index) => {
                if (index < iteration) {
                  return text[index];
                }
                return CHARS[Math.floor(Math.random() * CHARS.length)];
              })
              .join('')
          );

          if (iteration >= text.length) {
            clearInterval(interval);
          }

          iteration += 1 / 3;
        }, 30);
      };

      timeoutId = setTimeout(animate, delay * 1000);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isInView, text, delay]);

  return (
    <motion.span 
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {displayText}
    </motion.span>
  );
}
