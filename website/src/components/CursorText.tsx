import { motion } from 'framer-motion';

export function CursorText({ isHovering }: { isHovering: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="overflow-visible"
      >
        <path
          id="textPath"
          d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
          fill="none"
        />
        <text className="text-[14px] font-bold uppercase tracking-[0.2em] fill-white ">
          <textPath href="#textPath" startOffset="0%">
            DRAG TO EXPLORE • AURA STUDIO • 
          </textPath>
        </text>
      </motion.svg>
    </motion.div>
  );
}
