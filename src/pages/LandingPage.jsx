import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  RefreshCw,
  Eye,
  Settings,
  Flame,
  Globe
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
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.2 + 0.05,
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-45 z-0" />;
};

// Interactive warp mesh grid
const WarpGrid = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

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
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const spacing = 70;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;

    const points = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        points.push({
          ox: x * spacing,
          oy: y * spacing,
          x: x * spacing,
          y: y * spacing
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.04)';
      ctx.lineWidth = 1;

      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (let x = 0; x < cols; x++) {
        ctx.beginPath();
        for (let y = 0; y < rows; y++) {
          const p = points[x * rows + y];
          const dx = mx - p.ox;
          const dy = my - p.oy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, (250 - dist) / 250);

          p.x = p.ox - (dx / dist) * force * 18;
          p.y = p.oy - (dy / dist) * force * 18;

          if (y === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

// Tinder-style 3D Drag Card component
const DragCard = ({ item, index, activeIndex, onSwipe, handleLaunch }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);
  
  const springX = useSpring(x, { damping: 20, stiffness: 120 });
  const springY = useSpring(y, { damping: 20, stiffness: 120 });
  
  const isTopCard = index === activeIndex;

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 140;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      onSwipe();
    } else {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      drag={isTopCard}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        z: isTopCard ? 100 : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      animate={{
        scale: isTopCard ? 1 : 0.95 - (index - activeIndex) * 0.03,
        y: isTopCard ? 0 : (index - activeIndex) * 12,
      }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`absolute w-[310px] sm:w-[360px] h-[400px] rounded-3xl border border-white/[0.06] bg-[#0c0c0e]/95 backdrop-blur-md p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 ${
        isTopCard ? 'cursor-grab active:cursor-grabbing border-orange-500/20 shadow-orange-500/5' : 'pointer-events-none opacity-40'
      }`}
    >
      <div className="space-y-6 text-left">
        <div className={`w-14 h-14 rounded-2xl ${item.iconBg} border ${item.iconBorder} flex items-center justify-center ${item.iconColor} shadow-md`}>
          <item.icon size={26} />
        </div>
        <div className="space-y-3">
          <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-500 uppercase">STUDIO MODULE</span>
          <h3 className="font-display text-2xl font-black text-foreground">{item.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {item.desc}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isTopCard && (
          <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500">
            <span>DRAG CARD TO SWIPE</span>
            <span className="text-orange-400 font-black">ACTIVE</span>
          </div>
        )}
        <button
          onClick={() => handleLaunch(item.path)}
          className={`w-full py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400`}
        >
          <span>Launch Portal Node</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Drag card stack states
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Active platform catalog selection
  const [activeCatalogTab, setActiveCatalogTab] = useState('generate');
  const [isHoveringCatalog, setIsHoveringCatalog] = useState(false);

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

  // Tone sandbox mode
  const [toneMode, setToneMode] = useState('casual');

  // Logs terminal stream
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

  const swipeCard = () => {
    setActiveCardIndex((prev) => (prev + 1) % platformFeatures.length);
    setLogs((prev) => [...prev.slice(-6), `[STACK] Swiped studio module card.`]);
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
      subtitle: 'Copy generation suite',
      desc: 'Create high-performing blog outlines, copy components, and custom social assets grounded in your brand identity.',
      path: '/generate',
      icon: Sparkles,
      iconBg: 'bg-orange-500/10',
      iconBorder: 'border-orange-500/25',
      iconColor: 'text-orange-400',
      imgPreview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'blog',
      title: 'Blog Studio',
      subtitle: 'SEO indexing outlines',
      desc: 'Formulate search engine optimized structures, index topics, and draft comprehensive articles automatically.',
      path: '/blog-studio',
      icon: Layout,
      iconBg: 'bg-amber-500/10',
      iconBorder: 'border-amber-500/25',
      iconColor: 'text-amber-400',
      imgPreview: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'image',
      title: 'Image Studio',
      subtitle: 'Graphics builder canvas',
      desc: 'Produce breathtaking graphics, marketing banners, and visual layouts tailored to maximize social conversion.',
      path: '/image-studio',
      icon: ImageIcon,
      iconBg: 'bg-yellow-500/10',
      iconBorder: 'border-yellow-500/25',
      iconColor: 'text-yellow-400',
      imgPreview: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'video',
      title: 'Video Studio',
      subtitle: 'Reels narration tracks',
      desc: 'Design engaging social reels and brand video presentations complete with AI narration audio loops.',
      path: '/video-studio',
      icon: Video,
      iconBg: 'bg-orange-650/10',
      iconBorder: 'border-orange-650/25',
      iconColor: 'text-orange-500',
      imgPreview: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'tracker',
      title: 'LinkedIn Ads',
      subtitle: 'Ad budget and conversions',
      desc: 'Track conversions metrics, run analytics audits, and manage corporate campaign ad budgets in real-time.',
      path: '/linkedinads',
      icon: BarChart3,
      iconBg: 'bg-red-500/10',
      iconBorder: 'border-red-500/25',
      iconColor: 'text-red-400',
      imgPreview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop'
    }
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="dark relative min-h-screen bg-[#040405] text-[#f4f4f7] overflow-x-hidden font-display select-none"
    >
      <SpaceParticlesBg />
      <WarpGrid />

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
            <a href="#drag-stack" className="hover:text-foreground transition">3D Swiper</a>
            <a href="#studios" className="hover:text-foreground transition">Catalog</a>
            <a href="#narrative" className="hover:text-foreground transition">Engine</a>
            <a href="#sandbox" className="hover:text-foreground transition">Sandbox</a>
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
            <span>Interactive 3D Swiper & Transitions</span>
          </div>

          <h1 className="text-5xl sm:text-8xl font-display font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[0.94] capitalize">
            The Interactive{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Creative Portal</span>{' '}
            For Brands
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Write outlines, translate tone structures, and launch automated campaign metrics inside a hardware-accelerated dark sandbox interface.
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
        {isHoveringCatalog && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ x: smoothMouseX, y: smoothMouseY }}
            className="fixed top-0 left-0 pointer-events-none z-45 w-32 h-32 rounded-full overflow-hidden border border-orange-500/40 shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {platformFeatures.map((feat) => {
                if (feat.id !== activeCatalogTab) return null;
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

      {/* 3D DRAG CARD SWIPER STACK SECTION */}
      <section id="drag-stack" className="max-w-5xl mx-auto px-6 py-12 relative z-10 text-center">
        <div className="space-y-2 mb-10">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Flame size={14} className="text-orange-400" /> 3D Stack Swiper
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Drag and swipe cards left/right to browse the studio workspace catalog modules.</p>
        </div>

        {/* Swiper deck container */}
        <div className="relative h-[480px] flex items-center justify-center select-none max-w-sm mx-auto">
          {platformFeatures.map((item, idx) => (
            <DragCard
              key={item.id}
              item={item}
              index={idx}
              activeIndex={activeCardIndex}
              onSwipe={swipeCard}
              handleLaunch={handleLaunch}
            />
          ))}
        </div>
      </section>

      {/* PLATFORM CATALOG SECTION */}
      <section id="studios" className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="space-y-2 mb-12 text-center">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Layers size={14} className="text-orange-400" /> Studio Directory
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Focus nodes below to load dynamic high-fidelity app previews.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 bg-[#09090b]/80 border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
          {/* Menu list */}
          <div
            onMouseEnter={() => setIsHoveringCatalog(true)}
            onMouseLeave={() => setIsHoveringCatalog(false)}
            className="flex flex-col border-r border-white/[0.03] pr-0 lg:pr-8 text-left justify-center space-y-4"
          >
            {platformFeatures.map((feat) => {
              const isActive = activeCatalogTab === feat.id;
              return (
                <div
                  key={feat.id}
                  onMouseEnter={() => {
                    setActiveCatalogTab(feat.id);
                    setLogs((prev) => [...prev.slice(-6), `[HOVER] Focused catalog: ${feat.title}`]);
                  }}
                  className="relative px-6 py-5 rounded-2xl flex items-center justify-between cursor-pointer group transition-all"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCatalogCap"
                      className="absolute inset-0 bg-orange-500/10 border border-orange-500/20 rounded-2xl -z-10"
                      transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                    />
                  )}

                  <div className="flex items-center gap-6">
                    <span className={`text-xs font-mono font-bold tracking-widest ${isActive ? 'text-orange-400' : 'text-neutral-600'}`}>
                      {platformFeatures.indexOf(feat) + 1}
                    </span>
                    <div className="space-y-0.5">
                      <h3 className={`text-xl font-black tracking-tight transition ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                        {feat.title}
                      </h3>
                      <span className="text-[10px] text-neutral-500 block uppercase tracking-wider font-semibold">{feat.subtitle}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                    <span>Preview</span>
                    <ArrowRight size={11} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dynamic Mock Workspace Preview */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#0c0c0f] overflow-hidden flex flex-col justify-between h-[390px] text-left">
            {/* Window Header */}
            <div className="bg-neutral-900/40 border-b border-white/[0.03] px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/30" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/30" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/30" />
              </div>
              <span className="text-[8px] text-neutral-600 font-mono">live_studio_preview.jsx</span>
              <div className="w-3 h-3 rounded bg-white/5" />
            </div>

            {/* Dashboard content */}
            <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeCatalogTab === 'generate' && (
                  <motion.div
                    key="generate"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-orange-400 font-black uppercase">AI Outlines Generator</span>
                      <span className="text-[9px] text-neutral-500">Compiling</span>
                    </div>
                    <div className="space-y-2.5 font-mono text-[10px] leading-relaxed text-slate-350">
                      <p className="border-l border-orange-500/30 pl-2">Matching brand indexes to outline parameters...</p>
                      <div className="p-2.5 bg-orange-500/5 border border-orange-500/15 rounded-lg flex items-center justify-between">
                        <span className="text-white">✨ AI Assist: Refine introduction copy</span>
                        <span className="text-[8px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded">Indexed</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCatalogTab === 'blog' && (
                  <motion.div
                    key="blog"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-amber-400 font-black uppercase">SEO Keyword Tracker</span>
                      <span className="text-[9px] text-emerald-400 font-bold">✓ Active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="border border-white/[0.03] p-3 rounded-xl bg-white/[0.01] flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-bold text-white block">1. Figma Layout Compiling</span>
                          <span className="text-[8px] text-neutral-500 block mt-0.5">Keywords: sandbox builder, design compiler</span>
                        </div>
                        <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-bold">98% Match</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCatalogTab === 'image' && (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 h-full flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-yellow-400 font-black uppercase">GRAPHICS STUDIO ENGINE</span>
                      <span className="text-[9px] text-neutral-500">Render loops</span>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center border border-dashed border-white/[0.05] rounded-xl relative overflow-hidden bg-white/[0.01] my-2">
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
                  </motion.div>
                )}

                {activeCatalogTab === 'video' && (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-orange-500 font-black uppercase">AUDIO LOOP MONITOR</span>
                      <span className="text-[9px] text-neutral-500">Connected</span>
                    </div>

                    <div className="bg-black/30 border border-white/[0.03] p-3.5 rounded-xl space-y-3">
                      <div className="flex items-center gap-2">
                        <Volume2 size={13} className="text-orange-500 animate-bounce" />
                        <span className="text-[10px] text-white font-bold">Confidence Male Narration Voice</span>
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
                  </motion.div>
                )}

                {activeCatalogTab === 'tracker' && (
                  <motion.div
                    key="tracker"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
                      <span className="text-[9px] font-mono text-red-400 font-black uppercase">LinkedIn campaigns console</span>
                      <span className="text-[9px] text-emerald-400 font-bold">Live</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl">
                        <span className="text-[8px] text-neutral-500 block uppercase">ROI ratio</span>
                        <span className="text-lg font-black text-white mt-1 block">4.8x</span>
                      </div>
                      <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl">
                        <span className="text-[8px] text-neutral-500 block uppercase">Conversions</span>
                        <span className="text-lg font-black text-white mt-1 block">5.42%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Launch button */}
            <div className="p-4 bg-neutral-900/20 border-t border-white/[0.03]">
              <button
                onClick={() => handleLaunch(platformFeatures.find(f => f.id === activeCatalogTab).path)}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/10"
              >
                <span>Enter Portal Node</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CORE ARCHITECTURE ENGINE */}
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

          <div className="p-5 bg-black/60 border border-white/[0.03] rounded-2xl min-h-[90px] text-left font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="text-orange-500 mr-2">&gt;</span>
            {rewriteDrafts[toneMode]}
          </div>
        </div>
      </section>

      {/* OPERATIONAL CONSOLE */}
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

      {/* FOOTER */}
      <footer className="border-t border-white/[0.02] py-8 text-center text-xs text-muted-foreground bg-[#040405] relative z-10">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;