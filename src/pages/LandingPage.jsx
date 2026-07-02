import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
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
  Sliders,
  Terminal,
  Activity,
  Layers,
  ArrowUpRight,
  X,
  Lock,
  Search,
  UploadCloud,
  FileCode,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  Volume2
} from 'lucide-react';

// Grid warping backdrop canvas
const WarpGridBg = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const gridSpacing = 64;
    const cols = Math.ceil(w / gridSpacing) + 1;
    const rows = Math.ceil(h / gridSpacing) + 1;

    const points = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        points.push({
          ox: x * gridSpacing,
          oy: y * gridSpacing,
          x: x * gridSpacing,
          y: y * gridSpacing
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.05)';
      ctx.lineWidth = 1;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw grid columns
      for (let x = 0; x < cols; x++) {
        ctx.beginPath();
        for (let y = 0; y < rows; y++) {
          const p = points[x * rows + y];
          const dx = mx - p.ox;
          const dy = my - p.oy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, (280 - dist) / 280);

          p.x = p.ox - (dx / dist) * force * 15;
          p.y = p.oy - (dy / dist) * force * 15;

          if (y === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Draw grid rows
      for (let y = 0; y < rows; y++) {
        ctx.beginPath();
        for (let x = 0; x < cols; x++) {
          const p = points[x * rows + y];
          if (x === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 z-0" />;
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const titleText = "CreativeStudio OS";
  
  // Tab states
  const [activeTab, setActiveTab] = useState('generate');
  const [isHoveringList, setIsHoveringList] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Follower spring values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 280, mass: 0.15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX - 64);
    mouseY.set(e.clientY - 64);
  };

  // Tone sandbox states
  const [rewriteMode, setRewriteMode] = useState('casual');
  
  // Terminal logs
  const [logs, setLogs] = useState([
    '[INIT] CreativeOS micro-kernel active.',
    '[SYSTEM] Interactive transitions bound.',
    '[STANDBY] Awaiting user review...'
  ]);

  const handleLaunch = (targetPath) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/register?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  const rewriteDrafts = {
    casual: "⚡ Yo! We just shipped a brand new custom sandbox code builder. Deploy live codeblocks directly from your design files in 1 click. Check it out now, link in description!",
    executive: "💼 We are pleased to announce the deployment of our automated sandbox compiler, designed to accelerate interface translation workflows for growth marketing teams.",
    geek: "🔧 [DEPLOYMENT] Initializing containerized sandbox virtualization node. Injecting custom Tailwind variables directly into root theme contexts at runtime."
  };

  const platformFeatures = [
    {
      id: 'generate',
      index: '01',
      label: 'Generate Page',
      subtitle: 'AI copy builder',
      desc: 'Create high-performing blog outlines, copy components, and custom social assets grounded in your brand identity.',
      path: '/generate',
      icon: Sparkles,
      color: 'text-orange-400',
      badgeColor: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      imgPreview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'blog',
      index: '02',
      label: 'Blog Studio',
      subtitle: 'SEO indexing engine',
      desc: 'Formulate search engine optimized structures, index topics, and draft comprehensive articles automatically.',
      path: '/blog-studio',
      icon: Layout,
      color: 'text-amber-400',
      badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      imgPreview: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'image',
      index: '03',
      label: 'Image Studio',
      subtitle: 'Graphics generation suite',
      desc: 'Produce breathtaking graphics, marketing banners, and visual layouts tailored to maximize social conversion.',
      path: '/image-studio',
      icon: ImageIcon,
      color: 'text-yellow-400',
      badgeColor: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      imgPreview: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'video',
      index: '04',
      label: 'Video Studio',
      subtitle: 'Reels narration loops',
      desc: 'Design engaging social reels and brand video presentations complete with AI narration audio loops.',
      path: '/video-studio',
      icon: Video,
      color: 'text-orange-500',
      badgeColor: 'bg-orange-650/10 border-orange-650/20 text-orange-500',
      imgPreview: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'tracker',
      index: '05',
      label: 'LinkedIn Ads',
      subtitle: 'Campaign performance cycles',
      desc: 'Track conversions metrics, run analytics audits, and manage corporate campaign ad budgets in real-time.',
      path: '/linkedinads',
      icon: BarChart3,
      color: 'text-red-400',
      badgeColor: 'bg-red-500/10 border-red-500/20 text-red-400',
      imgPreview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop'
    }
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="dark relative min-h-screen bg-[#040406] text-[#f4f4f7] overflow-x-hidden font-display select-none"
    >
      <WarpGridBg />

      {/* FLOATING CAPSULE HEADER */}
      <header className="sticky top-4 z-50 max-w-5xl mx-auto px-6">
        <nav className="w-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.05] rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="relative w-8 h-8 rounded-lg bg-[#040406] border border-orange-500/20 flex items-center justify-center font-black text-foreground text-sm">
              C
            </span>
            <span className="font-display font-black tracking-tight text-foreground text-sm">
              CreativeStudio <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#studios" className="hover:text-foreground transition">Studio Catalog</a>
            <a href="#narrative" className="hover:text-foreground transition">Workflow Core</a>
            <a href="#sandbox" className="hover:text-foreground transition">AI Previewer</a>
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

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 text-center relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.2 bg-orange-500/10 border border-orange-500/25 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <Sparkles size={11} className="text-amber-400 animate-pulse" />
            <span>Interactive Layout Transitions</span>
          </div>

          {/* Letter Reveal Header */}
          <h1 className="text-5xl sm:text-8xl font-display font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[0.94] capitalize">
            {titleText.split("").map((letter, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: idx * 0.04
                }}
                className="inline-block"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Write brand-grounded outlines, translate draft tone parameters, and orchestrate campaign metrics inside a sleek, fluid interface.
          </p>

          <div className="pt-4">
            <button
              onClick={() => handleLaunch('/register')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-black rounded-full text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2 transition mx-auto cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* CURSOR IMAGE REVEAL MASK LAYER */}
      <AnimatePresence>
        {isHoveringList && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ x: smoothMouseX, y: smoothMouseY }}
            className="fixed top-0 left-0 pointer-events-none z-40 w-32 h-32 rounded-full overflow-hidden border border-orange-500/40 shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {platformFeatures.map((feat) => {
                if (feat.id !== activeTab) return null;
                return (
                  <motion.img
                    key={feat.id}
                    src={feat.imgPreview}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TASTEFUL PLATFORM CATALOG SECTION */}
      <section id="studios" className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="space-y-2 mb-12 text-center">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Layers size={14} className="text-orange-400" /> Platform Catalog
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Hover over items to reveal floating previews; click to launch portal drawer.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
          {/* Left Column: Menu Items */}
          <div 
            onMouseEnter={() => setIsHoveringList(true)}
            onMouseLeave={() => setIsHoveringList(false)}
            className="flex flex-col border-r border-white/[0.03] pr-0 lg:pr-8 text-left justify-center space-y-4"
          >
            {platformFeatures.map((feat) => {
              const isActive = activeTab === feat.id;
              return (
                <div
                  key={feat.id}
                  onMouseEnter={() => {
                    setActiveTab(feat.id);
                    setLogs((prev) => [...prev.slice(-6), `[HOVER] Focused module: ${feat.label}`]);
                  }}
                  onClick={() => setSelectedItem(feat)}
                  className="relative px-6 py-5 rounded-2xl flex items-center justify-between cursor-pointer group transition-all"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCatalogCap"
                      className="absolute inset-0 bg-orange-550/10 border border-orange-500/20 rounded-2xl -z-10"
                      transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                    />
                  )}

                  <div className="flex items-center gap-6">
                    <span className={`text-xs font-mono font-bold tracking-widest ${isActive ? 'text-orange-400' : 'text-neutral-600'}`}>
                      {feat.index}
                    </span>
                    <div className="space-y-0.5">
                      <h3 className={`text-xl font-black tracking-tight transition ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                        {feat.label}
                      </h3>
                      <span className="text-[10px] text-neutral-500 block uppercase tracking-wider font-semibold">{feat.subtitle}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                    <span>Explore</span>
                    <ArrowRight size={11} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Column: Premium High-Fidelity Active Preview (Replacive) */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#0c0c0f] overflow-hidden flex flex-col justify-between h-[390px]">
            {/* Window bar */}
            <div className="bg-neutral-900/40 border-b border-white/[0.03] px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/30" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/30" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/30" />
              </div>
              <span className="text-[8px] text-neutral-600 font-mono">active_studio_view.jsx</span>
              <div className="w-3 h-3 rounded bg-white/5" />
            </div>

            {/* Dynamic Dashboard content */}
            <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'generate' && (
                  <motion.div
                    key="generate"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-orange-400 font-black uppercase">AI Editor Pipeline</span>
                      <span className="text-[9px] text-neutral-500">Drafting</span>
                    </div>
                    <div className="space-y-2.5 font-mono text-[10px] leading-relaxed text-slate-300">
                      <p className="border-l border-orange-500/30 pl-2">Applying Stripe_Voice index matrix to content outline drafts...</p>
                      <div className="p-2.5 bg-orange-550/5 border border-orange-500/15 rounded-lg flex items-center justify-between">
                        <span className="text-white">✨ AI: Optimize introduction copy</span>
                        <span className="text-[8px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded">Indexed</span>
                      </div>
                      <p>Ensuring layout parameters bind natively to local variables at compile runtime.</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'blog' && (
                  <motion.div
                    key="blog"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-amber-400 font-black uppercase">SEO OUTLINE BUILDER</span>
                      <span className="text-[9px] text-emerald-400 font-bold">✓ Connected</span>
                    </div>
                    <div className="space-y-2">
                      <div className="border border-white/[0.03] p-3 rounded-xl bg-white/[0.01] flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-bold text-white block">1. Tailwind Grid Compilation</span>
                          <span className="text-[8px] text-neutral-500 block mt-0.5">Keywords: sandbox builder, figma layouts</span>
                        </div>
                        <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-bold">98% Match</span>
                      </div>
                      <div className="border border-white/[0.03] p-3 rounded-xl bg-white/[0.01] flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-bold text-white block">2. Visual Rendering Loops</span>
                          <span className="text-[8px] text-neutral-500 block mt-0.5">Keywords: react modules, compile sandbox</span>
                        </div>
                        <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-bold">95% Match</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'image' && (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-left h-full flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-yellow-400 font-black uppercase">GRAPHICS DESIGN SUITE</span>
                      <span className="text-[9px] text-neutral-500">Render active</span>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center border border-dashed border-white/[0.05] rounded-xl relative overflow-hidden bg-white/[0.01] my-2">
                      <div className="text-center space-y-2">
                        <ImageIcon size={20} className="text-yellow-400 mx-auto animate-pulse" />
                        <span className="text-[9px] font-mono text-neutral-500 block">Compiling social banner layouts...</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 h-1 bg-white/[0.03] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-yellow-400 rounded-full" 
                          animate={{ width: ['0%', '100%'] }} 
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'video' && (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-orange-500 font-black uppercase">VIDEO NARRATION BUILDER</span>
                      <span className="text-[9px] text-neutral-500">Tracks indexed</span>
                    </div>

                    <div className="bg-black/30 border border-white/[0.03] p-3.5 rounded-xl space-y-3">
                      <div className="flex items-center gap-2">
                        <Volume2 size={13} className="text-orange-500 animate-bounce" />
                        <span className="text-[10px] text-white font-bold">Narration Voice: Male Confidence</span>
                      </div>
                      {/* Audio Waves */}
                      <div className="h-6 flex items-center gap-1.5 px-1 bg-white/[0.01] border border-white/[0.02] rounded-lg overflow-hidden">
                        {[40, 70, 45, 90, 60, 80, 50, 75, 40, 85, 50, 70, 30].map((h, i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 bg-orange-500 rounded-t"
                            animate={{ height: [`${h * 0.4}%`, `${h * 0.9}%`, `${h * 0.4}%`] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'tracker' && (
                  <motion.div
                    key="tracker"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-red-400 font-black uppercase">LinkedIn ads manager</span>
                      <span className="text-[9px] text-emerald-400 font-bold">Active</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl">
                        <span className="text-[8px] text-neutral-500 block uppercase">ROI RATIO</span>
                        <span className="text-lg font-black text-white mt-1 block">4.8x</span>
                        <span className="text-[8px] text-emerald-400 block font-bold">+18.2%</span>
                      </div>
                      <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl">
                        <span className="text-[8px] text-neutral-500 block uppercase">Conversion rate</span>
                        <span className="text-lg font-black text-white mt-1 block">5.42%</span>
                        <span className="text-[8px] text-emerald-400 block font-bold">+12%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Launch button */}
            <div className="p-4 bg-neutral-900/20 border-t border-white/[0.03]">
              <button
                onClick={() => handleLaunch(platformFeatures.find(f => f.id === activeTab).path)}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/10"
              >
                <span>Enter Portal Node</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NARRATIVE PIPELINE CORE SECTION */}
      <section id="narrative" className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center space-y-4 mb-20">
          <h3 className="font-display text-4xl font-black text-foreground">Engine Architecture</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Three core pipelines built to streamline brand-focused content output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-6 text-left space-y-4 hover:border-orange-500/20 transition">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Brain size={18} />
            </div>
            <h4 className="font-display font-black text-foreground text-lg">01 / Brand Indexing</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload wikis, documents, and references. The AI indexes files locally to establish context constraints.
            </p>
          </div>

          <div className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-6 text-left space-y-4 hover:border-orange-500/20 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sliders size={18} />
            </div>
            <h4 className="font-display font-black text-foreground text-lg">02 / Persona Tuning</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Map out custom personas with preset vocabularies and tones to structure campaign copy correctly.
            </p>
          </div>

          <div className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-6 text-left space-y-4 hover:border-orange-500/20 transition">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <BarChart3 size={18} />
            </div>
            <h4 className="font-display font-black text-foreground text-lg">03 / Unified Audit</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Push drafts directly to LinkedIn ad accounts and track conversion metrics with real-time graphs.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TONE SANDBOX */}
      <section id="sandbox" className="max-w-5xl mx-auto px-6 py-12 relative z-10 text-center">
        <div className="space-y-2 mb-10">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Sliders size={14} className="text-orange-400" /> Interactive Tone sandbox
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Select a persona mode below to see the AI translate the post in real-time.</p>
        </div>

        <div className="bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl space-y-6">
          <div className="flex justify-center gap-3">
            {['casual', 'executive', 'geek'].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setRewriteMode(mode);
                  setLogs((prev) => [...prev.slice(-6), `[SANDBOX] Switched rewriter mode: ${mode}`]);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition cursor-pointer ${
                  rewriteMode === mode ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400 shadow-sm' : 'bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/[0.08]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="p-5 bg-black/60 border border-white/[0.03] rounded-2xl min-h-[90px] text-left font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="text-orange-500 mr-2">&gt;</span>
            {rewriteDrafts[rewriteMode]}
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC TERMINAL CONSOLE */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative z-10 text-center">
        <div className="bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto text-left font-mono shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3 text-xs font-bold text-muted-foreground">
            <Terminal size={14} className="text-orange-400" />
            <span>OPERATIONAL DIAGNOSTIC TERMINAL</span>
          </div>

          <div className="space-y-2 text-[11px] text-muted-foreground leading-normal max-h-[160px] overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx}>
                <span className="text-orange-500 mr-2">&gt;&gt;</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHARED LAYOUT DRAWER */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              layoutId={`activeDrawer_${selectedItem.id}`}
              className="relative w-full max-w-lg bg-[#0d0d10] border border-white/[0.08] rounded-3xl p-8 text-left shadow-2xl space-y-6"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-3">
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold border ${selectedItem.badgeColor}`}>
                  {selectedItem.label} Node Details
                </span>
                <h3 className="text-2xl font-black text-foreground pt-2">{selectedItem.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedItem.desc}
                </p>
              </div>

              <div className="border-t border-white/[0.04] pt-5 space-y-4">
                <h4 className="text-xs font-bold text-foreground">Active Configuration Params:</h4>
                <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-muted-foreground">
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/[0.03]">
                    <span className="block text-orange-400 uppercase font-black tracking-wider text-[8px] mb-1">State Type</span>
                    <span>Sandbox Virtualizer</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/[0.03]">
                    <span className="block text-orange-400 uppercase font-black tracking-wider text-[8px] mb-1">Fidelity Mode</span>
                    <span>Compile Verification</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/[0.08] border border-white/10 text-foreground font-black rounded-xl text-xs transition cursor-pointer"
                >
                  Close Details
                </button>
                <button
                  onClick={() => {
                    handleLaunch(selectedItem.path);
                    setSelectedItem(null);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/15"
                >
                  <span>Launch Portal</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-muted-foreground bg-[#040406] relative z-10">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;