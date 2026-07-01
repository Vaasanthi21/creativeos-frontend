import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Check
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLaunch = (targetPath) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 90, damping: 15 }
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-display">
      
      {/* 1. BACKGROUND DYNAMICS */}
      {/* Floating neon gradients */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.85, 1.1, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none"
      />
      
      {/* High-tech tech grid backdrop */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25"
        style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)' }}
      />

      {/* 2. HEADER NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-extrabold text-white text-sm shadow-[0_0_15px_rgba(242,91,24,0.4)]">
            C
          </div>
          <span className="font-display font-extrabold tracking-tight text-white text-base">CreativeStudio OS</span>
        </div>
        
        <div>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/blog-studio')}
              className="px-4 py-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <span>Go to App</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-primary shadow-sm"
          >
            <Sparkles size={11} className="animate-pulse" />
            <span>Next-Generation AI Engine</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08] capitalize"
          >
            The Ultimate AI Operating System for{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Creative Expression</span>{' '}
            &{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Growth Acceleration</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Unify your content production workflows and campaign execution layers inside a single dynamic environment. Choose your vector.
          </motion.p>
        </motion.div>
      </div>

      {/* 4. DUAL OS SELECTOR PORTAL */}
      <div className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* PORTAL A: CREATIVE OS */}
          <motion.div
            variants={scaleIn}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between space-y-8 overflow-hidden hover:border-primary/45 hover:shadow-[0_0_50px_rgba(242,91,24,0.1)] transition-all duration-300"
          >
            {/* Background glow overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-300" />
            
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                <Workflow size={20} />
              </div>

              {/* Title details */}
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-black text-white">Creative OS</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Focus on content synthesis. Generate blogs, design premium images, and render short videos grounded in your brand identity automatically.
                </p>
              </div>

              {/* Features list */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
                {[
                  { text: 'Blog Studio AI Grounding Engine', icon: Compass },
                  { text: 'AI Image Studio cover-art renderer', icon: ImageIcon },
                  { text: 'Video Studio social adaptations', icon: Video },
                  { text: 'Interactive text outline refiner', icon: Layout }
                ].map((feat, idx) => {
                  const FeatIcon = feat.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                      <div className="w-5 h-5 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FeatIcon size={11} />
                      </div>
                      <span>{feat.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleLaunch('/blog-studio')}
              className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-extrabold rounded-xl shadow-[0_4px_20px_rgba(242,91,24,0.25)] hover:shadow-[0_4px_30px_rgba(242,91,24,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Launch Creative OS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 duration-200" />
            </button>
          </motion.div>

          {/* PORTAL B: GROWTH OS */}
          <motion.div
            variants={scaleIn}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between space-y-8 overflow-hidden hover:border-cyan-500/45 hover:shadow-[0_0_50px_rgba(6,182,212,0.1)] transition-all duration-300"
          >
            {/* Background glow overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-300" />
            
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-sm">
                <TrendingUp size={20} />
              </div>

              {/* Title details */}
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-black text-white">Growth OS</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Focus on distribution performance. Launch automated LinkedIn campaigns, recharge wallets, map audience metrics, and configure personas.
                </p>
              </div>

              {/* Features list */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
                {[
                  { text: 'LinkedIn Campaign Ad Builder', icon: Layers },
                  { text: 'LinkedIn Analytics metrics tracker', icon: BarChart3 },
                  { text: 'Brand Persona configurations', icon: Brain },
                  { text: 'Wallet budget allocation controller', icon: Zap }
                ].map((feat, idx) => {
                  const FeatIcon = feat.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                      <div className="w-5 h-5 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                        <FeatIcon size={11} />
                      </div>
                      <span>{feat.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleLaunch('/linkedinads')}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Launch Growth OS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 duration-200" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 5. SCROLL TRIGGERED FEATURE SHOWCASE SECTION */}
      <div className="border-t border-slate-900 bg-slate-950/40 py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white">Unified System Capabilities</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              How our system bridges the creative workflow and distribution loop natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Brand Grounding',
                desc: 'AI references uploaded corporate files, pitch wikis, and target audience domains to ensure blog drafts maintain 100% factual accuracy.',
                icon: Globe
              },
              {
                title: 'Multi-Channel Adapters',
                desc: 'Generate central canonical drafts and render one-click adaptations targeting LinkedIn, Medium, Substack, and Developer platforms.',
                icon: Layout
              },
              {
                title: 'Audience Persona Logic',
                desc: 'Assign dedicated content personas to each generation workflow to automatically tune messaging, writing styles, and keywords.',
                icon: Brain
              }
            ].map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-4 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-primary shadow-sm">
                    <CardIcon size={16} />
                  </div>
                  <h4 className="font-display font-bold text-white text-base">{card.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. FOOTER */}
      <footer className="border-t border-slate-900/80 py-8 text-center text-xs text-slate-500 relative z-10 bg-slate-950">
        <p>&copy; 2026 CreativeStudio OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
