import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  Play,
  Activity,
  Terminal,
  Layers,
  Sliders,
  Folder,
  RefreshCw,
  Plus,
  ArrowUpRight
} from 'lucide-react';

// Floating Particles Backdrop
const ParticlesBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30 z-0" />;
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Interactive orbit state
  const [activeOrbitTab, setActiveOrbitTab] = useState('generate');
  
  // Translation Sandbox states
  const [rewriteMode, setRewriteMode] = useState('casual'); // casual, executive, geek
  
  // Live console logs
  const [logs, setLogs] = useState([
    '[INIT] CreativeOS micro-kernel active.',
    '[SYSTEM] Orbital array initialized.',
    '[STANDBY] Awaiting pipeline command...'
  ]);

  const handleLaunch = (targetPath) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/register?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  // Add system logs
  const addLog = (msg) => {
    setLogs((prev) => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Rewrite content definitions
  const rewriteDrafts = {
    casual: "⚡ Yo! We just shipped a brand new custom sandbox code builder. Deploy live codeblocks directly from your design files in 1 click. Check it out now, link in description!",
    executive: "💼 We are pleased to announce the deployment of our automated sandbox compiler, designed to accelerate interface translation workflows for growth marketing teams.",
    geek: "🔧 [DEPLOYMENT] Initializing containerized sandbox virtualization node. Injecting custom Tailwind variables directly into root theme contexts at runtime."
  };

  // Satellites orbiting central core
  const satelliteNodes = [
    { id: 'generate', label: 'Generate Page', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', icon: Sparkles, path: '/generate' },
    { id: 'blog', label: 'Blog Studio', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', icon: Layout, path: '/blog-studio' },
    { id: 'image', label: 'Image Studio', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/25', icon: ImageIcon, path: '/image-studio' },
    { id: 'video', label: 'Video Studio', color: 'text-orange-500', bg: 'bg-orange-600/10', border: 'border-orange-650/25', icon: Video, path: '/video-studio' },
    { id: 'tracker', label: 'LinkedIn Ads', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25', icon: BarChart3, path: '/linkedinads' }
  ];

  return (
    <div className="dark relative min-h-screen bg-[#050507] text-[#f4f4f6] overflow-x-hidden font-display select-none">
      <ParticlesBg />

      {/* Cybernetic grid overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#161311_1px,transparent_1px),linear-gradient(to_bottom,#161311_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-25"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)'
        }}
      />

      {/* FLOATING CAPSULE HEADER */}
      <header className="sticky top-4 z-50 max-w-5xl mx-auto px-6">
        <nav className="w-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.05] rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-8 h-8 rounded-lg bg-[#050507] flex items-center justify-center font-black text-foreground text-sm">
                C
              </div>
            </div>
            <span className="font-display font-black tracking-tight text-foreground text-sm">
              CreativeStudio <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#control-orbit" className="hover:text-foreground transition">Studio Orbit</a>
            <a href="#narrative" className="hover:text-foreground transition">Platform Vision</a>
            <a href="#sandbox" className="hover:text-foreground transition">AI Rewriter</a>
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
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.2 bg-orange-500/10 border border-orange-500/25 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <Sparkles size={11} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Interactive 3D Workspace V2</span>
          </div>

          <h1 className="text-5xl sm:text-8xl font-display font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[0.95] capitalize">
            The Interactive{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Creative Console</span>{' '}
            For Brands
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Configure grounding assets, translate draft tone parameters, and orchestrate automated campaigns inside a hardware-accelerated grid pipeline.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => handleLaunch('/register')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-black rounded-full text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2 transition"
            >
              <span>Start Staging</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 3D ORBIT CONTROL HUB */}
      <section id="control-orbit" className="max-w-5xl mx-auto px-6 py-12 relative z-10 text-center">
        <div className="space-y-2 mb-12">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Sliders size={14} className="text-orange-400" /> Interactive Studio Orbit
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Select an orbital node below to inspect its dashboard mockup configuration.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 bg-[#09090b] border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
          {/* Orbital Interface */}
          <div className="relative h-[340px] sm:h-[400px] flex items-center justify-center border border-white/[0.03] rounded-2xl bg-black/40 overflow-hidden">
            {/* Center Core */}
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-[0_0_50px_rgba(249,115,22,0.3)] z-10">
              <div className="w-full h-full rounded-full bg-[#050507] flex flex-col items-center justify-center">
                <Brain size={24} className="text-orange-400 animate-pulse" />
                <span className="text-[8px] font-bold text-muted-foreground tracking-wider uppercase mt-1">Creative OS</span>
              </div>
            </div>

            {/* Orbit lines */}
            <div className="absolute w-[240px] h-[240px] rounded-full border border-dashed border-white/[0.04] pointer-events-none" />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-dashed border-white/[0.04] pointer-events-none" />

            {/* Orbiting Satellite Nodes */}
            <div className="absolute inset-0 flex items-center justify-center">
              {satelliteNodes.map((node, idx) => {
                const angle = (idx * 2 * Math.PI) / satelliteNodes.length;
                const radius = 120; // radius of orbit path
                const tx = Math.cos(angle) * radius;
                const ty = Math.sin(angle) * radius;
                const isActive = activeOrbitTab === node.id;

                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      setActiveOrbitTab(node.id);
                      addLog(`Connected workspace: ${node.label}`);
                    }}
                    style={{ transform: `translate(${tx}px, ${ty}px)` }}
                    className={`absolute z-20 w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-350 cursor-pointer ${
                      isActive ? 'bg-orange-500/20 border-orange-500 text-orange-400 scale-110 shadow-lg shadow-orange-500/10' : 'bg-[#0d0d0f]/60 border-white/[0.06] text-muted-foreground hover:border-white/20'
                    }`}
                  >
                    <node.icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Node Dashboard Inspector Mockup */}
          <div className="border border-white/[0.04] rounded-2xl p-6 bg-[#0c0c0e] flex flex-col justify-between text-left h-[340px] sm:h-[400px]">
            <AnimatePresence mode="wait">
              {satelliteNodes.map((node) => {
                if (node.id !== activeOrbitTab) return null;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 h-full flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${node.color.replace('text-', 'bg-')}`} />
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-black">STUDIO PORTAL INSPECTOR</span>
                      </div>
                      <h3 className="text-2xl font-black text-foreground">{node.label}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Hardware compilation sandbox interface configured. Launch this node to direct authentication token flows.
                      </p>
                    </div>

                    <div className="space-y-3 bg-black/40 border border-white/[0.04] p-4 rounded-xl">
                      <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground">
                        <span>CONNECTION ADAPTER</span>
                        <span className="text-orange-400 font-bold uppercase">Ready</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] p-2 bg-white/[0.01] border border-white/[0.03] rounded-lg">
                        <span className="text-slate-350 flex items-center gap-2"><node.icon size={12} className={node.color} /> portal_node_{node.id}.js</span>
                        <span className="text-[8px] text-orange-400 font-mono">Bound</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch(node.path)}
                      className="w-full py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 text-orange-400 font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Launch Portal Node</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* PARALLAX NARRATIVE CARDS */}
      <section id="narrative" className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center space-y-4 mb-20">
          <h3 className="font-display text-4xl font-black text-foreground">Next-Gen Architecture</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Three core layers engineered to manage copy production and distribution pipelines.
          </p>
        </div>

        <div className="space-y-12">
          {/* Card 1 */}
          <div className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center text-left hover:border-orange-500/20 transition duration-300">
            <div className="space-y-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Brain size={20} />
              </div>
              <h4 className="text-2xl font-black text-foreground">01 / Brand Indexing Grounding</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Upload your company pitch decks, brand books, and audience parameters. CreativeOS processes these assets locally to ground drafts in exact factual references.
              </p>
            </div>
            <div className="w-full md:w-80 bg-black/40 border border-white/[0.04] p-4.5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground tracking-wider">
                <span>DOCUMENT REPOSITORY</span>
                <span className="text-orange-400 font-black">Indexed</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-350">
                <div className="p-2.5 bg-white/[0.01] border border-white/[0.03] rounded-lg flex justify-between">
                  <span>voice_params.docx</span>
                  <span className="text-orange-400">✓ Grounded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row-reverse gap-8 items-center text-left hover:border-orange-500/20 transition duration-300">
            <div className="space-y-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Sliders size={20} />
              </div>
              <h4 className="text-2xl font-black text-foreground">02 / Dynamic Persona Adapters</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Build distinct buyer personas to align draft syntax. Toggle parameters to re-target formal copy into casual social snippets.
              </p>
            </div>
            <div className="w-full md:w-80 bg-black/40 border border-white/[0.04] p-4.5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground tracking-wider">
                <span>ACTIVE PERSONA</span>
                <span className="text-amber-400 font-black">Enabled</span>
              </div>
              <div className="p-3 bg-[#0c0c0e] rounded-xl border border-white/[0.03] text-left">
                <span className="text-[10px] font-bold text-white block">Tech Exec Persona</span>
                <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider block mt-0.5">Formal Syntax Tone</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center text-left hover:border-orange-500/20 transition duration-300">
            <div className="space-y-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <BarChart3 size={20} />
              </div>
              <h4 className="text-2xl font-black text-foreground">03 / Unified Distribution Loops</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Push campaign assets straight to LinkedIn ad modules, review wallet balances, and track audience conversion graphs.
              </p>
            </div>
            <div className="w-full md:w-80 bg-black/40 border border-white/[0.04] p-4.5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground tracking-wider">
                <span>CONVERSION PULSE</span>
                <span className="text-red-400 font-black">+14% Growth</span>
              </div>
              <div className="h-10 bg-red-500/10 border border-white/[0.02] rounded-lg overflow-hidden flex items-end px-2 gap-1">
                <div className="w-full h-[30%] bg-red-400/40 rounded-t" />
                <div className="w-full h-[60%] bg-red-400/60 rounded-t" />
                <div className="w-full h-[90%] bg-red-400 rounded-t" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE VOICE TRANSLATION SANDBOX */}
      <section id="sandbox" className="max-w-5xl mx-auto px-6 py-12 relative z-10 text-center">
        <div className="space-y-2 mb-10">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Sliders size={14} className="text-orange-400" /> Interactive Tone sandbox
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Select a persona mode below to see the AI translate the post in real-time.</p>
        </div>

        <div className="bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl space-y-6">
          <div className="flex justify-center gap-3">
            {['casual', 'executive', 'geek'].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setRewriteMode(mode);
                  addLog(`Tuned Sandbox Tone: ${mode}`);
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

      {/* OPERATIONS CONSOLE TERMINAL */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative z-10 text-center">
        <div className="bg-[#09090b] border border-white/[0.05] rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto text-left font-mono shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3 text-xs font-bold text-muted-foreground">
            <Terminal size={14} className="text-orange-400" />
            <span>OPERATIONAL DIAGNOSTIC TERMINAL</span>
          </div>

          <div className="space-y-2 text-[11px] text-muted-foreground leading-normal max-h-[180px] overflow-y-auto">
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
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-muted-foreground bg-[#050507] relative z-10">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;