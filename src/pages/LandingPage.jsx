import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Brain,
  Workflow,
  Layout,
  BarChart3,
  Video,
  Image as ImageIcon,
  Compass,
  Users,
  Send,
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

  // Pointer position for custom background spotlight (Brand Orange Glow)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Coverflow carousel state — auto-advances through cards, pauses on hover
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCoverflowPaused, setIsCoverflowPaused] = useState(false);

  // Workflow timeline state — auto-advances through steps, pauses on hover
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isTimelinePaused, setIsTimelinePaused] = useState(false);

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

  // sliding cards data representing features — brand orange palette
  const featuresData = [
    {
      title: 'Generate Page',
      desc: 'Create high-performing blog outlines, copy components, and custom social assets grounded in your brand identity.',
      path: '/generate',
      icon: Sparkles,
      iconBg: 'bg-orange-500/10',
      iconBorder: 'border-orange-500/25',
      iconColor: 'text-orange-400',
      glowColor: 'rgba(249,115,22,0.18)'
    },
    {
      title: 'Blog Studio',
      desc: 'Formulate search engine optimized structures, index topics, and draft comprehensive articles automatically.',
      path: '/blog-studio',
      icon: Layout,
      iconBg: 'bg-amber-500/10',
      iconBorder: 'border-amber-500/25',
      iconColor: 'text-amber-400',
      glowColor: 'rgba(245,158,11,0.18)'
    },
    {
      title: 'Image Studio',
      desc: 'Produce breathtaking graphics, marketing banners, and visual layouts tailored to maximize social conversion.',
      path: '/image-studio',
      icon: ImageIcon,
      iconBg: 'bg-yellow-500/10',
      iconBorder: 'border-yellow-500/25',
      iconColor: 'text-yellow-400',
      glowColor: 'rgba(234,179,8,0.18)'
    },
    {
      title: 'Video Studio',
      desc: 'Design engaging social reels and brand video presentations complete with AI narration audio loops.',
      path: '/video-studio',
      icon: Video,
      iconBg: 'bg-orange-600/10',
      iconBorder: 'border-orange-600/25',
      iconColor: 'text-orange-500',
      glowColor: 'rgba(234,88,12,0.18)'
    },
    {
      title: 'LinkedIn Tracker',
      desc: 'Track conversions metrics, run analytics audits, and manage corporate campaign ad budgets in real-time.',
      path: '/linkedinads',
      icon: BarChart3,
      iconBg: 'bg-red-500/10',
      iconBorder: 'border-red-500/25',
      iconColor: 'text-red-400',
      glowColor: 'rgba(239,68,68,0.18)'
    }
  ];

  const cardCount = featuresData.length;

  // Auto-advance the coverflow carousel every 2.6s — pauses on hover
  useEffect(() => {
    if (isCoverflowPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardCount);
    }, 2600);
    return () => clearInterval(timer);
  }, [isCoverflowPaused, cardCount]);

  // Shortest signed distance from a card's index to the active card
  const getOffset = (idx) => {
    let diff = idx - activeIndex;
    if (diff > cardCount / 2) diff -= cardCount;
    if (diff < -cardCount / 2) diff += cardCount;
    return diff;
  };

  // Workflow timeline steps — Brand Orange Theme colors
  const workflowSteps = [
    {
      title: 'Brief',
      icon: FileText,
      desc: 'Drop in your goals, references, and brand voice. CreativeStudio OS builds working context from it automatically — no separate setup step.',
      chips: ['Goal: Product launch', 'Voice: Confident'],
      solidColor: '#f59e0b',
      lineColor: '#f59e0b',
      glow: 'rgba(245,158,11,0.45)'
    },
    {
      title: 'Draft',
      icon: Sparkles,
      desc: 'AI drafts blog posts, captions, and visuals grounded in the brief — fully formed first passes, ready for you to shape.',
      chips: ['Blog outline ready', '3 caption variants'],
      solidColor: '#f97316',
      lineColor: '#f97316',
      glow: 'rgba(249,115,22,0.45)'
    },
    {
      title: 'Personas',
      icon: Users,
      desc: 'Tune tone and vocabulary per audience before anything ships, so the same idea lands right for every reader.',
      chips: ['Tech Exec: Analytical', 'Creator: Casual'],
      solidColor: '#ea580c',
      lineColor: '#ea580c',
      glow: 'rgba(234,88,12,0.45)'
    },
    {
      title: 'Publish',
      icon: Send,
      desc: 'Push the finished piece to LinkedIn, your blog, and every channel it belongs on — in one click, already formatted.',
      chips: ['LinkedIn ✓', 'Blog ✓', 'Newsletter ✓'],
      solidColor: '#e11d48',
      lineColor: '#e11d48',
      glow: 'rgba(225,29,72,0.45)'
    }
  ];

  // Auto-advance the workflow timeline every 3.2s — pauses on hover
  useEffect(() => {
    if (isTimelinePaused) return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % workflowSteps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isTimelinePaused]);

  return (
    <div className="dark relative min-h-screen bg-background text-foreground overflow-hidden font-display select-none">

      {/* 1. STAR LIGHT STARS BACKDROP */}
      <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none" />

      {/* 2. INTERACTIVE MOUSE SPOTLIGHT (Brand Orange Spotlight) */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-70 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249,115,22,0.06) 0%, rgba(245,158,11,0.04) 50%, transparent 100%)`
        }}
      />

      {/* 3. DYNAMIC NEBULA BLOBS (Orange / Amber Theme) */}
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
        className="absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-orange-600/10 to-amber-600/5 blur-[140px] pointer-events-none"
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
        className="absolute bottom-[-20%] right-[-15%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/5 blur-[160px] pointer-events-none"
      />

      {/* Cybernetic grid overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#2a1808_1px,transparent_1px),linear-gradient(to_bottom,#2a1808_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-25 animate-pulse"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          animationDuration: '8s'
        }}
      />

      {/* 4. PREMIUM GLASS NAVIGATION HEADER */}
      <nav className="sticky top-0 z-50 w-full bg-background/65 backdrop-blur-lg border-b border-white/[0.04] px-8 py-4.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-9 h-9 rounded-xl bg-background flex items-center justify-center font-extrabold text-foreground text-base">
              C
            </div>
          </div>
          <span className="font-display font-black tracking-tight text-foreground text-base">
            CreativeStudio <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">OS</span>
          </span>
        </div>

        <div>
          <button
            onClick={() => handleLaunch('/generate')}
            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5 text-muted-foreground hover:text-foreground font-extrabold rounded-xl text-xs shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <span>Launch Portal</span>
            <ArrowRight size={13} className="text-orange-400" />
          </button>
        </div>
      </nav>

      {/* 5. HERO SECTION */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-2 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Glowing badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-orange-500/10 border border-orange-500/25 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:border-orange-500/40 transition-all duration-300"
          >
            <Sparkles size={11} className="text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Figma Blueprint to Production-Ready Code</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-8xl font-display font-black tracking-tight text-foreground max-w-5xl mx-auto leading-[0.98] capitalize animate-fade-in"
          >
            The Ultimate{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">AI Platform</span>
            </span>{' '}
            For{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Content & Growth</span>
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-xs sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Unify your creative engines and distribution metrics. Build personas, crawl sources, generate blogs, and optimize campaigns inside a single dynamic environment.
          </motion.p>
        </motion.div>
      </div>

      {/* 6. DUAL SWIRLING PORTAL ORB (Brand Orange / Amber Core) */}
      <div className="relative w-64 h-64 mx-auto my-10 z-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 blur-3xl opacity-35" />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute w-80 h-80 rounded-full border border-dashed border-orange-500/20 flex items-center justify-center pointer-events-none"
        >
          <span className="w-2 h-2 rounded-full bg-orange-400 absolute top-0" />
          <span className="w-2 h-2 rounded-full bg-amber-400 absolute bottom-0" />
        </motion.div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[340px] h-[340px] rounded-full border border-dashed border-white/5 flex items-center justify-center pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 absolute left-0" />
        </motion.div>

        {/* Code-drawn core — Orange Base, bound to HSL variables */}
        <motion.div
          className="relative w-56 h-56 rounded-full z-10 pointer-events-none"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.95) 0%, rgba(253,230,138,0.9) 10%, rgba(249,115,22,0.85) 28%, rgba(194,65,12,0.9) 52%, hsl(var(--background)) 78%)',
              boxShadow: '0 0 70px rgba(249,115,22,0.45), inset -18px -18px 50px rgba(0,0,0,0.55)'
            }}
          />

          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-70">
            <ellipse cx="100" cy="100" rx="96" ry="34" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
            <ellipse cx="100" cy="100" rx="96" ry="64" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            <ellipse cx="100" cy="100" rx="58" ry="96" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            <ellipse cx="100" cy="100" rx="30" ry="96" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </svg>

          {/* Slow rotating dashed ring */}
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="100" cy="100" r="98" fill="none" stroke="url(#coreRingGradient)" strokeWidth="2" strokeDasharray="3 11" strokeLinecap="round" />
            <defs>
              <linearGradient id="coreRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </motion.svg>

          <div
            className="absolute top-[14%] left-[24%] w-10 h-6 rounded-full opacity-70"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, transparent 70%)', filter: 'blur(2px)' }}
          />
        </motion.div>
      </div>

      {/* 7. AUTO-ROTATING 3D COVERFLOW FEATURE CARDS (Medium Cards) */}
      <div className="max-w-6xl mx-auto px-6 pb-24 relative z-10 text-center">
        <div className="space-y-2 mb-10">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Zap size={14} className="text-orange-400" /> Transform Your Workflow
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Cycles automatically — hover to pause, click a card to jump to it.</p>
        </div>

        {/* Coverflow stage: perspective container, cards positioned absolutely and animated by offset */}
        <div
          className="relative h-[450px] sm:h-[500px] flex items-center justify-center"
          style={{ perspective: '1600px' }}
          onMouseEnter={() => setIsCoverflowPaused(true)}
          onMouseLeave={() => setIsCoverflowPaused(false)}
        >
          {featuresData.map((card, idx) => {
            const offset = getOffset(idx);
            const abs = Math.abs(offset);
            const isActive = offset === 0;

            // Cards more than 2 positions away are hidden entirely
            if (abs > 2) return null;

            const translateX = offset * 280;
            const scale = isActive ? 1 : abs === 1 ? 0.8 : 0.62;
            const rotateY = isActive ? 0 : offset > 0 ? -38 : 38;
            const opacity = isActive ? 1 : abs === 1 ? 0.65 : 0.32;
            const zIndex = 20 - abs;

            return (
              <motion.div
                key={card.title}
                onClick={() => (isActive ? handleLaunch(card.path) : setActiveIndex(idx))}
                animate={{ x: translateX, scale, rotateY, opacity }}
                transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                style={{ zIndex, transformStyle: 'preserve-3d' }}
                className="absolute w-[330px] sm:w-[370px] h-[380px] sm:h-[420px] cursor-pointer bg-card/75 border border-white/[0.06] rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm shadow-2xl"
              >
                <div className="space-y-6">
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBg} border ${card.iconBorder} flex items-center justify-center ${card.iconColor} shadow-sm`}>
                    <card.icon size={24} />
                  </div>
                  <div className="space-y-3 text-left">
                    <h3 className="font-display text-xl font-black text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest ${card.iconColor} text-left`}>
                  <span>Explore workspace</span>
                  <ArrowRight size={13} />
                </div>

                {/* Ambient glow only on the active, front-facing card */}
                {isActive && (
                  <div
                    className="absolute -inset-px rounded-3xl -z-10 blur-2xl pointer-events-none"
                    style={{ background: `radial-gradient(220px circle, ${card.glowColor} 0%, transparent 80%)` }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Position indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {featuresData.map((card, idx) => (
            <button
              key={card.title}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show ${card.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? `w-6 ${card.iconColor.replace('text-', 'bg-')}` : 'w-1.5 bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 8. AUTO-PLAYING WORKFLOW TIMELINE */}
      <div className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <div className="text-center space-y-2 mb-14">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Workflow size={14} className="text-orange-400" /> How It Flows
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Plays automatically — hover to pause, click a step to jump to it.</p>
        </div>

        <div
          onMouseEnter={() => setIsTimelinePaused(true)}
          onMouseLeave={() => setIsTimelinePaused(false)}
        >
          {/* Step rail: connecting line + numbered nodes */}
          <div className="relative flex items-center justify-between mb-12 px-2 sm:px-6">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/[0.06] mx-2 sm:mx-6" />
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] mx-2 sm:mx-6"
              style={{ background: `linear-gradient(90deg, ${workflowSteps.map(s => s.lineColor).join(', ')})` }}
              animate={{ width: `${(activeStepIndex / (workflowSteps.length - 1)) * 100}%` }}
              transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            />
            {workflowSteps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;
              return (
                <button
                  key={step.title}
                  onClick={() => setActiveStepIndex(idx)}
                  className="relative z-10 flex flex-col items-center gap-3 cursor-pointer group bg-transparent border-0"
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      backgroundColor: isActive || isPast ? step.solidColor : 'rgba(15,17,33,1)',
                      borderColor: isActive || isPast ? step.solidColor : 'rgba(255,255,255,0.12)'
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center shadow-lg"
                    style={isActive ? { boxShadow: `0 0 24px ${step.glow}` } : undefined}
                  >
                    <step.icon size={20} className={isActive || isPast ? 'text-slate-950' : 'text-slate-500'} />
                  </motion.div>
                  <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active step detail panel */}
          <div className="relative min-h-[220px] sm:min-h-[200px]">
            <AnimatePresence mode="wait">
              {workflowSteps.map((step, idx) => (
                idx === activeStepIndex && (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                    className="bg-card/45 border border-white/[0.06] rounded-3xl p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-center"
                  >
                    <div className="text-left space-y-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: step.solidColor }}>
                        Step {idx + 1} of {workflowSteps.length}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{step.desc}</p>
                    </div>

                    {/* Small per-step visual mockup */}
                    <div className="flex gap-2 sm:flex-col shrink-0">
                      {step.chips.map((chip) => (
                        <span
                          key={chip}
                          className="text-[10px] sm:text-xs font-semibold px-3 py-2 rounded-xl border whitespace-nowrap"
                          style={{ color: step.solidColor, borderColor: `${step.solidColor}40`, backgroundColor: `${step.solidColor}14` }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>


      {/* 9. DRIBBBLE-STYLE BENTO GRID FEATURE SHOWCASE */}
      <div className="border-t border-white/[0.02] bg-background/60 py-28 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h3 className="font-display text-4xl font-black text-foreground">Consolidated OS Engine</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
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
              className="md:col-span-2 bg-card/30 border border-white/[0.04] hover:border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
                  <Brain size={18} />
                </div>
                <h4 className="font-display font-black text-foreground text-xl">Core AI Grounding Engine</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-normal mt-2">
                  AI references uploaded corporate wikis, pitch decks, and audience guidelines to ensure every article draft maintains strict factual consistency.
                </p>
              </div>

              {/* Interactive Mock Doc Checklist */}
              <div className="bg-background/70 border border-white/[0.03] p-4.5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground tracking-wider">
                  <span>GROUNDING DOCUMENTS</span>
                  <span className="text-orange-400">✓ GROUNDED</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-white/[0.01] border border-white/[0.03] rounded-lg">
                    <span className="text-slate-350 flex items-center gap-2"><FileText size={12} className="text-orange-400" /> pitch_deck_v3.pdf</span>
                    <span className="text-[10px] text-orange-400 font-bold bg-orange-550/10 px-2 py-0.5 rounded border border-orange-500/20">Indexed</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-white/[0.01] border border-white/[0.03] rounded-lg">
                    <span className="text-slate-350 flex items-center gap-2"><FileText size={12} className="text-orange-400" /> brand_voice_guide.docx</span>
                    <span className="text-[10px] text-orange-400 font-bold bg-orange-550/10 px-2 py-0.5 rounded border border-orange-500/20">Indexed</span>
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
              className="bg-card/30 border border-white/[0.04] hover:border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
                  <Compass size={18} />
                </div>
                <h4 className="font-display font-black text-foreground text-xl">Interactive Personas</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-normal mt-2">
                  Configure custom buyer personas with distinct writing speeds, vocabularies, and demographics.
                </p>
              </div>

              {/* Mini Interactive Persona Badge */}
              <div className="bg-background/70 border border-white/[0.03] p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-xs text-white">
                  TE
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-xs font-bold text-white block">Tech Exec</span>
                  <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider block">Analytical Tone</span>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 3: Multi-Platform Publisher (Col Span 1) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card/30 border border-white/[0.04] hover:border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
                  <Layout size={18} />
                </div>
                <h4 className="font-display font-black text-foreground text-xl">Multi-Channel Layouts</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-normal mt-2">
                  Draft blogs once, then compile and reformat for LinkedIn, Medium, and Substack channels.
                </p>
              </div>

              {/* Connected Icons visual mockup */}
              <div className="bg-background/70 border border-white/[0.03] p-4 rounded-2xl flex justify-between items-center relative overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-orange-550/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400">LI</div>
                <div className="w-7 h-7 rounded-lg bg-orange-550/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400">MD</div>
                <div className="w-7 h-7 rounded-lg bg-orange-550/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400">SU</div>
              </div>
            </motion.div>

            {/* Bento Card 4: Campaigns metrics tracker (Col Span 2) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="md:col-span-2 bg-card/30 border border-white/[0.04] hover:border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
                  <BarChart3 size={18} />
                </div>
                <h4 className="font-display font-black text-foreground text-xl">Real-Time Campaigns Console</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-normal mt-2">
                  Launch automated LinkedIn campaigns, recharge wallets, map conversions, and run data audits.
                </p>
              </div>

              {/* Live Metric Graph visual mockup */}
              <div className="bg-background/70 border border-white/[0.03] p-4.5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                  <span>CTR ANALYTICS</span>
                  <span className="text-orange-400 font-mono font-black">+14.2%</span>
                </div>
                <div className="h-10 bg-orange-500/10 border border-orange-555/5 rounded-lg overflow-hidden flex items-end px-2 gap-1.5">
                  <div className="w-full h-[30%] bg-orange-400/40 rounded-t" />
                  <div className="w-full h-[60%] bg-orange-400/60 rounded-t" />
                  <div className="w-full h-[45%] bg-orange-400/40 rounded-t" />
                  <div className="w-full h-[85%] bg-orange-400 rounded-t" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* 10. FOOTER */}
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-muted-foreground relative z-10 bg-background">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;