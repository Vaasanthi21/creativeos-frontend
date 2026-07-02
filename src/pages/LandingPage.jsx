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
  FileText,
  Check,
  Plus,
  Play,
  TrendingUp,
  Cpu,
  Monitor,
  Settings,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

// Reusable 3D Tilt Card Wrapper using Framer Motion physics
const TiltCard = ({ children, className, glowColor, onClick }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

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
      <div style={{ transform: 'translateZ(25px)' }} className="h-full relative z-10">
        {children}
      </div>

      {/* Behind-card glow */}
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

  // Coverflow carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCoverflowPaused, setIsCoverflowPaused] = useState(false);

  // Workflow timeline state
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isTimelinePaused, setIsTimelinePaused] = useState(false);

  // Active brand mockup selection state for hero dashboard
  const [heroActiveTab, setHeroActiveTab] = useState('editor');

  const handleLaunch = (targetPath) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/register?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  // sliding cards data representing features
  const featuresData = [
    {
      title: 'Generate Page',
      desc: 'Create high-performing blog outlines, copy components, and custom social assets grounded in your brand identity.',
      path: '/generate',
      icon: Sparkles,
      iconBg: 'bg-orange-550/10',
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

  useEffect(() => {
    if (isCoverflowPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardCount);
    }, 2800);
    return () => clearInterval(timer);
  }, [isCoverflowPaused, cardCount]);

  const getOffset = (idx) => {
    let diff = idx - activeIndex;
    if (diff > cardCount / 2) diff -= cardCount;
    if (diff < -cardCount / 2) diff += cardCount;
    return diff;
  };

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

  useEffect(() => {
    if (isTimelinePaused) return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % workflowSteps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isTimelinePaused]);

  return (
    <div className="dark relative min-h-screen bg-[#070708] text-[#f4f4f5] overflow-x-hidden font-display select-none">

      {/* 1. STAR LIGHT STARS BACKDROP */}
      <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.04] pointer-events-none" />

      {/* 2. INTERACTIVE SPOTLIGHT GLOW */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249,115,22,0.06) 0%, rgba(245,158,11,0.04) 50%, transparent 100%)`
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
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-orange-600/10 to-amber-600/5 blur-[140px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -60, 80, 0],
          y: [0, 90, -60, 0],
          scale: [1, 0.85, 1.2, 1],
          rotate: [0, -50, 50, 0]
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-20%] right-[-15%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/5 blur-[160px] pointer-events-none"
      />

      {/* Cybernetic Grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#191512_1px,transparent_1px),linear-gradient(to_bottom,#191512_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-35"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)'
        }}
      />

      {/* 4. FLOATING CAPSULE NAVIGATION HEADER */}
      <header className="sticky top-4 z-50 max-w-5xl mx-auto px-6">
        <nav className="w-full bg-[#0d0d0f]/70 backdrop-blur-xl border border-white/[0.05] rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-350" />
              <div className="relative w-8 h-8 rounded-lg bg-background flex items-center justify-center font-black text-foreground text-sm">
                C
              </div>
            </div>
            <span className="font-display font-black tracking-tight text-foreground text-sm">
              CreativeStudio <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#workflow" className="hover:text-foreground transition">Workflow</a>
            <a href="#engine" className="hover:text-foreground transition">Engine</a>
          </div>

          <div>
            <button
              onClick={() => handleLaunch('/generate')}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5 text-muted-foreground hover:text-foreground font-extrabold rounded-full text-xs transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Portal</span>
              <ArrowRight size={12} className="text-orange-400" />
            </button>
          </div>
        </nav>
      </header>

      {/* 5. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-4 text-center relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.2 bg-orange-500/10 border border-orange-500/25 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <Sparkles size={11} className="text-amber-400 animate-pulse" />
            <span>Interactive Production-Grade Release</span>
          </div>

          <h1 className="text-5xl sm:text-8xl font-display font-black tracking-tight text-foreground max-w-5xl mx-auto leading-[0.96] capitalize">
            The Intelligent Content Workspace For{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Fast Creators</span>
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Write brand-grounded documents, generate campaign visuals, and audit LinkedIn conversion performance under one highly responsive dark workspace.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => handleLaunch('/register')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-black rounded-full text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => handleLaunch('/generate')}
              className="px-6 py-3 bg-white/5 hover:bg-white/[0.08] border border-white/10 text-foreground font-black rounded-full text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <span>Explore Features</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. HERO INTERACTIVE DASHBOARD PREVIEW */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="rounded-3xl border border-white/[0.06] overflow-hidden shadow-2xl bg-[#09090b] shadow-orange-500/5">
          {/* Browser header */}
          <div className="bg-neutral-900/60 border-b border-white/[0.03] px-5 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
            </div>
            <div className="text-[10px] text-muted-foreground bg-black/60 px-6 py-1 rounded-full border border-white/[0.02] select-none font-mono">
              creativestudio.os/portal
            </div>
            <div className="flex items-center gap-3">
              <Bell size={13} className="text-muted-foreground" />
              <div className="w-5 h-5 rounded-full bg-neutral-800" />
            </div>
          </div>

          {/* Editor/Studio Inner layout mockup */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_240px] h-[400px] bg-[#0c0c0e]">
            {/* Sidebar Mockup */}
            <div className="border-r border-white/[0.03] p-4 flex flex-col justify-between hidden md:flex text-left">
              <div className="space-y-4">
                <span className="text-[8px] font-bold text-muted-foreground tracking-wider uppercase">STUDIO PIPELINES</span>
                <div className="space-y-1.5">
                  <div
                    onClick={() => setHeroActiveTab('editor')}
                    className={`px-3 py-1.8 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      heroActiveTab === 'editor' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-muted-foreground hover:bg-white/[0.02]'
                    }`}
                  >
                    <Sparkles size={13} />
                    <span>Generate Page</span>
                  </div>
                  <div
                    onClick={() => setHeroActiveTab('blog')}
                    className={`px-3 py-1.8 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      heroActiveTab === 'blog' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-muted-foreground hover:bg-white/[0.02]'
                    }`}
                  >
                    <Layout size={13} />
                    <span>Blog Studio</span>
                  </div>
                  <div
                    onClick={() => setHeroActiveTab('metrics')}
                    className={`px-3 py-1.8 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      heroActiveTab === 'metrics' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-muted-foreground hover:bg-white/[0.02]'
                    }`}
                  >
                    <BarChart3 size={13} />
                    <span>LinkedIn Tracker</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white/[0.01] rounded-xl border border-white/[0.03] text-left">
                <span className="text-[9px] font-mono text-muted-foreground block">ACTIVE BRAND</span>
                <span className="text-[10px] font-bold text-foreground flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Stripe Brand
                </span>
              </div>
            </div>

            {/* Central Editor Mockup */}
            <div className="p-6 flex flex-col justify-between text-left overflow-y-auto">
              <AnimatePresence mode="wait">
                {heroActiveTab === 'editor' && (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest font-black">AI Editor Workspace</span>
                        <h3 className="text-sm font-bold text-foreground">How AI is reshaping product engineering</h3>
                      </div>
                      <span className="text-[9px] text-muted-foreground">Draft 03</span>
                    </div>

                    <div className="space-y-2.5 font-mono text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                      <p>Over the last decade, UI workflows have evolved rapidly. Modern teams are transitioning from static wireframe handoffs directly into interactive, code-grounded sandbox environments...</p>
                      <p className="bg-orange-550/5 border border-orange-500/15 p-2 rounded-lg text-foreground flex items-center justify-between">
                        <span>✨ AI Assist: Refine tone to "Confident & Thought Leadership"</span>
                        <span className="text-[9px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded">Applying</span>
                      </p>
                      <p>This paradigm shift ensures styling fidelity remains 100% accurate, eliminating design compromises during final production compile runs...</p>
                    </div>
                  </motion.div>
                )}

                {heroActiveTab === 'blog' && (
                  <motion.div
                    key="blog"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-black">Blog outline generator</span>
                        <h3 className="text-sm font-bold text-foreground">SEO Keyword Strategy Brief</h3>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold">Grounded</span>
                    </div>

                    <div className="space-y-2">
                      <div className="border border-white/[0.03] p-3 rounded-xl bg-white/[0.01]">
                        <span className="text-[10px] font-bold text-foreground block">1. Introduction to Web3 Sandboxes</span>
                        <span className="text-[9px] text-muted-foreground block mt-1">Target keywords: figma wireframe, react code blocks, sandbox engine</span>
                      </div>
                      <div className="border border-white/[0.03] p-3 rounded-xl bg-white/[0.01]">
                        <span className="text-[10px] font-bold text-foreground block">2. Measuring Code Fidelity Performance</span>
                        <span className="text-[9px] text-muted-foreground block mt-1">Target keywords: production compile, css variables, design handoff</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {heroActiveTab === 'metrics' && (
                  <motion.div
                    key="metrics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest font-black">Live performance monitoring</span>
                        <h3 className="text-sm font-bold text-foreground">LinkedIn Campaign Conversion Loops</h3>
                      </div>
                      <span className="text-[9px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded">Active</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">
                        <span className="text-[9px] text-muted-foreground block">TOTAL REACH</span>
                        <span className="text-lg font-bold text-foreground mt-1 block">142,840</span>
                        <span className="text-[9px] text-emerald-400 font-bold">+24% this week</span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">
                        <span className="text-[9px] text-muted-foreground block">CONVERSIONS</span>
                        <span className="text-lg font-bold text-foreground mt-1 block">3,490</span>
                        <span className="text-[9px] text-emerald-400 font-bold">+18.5% this week</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right sidebar mockup */}
            <div className="border-l border-white/[0.03] p-4 flex flex-col justify-between hidden md:flex text-left">
              <div className="space-y-5">
                <span className="text-[8px] font-bold text-muted-foreground tracking-wider uppercase">BRAND COMPLIANCE</span>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-foreground font-bold flex justify-between">
                      <span>Factual Match</span>
                      <span className="text-orange-400">98%</span>
                    </span>
                    <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-orange-500 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-foreground font-bold flex justify-between">
                      <span>Tone Match</span>
                      <span className="text-amber-400">95%</span>
                    </span>
                    <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-amber-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-orange-500/5 rounded-xl border border-orange-500/10 text-left">
                <span className="text-[9px] text-orange-400 font-bold block uppercase tracking-wider">Engine Status</span>
                <span className="text-[10px] font-bold text-foreground mt-1 block">Fidelity Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AUTO-ROTATING 3D COVERFLOW FEATURE CARDS */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-24 relative z-10 text-center">
        <div className="space-y-2 mb-10">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Zap size={14} className="text-orange-400" /> Transform Your Workflow
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Cycles automatically — hover to pause, click a card to jump to it.</p>
        </div>

        {/* Coverflow stage: perspective container */}
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
                <div className="space-y-6 text-left">
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBg} border ${card.iconBorder} flex items-center justify-center ${card.iconColor} shadow-sm`}>
                    <card.icon size={24} />
                  </div>
                  <div className="space-y-3">
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
      </section>

      {/* 8. AUTO-PLAYING WORKFLOW TIMELINE */}
      <section id="workflow" className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
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
          {/* Step rail */}
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
                      backgroundColor: isActive || isPast ? step.solidColor : '#0d0d0f',
                      borderColor: isActive || isPast ? step.solidColor : 'rgba(255,255,255,0.12)'
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center shadow-lg"
                    style={isActive ? { boxShadow: `0 0 24px ${step.glow}` } : undefined}
                  >
                    <step.icon size={20} className={isActive || isPast ? 'text-slate-950' : 'text-slate-550'} />
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
      </section>

      {/* 9. DRIBBBLE-STYLE BENTO GRID FEATURE SHOWCASE */}
      <section id="engine" className="border-t border-white/[0.02] bg-background/60 py-28 relative z-10">
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
                  AI references uploaded corporate wikis, pitch decks, and guidelines to ensure drafts maintain strict brand consistency.
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
                    <span className="text-[10px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Indexed</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-white/[0.01] border border-white/[0.03] rounded-lg">
                    <span className="text-slate-350 flex items-center gap-2"><FileText size={12} className="text-orange-400" /> brand_voice_guide.docx</span>
                    <span className="text-[10px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Indexed</span>
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

              {/* Connected Icons mockup */}
              <div className="bg-background/70 border border-white/[0.03] p-4 rounded-2xl flex justify-between items-center relative overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400">LI</div>
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400">MD</div>
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400">SU</div>
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
                <div className="h-10 bg-orange-550/10 border border-orange-500/10 rounded-lg overflow-hidden flex items-end px-2 gap-1.5">
                  <div className="w-full h-[30%] bg-orange-400/40 rounded-t" />
                  <div className="w-full h-[60%] bg-orange-400/60 rounded-t" />
                  <div className="w-full h-[45%] bg-orange-400/40 rounded-t" />
                  <div className="w-full h-[85%] bg-orange-400 rounded-t" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-muted-foreground relative z-10 bg-background">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;