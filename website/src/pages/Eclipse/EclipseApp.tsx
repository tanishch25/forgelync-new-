import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { EclipseScene } from './EclipseScene';
import { GlobalExit } from '../../components/GlobalExit';
import { GlitchText } from './GlitchText';
import { PhysicsCard, MagnetText } from './PhysicsDOM';
import { TerminalWindow, Marquee } from './PhysicsTerminal';
import { VelocityScrollWrapper } from './VelocityScrollWrapper';
import { ShatterHoverText } from './ShatterText';
import { CustomCursor } from './CustomCursor';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Scanline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

function EclipseLoader() {
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 500);
      }
      setPercent(current);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div 
          key="eclipse-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="font-mono text-[10px] tracking-[0.5em] text-[#00FF41] mb-8">
            <GlitchText text="INITIALIZING_WEB3_PROTOCOL" />
          </div>
          <div className="font-display text-7xl font-bold text-white uppercase tracking-tighter">
            <GlitchText text="ECLIPSE" />
          </div>
          <div className="mt-8 font-mono text-sm text-white/40">
            [{percent}%] SYNCHRONIZING
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function EclipseApp() {
  useEffect(() => {
    // Force instant scroll to top before Lenis mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
      className="relative w-full bg-[#050505] text-white selection:bg-[#00FF41] selection:text-black font-sans cursor-none"
    >
      <CustomCursor />
      <EclipseLoader />

      {/* Cyberpunk Grid Overlay */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* 3D Singularity Environment */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
          <EclipseScene />
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={2.0} />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.005, 0.005)} />
            <Noise opacity={0.3} blendFunction={BlendFunction.OVERLAY} />
            <Scanline density={2.5} opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
          </EffectComposer>
        </Canvas>
      </div>

      <GlobalExit />
      
      {/* Aggressive Brutalist Navbar */}
      <nav className="fixed top-0 w-full px-8 md:px-16 py-8 flex justify-between items-center z-[100] mix-blend-difference pointer-events-auto">
        <div className="flex items-center gap-8">
          <div 
            className="font-display font-bold text-3xl tracking-tighter uppercase cursor-crosshair text-white hover:text-[#00FF41] transition-colors"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <GlitchText text="ECLIPSE." />
          </div>
        </div>
        <div className="hidden md:flex gap-12 font-mono text-[11px] tracking-[0.4em] uppercase font-bold text-white">
          <button onClick={() => window.scrollTo({top: window.innerHeight * 1.5, behavior: 'smooth'})} className="hover:text-[#00FF41] transition-colors"><GlitchText text="[ ARCHITECTURE ]" /></button>
          <button onClick={() => window.scrollTo({top: window.innerHeight * 3.0, behavior: 'smooth'})} className="hover:text-[#00FF41] transition-colors"><GlitchText text="[ PROTOCOL ]" /></button>
          <button className="border border-[#00FF41] text-[#00FF41] px-6 py-2 hover:bg-[#00FF41] hover:text-black transition-all cursor-crosshair"><GlitchText text="INITIATE" /></button>
        </div>
      </nav>

      {/* --- SCROLL CONTENT --- */}
      <VelocityScrollWrapper>
        {/* S1: The Void Hero */}
        <section className="relative z-10 h-screen flex items-center justify-center pointer-events-none px-4">
          <div className="text-center mix-blend-difference">
            <h1 className="font-display font-black text-[15vw] leading-[0.8] tracking-tighter text-white">
              <GlitchText text="ECLIPSE" />
            </h1>
            <h2 className="font-mono text-sm md:text-xl tracking-[0.5em] text-[#00FF41] mt-8 uppercase">
              <GlitchText text="Decentralized Intelligence" />
            </h2>
          </div>
        </section>

        {/* S2: Brutalist Typography Manifesto */}
        <section className="relative z-10 min-h-[150vh] flex items-center px-8 md:px-24 pointer-events-none mt-[20vh]">
          <MagnetText className="max-w-6xl mix-blend-difference pointer-events-auto">
            <p className="font-display font-bold text-5xl md:text-8xl leading-[0.85] tracking-tighter text-white uppercase">
              We don't build apps. <br/>
              <span className="text-[#00FF41]"><GlitchText text="We build ecosystems" /></span> <br/>
              that break the legacy web.
            </p>
            <div className="mt-16 w-32 h-[2px] bg-[#00FF41]" />
            <p className="mt-8 font-mono text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed tracking-widest lowercase">
              [sys.log] &gt; traditional architecture is dead. we deploy self-sustaining autonomous networks on the edge. zero trust. pure logic.
            </p>
          </MagnetText>
        </section>

        {/* MARQUEE SEPARATOR */}
        <div className="relative z-10 my-32">
          <Marquee text="ZERO TRUST // ZERO KNOWLEDGE // ABSOLUTE EXECUTION // " />
        </div>

        {/* S3: The Features / Data Vault */}
        <section className="relative z-10 min-h-[100vh] px-8 md:px-24 py-32 pointer-events-auto bg-[#050505]/40 backdrop-blur-sm border-y border-[#00FF41]/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
              {[
                { id: "01", title: "Smart Contracts", desc: "Immutable execution on layer zero. No human error." },
                { id: "02", title: "Zk-Rollups", desc: "Absolute privacy. Mathematical certainty. Zero knowledge." },
                { id: "03", title: "Edge Nodes", desc: "Distributed computing power running directly in the browser." }
              ].map((item) => (
                <PhysicsCard key={item.id} className="group border border-white/10 p-8 hover:border-[#00FF41]/50 transition-colors bg-[#050505]/80">
                  <div className="font-mono text-[#00FF41] text-xs mb-12 tracking-[0.4em]"><GlitchText text={`[ PROTOCOL_${item.id} ]`} /></div>
                  <h3 className="font-display text-4xl font-bold uppercase tracking-tighter mb-4 text-white group-hover:text-[#00FF41] transition-colors"><GlitchText text={item.title} /></h3>
                  <p className="font-sans text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </PhysicsCard>
              ))}
            </div>
          </div>
        </section>

        {/* S5: Draggable Terminal Emulator */}
        <section className="relative z-10 min-h-[100vh] flex flex-col items-center justify-center px-4 mt-32 pointer-events-none">
          <div className="mb-12 font-mono text-xl tracking-[0.5em] text-white/50 uppercase mix-blend-difference">
            [ INTERACTIVE TERMINAL ]
          </div>
          <div className="pointer-events-auto">
            <TerminalWindow />
          </div>
        </section>

        {/* S4: The Final Push */}
        <section className="relative z-10 h-screen flex items-center justify-center pointer-events-auto px-4 mt-[20vh]">
          <div className="text-center mix-blend-difference">
            <div className="font-display font-black text-[8vw] leading-[0.8] tracking-tighter text-white hover:text-[#00FF41] transition-colors cursor-crosshair">
              <ShatterHoverText text="ENTER THE VOID." />
            </div>
          </div>
        </section>
      </VelocityScrollWrapper>

    </motion.div>
  );
}
