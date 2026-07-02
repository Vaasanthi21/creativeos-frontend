import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
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
  MoveHorizontal,
  Plus
} from 'lucide-react';

// Reusable 3D Tilt Card Wrapper using Framer Motion physics
const TiltCard = ({ children, className, glowColor }) => {
  const cardRef = useRef(null);
  
  // Motion values for coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Rotation ranges
  const rotateX = useTransform(mouseY, [-200, 200], [12, -12]);
  const rotateY = useTransform(mouseX, [-200, 200], [-12, 12]);

  // Spring physics for buttery-smooth interpolation
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={`relative group ${className}`}
    >
      {/* 3D Perspective container */}
      <div style={{ transform: 'translateZ(30px)' }} className="h-full relative z-10">
        {children}
      </div>

      {/* Behind-card ambient glow */}
      <div 
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none z-0"
        style={{
          background: `radial-gradient(220px circle, ${glowColor} 0%, transparent 80%)`,
        }}
      />
    </motion.div>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Pointer position for custom background spotlight
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Image comparison slider position state (percentage 0 to 100)
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

  // Stagger reveal animation variants
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
      
      {/* 1. STAR LIGHT STARS BACKDROP */}
      <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none" />

      {/* 2. INTERACTIVE MOUSE SPOTLIGHT */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-70 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.06) 50%, transparent 100%)`
        }}
      />

      {/* 3. DYNAMIC NEBULA BLOBS */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -90, 50, 0],
          scale: [1, 1.25, 0.8, 1],
          rotate: [0, 60, -60, 0]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-violet-600/15 to-fuchsia-600/5 blur-[140px] pointer-events-none"
      />
      
      <motion.div
        animate={{
          x: [0, -60, 80, 0],
          y: [0, 90, -60, 0],
          scale: [1, 0.85, 1.2, 1],
          rotate: [0, -50, 50, 0]
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute bottom-[-20%] right-[-15%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-cyan-500/15 to-emerald-500/5 blur-[160px] pointer-events-none"
      />

      {/* Cybernetic grid overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-25 animate-pulse"
        style={{ 
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          animationDuration: '8s'
        }}
      />

      {/* 4. PREMIUM GLASS NAVIGATION HEADER */}
      <nav className="sticky top-0 z-50 w-full bg-slate-950/65 backdrop-blur-lg border-b border-white/[0.04] px-8 py-4.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center font-extrabold text-white text-base">
              C
            </div>
          </div>
          <span className="font-display font-black tracking-tight text-white text-base">
            CreativeStudio <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">OS</span>
          </span>
        </div>
        
        <div>
          <button
            onClick={() => handleLaunch('/generate')}
            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 text-slate-200 hover:text-white font-extrabold rounded-xl text-xs shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <span>Launch Portal</span>
            <ArrowRight size={13} className="text-violet-400" />
          </button>
        </div>
      </nav>

      {/* 5. HERO SECTION */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-6 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Glowing badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-violet-500/10 border border-violet-500/25 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:border-violet-500/40 transition-all duration-300"
          >
            <Sparkles size={11} className="text-fuchsia-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Figma Blueprint to Production-Ready Code</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl sm:text-8xl font-display font-black tracking-tight text-white max-w-5xl mx-auto leading-[0.98] capitalize"
          >
            The Ultimate{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">AI Platform</span>
            </span>{' '}
            For{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Content & Growth</span>
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={fadeInUp}
            className="text-xs sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Unify your creative engines and distribution metrics. Build personas, crawl sources, generate blogs, and optimize campaigns inside a single dynamic environment.
          </motion.p>
        </motion.div>
      </div>

      {/* 6. CENTRAL PORTAL CORE ORB */}
      <div className="relative w-44 h-44 mx-auto my-12 z-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 blur-2xl animate-pulse opacity-40" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-violet-500/30 flex items-center justify-center"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 absolute top-0" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute bottom-0" />
        </motion.div>
        <div className="absolute inset-4 rounded-full bg-slate-950/90 border border-white/[0.08] backdrop-blur-xl flex flex-col items-center justify-center shadow-2xl">
          <Sparkles className="text-violet-400 w-7 h-7 animate-bounce duration-1000" />
          <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 mt-2">OS CORE</span>
        </div>
      </div>

      {/* 7. BROWSER FRAME COMPARISON SLIDER */}
      <div className="max-w-4xl mx-auto px-6 pb-24 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sliders size={14} className="text-violet-400" /> Interactive UI Visualizer
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Slide to compare the Figma Blueprint (Left) with the Coded UI (Right)</p>
        </div>

        {/* Browser window wrap */}
        <div className="rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl bg-slate-950 shadow-violet-500/5">
          {/* Browser header */}
          <div className="bg-slate-900/60 border-b border-white/[0.05] px-5 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="text-[9px] text-slate-400 bg-slate-950/80 px-6 py-1 rounded-md border border-white/[0.03] select-none font-mono">
              creativestudio.os/sandbox
            </div>
            <div className="w-10" />
          </div>

          <div 
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="h-[320px] sm:h-[400px] w-full relative overflow-hidden cursor-ew-resize select-none bg-slate-950"
          >
            {/* RIGHT SIDE: Production Coded UI */}
            <div className="absolute inset-0 w-full h-full p-6 flex gap-6 bg-slate-950">
              {/* Mock Sidebar */}
              <div className="w-1/4 h-full border border-white/[0.05] bg-slate-900/40 rounded-2xl p-4 flex flex-col justify-between hidden sm:flex">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/[0.05]">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-500 to-fuchsia-500" />
                    <div className="h-2 w-16 bg-white/20 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-full bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center px-2">
                      <div className="w-2 h-2 rounded-full bg-violet-500 mr-2" />
                      <div className="h-1.5 w-12 bg-violet-500/45 rounded" />
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-extrabold text-violet-400">OS</div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-2 gap-4 flex-1 py-4">
                  <div className="border border-white/[0.06] bg-slate-900/20 rounded-2xl p-4 flex flex-col justify-between text-left">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-2">
                        <Sparkles size={14} />
                      </div>
                      <div className="h-2.5 w-20 bg-white/20 rounded mb-1" />
                      <div className="h-1.5 w-28 bg-white/10 rounded" />
                    </div>
                    <div className="h-7 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[9px] font-black rounded-lg flex items-center justify-center gap-1">
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
                    <div className="h-7 w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-[9px] font-black rounded-lg flex items-center justify-center gap-1">
                      <span>Monitor</span> <ArrowRight size={10} />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 flex items-center gap-1.5"><Cpu size={10} className="text-violet-400" /> Active Optimization Pipeline</span>
                  <span className="text-[9px] font-bold text-violet-400 font-mono animate-pulse">Running</span>
                </div>
              </div>
            </div>

            {/* LEFT SIDE: Figma Blueprint */}
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
              className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-fuchsia-500 to-violet-500 cursor-ew-resize z-40"
              style={{ 
                left: `${sliderPos}%`,
                transition: isDragging ? 'none' : 'left 0.15s ease-out'
              }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-violet-500 flex items-center justify-center text-violet-400 shadow-glow shadow-violet-500/30 active:scale-95 transition-transform duration-200">
                <MoveHorizontal size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. DUAL OS SELECTOR PORTALS */}
      <div className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* PORTAL A: CREATIVE OS CARD */}
          <TiltCard
            glowColor="rgba(139,92,246,0.18)"
            className="bg-slate-900/40 border border-white/[0.04] rounded-3xl p-8 flex flex-col justify-between space-y-8 overflow-hidden hover:border-violet-500/40 hover:shadow-[0_0_50px_rgba(139,92,246,0.12)] transition-all duration-300"
          >
            <div className="space-y-6">
              {/* Header details */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400 shadow-sm group-hover:scale-105 duration-300">
                  <Workflow size={20} />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400/65 bg-violet-500/5 px-2.5 py-1 rounded-md border border-violet-500/10">Suite Alpha</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 text-left">
                <h3 className="font-display text-2xl font-black text-white group-hover:text-violet-400 transition-colors">Creative OS</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The automated content production core. Author articles, design social art styles, and compile assets grounded in your brand voice.
                </p>
              </div>

              {/* Features check list */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/40 text-left">
                {[
                  'Creative Studio outline builder',
                  'AI Image generation layout module',
                  'Adaptive video templates creator',
                  'Interactive copy refining toolkit'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                    <Check size={12} className="text-violet-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LAUNCH BUTTON (REDIRECTS TO /generate) */}
            <button
              onClick={() => handleLaunch('/generate')}
              className="w-full py-4.5 bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:opacity-95 text-white font-extrabold rounded-xl shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-[0.99] z-10"
            >
              <span>Launch Creative OS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 duration-200" />
            </button>
          </TiltCard>

          {/* PORTAL B: GROWTH OS CARD */}
          <TiltCard
            glowColor="rgba(6,182,212,0.18)"
            className="bg-slate-900/40 border border-white/[0.04] rounded-3xl p-8 flex flex-col justify-between space-y-8 overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.12)] transition-all duration-300"
          >
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
              <div className="space-y-2.5 pt-2 border-t border-slate-800/40 text-left">
                {[
                  'LinkedIn campaign builder wizard',
                  'Audience persona profiles generator',
                  'Multi-channel performance trackers',
                  'Stripe-powered ad wallet manager'
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
              className="w-full py-4.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 text-white font-extrabold rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-[0.99] z-10"
            >
              <span>Launch Growth OS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 duration-200" />
            </button>
          </TiltCard>
        </motion.div>
      </div>

      {/* 9. VIEWPORT TRIGGERED SYSTEM HIGHLIGHTS */}
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
                desc: 'Scrapes competitor SEO keywords, monitors trending news logs, and generates briefs instantly.',
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
                  className="bg-slate-900/20 border border-white/[0.03] rounded-2xl p-6.5 space-y-4 text-left hover:border-violet-500/25 transition duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/[0.06] flex items-center justify-center text-violet-400 shadow-sm">
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

      {/* 10. FOOTER */}
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-slate-500 relative z-10 bg-slate-950">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
