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
  Lock,
  FileText
} from 'lucide-react';

// Reusable 3D Tilt Card Wrapper using Framer Motion physics
const TiltCard = ({ children, className, glowColor, onClick }) => {
  const cardRef = useRef(null);
  
  // Motion values for coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Rotation ranges
  const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

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
      onClick={onClick}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={`relative group cursor-pointer ${className}`}
    >
      {/* 3D Perspective container */}
      <div style={{ transform: 'translateZ(30px)' }} className="h-full relative z-10">
        {children}
      </div>

      {/* Behind-card ambient glow */}
      <div 
        className="absolute -inset-px rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none z-0"
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
      // Redirect to Signup (Register) page, then return to clicked page
      navigate(`/register?redirect=${encodeURIComponent(targetPath)}`);
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

  // sliding cards data representing features
  const featuresData = [
    {
      title: 'Generate Page',
      desc: 'Create high-performing blog outlines, copy components, and custom social assets grounded in your brand identity.',
      path: '/generate',
      icon: Sparkles,
      iconBg: 'bg-white/5',
      iconBorder: 'border-white/10',
      iconColor: 'text-neutral-200',
      glowColor: 'rgba(255,255,255,0.06)'
    },
    {
      title: 'Blog Studio',
      desc: 'Formulate search engine optimized structures, index topics, and draft comprehensive articles automatically.',
      path: '/blog-studio',
      icon: Layout,
      iconBg: 'bg-white/5',
      iconBorder: 'border-white/10',
      iconColor: 'text-neutral-200',
      glowColor: 'rgba(255,255,255,0.06)'
    },
    {
      title: 'Image Studio',
      desc: 'Produce breathtaking graphics, marketing banners, and visual layouts tailored to maximize social conversion.',
      path: '/image-studio',
      icon: ImageIcon,
      iconBg: 'bg-white/5',
      iconBorder: 'border-white/10',
      iconColor: 'text-neutral-200',
      glowColor: 'rgba(255,255,255,0.06)'
    },
    {
      title: 'Video Studio',
      desc: 'Design engaging social reels and brand video presentations complete with AI narration audio loops.',
      path: '/video-studio',
      icon: Video,
      iconBg: 'bg-white/5',
      iconBorder: 'border-white/10',
      iconColor: 'text-neutral-200',
      glowColor: 'rgba(255,255,255,0.06)'
    },
    {
      title: 'LinkedIn Tracker',
      desc: 'Track conversions metrics, run analytics audits, and manage corporate campaign ad budgets in real-time.',
      path: '/linkedinads',
      icon: BarChart3,
      iconBg: 'bg-white/5',
      iconBorder: 'border-white/10',
      iconColor: 'text-neutral-200',
      glowColor: 'rgba(255,255,255,0.06)'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030303] text-slate-200 overflow-hidden font-display select-none">
      
      {/* 1. CUSTOM STYLE TAG FOR AUTO SCROLLING MARQUEE */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 2. STAR LIGHT STARS BACKDROP */}
      <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* 3. SUBTLE GLOW SPOTLIGHT */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.03) 0%, transparent 100%)`
        }}
      />

      {/* Cybernetic grid overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20"
        style={{ 
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)'
        }}
      />

      {/* 4. PREMIUM NAVIGATION HEADER */}
      <nav className="sticky top-0 z-50 w-full bg-[#030303]/80 backdrop-blur-md border-b border-white/[0.03] px-8 py-4.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-black text-white text-sm">
            C
          </div>
          <span className="font-display font-black tracking-tight text-white text-sm">
            CreativeStudio <span className="text-neutral-400">OS</span>
          </span>
        </div>
        
        <div>
          <button
            onClick={() => handleLaunch('/generate')}
            className="px-5 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850 text-neutral-200 hover:text-white font-extrabold rounded-xl text-xs shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <span>Launch Portal</span>
            <ArrowRight size={12} className="text-neutral-400" />
          </button>
        </div>
      </nav>

      {/* 5. HERO SECTION */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-4 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Glowing badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-900/60 border border-neutral-800 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 shadow-sm"
          >
            <Sparkles size={11} className="text-neutral-400" />
            <span>Figma Blueprint to Production-Ready Code</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl sm:text-8xl font-display font-black tracking-tight text-white max-w-5xl mx-auto leading-[0.98] capitalize"
          >
            The Ultimate AI Platform For Content & Growth
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={fadeInUp}
            className="text-xs sm:text-base text-neutral-500 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Unify your creative engines and distribution metrics. Build personas, crawl sources, generate blogs, and optimize campaigns inside a single dynamic environment.
          </motion.p>
        </motion.div>
      </div>

      {/* 6. CENTRAL PORTAL ORB (Subtle center glow) */}
      <div className="relative w-64 h-64 mx-auto my-6 z-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-neutral-800/10 blur-2xl opacity-40" />
        
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute w-80 h-80 rounded-full border border-dashed border-neutral-800/30 flex items-center justify-center pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 absolute top-0" />
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 absolute bottom-0" />
        </motion.div>

        <motion.img
          src="/web3_portal_orb.png"
          alt="Web3 Portal Orb"
          className="w-56 h-56 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.05)] pointer-events-none"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* 7. AUTO SCROLLING CAROUSEL GALLERY */}
      <div className="w-full py-16 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-2 mb-8">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Zap size={14} className="text-neutral-400" /> Transform Your Workflow
          </h2>
          <p className="text-[10px] sm:text-xs text-neutral-500">Auto-scrolling studio portals. Hover to pause, click to launch.</p>
        </div>

        {/* Viewport container with fade masks on the edges */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#030303] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#030303] to-transparent z-20 pointer-events-none" />
          
          <div className="animate-marquee-infinite gap-6 flex px-4">
            {/* First copy */}
            {featuresData.map((card, idx) => (
              <TiltCard
                key={`a-${idx}`}
                glowColor={card.glowColor}
                onClick={() => handleLaunch(card.path)}
                className="w-[280px] sm:w-[320px] shrink-0 bg-neutral-900/35 border border-white/[0.03] rounded-[2.2rem] p-8 flex flex-col justify-between space-y-8 overflow-hidden hover:border-neutral-700 hover:bg-neutral-900/60 transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Feature Icon box */}
                  <div className={`w-11 h-11 rounded-2xl ${card.iconBg} border ${card.iconBorder} flex items-center justify-center ${card.iconColor} shadow-sm group-hover:scale-105 duration-300`}>
                    <card.icon size={18} />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 text-left">
                    <h3 className="font-display text-lg font-black text-white group-hover:text-neutral-300 transition-colors">{card.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* Explore Badge */}
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 text-left">
                  <span>Explore workspace</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 duration-200" />
                </div>
              </TiltCard>
            ))}

            {/* Second copy for seamless infinite loop */}
            {featuresData.map((card, idx) => (
              <TiltCard
                key={`b-${idx}`}
                glowColor={card.glowColor}
                onClick={() => handleLaunch(card.path)}
                className="w-[280px] sm:w-[320px] shrink-0 bg-neutral-900/35 border border-white/[0.03] rounded-[2.2rem] p-8 flex flex-col justify-between space-y-8 overflow-hidden hover:border-neutral-700 hover:bg-neutral-900/60 transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Feature Icon box */}
                  <div className={`w-11 h-11 rounded-2xl ${card.iconBg} border ${card.iconBorder} flex items-center justify-center ${card.iconColor} shadow-sm group-hover:scale-105 duration-300`}>
                    <card.icon size={18} />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 text-left">
                    <h3 className="font-display text-lg font-black text-white group-hover:text-neutral-300 transition-colors">{card.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* Explore Badge */}
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 text-left">
                  <span>Explore workspace</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 duration-200" />
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>

      {/* 8. BROWSER FRAME COMPARISON SLIDER */}
      <div className="max-w-4xl mx-auto px-6 pb-24 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sliders size={14} className="text-neutral-400" /> Interactive UI Visualizer
          </h2>
          <p className="text-[10px] sm:text-xs text-neutral-500">Slide to compare the Figma Blueprint (Left) with the Coded UI (Right)</p>
        </div>

        {/* Browser window wrap */}
        <div className="rounded-3xl border border-white/[0.05] overflow-hidden shadow-2xl bg-slate-950">
          {/* Browser header */}
          <div className="bg-neutral-900/40 border-b border-white/[0.03] px-5 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            </div>
            <div className="text-[9px] text-neutral-500 bg-black/60 px-6 py-1 rounded-md border border-white/[0.02] select-none font-mono">
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
              <div className="w-1/4 h-full border border-white/[0.03] bg-neutral-900/10 rounded-2xl p-4 flex flex-col justify-between hidden sm:flex">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/[0.03]">
                    <div className="w-6 h-6 rounded-lg bg-neutral-800" />
                    <div className="h-2 w-16 bg-white/10 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-full bg-neutral-900 rounded-lg flex items-center px-2">
                      <div className="w-2 h-2 rounded-full bg-neutral-500 mr-2" />
                      <div className="h-1.5 w-12 bg-neutral-750 rounded" />
                    </div>
                    <div className="h-6 w-full hover:bg-white/[0.01] rounded-lg flex items-center px-2">
                      <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
                      <div className="h-1.5 w-10 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.03]">
                  <div className="w-5 h-5 rounded-full bg-neutral-800" />
                  <div className="h-1.5 w-10 bg-white/5 rounded" />
                </div>
              </div>

              {/* Mock Dashboard Area */}
              <div className="flex-1 h-full flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
                  <div className="space-y-1 text-left">
                    <div className="h-3 w-28 bg-white/15 rounded" />
                    <div className="h-2 w-16 bg-white/5 rounded" />
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-extrabold text-neutral-400">OS</div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-2 gap-4 flex-1 py-4">
                  <div className="border border-white/[0.04] bg-neutral-900/10 rounded-2xl p-4 flex flex-col justify-between text-left">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 mb-2">
                        <Sparkles size={14} />
                      </div>
                      <div className="h-2.5 w-20 bg-white/15 rounded mb-1" />
                      <div className="h-1.5 w-28 bg-white/5 rounded" />
                    </div>
                    <div className="h-7 w-full bg-neutral-800 text-white text-[9px] font-bold rounded-lg flex items-center justify-center gap-1">
                      <span>Activate</span> <ArrowRight size={10} />
                    </div>
                  </div>

                  <div className="border border-white/[0.04] bg-neutral-900/10 rounded-2xl p-4 flex flex-col justify-between text-left">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 mb-2">
                        <TrendingUp size={14} />
                      </div>
                      <div className="h-2.5 w-24 bg-white/15 rounded mb-1" />
                      <div className="h-1.5 w-20 bg-white/5 rounded" />
                    </div>
                    <div className="h-7 w-full bg-neutral-800 text-white text-[9px] font-bold rounded-lg flex items-center justify-center gap-1">
                      <span>Monitor</span> <ArrowRight size={10} />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="p-3 bg-neutral-900/10 border border-white/[0.03] rounded-xl flex items-center justify-between">
                  <span className="text-[9px] text-neutral-400 flex items-center gap-1.5"><Cpu size={10} className="text-neutral-400" /> Active Optimization Pipeline</span>
                  <span className="text-[9px] font-bold text-neutral-400 font-mono animate-pulse">Running</span>
                </div>
              </div>
            </div>

            {/* LEFT SIDE: Figma Blueprint */}
            <div 
              className="absolute inset-0 h-full p-6 flex gap-6 bg-slate-950 border-r border-neutral-700"
              style={{ 
                width: `${sliderPos}%`,
                transition: isDragging ? 'none' : 'width 0.15s ease-out'
              }}
            >
              {/* Blueprint Overlay grids */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

              {/* Mock Sidebar Blueprint */}
              <div className="w-[185px] h-full border border-white/[0.05] bg-neutral-950/20 rounded-2xl p-4 flex flex-col justify-between shrink-0 hidden sm:flex relative">
                <span className="absolute top-1 left-1 text-[7px] font-mono text-neutral-500">W: 185px</span>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                    <div className="w-6 h-6 border border-white/10 border-dashed rounded" />
                    <div className="h-1.5 w-12 bg-white/5 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-full border border-white/10 rounded-lg flex items-center px-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 mr-2" />
                      <div className="h-1 w-10 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-10 bg-white/5 rounded" />
              </div>

              {/* Mock Dashboard Area Blueprint */}
              <div className="w-[500px] h-full flex flex-col justify-between shrink-0 relative">
                <span className="absolute top-1 left-1 text-[7px] font-mono text-neutral-500">Frame 01</span>
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="space-y-1 text-left">
                    <div className="h-2 w-20 bg-white/10 rounded" />
                    <div className="h-1.5 w-12 bg-white/5 rounded" />
                  </div>
                  <div className="w-7 h-7 border border-white/10 rounded-full flex items-center justify-center text-[7px] font-mono text-neutral-500">NODE</div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-2 gap-4 flex-1 py-4">
                  <div className="border border-white/10 bg-neutral-950/20 rounded-2xl p-4 flex flex-col justify-between text-left relative">
                    <span className="absolute bottom-1 right-2 text-[6px] font-mono text-neutral-500">Card</span>
                    <div>
                      <div className="w-8 h-8 border border-white/10 border-dashed rounded flex items-center justify-center text-neutral-500 mb-2">
                        +
                      </div>
                      <div className="h-2 w-14 bg-white/10 rounded mb-1" />
                      <div className="h-1 w-20 bg-white/5 rounded" />
                    </div>
                    <div className="h-7 w-full border border-white/10 rounded-lg flex items-center justify-center" />
                  </div>

                  <div className="border border-white/10 bg-neutral-950/20 rounded-2xl p-4 flex flex-col justify-between text-left relative">
                    <div>
                      <div className="w-8 h-8 border border-white/10 border-dashed rounded flex items-center justify-center text-neutral-500 mb-2">
                        +
                      </div>
                      <div className="h-2 w-16 bg-white/10 rounded mb-1" />
                    </div>
                    <div className="h-7 w-full border border-white/10 rounded-lg flex items-center justify-center" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="p-3 border border-white/10 bg-neutral-950/20 rounded-xl flex items-center justify-between">
                  <span className="text-[9px] text-neutral-500 font-mono">X: 24 Y: 320</span>
                  <span className="text-[9px] font-bold text-neutral-400 font-mono">Blueprint</span>
                </div>
              </div>
            </div>

            {/* SLIDER HANDLE BAR */}
            <div 
              onMouseDown={() => setIsDragging(true)}
              className="absolute top-0 bottom-0 w-0.5 bg-neutral-500 cursor-ew-resize z-40"
              style={{ 
                left: `${sliderPos}%`,
                transition: isDragging ? 'none' : 'left 0.15s ease-out'
              }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border border-neutral-600 flex items-center justify-center text-neutral-400 shadow-sm active:scale-95 transition-transform duration-200">
                <MoveHorizontal size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. DRIBBBLE-STYLE BENTO GRID FEATURE SHOWCASE */}
      <div className="border-t border-white/[0.02] bg-black/40 py-28 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h3 className="font-display text-4xl font-black text-white">Consolidated OS Engine</h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              How our system bridges creative expression and growth metrics natively.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Brand Grounding Engine (Col Span 2) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 bg-neutral-900/20 border border-white/[0.03] hover:border-neutral-700 rounded-[2.2rem] p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-200 mb-4 shadow-sm">
                  <Brain size={18} />
                </div>
                <h4 className="font-display font-black text-white text-xl">Core AI Grounding Engine</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal mt-2">
                  AI references uploaded corporate wikis, pitch decks, and audience guidelines to ensure every article draft maintains strict factual consistency.
                </p>
              </div>

              {/* Interactive Mock Doc Checklist */}
              <div className="bg-black/60 border border-white/[0.02] p-4.5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 tracking-wider">
                  <span>GROUNDING DOCUMENTS</span>
                  <span className="text-neutral-400">✓ GROUNDED</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-white/[0.01] border border-white/[0.02] rounded-lg">
                    <span className="text-slate-300 flex items-center gap-2"><FileText size={12} className="text-neutral-400" /> pitch_deck_v3.pdf</span>
                    <span className="text-[10px] text-neutral-400 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10">Indexed</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-white/[0.01] border border-white/[0.02] rounded-lg">
                    <span className="text-slate-300 flex items-center gap-2"><FileText size={12} className="text-neutral-400" /> brand_voice_guide.docx</span>
                    <span className="text-[10px] text-neutral-400 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10">Indexed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 2: Interactive Persona Selector (Col Span 1) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-neutral-900/20 border border-white/[0.03] hover:border-neutral-700 rounded-[2.2rem] p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-200 mb-4 shadow-sm">
                  <Compass size={18} />
                </div>
                <h4 className="font-display font-black text-white text-xl">Interactive Personas</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal mt-2">
                  Configure custom buyer personas with distinct writing speeds, vocabularies, and demographics.
                </p>
              </div>

              {/* Mini Interactive Persona Badge */}
              <div className="bg-black/60 border border-white/[0.02] p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-black text-xs text-white">
                  TE
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-xs font-bold text-white block">Tech Exec</span>
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Analytical Tone</span>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 3: Multi-Platform Publisher (Col Span 1) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-neutral-900/20 border border-white/[0.03] hover:border-neutral-700 rounded-[2.2rem] p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-200 mb-4 shadow-sm">
                  <Layout size={18} />
                </div>
                <h4 className="font-display font-black text-white text-xl">Multi-Channel Layouts</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal mt-2">
                  Draft blogs once, then compile and reformat for LinkedIn, Medium, and Substack channels.
                </p>
              </div>

              {/* Connected Icons visual mockup */}
              <div className="bg-black/60 border border-white/[0.02] p-4 rounded-2xl flex justify-between items-center relative overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400">LI</div>
                <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400">MD</div>
                <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400">SU</div>
              </div>
            </motion.div>

            {/* Bento Card 4: Campaigns metrics tracker (Col Span 2) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="md:col-span-2 bg-neutral-900/20 border border-white/[0.03] hover:border-neutral-700 rounded-[2.2rem] p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-200 mb-4 shadow-sm">
                  <BarChart3 size={18} />
                </div>
                <h4 className="font-display font-black text-white text-xl">Real-Time Campaigns Console</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal mt-2">
                  Launch automated LinkedIn campaigns, recharge wallets, map conversions, and run data audits.
                </p>
              </div>

              {/* Live Metric Graph visual mockup */}
              <div className="bg-black/60 border border-white/[0.02] p-4.5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500">
                  <span>CTR ANALYTICS</span>
                  <span className="text-neutral-400 font-mono font-black">+14.2%</span>
                </div>
                <div className="h-10 bg-neutral-900/10 border border-white/5 rounded-lg overflow-hidden flex items-end px-2 gap-1.5">
                  <div className="w-full h-[30%] bg-neutral-800 rounded-t" />
                  <div className="w-full h-[60%] bg-neutral-700 rounded-t" />
                  <div className="w-full h-[45%] bg-neutral-800 rounded-t" />
                  <div className="w-full h-[85%] bg-neutral-600 rounded-t" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* 10. FOOTER */}
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-slate-500 relative z-10 bg-[#030303]">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
