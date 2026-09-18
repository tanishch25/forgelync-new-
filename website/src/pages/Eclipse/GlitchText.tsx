import { useState, useEffect } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________0123456789ABCDEF';

export function GlitchText({ text, as: Component = 'span', className = '' }: { text: string, as?: any, className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isHovered) {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText(
          text.split('')
            .map((_, index) => {
              if (index < iteration) return text[index];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );
        
        if (iteration >= text.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 3; 
      }, 30);
    } else {
      setDisplayText(text);
    }

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return (
    <Component 
      className={`cursor-crosshair ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
    </Component>
  );
}
