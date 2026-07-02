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
  FolderOpen,
  Sliders,
  Terminal,
  Activity,
  Layers,
  Globe
} from 'lucide-react';

// 1. Magnetic Hover Button Wrapper using cursor physics
const MagneticButton = ({ children, onClick, className }) => {
  const buttonRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 15, stiffness: 120 });
  const springY = useSpring(y, { damping: 15, stiffness: 120 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Limit pull range to 25px
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={`relative group cursor-pointer ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-full bg-white/[0.03] scale-0 group-hover:scale-100 transition-transform duration-350 z-0" />
    </motion.button>
  );
};

// 2. Parallax 3D Hover Card Wrapper (moves inner items at different rates)
const ParallaxCard = ({ children, className, glowColor, onClick }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Rotation angles
  const rotateX = useTransform(mouseY, [-200, 200], [12, -12]);
  const rotateY = useTransform(mouseX, [-200, 200], [-12, 12]);

  // Spring physics
  const springX = useSpring(rotateX, { damping: 20, stiffness: 130 });
  const springY = useSpring(rotateY, { damping: 20, stiffness: 130 });

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
        perspective: 1200
      }}
      className={`relative group cursor-pointer ${className}`}
    >
      {/* 3D Depth Card Body */}
      <div style={{ transform: 'translateZ(35px)' }} className="h-full relative z-10 transform-gpu">
        {children}
      </div>

      {/* Ambient background glow */}
      <div 
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none z-0"
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

  // Mouse coordinates for background spotlights
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

  // Pipeline simulation state variables
  const [pipelineState, setPipelineState] = useState('idle'); // idle, ingesting, drafting, rewriting, ready
  const [consoleLogs, setConsoleLogs] = useState([
    'System ready. Standing by for pipeline task...'
  ]);

  // Voice rewriter state (Interactive Tone Slider)
  const [toneValue, setToneValue] = useState(50); // 0 (casual), 50 (corporate), 100 (geek)
  
  const getRewriterText = () => {
    if (toneValue < 30) {
      return "🚨 OMG we just shipped a crazy new feature! Deploying web3 sandboxes straight from your figma layout. Check it out now, links in bio! ✨🚀";
    } else if (toneValue > 70) {
      return "🔧 [DEPLOYMENT] Automated compile routines successfully bound to local custom properties. Initializing containerized sandbox node pipeline interfaces.";
    } else {
      return "💼 We are proud to announce the integration of sandboxed code-generation tools. This functionality streamlines design translation for growth teams.";
    }
  };

  const handleLaunch = (targetPath) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/register?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  // sliding cards features data
  const featuresData = [
    {
      title: 'Generate Page',
      desc: 'Create high-performing blog outlines, copy components, and custom social assets grounded in your brand identity.',
      path: '/generate',
      icon: Sparkles,
      iconBg: 'bg-orange-500/10',
      iconBorder: 'border-orange-500/25',
      iconColor: 'text-orange-400',
      glowColor: 'rgba(249,115,22,0.22)'
    },
    {
      title: 'Blog Studio',
      desc: 'Formulate search engine optimized structures, index topics, and draft comprehensive articles automatically.',
      path: '/blog-studio',
      icon: Layout,
      iconBg: 'bg-amber-500/10',
      iconBorder: 'border-amber-500/25',
      iconColor: 'text-amber-400',
      glowColor: 'rgba(245,158,11,0.22)'
    },
    {
      title: 'Image Studio',
      desc: 'Produce breathtaking graphics, marketing banners, and visual layouts tailored to maximize social conversion.',
      path: '/image-studio',
      icon: ImageIcon,
      iconBg: 'bg-yellow-500/10',
      iconBorder: 'border-yellow-500/25',
      iconColor: 'text-yellow-400',
      glowColor: 'rgba(234,179,8,0.22)'
    },
    {
      title: 'Video Studio',
      desc: 'Design engaging social reels and brand video presentations complete with AI narration audio loops.',
      path: '/video-studio',
      icon: Video,
      iconBg: 'bg-orange-650/10',
      iconBorder: 'border-orange-650/25',
      iconColor: 'text-orange-500',
      glowColor: 'rgba(234,88,12,0.22)'
    },
    {
      title: 'LinkedIn Tracker',
      desc: 'Track conversions metrics, run analytics audits, and manage corporate campaign ad budgets in real-time.',
      path: '/linkedinads',
      icon: BarChart3,
      iconBg: 'bg-red-500/10',
      iconBorder: 'border-red-500/25',
      iconColor: 'text-red-400',
      glowColor: 'rgba(239,68,68,0.22)'
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

  // Launch pipeline simulator steps in sequence
  const startPipelineDemo = async () => {
    if (pipelineState !== 'idle') return;

    setPipelineState('ingesting');
    setConsoleLogs((prev) => [...prev, '⚡ Initiating grounding cycle...', '📂 Loading Brand Guideline docs (Stripe_Voice.pdf)']);
    
    await new Promise((r) => setTimeout(r, 1800));
    setPipelineState('drafting');
    setConsoleLogs((prev) => [...prev, '✓ Context index compiled successfully. (Score: 98%)', '🤖 AI Editor generating draft components...']);

    await new Promise((r) => setTimeout(r, 1800));
    setPipelineState('rewriting');
    setConsoleLogs((prev) => [...prev, '✓ Content drafted (580 words).', '🧬 Tuning tone to active personas...']);

    await new Promise((r) => setTimeout(r, 1800));
    setPipelineState('ready');
    setConsoleLogs((prev) => [...prev, '✓ Persona tune completed.', '🚀 Ready for production publication!']);

    await new Promise((r) => setTimeout(r, 2000));
    setPipelineState('idle');
    setConsoleLogs(['System ready. Standing by for pipeline task...']);
  };

  return (
    <div className="dark relative min-h-screen bg-[#060608] text-[#f4f4f6] overflow-x-hidden font-display select-none">

      {/* 1. BRAND ORANGE PARALLAX BLURS */}
      <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* 2. DYNAMIC MAGNETIC SPOTLIGHT */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249,115,22,0.06) 0%, rgba(245,158,11,0.04) 50%, transparent 100%)`
        }}
      />

      {/* 3. DYNAMIC NEBULA BLOBS */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.2, 0.85, 1],
          rotate: [0, 45, -45, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-orange-650/10 to-amber-600/5 blur-[140px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -40, 60, 0],
          y: [0, 80, -40, 0],
          scale: [1, 0.88, 1.15, 1],
          rotate: [0, -40, 40, 0]
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-20%] right-[-15%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-550/5 blur-[160px] pointer-events-none"
      />

      {/* Cybernetic grid lines overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#191512_1px,transparent_1px),linear-gradient(to_bottom,#191512_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-35"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)'
        }}
      />

      {/* 4. FLOATING CAPSULE NAVIGATION HEADER */}
      <header className="sticky top-4 z-50 max-w-5xl mx-auto px-6">
        <nav className="w-full bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/[0.05] rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-550 to-amber-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-8 h-8 rounded-lg bg-[#060608] flex items-center justify-center font-black text-foreground text-sm">
                C
              </div>
            </div>
            <span className="font-display font-black tracking-tight text-foreground text-sm">
              CreativeStudio <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#pipelines" className="hover:text-foreground transition">Live Pipelines</a>
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
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.2 bg-orange-500/10 border border-orange-500/25 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
          >
            <Sparkles size={11} className="text-amber-400 animate-pulse" />
            <span>CreativeOS V2 Engine Release</span>
          </motion.div>

          <h1 className="text-5xl sm:text-8xl font-display font-black tracking-tight text-foreground max-w-5xl mx-auto leading-[0.96] capitalize">
            The Interactive{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Creative Portal</span>
            </span>{' '}
            For Teams
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Write brand-grounded outlines, design campaign banners, and audit LinkedIn metric cycles inside an immersive, hardware-accelerated workspace.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <MagneticButton
              onClick={() => handleLaunch('/register')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-black rounded-full text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight size={13} />
            </MagneticButton>
            <MagneticButton
              onClick={() => handleLaunch('/generate')}
              className="px-6 py-3 bg-white/5 hover:bg-white/[0.08] border border-white/10 text-foreground font-black rounded-full text-xs flex items-center gap-2"
            >
              <span>Explore Studio</span>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 6. IMMERSIVE PIPELINE FLOW SIMULATOR */}
      <section id="pipelines" className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="rounded-3xl border border-white/[0.06] overflow-hidden bg-[#09090b] shadow-2xl shadow-orange-500/5">
          {/* Header block */}
          <div className="bg-neutral-900/60 border-b border-white/[0.03] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-orange-400 animate-pulse" />
              <span className="text-xs font-bold text-foreground">Interactive OS Pipeline Portal</span>
            </div>
            <button
              onClick={startPipelineDemo}
              disabled={pipelineState !== 'idle'}
              className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition ${
                pipelineState !== 'idle' ? 'bg-white/5 text-muted-foreground border border-white/5' : 'bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/20 cursor-pointer'
              }`}
            >
              <Play size={10} fill="currentColor" />
              <span>{pipelineState !== 'idle' ? 'Processing...' : 'Run Pipeline'}</span>
            </button>
          </div>

          {/* Flow board */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] h-[360px] bg-[#0c0c0e]">
            {/* Left board visual flow */}
            <div className="p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center z-10">
                {/* Node 1: Ingestion */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                    pipelineState === 'ingesting' ? 'bg-orange-500/20 border-orange-500 text-orange-400 scale-110 shadow-lg shadow-orange-500/10' : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground'
                  }`}>
                    <FolderOpen size={18} />
                  </div>
                  <span className="text-[10px] font-bold">1. Ingest Brand</span>
                </div>

                {/* Arrow bridge */}
                <div className="w-10 sm:w-16 h-[2px] bg-white/[0.04] relative">
                  {pipelineState === 'ingesting' && (
                    <motion.div
                      className="absolute top-0 bottom-0 bg-orange-400 w-3 rounded-full"
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>

                {/* Node 2: Writer */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                    pipelineState === 'drafting' ? 'bg-orange-550/20 border-orange-500 text-orange-400 scale-110 shadow-lg shadow-orange-500/10' : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground'
                  }`}>
                    <Sparkles size={18} />
                  </div>
                  <span className="text-[10px] font-bold">2. AI Studio Draft</span>
                </div>

                {/* Arrow bridge */}
                <div className="w-10 sm:w-16 h-[2px] bg-white/[0.04] relative">
                  {pipelineState === 'drafting' && (
                    <motion.div
                      className="absolute top-0 bottom-0 bg-orange-450 w-3 rounded-full"
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>

                {/* Node 3: Tuning */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                    pipelineState === 'rewriting' ? 'bg-amber-500/20 border-amber-500 text-amber-400 scale-110 shadow-lg shadow-amber-500/10' : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground'
                  }`}>
                    <Users size={18} />
                  </div>
                  <span className="text-[10px] font-bold">3. Tune Persona</span>
                </div>

                {/* Arrow bridge */}
                <div className="w-10 sm:w-16 h-[2px] bg-white/[0.04] relative">
                  {pipelineState === 'rewriting' && (
                    <motion.div
                      className="absolute top-0 bottom-0 bg-amber-450 w-3 rounded-full"
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>

                {/* Node 4: Ready */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                    pipelineState === 'ready' ? 'bg-red-500/20 border-red-500 text-red-400 scale-110 shadow-lg shadow-red-500/10' : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground'
                  }`}>
                    <Send size={18} />
                  </div>
                  <span className="text-[10px] font-bold">4. Distribute</span>
                </div>
              </div>

              {/* Graphic center flow status */}
              <div className="border border-white/[0.03] p-4.5 rounded-2xl bg-white/[0.01] text-left z-10 min-h-[90px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {pipelineState === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">STATION STATUS</span>
                      <p className="text-xs text-foreground font-bold mt-1">Ready to compile brand assets. Press "Run Pipeline" above to preview.</p>
                    </motion.div>
                  )}
                  {pipelineState === 'ingesting' && (
                    <motion.div key="ingesting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <span className="text-[10px] text-orange-400 uppercase font-mono font-black animate-pulse">INGESTING BRAND GUIDELINES</span>
                      <p className="text-xs text-foreground font-bold mt-1">Indexing Stripe_Voice.pdf & brand_parameters.docx...</p>
                    </motion.div>
                  )}
                  {pipelineState === 'drafting' && (
                    <motion.div key="drafting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <span className="text-[10px] text-orange-400 uppercase font-mono font-black animate-pulse">GENERATING DRAFT</span>
                      <p className="text-xs text-foreground font-bold mt-1">Drafting article copy using brand-specific tone structures...</p>
                    </motion.div>
                  )}
                  {pipelineState === 'rewriting' && (
                    <motion.div key="rewriting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <span className="text-[10px] text-amber-400 uppercase font-mono font-black animate-pulse">TUNING PERSONA CHANNELS</span>
                      <p className="text-xs text-foreground font-bold mt-1">Adapting syntax structure for corporate and technical audiences...</p>
                    </motion.div>
                  )}
                  {pipelineState === 'ready' && (
                    <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <span className="text-[10px] text-red-400 uppercase font-mono font-black">PIPELINE READY</span>
                      <p className="text-xs text-foreground font-bold mt-1">Draft packages compiled and ready to push to LinkedIn ads console!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative grid orb */}
              <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
            </div>

            {/* Right log terminal */}
            <div className="border-l border-white/[0.03] p-4 bg-[#08080a] flex flex-col justify-between text-left font-mono">
              <div className="space-y-3">
                <span className="text-[8px] font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                  <Terminal size={11} className="text-orange-400" /> SYSTEM LOGS
                </span>
                
                <div className="space-y-1.8 h-[240px] overflow-y-auto text-[9px] text-muted-foreground leading-normal">
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className="border-b border-white/[0.02] pb-1">
                      <span className="text-orange-500 mr-1.5">&gt;</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC SLIDING COVERFLOW STUDIO PORTALS */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-24 relative z-10 text-center">
        <div className="space-y-2 mb-10">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Zap size={14} className="text-orange-400" /> Platform Studios
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Cycles automatically — hover to pause, click a card to launch.</p>
        </div>

        {/* 3D stage */}
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

            const translateX = offset * 285;
            const scale = isActive ? 1 : abs === 1 ? 0.78 : 0.6;
            const rotateY = isActive ? 0 : offset > 0 ? -40 : 40;
            const opacity = isActive ? 1 : abs === 1 ? 0.65 : 0.28;
            const zIndex = 20 - abs;

            return (
              <motion.div
                key={card.title}
                onClick={() => (isActive ? handleLaunch(card.path) : setActiveIndex(idx))}
                animate={{ x: translateX, scale, rotateY, opacity }}
                transition={{ type: 'spring', stiffness: 130, damping: 20 }}
                style={{ zIndex, transformStyle: 'preserve-3d' }}
                className="absolute w-[330px] sm:w-[370px] h-[380px] sm:h-[420px] cursor-pointer"
              >
                <ParallaxCard
                  glowColor={card.glowColor}
                  className="w-full h-full bg-[#0d0d0f]/80 border border-white/[0.05] rounded-3xl p-8 flex flex-col justify-between shadow-2xl backdrop-blur-md"
                >
                  <div className="space-y-6 text-left">
                    <div className={`w-14 h-14 rounded-2xl ${card.iconBg} border ${card.iconBorder} flex items-center justify-center ${card.iconColor} shadow-md`}>
                      <card.icon size={26} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-display text-xl font-black text-foreground">{card.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest ${card.iconColor} text-left`}>
                    <span>Launch Portal</span>
                    <ArrowRight size={13} />
                  </div>
                </ParallaxCard>
              </motion.div>
            );
          })}
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {featuresData.map((card, idx) => (
            <button
              key={card.title}
              onClick={() => setActiveIndex(idx)}
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
            <Workflow size={14} className="text-orange-400" /> Life Cycle Flow
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Plays automatically — click a step node to skip.</p>
        </div>

        <div
          onMouseEnter={() => setIsTimelinePaused(true)}
          onMouseLeave={() => setIsTimelinePaused(false)}
        >
          {/* Rails */}
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
                    <step.icon size={20} className={isActive || isPast ? 'text-[#060608]' : 'text-slate-550'} />
                  </motion.div>
                  <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Step Detail */}
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

      {/* 9. DRIBBBLE BENTO GRID V2 */}
      <section id="engine" className="border-t border-white/[0.02] bg-background/60 py-28 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h3 className="font-display text-4xl font-black text-foreground">Consolidated OS Engine</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              How our system bridges creative expression and growth metrics natively.
            </p>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bento Card 1: Grounding */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 bg-[#0d0d0f]/60 border border-white/[0.05] hover:border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
                  <Brain size={18} />
                </div>
                <h4 className="font-display font-black text-foreground text-xl">Core AI Grounding Engine</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  AI references uploaded corporate wikis, pitch decks, and guidelines to ensure drafts maintain strict brand consistency.
                </p>
              </div>

              {/* Document tracker widget */}
              <div className="bg-black/40 border border-white/[0.04] p-4.5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground tracking-wider">
                  <span>GROUNDING DOCUMENTS</span>
                  <span className="text-orange-400 font-black">✓ INDEXED</span>
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

            {/* Bento Card 2: Interactive Voice Changer Widget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-[#0d0d0f]/60 border border-white/[0.05] hover:border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
                  <Sliders size={18} />
                </div>
                <h4 className="font-display font-black text-foreground text-xl">Interactive Personas</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  Slide below to test real-time AI tone rewriting across active target audiences.
                </p>
              </div>

              {/* Slider UI mockup */}
              <div className="space-y-4 bg-black/40 border border-white/[0.04] p-4.5 rounded-2xl">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Casual</span>
                  <span>Corporate</span>
                  <span>Geek</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toneValue}
                  onChange={(e) => setToneValue(parseInt(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer h-1 rounded bg-white/10"
                />
                <div className="p-3 bg-[#070708] rounded-xl border border-white/[0.03] min-h-[70px] text-[10px] font-mono leading-relaxed text-slate-350">
                  {getRewriterText()}
                </div>
              </div>
            </motion.div>

            {/* Bento Card 3: Multi-Platform Publisher */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#0d0d0f]/60 border border-white/[0.05] hover:border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
                  <Layers size={18} />
                </div>
                <h4 className="font-display font-black text-foreground text-xl">Multi-Channel Layouts</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  Draft blogs once, then compile and reformat for LinkedIn, Medium, and Substack channels.
                </p>
              </div>

              {/* Connecting Nodes widget */}
              <div className="bg-black/40 border border-white/[0.04] p-4 rounded-2xl flex justify-between items-center relative overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-450">LI</div>
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-450">MD</div>
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-450">SU</div>
              </div>
            </motion.div>

            {/* Bento Card 4: Campaigns tracker */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="md:col-span-2 bg-[#0d0d0f]/60 border border-white/[0.05] hover:border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between space-y-6 text-left transition duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
                  <BarChart3 size={18} />
                </div>
                <h4 className="font-display font-black text-foreground text-xl">Real-Time Campaigns Console</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  Launch automated LinkedIn campaigns, recharge wallets, map conversions, and run data audits.
                </p>
              </div>

              {/* Graphic metrics chart */}
              <div className="bg-black/40 border border-white/[0.04] p-4.5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                  <span>CTR ANALYTICS</span>
                  <span className="text-orange-400 font-mono font-black">+14.2%</span>
                </div>
                <div className="h-12 bg-orange-500/10 border border-orange-500/10 rounded-lg overflow-hidden flex items-end px-2 gap-1.5">
                  <div className="w-full h-[30%] bg-orange-400/40 rounded-t" />
                  <div className="w-full h-[60%] bg-orange-400/60 rounded-t" />
                  <div className="w-full h-[45%] bg-orange-400/40 rounded-t" />
                  <div className="w-full h-[85%] bg-orange-450 rounded-t animate-pulse" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-muted-foreground bg-[#060608] relative z-10">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;