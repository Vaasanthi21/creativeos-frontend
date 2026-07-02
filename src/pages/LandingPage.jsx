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
  Volume2
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
    for (let i = 0; i < 40; i++) {
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
  
  // Interactive rewriter state
  const [toneMode, setToneMode] = useState('casual');
  
  // Diagnostics terminal logs
  const [logs, setLogs] = useState([
    '[INIT] CreativeOS micro-kernel active.',
    '[SYSTEM] Interactive transitions bound.',
    '[STANDBY] Awaiting user review...'
  ]);

  // Mouse coordinate following spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 280, mass: 0.15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX - 64);
    mouseY.set(e.clientY - 64);
  };

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

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="dark relative min-h-screen bg-[#040405] text-[#f4f4f7] overflow-x-hidden font-display select-none flex flex-col md:flex-row"
    >
      <SpaceParticlesBg />

      {/* LEFT COLUMN: Sticky System Core */}
      <div className="w-full md:w-[420px] md:h-screen md:sticky md:top-0 bg-[#08080a] border-b md:border-b-0 md:border-r border-white/[0.04] p-8 flex flex-col justify-between z-20 shrink-0 text-left relative overflow-hidden">
        {/* Brand signature */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="relative w-8 h-8 rounded-lg bg-[#040405] border border-orange-500/20 flex items-center justify-center font-black text-foreground text-sm">
              C
            </span>
            <span className="font-display font-black tracking-tight text-foreground text-sm">
              CreativeStudio <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">OS</span>
            </span>
          </div>

          <div className="pt-8 space-y-4">
            <h1 className="text-4xl font-black text-foreground leading-[1.05] capitalize">
              The Interactive Creative Console
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Configure grounding parameters, translate draft tone parameters, and orchestrate campaign metrics inside a grid pipeline.
            </p>
          </div>
        </div>

        {/* Swirling Core Orb widget */}
        <div className="relative w-44 h-44 my-8 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 blur-2xl opacity-20" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute w-36 h-36 rounded-full border border-dashed border-orange-500/20 flex items-center justify-center pointer-events-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-orange-450 absolute top-0" />
          </motion.div>
          
          <div className="relative w-24 h-24 rounded-full bg-[#050507] border border-orange-500/20 flex flex-col items-center justify-center shadow-lg">
            <Brain size={24} className="text-orange-400 animate-pulse" />
            <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Creative OS</span>
          </div>
        </div>

        {/* Diagnostics Terminal at the bottom */}
        <div className="bg-[#040405] border border-white/[0.04] p-4.5 rounded-2xl font-mono text-[9px] text-muted-foreground space-y-2.5">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-1.5 font-bold">
            <Terminal size={11} className="text-orange-400" />
            <span>DIAGNOSTIC TERMINAL</span>
          </div>
          <div className="space-y-1.5 max-h-[80px] overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx}>
                <span className="text-orange-500 mr-1.5">&gt;&gt;</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Scrolling features showcase */}
      <div className="flex-1 p-6 md:p-12 space-y-16 relative z-10">
        
        {/* Generate Studio Section */}
        <section className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 text-left space-y-6 hover:border-orange-500/20 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase">STUDIO NODE 01</span>
              <h2 className="text-3xl font-black text-foreground">Generate Studio</h2>
            </div>
            <button
              onClick={() => handleLaunch('/generate')}
              className="p-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 rounded-2xl transition cursor-pointer"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Create high-performing blog outlines, copy components, and custom social assets grounded in your brand identity.
          </p>

          {/* Interactive Mockup */}
          <div className="bg-[#0c0c0f] border border-white/[0.04] rounded-2xl overflow-hidden shadow-lg h-[220px] flex flex-col justify-between">
            <div className="bg-neutral-900/40 border-b border-white/[0.03] px-4 py-2.5 flex items-center justify-between text-[8px] text-neutral-600 font-mono">
              <span>generate_workspace.jsx</span>
              <span className="text-orange-400">active</span>
            </div>
            <div className="p-5 flex-1 font-mono text-[10px] leading-relaxed text-slate-350 space-y-3">
              <p className="border-l border-orange-500/30 pl-2">Matching brand indexes to outline parameters...</p>
              <div className="p-2.5 bg-orange-500/5 border border-orange-500/15 rounded-lg flex items-center justify-between">
                <span className="text-white">✨ AI Assist: Refine introduction copy</span>
                <span className="text-[8px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded">Grounded</span>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Studio Section */}
        <section className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 text-left space-y-6 hover:border-amber-500/20 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">STUDIO NODE 02</span>
              <h2 className="text-3xl font-black text-foreground">Blog Studio</h2>
            </div>
            <button
              onClick={() => handleLaunch('/blog-studio')}
              className="p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-2xl transition cursor-pointer"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Formulate search engine optimized structures, index topics, and draft comprehensive articles automatically.
          </p>

          {/* Interactive Mockup */}
          <div className="bg-[#0c0c0f] border border-white/[0.04] rounded-2xl overflow-hidden shadow-lg h-[220px] flex flex-col justify-between">
            <div className="bg-neutral-900/40 border-b border-white/[0.03] px-4 py-2.5 flex items-center justify-between text-[8px] text-neutral-600 font-mono">
              <span>blog_index.jsx</span>
              <span className="text-amber-400">active</span>
            </div>
            <div className="p-5 flex-1 font-mono text-[10px] leading-relaxed text-slate-350 space-y-2">
              <div className="border border-white/[0.03] p-2.5 rounded-xl bg-white/[0.01] flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-white block">1. Tailwind Grid Compilation</span>
                  <span className="text-[8px] text-neutral-500 block mt-0.5">Keywords: sandbox builder, figma layouts</span>
                </div>
                <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold font-mono">98% Match</span>
              </div>
            </div>
          </div>
        </section>

        {/* Image Studio Section */}
        <section className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 text-left space-y-6 hover:border-yellow-500/20 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-yellow-400 uppercase">STUDIO NODE 03</span>
              <h2 className="text-3xl font-black text-foreground">Image Studio</h2>
            </div>
            <button
              onClick={() => handleLaunch('/image-studio')}
              className="p-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 rounded-2xl transition cursor-pointer"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Produce breathtaking graphics, marketing banners, and visual layouts tailored to maximize social conversion.
          </p>

          {/* Interactive Mockup */}
          <div className="bg-[#0c0c0f] border border-white/[0.04] rounded-2xl overflow-hidden shadow-lg h-[220px] flex flex-col justify-between">
            <div className="bg-neutral-900/40 border-b border-white/[0.03] px-4 py-2.5 flex items-center justify-between text-[8px] text-neutral-600 font-mono">
              <span>graphics_builder.jsx</span>
              <span className="text-yellow-400">render</span>
            </div>
            <div className="p-5 flex-1 flex items-center justify-center border border-dashed border-white/[0.05] rounded-xl relative overflow-hidden bg-white/[0.01]">
              <div className="text-center space-y-2">
                <ImageIcon size={20} className="text-yellow-400 mx-auto animate-pulse" />
                <span className="text-[9px] font-mono text-neutral-500 block">Compiling social banners...</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 h-1 bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-yellow-400 rounded-full" 
                  animate={{ width: ['0%', '100%'] }} 
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Video Studio Section */}
        <section className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 text-left space-y-6 hover:border-orange-650/20 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-orange-500 uppercase">STUDIO NODE 04</span>
              <h2 className="text-3xl font-black text-foreground">Video Studio</h2>
            </div>
            <button
              onClick={() => handleLaunch('/video-studio')}
              className="p-3 bg-orange-600/10 hover:bg-orange-600/20 border border-orange-600/20 text-orange-500 rounded-2xl transition cursor-pointer"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Design engaging social reels and brand video presentations complete with AI narration audio loops.
          </p>

          {/* Interactive Mockup */}
          <div className="bg-[#0c0c0f] border border-white/[0.04] rounded-2xl overflow-hidden shadow-lg h-[220px] flex flex-col justify-between">
            <div className="bg-neutral-900/40 border-b border-white/[0.03] px-4 py-2.5 flex items-center justify-between text-[8px] text-neutral-600 font-mono">
              <span>video_audios.jsx</span>
              <span className="text-orange-500">active</span>
            </div>
            <div className="p-5 flex-1 font-mono text-[10px] leading-relaxed text-slate-350 space-y-2">
              <div className="bg-black/30 border border-white/[0.03] p-3 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 size={13} className="text-orange-500 animate-bounce" />
                  <span className="text-[9px] text-white font-bold">Narration voice track</span>
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
              </div>
            </div>
          </div>
        </section>

        {/* LinkedIn Tracker Section */}
        <section className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 text-left space-y-6 hover:border-red-500/20 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">STUDIO NODE 05</span>
              <h2 className="text-3xl font-black text-foreground">LinkedIn Ads</h2>
            </div>
            <button
              onClick={() => handleLaunch('/linkedinads')}
              className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-2xl transition cursor-pointer"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Track conversions metrics, run analytics audits, and manage corporate campaign ad budgets in real-time.
          </p>

          {/* Interactive Mockup */}
          <div className="bg-[#0c0c0f] border border-white/[0.04] rounded-2xl overflow-hidden shadow-lg h-[220px] flex flex-col justify-between">
            <div className="bg-neutral-900/40 border-b border-white/[0.03] px-4 py-2.5 flex items-center justify-between text-[8px] text-neutral-600 font-mono">
              <span>ads_metrics.jsx</span>
              <span className="text-red-400">active</span>
            </div>
            <div className="p-5 flex-1 font-mono text-[10px] leading-relaxed text-slate-350">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl">
                  <span className="text-[8px] text-neutral-500 block uppercase">ROI ratio</span>
                  <span className="text-base font-black text-white mt-1 block">4.8x</span>
                </div>
                <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl">
                  <span className="text-[8px] text-neutral-500 block uppercase">Conversions</span>
                  <span className="text-base font-black text-white mt-1 block">5.42%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE TONE SANDBOX */}
        <section id="sandbox" className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 text-left space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase">Interactive sandbox</span>
            <h2 className="text-3xl font-black text-foreground">AI Rewriter Sandbox</h2>
          </div>

          <div className="flex gap-3">
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

          <div className="p-5 bg-black/60 border border-white/[0.03] rounded-2xl min-h-[90px] text-left font-mono text-xs text-slate-300 leading-relaxed">
            <span className="text-orange-500 mr-2">&gt;</span>
            {rewriteDrafts[toneMode]}
          </div>
        </section>

      </div>
    </div>
  );
};

export default LandingPage;