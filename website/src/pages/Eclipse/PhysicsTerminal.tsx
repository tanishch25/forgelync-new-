import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function TerminalWindow() {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const lines = [
      "INITIATING DECENTRALIZED HANDSHAKE...",
      "ESTABLISHING PEER-TO-PEER CONNECTION [OK]",
      "VERIFYING ZERO-KNOWLEDGE PROOFS...",
      "HASH: 0x48fA92... [VALID]",
      "BYPASSING LEGACY MAINFRAME...",
      "ACCESS GRANTED.",
      "AWAITING COMMAND_"
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setLogs(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      drag 
      dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
      dragElastic={0.2}
      whileHover={{ scale: 1.02 }}
      className="w-full max-w-2xl bg-[#050505]/90 border border-[#00FF41]/30 p-6 font-mono text-sm text-[#00FF41] cursor-grab active:cursor-grabbing backdrop-blur-md shadow-[0_0_30px_rgba(0,255,65,0.1)]"
    >
      <div className="flex justify-between items-center border-b border-[#00FF41]/30 pb-4 mb-4">
        <span>root@eclipse-node:~</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-[#00FF41]/50" />
        </div>
      </div>
      <div className="space-y-2 h-48 overflow-hidden">
        {logs.map((log, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            &gt; {log}
          </motion.div>
        ))}
        {logs.length >= 7 && (
          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
            _
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function Marquee({ text }: { text: string }) {
  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap py-8 border-y border-[#00FF41]/20 bg-[#050505]/60 backdrop-blur-sm pointer-events-none">
      <motion.div
        animate={{ x: [0, -1035] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
        className="inline-block font-display font-black text-6xl md:text-8xl text-transparent tracking-tighter uppercase"
        style={{ WebkitTextStroke: "1px #00FF41" }}
      >
        {text}&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;
      </motion.div>
    </div>
  );
}
