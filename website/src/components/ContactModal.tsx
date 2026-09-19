import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { InlineWidget } from 'react-calendly';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: ''
  });

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.budget) return;
    
    try {
      // You can add your Web3Forms logic here later
      // For now, it proceeds directly to the calendar
      setStep(2);
    } catch (error) {
      console.error("Form submission failed:", error);
      setStep(2);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 overflow-y-auto"
        >
          {/* Background FX */}
          <div className="fixed inset-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent" />

          {/* Modal Container */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden relative z-10 my-auto shadow-2xl"
          >
            {/* Close Button inside the modal for perfect mobile reachability */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-colors z-[20] bg-black/50 p-2 rounded-full backdrop-blur-md"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              
              {/* Left Column - Branding (Shrinks on mobile so it doesn't push form offscreen) */}
              <div className="w-full md:w-1/3 bg-[#111] p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
                <div>
                  <h3 className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 mb-4 md:mb-12">
                    {step === 1 ? 'Step 01 / Initiation' : 'Step 02 / Booking'}
                  </h3>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter text-metallic leading-[1.1]">
                    {step === 1 ? 'Filter the Noise.' : 'Secure the Asset.'}
                  </h2>
                  <p className="mt-4 md:mt-6 text-zinc-400 text-xs md:text-sm leading-relaxed hidden md:block">
                    {step === 1 
                      ? "We don't work with everyone. Provide your project parameters below to see if we're a match."
                      : "Your parameters have been accepted. Select a time below for our strategic initiation call."}
                  </p>
                </div>
                
                <div className="hidden md:block mt-8">
                  <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                    Forgelync Architecture
                    <br/>System v2.0
                  </div>
                </div>
              </div>

              {/* Right Column - Form / Calendly */}
              <div className="w-full md:w-2/3 p-6 md:p-12 relative min-h-[500px]">
                <AnimatePresence mode="wait">
                  
                  {step === 1 && (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      onSubmit={handleProceed}
                      className="flex flex-col h-full gap-6 md:gap-8 pointer-events-auto"
                    >
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/50">Leader Name</label>
                        <input 
                          required
                          type="text" 
                          className="bg-transparent border-b border-white/20 py-2 md:py-3 text-lg md:text-xl text-white focus:outline-none focus:border-white transition-colors"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>

                      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        <div className="flex flex-col gap-2 flex-1">
                          <label className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/50">Email Address</label>
                          <input 
                            required
                            type="email" 
                            className="bg-transparent border-b border-white/20 py-2 md:py-3 text-lg md:text-xl text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <label className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/50">Brand / Company</label>
                          <input 
                            type="text" 
                            className="bg-transparent border-b border-white/20 py-2 md:py-3 text-lg md:text-xl text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Acme Corp"
                            value={formData.company}
                            onChange={e => setFormData({...formData, company: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 md:gap-4 mt-2 md:mt-4">
                        <label className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/50">Capital Allocation (Budget)</label>
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                          {['< $2k', '$2k - $5k', '$5k+'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setFormData({...formData, budget: val})}
                              className={`py-3 md:py-4 px-2 md:px-6 border ${formData.budget === val ? 'border-white bg-white text-black' : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white'} transition-all duration-300 font-mono text-[10px] md:text-sm tracking-tighter md:tracking-widest whitespace-nowrap`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 md:mt-auto pt-4 md:pt-12 flex justify-end">
                        <button 
                          type="submit"
                          disabled={!formData.name || !formData.email || !formData.budget}
                          className="group w-full md:w-auto flex items-center justify-center md:justify-start gap-4 bg-white text-black px-8 py-4 font-mono text-[12px] md:text-sm font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors pointer-events-auto"
                        >
                          PROCEED TO BOOKING
                          <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="calendly"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="h-full w-full bg-white rounded-lg overflow-hidden -mx-2 md:mx-0"
                    >
                      {/* Calendly Integration Restored */}
                      <InlineWidget 
                        url="https://calendly.com/acmesales" 
                        styles={{ height: '550px', width: '100%' }} 
                        prefill={{
                          name: formData.name,
                          email: formData.email,
                        }}
                      />
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
