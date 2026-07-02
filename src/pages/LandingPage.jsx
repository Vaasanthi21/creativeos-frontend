import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Cpu,
  Flame,
  Sliders,
  MoveHorizontal
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Mouse coordinate tracking for spotlight glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Image slider position state (percentage 0 to 100)
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
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

      {/* 3. PREMIUM GLASS HEADER */}
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

      {/* 4. HERO PANEL */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
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
            <Sparkles size={11} className="text-accent animate-pulse" />
            <span>Figma Blueprint to Production-Ready Code</span>
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
            Deploy brand assets, auto-generate blog channels, and launch multi-layer analytics loops under a single premium dashboard.
          </motion.p>
        </motion.div>
      </div>

      {/* 5. INTERACTIVE FIGMA VS PRODUCTION COMPARISON SLIDER */}
      <div className="max-w-4xl mx-auto px-6 pb-20 relative z-10">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sliders size={14} className="text-primary" /> Interactive UI Visualizer
          </h2>
          <p className="text-[11px] text-muted-foreground">Slide to compare the Figma Blueprint (Left) with the Final Production-Coded UI (Right)</p>
        </div>

        <div 
          ref={sliderRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="h-[320px] sm:h-[400px] w-full rounded-3xl relative overflow-hidden border border-white/[0.08] shadow-2xl bg-slate-950 cursor-ew-resize select-none"
        >
          {/* RIGHT SIDE: Production Coded UI (Rendered) */}
          <div className="absolute inset-0 w-full h-full p-6 flex gap-6 bg-slate-950">
            {/* Mock Sidebar */}
            <div className="w-1/4 h-full border border-white/[0.05] bg-slate-900/40 rounded-2xl p-4 flex flex-col justify-between hidden sm:flex">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/[0.05]">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary to-accent" />
                  <div className="h-2 w-16 bg-white/20 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-full bg-primary/10 border border-primary/20 rounded-lg flex items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                    <div className="h-1.5 w-12 bg-primary/45 rounded" />
                  </div>
                  <div className="h-6 w-full hover:bg-white/[0.02] rounded-lg flex items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700 mr-2" />
                    <div className="h-1.5 w-10 bg-white/10 rounded" />
                  </div>
                  <div className="h-6 w-full hover:bg-white/[0.02] rounded-lg flex items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700 mr-2" />
                    <div className="h-1.5 w-14 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.05]">
                <div className="w-5 h-5 rounded-full bg-slate-800" />
                <div className="h-1.5 w-10 bg-white/10 rounded" />
              </div>
            </div>

            {/* Mock Dashboard Area */}
            <div className="flex-1 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                <div className="space-y-1 text-left">
                  <div className="h-3 w-28 bg-white/25 rounded" />
                  <div className="h-2 w-16 bg-white/10 rounded" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-extrabold text-cyan-400">OS</div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-2 gap-4 flex-1 py-4">
                <div className="border border-white/[0.06] bg-slate-900/20 rounded-2xl p-4 flex flex-col justify-between text-left">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
                      <Sparkles size={14} />
                    </div>
                    <div className="h-2.5 w-20 bg-white/20 rounded mb-1" />
                    <div className="h-1.5 w-28 bg-white/10 rounded" />
                  </div>
                  <div className="h-7 w-full bg-gradient-to-r from-primary to-accent text-white text-[9px] font-black rounded-lg flex items-center justify-center gap-1">
                    <span>Activate</span> <ArrowRight size={10} />
                  </div>
                </div>

                <div className="border border-white/[0.06] bg-slate-900/20 rounded-2xl p-4 flex flex-col justify-between text-left">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
                      <TrendingUp size={14} />
                    </div>
                    <div className="h-2.5 w-24 bg-white/20 rounded mb-1" />
                    <div className="h-1.5 w-20 bg-white/10 rounded" />
                  </div>
                  <div className="h-7 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[9px] font-black rounded-lg flex items-center justify-center gap-1">
                    <span>Monitor</span> <ArrowRight size={10} />
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between">
                <span className="text-[9px] text-slate-400 flex items-center gap-1.5"><Cpu size={10} className="text-primary" /> Active Optimization Pipeline</span>
                <span className="text-[9px] font-bold text-primary font-mono animate-pulse">Running</span>
              </div>
            </div>
          </div>

          {/* LEFT SIDE: Figma Blueprint (Masked) */}
          <div 
            className="absolute inset-0 h-full p-6 flex gap-6 bg-slate-950 border-r border-cyan-500/40"
            style={{ 
              width: `${sliderPos}%`,
              transition: isDragging ? 'none' : 'width 0.15s ease-out'
            }}
          >
            {/* Blueprint Overlay grids */}
            <div className="absolute inset-0 bg-[radial-gradient(cyan_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

            {/* Mock Sidebar Blueprint */}
            <div className="w-[185px] h-full border border-cyan-500/30 bg-cyan-950/10 rounded-2xl p-4 flex flex-col justify-between shrink-0 hidden sm:flex relative">
              {/* Dimensions tag */}
              <span className="absolute top-1 left-1 text-[7px] font-mono text-cyan-400">W: 185px</span>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-cyan-500/20">
                  <div className="w-6 h-6 border border-cyan-500/40 border-dashed rounded" />
                  <div className="h-1.5 w-12 bg-cyan-500/20 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-full border border-cyan-500/35 bg-cyan-500/10 rounded-lg flex items-center px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2" />
                    <div className="h-1 w-10 bg-cyan-500/30 rounded" />
                  </div>
                  <div className="h-6 w-full border border-cyan-500/15 rounded-lg flex items-center px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-800 mr-2" />
                    <div className="h-1 w-8 bg-cyan-500/10 rounded" />
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-10 bg-cyan-500/20 rounded" />
            </div>

            {/* Mock Dashboard Area Blueprint */}
            <div className="w-[500px] h-full flex flex-col justify-between shrink-0 relative">
              <span className="absolute top-1 left-1 text-[7px] font-mono text-cyan-400">Frame 01</span>
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="space-y-1 text-left">
                  <div className="h-2 w-20 bg-cyan-500/30 rounded" />
                  <div className="h-1.5 w-12 bg-cyan-500/10 rounded" />
                </div>
                <div className="w-7 h-7 border border-cyan-500/40 rounded-full flex items-center justify-center text-[7px] font-mono text-cyan-400">NODE</div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-2 gap-4 flex-1 py-4">
                <div className="border border-cyan-500/25 bg-cyan-950/5 rounded-2xl p-4 flex flex-col justify-between text-left relative">
                  <span className="absolute bottom-1 right-2 text-[6px] font-mono text-cyan-500/60">Component Card</span>
                  <div>
                    <div className="w-8 h-8 border border-cyan-500/40 border-dashed rounded flex items-center justify-center text-cyan-500 mb-2">
                      +
                    </div>
                    <div className="h-2 w-14 bg-cyan-500/30 rounded mb-1" />
                    <div className="h-1 w-20 bg-cyan-500/10 rounded" />
                  </div>
                  <div className="h-7 w-full border border-cyan-500/35 bg-cyan-500/15 rounded-lg flex items-center justify-center" />
                </div>

                <div className="border border-cyan-500/25 bg-cyan-950/5 rounded-2xl p-4 flex flex-col justify-between text-left relative">
                  <div>
                    <div className="w-8 h-8 border border-cyan-500/40 border-dashed rounded flex items-center justify-center text-cyan-500 mb-2">
                      +
                    </div>
                    <div className="h-2 w-16 bg-cyan-500/30 rounded mb-1" />
                    <div className="h-1 w-14 bg-cyan-500/10 rounded" />
                  </div>
                  <div className="h-7 w-full border border-cyan-500/35 bg-cyan-500/15 rounded-lg flex items-center justify-center" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="p-3 border border-cyan-500/20 bg-cyan-950/5 rounded-xl flex items-center justify-between">
                <span className="text-[9px] text-cyan-500/60 font-mono">X: 24 Y: 320</span>
                <span className="text-[9px] font-bold text-cyan-400 font-mono">Blueprint</span>
              </div>
            </div>
          </div>

          {/* SLIDER HANDLE BAR */}
          <div 
            onMouseDown={() => setIsDragging(true)}
            className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary cursor-ew-resize z-40"
            style={{ 
              left: `${sliderPos}%`,
              transition: isDragging ? 'none' : 'left 0.15s ease-out'
            }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-primary flex items-center justify-center text-primary shadow-glow shadow-primary/30 active:scale-95 transition-transform duration-200">
              <MoveHorizontal size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* 6. DUAL OS SELECTOR PORTALS */}
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

              {/* Features check list */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/40">
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

              {/* Features check list */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/40">
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
