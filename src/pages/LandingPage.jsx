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
  Volume2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Starry Space Particle Background
const SpaceParticlesBg = () => {
  const canvasRef = useRef(null);

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
    window.addEventListener('resize', handleResize);

    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.2 + 0.4,
        speed: Math.random() * 0.15 + 0.05,
        color: `rgba(249, 115, 22, ${Math.random() * 0.3 + 0.1})`
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        s.y -= s.speed;
        if (s.y < 0) s.y = h;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      });
      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30 z-0" />;
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // 3D coverflow carousel state
  const [activeIdx, setActiveIdx] = useState(2); // Start with center card (Image Studio)

  // Interactive sandbox tone
  const [toneMode, setToneMode] = useState('casual');
  
  // Operational logs stream
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

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? platformFeatures.length - 1 : prev - 1));
    setLogs((prev) => [...prev.slice(-6), `[CAROUSEL] Rotated left.`]);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === platformFeatures.length - 1 ? 0 : prev + 1));
    setLogs((prev) => [...prev.slice(-6), `[CAROUSEL] Rotated right.`]);
  };

  const rewriteDrafts = {
    casual: "⚡ Yo! We just shipped a brand new custom sandbox code builder. Deploy live codeblocks directly from your design files in 1 click. Check it out now, link in description!",
    executive: "💼 We are pleased to announce the deployment of our automated sandbox compiler, designed to accelerate interface translation workflows for growth marketing teams.",
    geek: "🔧 [DEPLOYMENT] Initializing containerized sandbox virtualization node. Injecting custom Tailwind variables directly into root theme contexts at runtime."
  };

  const platformFeatures = [
    {
      id: 'generate',
      title: 'Generate Page',
      subtitle: 'Copy compiler',
      desc: 'Create high-performing blog outlines, copy components, and custom social assets grounded in your brand identity.',
      path: '/generate',
      icon: Sparkles,
      color: 'text-orange-400',
      badgeColor: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      imgPreview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'blog',
      title: 'Blog Studio',
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
      title: 'Image Studio',
      subtitle: 'Visual banner canvas',
      desc: 'Produce breathtaking graphics, marketing banners, and visual layouts tailored to maximize social conversion.',
      path: '/image-studio',
      icon: ImageIcon,
      color: 'text-yellow-400',
      badgeColor: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      imgPreview: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'video',
      title: 'Video Studio',
      subtitle: 'Reels narration tracks',
      desc: 'Design engaging social reels and brand video presentations complete with AI narration audio loops.',
      path: '/video-studio',
      icon: Video,
      color: 'text-orange-500',
      badgeColor: 'bg-orange-650/10 border-orange-650/20 text-orange-500',
      imgPreview: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'tracker',
      title: 'LinkedIn Ads',
      subtitle: 'Metrics performance panel',
      desc: 'Track conversions metrics, run analytics audits, and manage corporate campaign ad budgets in real-time.',
      path: '/linkedinads',
      icon: BarChart3,
      color: 'text-red-400',
      badgeColor: 'bg-red-500/10 border-red-500/20 text-red-400',
      imgPreview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop'
    }
  ];

  const activeFeature = platformFeatures[activeIdx];

  return (
    <div className="dark relative min-h-screen bg-[#040405] text-[#f4f4f7] overflow-x-hidden font-display select-none">
      <SpaceParticlesBg />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#151210_1px,transparent_1px),linear-gradient(to_bottom,#151210_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-20 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)'
        }}
      />

      {/* FLOATING CAPSULE HEADER */}
      <header className="sticky top-4 z-50 max-w-5xl mx-auto px-6">
        <nav className="w-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.05] rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="relative w-8 h-8 rounded-lg bg-[#040405] border border-orange-500/20 flex items-center justify-center font-black text-foreground text-sm">
              C
            </span>
            <span className="font-display font-black tracking-tight text-foreground text-sm">
              CreativeStudio <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#showcase" className="hover:text-foreground transition">3D Showcase</a>
            <a href="#sandbox" className="hover:text-foreground transition">Rewriter Sandbox</a>
            <a href="#terminal" className="hover:text-foreground transition">System Console</a>
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
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-8 text-center relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.2 bg-orange-500/10 border border-orange-500/25 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <Sparkles size={11} className="text-amber-400 animate-pulse" />
            <span>Interactive 3D Carousel Portal</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[0.98] capitalize">
            The Production Grade{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Creative Console</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Write brand outlines, compile layout components, and launch campaign pipelines inside a highly interactive dark console dashboard.
          </p>
        </div>
      </section>

      {/* 3D CAROUSEL COVERFLOW SHOWCASE */}
      <section id="showcase" className="max-w-5xl mx-auto px-6 py-12 relative z-10 text-center">
        <div className="relative h-[280px] flex items-center justify-center overflow-hidden w-full select-none" style={{ perspective: 1000 }}>
          <div className="absolute inset-0 flex items-center justify-between px-4 z-30 pointer-events-none">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-black/60 border border-white/10 hover:border-orange-500/40 text-muted-foreground hover:text-white pointer-events-auto transition cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-black/60 border border-white/10 hover:border-orange-500/40 text-muted-foreground hover:text-white pointer-events-auto transition cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center justify-center relative w-full h-full">
            {platformFeatures.map((feat, idx) => {
              const offset = idx - activeIdx;
              const isActive = offset === 0;
              const absOffset = Math.abs(offset);

              // Don't render cards that are too far away
              if (absOffset > 2) return null;

              return (
                <motion.div
                  key={feat.id}
                  onClick={() => {
                    setActiveIdx(idx);
                    setLogs((prev) => [...prev.slice(-6), `[CAROUSEL] Focused module: ${feat.title}`]);
                  }}
                  animate={{
                    x: offset * 220,
                    scale: isActive ? 1.05 : 0.82,
                    rotateY: offset * -35,
                    z: isActive ? 100 : -100,
                    opacity: isActive ? 1 : 0.45
                  }}
                  transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                  className={`absolute w-[240px] sm:w-[280px] h-[190px] rounded-3xl p-6 border flex flex-col justify-between text-left cursor-pointer transition-shadow ${
                    isActive ? 'bg-[#0a0a0d] border-orange-500/35 shadow-[0_0_30px_rgba(249,115,22,0.1)] shadow-orange-500/5' : 'bg-black/60 border-white/[0.04]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                      isActive ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-white/5 border-white/5 text-muted-foreground'
                    }`}>
                      <feat.icon size={16} />
                    </div>
                    <div>
                      <h3 className={`text-base font-black tracking-tight ${isActive ? 'text-white' : 'text-neutral-500'}`}>{feat.title}</h3>
                      <span className="text-[9px] text-neutral-500 block uppercase tracking-wider mt-0.5">{feat.subtitle}</span>
                    </div>
                  </div>
                  
                  {isActive && (
                    <span className="text-[9px] text-orange-400 font-bold flex items-center gap-1">
                      <span>View details below</span>
                      <ArrowRight size={10} />
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* HIGH-FIDELITY ACTIVE INSPECTOR CONSOLE */}
        <div className="max-w-3xl mx-auto mt-12 bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 shadow-2xl text-left space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.03] pb-4">
            <div className="space-y-1">
              <span className={`px-2.5 py-1 text-[9px] font-mono rounded border uppercase font-black tracking-widest ${activeFeature.badgeColor}`}>
                {activeFeature.title} Configured
              </span>
              <h2 className="text-2xl font-black text-foreground pt-1">{activeFeature.title} Workspace</h2>
            </div>
            <button
              onClick={() => handleLaunch(activeFeature.path)}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-black rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/10"
            >
              <span>Enter Portal Node</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {activeFeature.desc}
          </p>

          {/* Dynamic Mockup Viewport */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#0c0c0f] overflow-hidden flex flex-col justify-between h-[230px]">
            {/* Window bar */}
            <div className="bg-neutral-900/40 border-b border-white/[0.03] px-4 py-2.5 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/30" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/30" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/30" />
              </div>
              <span className="text-[8px] text-neutral-600 font-mono">active_studio_view.jsx</span>
              <div className="w-3 h-3 rounded bg-white/5" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeFeature.id === 'generate' && (
                  <motion.div
                    key="generate"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2.5 font-mono text-[10px] leading-relaxed text-slate-350">
                      <p className="border-l border-orange-500/30 pl-2">Matching brand indexes to outline parameters...</p>
                      <div className="p-2.5 bg-orange-500/5 border border-orange-500/15 rounded-lg flex items-center justify-between">
                        <span className="text-white">✨ AI Assist: Refine introduction copy</span>
                        <span className="text-[8px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded">Indexed</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeFeature.id === 'blog' && (
                  <motion.div
                    key="blog"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div className="border border-white/[0.03] p-3 rounded-xl bg-white/[0.01] flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-white block">1. Tailwind Grid Compilation</span>
                        <span className="text-[8px] text-neutral-500 block mt-0.5">Keywords: sandbox builder, design compiler</span>
                      </div>
                      <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-bold">98% Match</span>
                    </div>
                  </motion.div>
                )}

                {activeFeature.id === 'image' && (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-center border border-dashed border-white/[0.05] rounded-xl relative overflow-hidden bg-white/[0.01]"
                  >
                    <div className="text-center space-y-2">
                      <ImageIcon size={20} className="text-yellow-400 mx-auto animate-pulse" />
                      <span className="text-[9px] font-mono text-neutral-500 block">Compiling social banner layouts...</span>
                    </div>
                  </motion.div>
                )}

                {activeFeature.id === 'video' && (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-black/30 border border-white/[0.03] p-3.5 rounded-xl space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 size={13} className="text-orange-500 animate-bounce" />
                      <span className="text-[9px] text-white font-bold">Narration voice wave</span>
                    </div>
                    <div className="h-6 flex items-center gap-1.5 px-1 bg-white/[0.01] border border-white/[0.02] rounded-lg overflow-hidden">
                      {[40, 70, 45, 90, 60, 80, 50, 75, 40, 85].map((h, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-orange-500 rounded-t"
                          animate={{ height: [`${h * 0.4}%`, `${h * 0.9}%`, `${h * 0.4}%`] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeFeature.id === 'tracker' && (
                  <motion.div
                    key="tracker"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl">
                      <span className="text-[8px] text-neutral-500 block uppercase">ROI ratio</span>
                      <span className="text-lg font-black text-white mt-1 block">4.8x</span>
                    </div>
                    <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl">
                      <span className="text-[8px] text-neutral-500 block uppercase">Conversions</span>
                      <span className="text-lg font-black text-white mt-1 block">5.42%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* CORE ENGINE PIPELINES */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-10 text-center">
        <div className="text-center space-y-4 mb-16">
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
                  setToneMode(mode);
                  setLogs((prev) => [...prev.slice(-6), `[SANDBOX] Switched rewriter mode: ${mode}`]);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition cursor-pointer ${
                  toneMode === mode ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400 shadow-sm' : 'bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/[0.08]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="p-5 bg-black/60 border border-white/[0.03] rounded-2xl min-h-[90px] text-left font-mono text-xs sm:text-sm text-slate-350 leading-relaxed">
            <span className="text-orange-500 mr-2">&gt;</span>
            {rewriteDrafts[toneMode]}
          </div>
        </div>
      </section>

      {/* OPERATIONS CONSOLE TERMINAL */}
      <section id="terminal" className="max-w-5xl mx-auto px-6 py-12 relative z-10 text-center">
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

      {/* FOOTER */}
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-muted-foreground bg-[#040405] relative z-10">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;