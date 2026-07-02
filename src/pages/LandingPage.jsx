import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import {
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Brain,
  Workflow,
  Globe,
  Layers,
  Layout,
  BarChart3,
  Video,
  Image as ImageIcon,
  Compass,
  Check,
  MousePointer,
  Heart,
  Cpu,
  Flame
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Mouse coordinate tracking for interactive spotlight glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleLaunch = (targetPath) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  // Stagger reveal animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 90, damping: 14 }
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-display select-none">
      
      {/* 1. INTERACTIVE MOUSE SPOTLIGHT */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(242,91,24,0.06) 0%, rgba(6,182,212,0.05) 50%, transparent 100%)`
        }}
      />

      {/* 2. GLOWING BACKDROP BLOBS */}
      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.2, 0.85, 1],
          rotate: [0, 45, -45, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-primary/10 to-accent/5 blur-[130px] pointer-events-none"
      />
      
      <motion.div
        animate={{
          x: [0, -50, 70, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.9, 1.15, 1],
          rotate: [0, -60, 60, 0]
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-cyan-500/10 to-indigo-500/5 blur-[150px] pointer-events-none"
      />

      {/* Cybernetic grid line layout mask */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-20"
        style={{ 
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)'
        }}
      />

      {/* 3. FLOATING CYBER PARTS */}
      <div className="absolute top-[25%] left-[8%] w-2 h-2 rounded-full bg-primary/45 animate-ping pointer-events-none" />
      <div className="absolute bottom-[35%] right-[10%] w-1.5 h-1.5 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />

      {/* 4. PREMIUM GLASS HEADER */}
      <nav className="sticky top-0 z-50 w-full bg-slate-950/65 backdrop-blur-lg border-b border-white/[0.04] px-8 py-4.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center font-extrabold text-white text-base">
              C
            </div>
          </div>
          <span className="font-display font-black tracking-tight text-white text-base">CreativeStudio <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">OS</span></span>
        </div>
        
        <div>
          <button
            onClick={() => handleLaunch('/generate')}
            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 text-slate-200 hover:text-white font-extrabold rounded-xl text-xs shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <span>Launch Portal</span>
            <ArrowRight size={13} className="text-primary" />
          </button>
        </div>
      </nav>

      {/* 5. HERO PANEL */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-16 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Animated badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.03] border border-white/[0.07] rounded-full text-[10px] font-extrabold uppercase tracking-widest text-primary shadow-sm hover:border-primary/30 transition-all duration-300"
          >
            <Sparkles size={11} className="animate-spin text-accent" style={{ animationDuration: '3s' }} />
            <span>Dual Creative Execution System</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl sm:text-7xl font-display font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.05] capitalize"
          >
            The Next Era of{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Creative OS</span>
              <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-primary to-accent rounded-full opacity-60" />
            </span>{' '}
            &{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Growth OS</span>
              <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full opacity-60" />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={fadeInUp}
            className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Deploy corporate brand assets, auto-generate structured blog channels, and launch multi-layer analytics loops under a single premium dashboard.
          </motion.p>
        </motion.div>
      </div>

      {/* 6. ENHANCED PORTALS GRID */}
      <div className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* PORTAL A: CREATIVE OS CARD */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="group relative bg-slate-900/40 border border-white/[0.04] rounded-3xl p-8 flex flex-col justify-between space-y-8 overflow-hidden hover:border-primary/40 hover:shadow-[0_0_50px_rgba(242,91,24,0.08)] transition-all duration-300"
          >
            {/* Ambient backglow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/15 transition-all duration-300 pointer-events-none" />
            
            <div className="space-y-6">
              {/* Header details */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 duration-300">
                  <Workflow size={20} />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary/65 bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">Suite Alpha</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 text-left">
                <h3 className="font-display text-2xl font-black text-white group-hover:text-primary transition-colors">Creative OS</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The automated content production core. Author high-quality articles, design social art styles, and compile assets grounded in your brand specs.
                </p>
              </div>

              {/* FLOATING UI MOCKUP PREVIEW */}
              <div className="h-28 rounded-2xl bg-slate-950/70 border border-white/[0.03] p-4 relative overflow-hidden flex flex-col justify-between select-none">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">AI Content Factory</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  </div>
                </div>
                <div className="space-y-2 py-1">
                  <div className="h-2 w-3/4 rounded bg-white/10" />
                  <div className="h-2 w-1/2 rounded bg-white/5" />
                </div>
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] rounded-lg px-2 py-1">
                  <span className="text-[8px] text-slate-400 flex items-center gap-1"><Cpu size={9} className="text-primary" /> Synthesizing blog draft...</span>
                  <span className="text-[8px] font-bold text-primary font-mono animate-pulse">86%</span>
                </div>
              </div>

              {/* Features check list */}
              <div className="space-y-2 pt-2 border-t border-slate-800/40">
                {[
                  'Creative Studio outline builder',
                  'AI Image generation layout module',
                  'Adaptive video templates creator',
                  'Interactive copy refining toolkit'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                    <Check size={12} className="text-primary shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LAUNCH BUTTON (REDIRECTS TO /generate) */}
            <button
              onClick={() => handleLaunch('/generate')}
              className="w-full py-4.5 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-extrabold rounded-xl shadow-[0_4px_20px_rgba(242,91,24,0.25)] hover:shadow-[0_4px_30px_rgba(242,91,24,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Launch Creative OS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 duration-200" />
            </button>
          </motion.div>

          {/* PORTAL B: GROWTH OS CARD */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="group relative bg-slate-900/40 border border-white/[0.04] rounded-3xl p-8 flex flex-col justify-between space-y-8 overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.08)] transition-all duration-300"
          >
            {/* Ambient backglow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all duration-300 pointer-events-none" />
            
            <div className="space-y-6">
              {/* Header details */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shadow-sm group-hover:scale-105 duration-300">
                  <TrendingUp size={20} />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400/65 bg-cyan-500/5 px-2.5 py-1 rounded-md border border-cyan-500/10">Suite Beta</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 text-left">
                <h3 className="font-display text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">Growth OS</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The automated distribution and optimization system. Manage high-converting LinkedIn campaigns, track ROI, and run data audits.
                </p>
              </div>

              {/* FLOATING UI MOCKUP PREVIEW */}
              <div className="h-28 rounded-2xl bg-slate-950/70 border border-white/[0.03] p-4 relative overflow-hidden flex flex-col justify-between select-none">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Metrics Console</span>
                  <span className="text-[8px] font-extrabold text-cyan-400 flex items-center gap-0.5"><Flame size={8} /> LIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-3 py-1">
                  <div className="bg-white/[0.01] border border-white/[0.04] p-1.5 rounded-lg flex flex-col">
                    <span className="text-[7px] text-slate-500 uppercase font-bold">Campaign CTR</span>
                    <span className="text-[10px] font-black text-white font-mono">+4.8%</span>
                  </div>
                  <div className="bg-white/[0.01] border border-white/[0.04] p-1.5 rounded-lg flex flex-col">
                    <span className="text-[7px] text-slate-500 uppercase font-bold">Total Conversions</span>
                    <span className="text-[10px] font-black text-white font-mono">1.2K</span>
                  </div>
                </div>
                <div className="h-1 bg-cyan-500/10 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['20%', '80%', '45%', '90%', '20%'] }} 
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-full bg-cyan-400" 
                  />
                </div>
              </div>

              {/* Features check list */}
              <div className="space-y-2 pt-2 border-t border-slate-800/40">
                {[
                  'LinkedIn campaign builder wizard',
                  'Audience persona profiles generator',
                  'Multi-channel performance trackers',
                  'Stripe-powered dynamic ad wallets'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                    <Check size={12} className="text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LAUNCH BUTTON (REDIRECTS TO /blog-studio) */}
            <button
              onClick={() => handleLaunch('/blog-studio')}
              className="w-full py-4.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-extrabold rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Launch Growth OS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 duration-200" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 7. VIEWPORT TRIGGERED SYSTEM HIGHLIGHTS */}
      <div className="border-t border-white/[0.02] bg-slate-950/50 py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h3 className="font-display text-3xl font-black text-white">Consolidated OS Engine</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              How our system bridges creative expression and growth metrics natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Market Research',
                desc: 'Scrapes competitor SEO keywords, monitors trending news logs, and generates tailored content briefs instantly.',
                icon: Globe
              },
              {
                title: 'Multi-Channel Layouts',
                desc: 'Draft blogs once, then automatically compile and reformat for LinkedIn, Medium, and Substack channels.',
                icon: Layout
              },
              {
                title: 'Core AI Grounding',
                desc: 'References target company files, corporate case studies, and tone rules to maintain strict factual consistency.',
                icon: Brain
              }
            ].map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="bg-slate-900/20 border border-white/[0.03] rounded-2xl p-6.5 space-y-4 text-left hover:border-slate-800 transition duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/[0.06] flex items-center justify-center text-primary shadow-sm">
                    <CardIcon size={16} />
                  </div>
                  <h4 className="font-display font-extrabold text-white text-base">{card.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 8. FOOTER */}
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-slate-500 relative z-10 bg-slate-950">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
