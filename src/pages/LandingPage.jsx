"use client"

/**
 * CreativeOS — single-file landing page (plain JSX)
 * -------------------------------------------------
 * Drop this file anywhere in a React project (Next.js, Vite, CRA…).
 *
 * Requirements:
 *   1. Tailwind CSS enabled in the host project.
 *   2. `lucide-react` installed:  npm i lucide-react
 *   3. These images available in your /public folder (same names):
 *        cyberpunk-1.png, cyberpunk-2.png, cyberpunk-3.png, cyberpunk-4.png,
 *        snowy-mountains.png
 *
 * Usage (either import style works):
 *         import { LandingPage } from "./pages/LandingPage"
 *         import LandingPage from "./pages/LandingPage"
 *
 * What's new in this version:
 *   - Scroll-triggered reveal animations (fade + rise) on every section,
 *     staggered per grid item, powered by a lightweight IntersectionObserver hook.
 *   - Parallax glow blobs that drift as you scroll.
 *   - 3D tilt-on-hover for image thumbnails, the video preview and platform nodes.
 *   - Magnetic buttons that nudge toward the cursor.
 *   - Count-up numbers for every stat once it scrolls into view.
 *   - Animated bar chart + line chart draw-in.
 *   - A thin scroll progress bar and a nav that condenses on scroll.
 *   - An auto-rotating 3D coverflow carousel (right after the hero) that gives
 *     visitors a fast, tactile map of all five studios before they scroll
 *     into the deep-dive sections.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"
import { useToast } from "../components/ui/use-toast"
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ImageIcon,
  Video,
  FileText,
  BarChart3,
  Wand2,
  Check,
  Play,
  Hash,
  TrendingUp,
  Download,
  Zap,
} from "lucide-react"

/* ================================================================== */
/*  Root                                                              */
/* ================================================================== */

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0705] font-sans text-neutral-200 antialiased selection:bg-orange-500/30">
      <GlobalMotionStyles />
      <ScrollProgress />
      <Starfield />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <StudioCoverflow />
        <ImageStudio />
        <VideoStudio />
        <BlogStudio />
        <TrackerStudio />
        <PlatformStudio />
        <Waitlist />
      </main>
      <Footer />
    </div>
  )
}

/* ============================== Motion kit ========================= */
/* Small, dependency-free primitives used across every section.        */

/** Fires once, true after the element crosses the viewport threshold. */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.unobserve(el)
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, visible]
}

/** Generic fade + rise wrapper for scroll-in animation. */
function Reveal({ children, className = "", delay = 0, y = 24, as: Tag = "div" }) {
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
      }}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {children}
    </Tag>
  )
}

/** 3D tilt that follows the cursor, resets smoothly on leave. */
function TiltCard({ children, className = "", max = 8, style = {} }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (py - 0.5) * -max
    const ry = (px - 0.5) * max
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px) scale(1.015)`
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = ""
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={style}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}

/** Nudges its contents toward the cursor — used on primary buttons. */
function Magnetic({ children, strength = 0.25, className = "" }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = ""
  }
  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`inline-block transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </span>
  )
}

/** Splits "12M+" -> {num:12, suffix:"M+"}, "99.9%" -> {num:99.9, suffix:"%", decimals:1} */
function splitStat(value) {
  const m = String(value).match(/^([\d.,]+)(.*)$/)
  if (!m) return { num: 0, suffix: String(value), decimals: 0 }
  const numStr = m[1].replace(/,/g, "")
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0
  return { num: parseFloat(numStr), suffix: m[2], decimals }
}

/** Animated count-up number, starts once `visible` flips true. */
function StatValue({ value, visible, duration = 1200 }) {
  const { num, suffix, decimals } = useMemo(() => splitStat(value), [value])
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!visible) return
    let raf
    let start = null
    const step = (ts) => {
      if (start === null) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(num * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [visible, num, duration])
  return (
    <>
      {display.toFixed(decimals)}
      {suffix}
    </>
  )
}

/** Thin gradient bar pinned to the top, fills with scroll progress. */
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const h = document.documentElement
        const scrolled = h.scrollTop
        const max = h.scrollHeight - h.clientHeight
        setPct(max > 0 ? (scrolled / max) * 100 : 0)
        raf = null
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/** Keyframes that Tailwind's core utilities don't cover, scoped globally once. */
function GlobalMotionStyles() {
  return (
    <style>{`
      @keyframes cos-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      @keyframes cos-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(249,115,22,0.35); } 70% { box-shadow: 0 0 0 14px rgba(249,115,22,0); } 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); } }
      @keyframes cos-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      .cos-logo-icon { animation: cos-float 3.2s ease-in-out infinite; }
      .cos-core-ring { animation: cos-pulse-ring 2.4s ease-out infinite; }
      .cos-shimmer-text {
        background-image: linear-gradient(100deg, #fb923c, #f97316 45%, #fdba74 55%, #fb923c);
        background-size: 220% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: cos-shimmer 5s linear infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .cos-logo-icon, .cos-core-ring, .cos-shimmer-text { animation: none !important; }
        * { transition-duration: 0.001ms !important; }
      }
    `}</style>
  )
}

/* ------------------------------- Nav ------------------------------- */

function Logo({ className = "" }) {
  return (
    <a href="#" className={`flex items-center gap-2.5 ${className}`}>
      <span className="cos-logo-icon grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-600/30">
        <Sparkles className="h-5 w-5 text-black" />
      </span>
      <span className="text-lg font-bold tracking-tight text-white">
        Creative<span className="text-orange-500">OS</span>
      </span>
    </a>
  )
}

function Nav() {
  const links = ["Image", "Video", "Blog", "Tracker", "Platform"]
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <header
      className={`fixed inset-x-0 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 backdrop-blur-xl transition-all duration-500 ease-out md:px-6 ${
        scrolled ? "top-2 bg-black/80 px-4 py-2 shadow-xl shadow-black/40" : "top-4 bg-black/60 px-4 py-2.5"
      }`}
    >
      <Logo />
      <nav className="hidden items-center gap-7 md:flex">
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            className="relative text-sm text-neutral-400 transition-colors duration-300 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            {l}
          </a>
        ))}
      </nav>
      <Magnetic strength={0.3}>
        <a
          href="#waitlist"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          Join waitlist
        </a>
      </Magnetic>
    </header>
  )
}

/* ------------------------------ Hero ------------------------------- */

function Hero() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const stats = [
    { v: "12M+", l: "Assets Generated" },
    { v: "48K", l: "Creators Onboarded" },
    { v: "4", l: "Integrated Studios" },
    { v: "99.9%", l: "Uptime SLA" },
  ]
  const [statsRef, statsVisible] = useReveal(0.3)
  const blobRef = useRef(null)

  // Gentle parallax on the hero glow as the page scrolls.
  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        if (blobRef.current) {
          const y = Math.min(window.scrollY, 800)
          blobRef.current.style.transform = `translate(-50%, ${y * 0.18}px) scale(${1 + y * 0.0002})`
        }
        raf = null
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-40 pb-24 text-center md:pt-48">
      <div
        ref={blobRef}
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-orange-600/20 blur-[140px]"
      />
      <Reveal y={16}>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-neutral-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
          v1.0 — Now in beta
        </span>
      </Reveal>

      <Reveal delay={80} y={26}>
        <h1 className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-extrabold leading-[0.98] tracking-tight text-white md:text-7xl lg:text-8xl">
          Create Stunning
          <br />
          Content with <span className="cos-shimmer-text italic">AI</span>
        </h1>
      </Reveal>

      <Reveal delay={160} y={22}>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-neutral-400 md:text-lg">
          Generate images, videos, blogs, and professional LinkedIn content — all from one intelligent workspace.
        </p>
      </Reveal>

      <Reveal delay={240} y={18}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Magnetic strength={0.25}>
            <button
              onClick={() => navigate(isAuthenticated ? "/generate" : "/login?redirect=/generate")}
              className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              Start Creating
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <a
              href="#image"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5 active:scale-95"
            >
              Explore the platform
            </a>
          </Magnetic>
        </div>
      </Reveal>

      <div
        ref={statsRef}
        className="mx-auto mt-20 grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:grid-cols-4"
      >
        {stats.map((s, i) => (
          <div
            key={s.l}
            style={{
              transitionDelay: `${i * 90}ms`,
              transform: statsVisible ? "translateY(0)" : "translateY(16px)",
            }}
            className={`px-6 py-7 transition-all duration-700 ease-out hover:-translate-y-0.5 hover:bg-white/[0.05] ${
              statsVisible ? "opacity-100" : "opacity-0"
            } ${i !== 0 ? "md:border-l md:border-white/10" : ""} ${
              i % 2 !== 0 ? "border-l border-white/10 md:border-l" : ""
            } ${i >= 2 ? "border-t border-white/10 md:border-t-0" : ""}`}
          >
            <div className="text-3xl font-bold text-white">
              <StatValue value={s.v} visible={statsVisible} />
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neutral-500">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------- Studio Coverflow ------------------------- */
/* Auto-rotating 3D coverflow carousel — ported from the earlier violet   */
/* build and re-themed for the orange/charcoal CreativeOS system. Gives   */
/* visitors a fast, tactile map of every studio before they scroll into   */
/* the dedicated deep-dive section for each one.                         */

function StudioCoverflow() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const cards = [
    {
      title: "Image Studio",
      desc: "Turn a sentence into a full visual world — four HD styles in seconds.",
      anchor: "#image",
      path: "/image-studio",
      icon: ImageIcon,
    },
    {
      title: "Video Studio",
      desc: "Describe a scene, get cinematic footage with timeline and export ready.",
      anchor: "#video",
      path: "/video-studio",
      icon: Video,
    },
    {
      title: "Blog Studio",
      desc: "SEO-tuned, source-cited long-form articles in a Notion-style editor.",
      anchor: "#blog",
      path: "/blog-studio",
      icon: FileText,
    },
    {
      title: "LinkedIn Tracker",
      desc: "A living dashboard for impressions, engagement, CTR and follower growth.",
      anchor: "#tracker",
      path: "/linkedinads",
      icon: BarChart3,
    },
    {
      title: "Platform Core",
      desc: "One universal prompt bar routes every request to the right studio.",
      anchor: "#platform",
      path: "/generate",
      icon: Sparkles,
    },
  ]
  const cardCount = cards.length

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [sectionRef, sectionVisible] = useReveal(0.2)

  // Auto-advance every 2.6s — pauses on hover, and never runs before the
  // section has actually scrolled into view.
  useEffect(() => {
    if (isPaused || !sectionVisible) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardCount)
    }, 2600)
    return () => clearInterval(timer)
  }, [isPaused, sectionVisible, cardCount])

  // Shortest signed distance from a card's index to the active card (handles wraparound).
  const getOffset = (idx) => {
    let diff = idx - activeIndex
    if (diff > cardCount / 2) diff -= cardCount
    if (diff < -cardCount / 2) diff += cardCount
    return diff
  }

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-6xl px-5 pb-24"
      style={{
        transitionDelay: "80ms",
        transform: sectionVisible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className={`text-center transition-all duration-700 ease-out ${sectionVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="flex justify-center">
          <SectionLabel>Studio Index</SectionLabel>
        </div>
        <h2 className="mx-auto mt-5 max-w-xl text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
          Five studios, one prompt bar away.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-sm text-neutral-500">
          Cycles automatically — hover to pause, click any card to jump straight to it.
        </p>
      </div>

      <div
        className="relative mt-14 flex h-[440px] items-center justify-center sm:h-[480px]"
        style={{ perspective: "1600px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {cards.map((card, idx) => {
          const offset = getOffset(idx)
          const abs = Math.abs(offset)
          const isActive = offset === 0
          if (abs > 2) return null

          const translateX = offset * 260
          const scale = isActive ? 1 : abs === 1 ? 0.82 : 0.64
          const rotateY = isActive ? 0 : offset > 0 ? -36 : 36
          const opacity = isActive ? 1 : abs === 1 ? 0.55 : 0.22
          const zIndex = 20 - abs

          return (
            <div
              key={card.title}
              onClick={() => {
                if (isActive) {
                  if (isAuthenticated) {
                    navigate(card.path)
                  } else {
                    toast({
                      title: "Authentication Required",
                      description: "Please login or create an account to access the studios.",
                    })
                    navigate(`/login?redirect=${card.path}`)
                  }
                } else {
                  setActiveIndex(idx)
                }
              }}
              style={{
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",
                transition: "transform 550ms cubic-bezier(0.22, 1, 0.36, 1), opacity 550ms ease-out",
              }}
              className="absolute h-[380px] w-[300px] cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm sm:h-[420px] sm:w-[330px] sm:p-8"
            >
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-500/10 text-orange-500">
                    <card.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-2xl font-bold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">{card.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-orange-500">
                  <span>Open studio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {isActive && (
                <div
                  className="pointer-events-none absolute -inset-px -z-10 rounded-2xl blur-2xl"
                  style={{ background: "radial-gradient(200px circle, rgba(249,115,22,0.16) 0%, transparent 80%)" }}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {cards.map((card, idx) => (
          <button
            key={card.title}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Show ${card.title}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex ? "w-6 bg-orange-500" : "w-1.5 bg-white/15"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

/* --------------------------- Shared bits --------------------------- */

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-orange-500" />
      <span className="font-mono text-xs uppercase tracking-widest text-orange-500">{children}</span>
    </div>
  )
}

function StudioHeading({ label, title, desc }) {
  return (
    <div className="max-w-2xl">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-pretty text-lg leading-relaxed text-neutral-400">{desc}</p>
    </div>
  )
}

function FeatureRow({ icon: Icon, title, status }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/30 hover:bg-white/[0.05]">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-500/10 text-orange-500 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-white">{title}</div>
        <div className="text-xs text-neutral-500">{status}</div>
      </div>
    </div>
  )
}

/* -------------------------- Image Studio --------------------------- */

function ImageStudio() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("A futuristic cyberpunk city at sunset.")
  const images = ["/cyberpunk-1.png", "/cyberpunk-2.png", "/cyberpunk-3.png", "/cyberpunk-4.png"]
  const [gridRef, gridVisible] = useReveal(0.2)

  return (
    <section id="image" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <StudioHeading
          label="01 — Image Studio"
          title="Turn a sentence into a whole visual world."
          desc="Describe anything. Get four production-ready images in seconds — each in a different style, all at HD quality."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <Reveal delay={100} className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <FeatureRow icon={Wand2} title="Text-to-Image" status="Enabled" />
          <FeatureRow icon={ImageIcon} title="Multiple Styles" status="Enabled" />
          <FeatureRow icon={Sparkles} title="HD Quality" status="Enabled" />
          <FeatureRow icon={Zap} title="Instant Generation" status="Enabled" />
        </Reveal>

        <Reveal delay={180} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (isAuthenticated) {
                navigate("/image-studio", { state: { prompt } })
              } else {
                toast({
                  title: "Authentication Required",
                  description: "Please login or create an account to access the studios.",
                })
                navigate(`/login?redirect=/image-studio`, { state: { prompt } })
              }
            }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2 pl-4 transition-colors duration-300 focus-within:border-orange-500/40"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-orange-500" />
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-neutral-200 outline-none placeholder:text-neutral-600"
              placeholder="Describe your image..."
              aria-label="Image prompt"
            />
            <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-orange-400 hover:scale-[1.03] active:scale-95">
              Generate
            </button>
          </form>

          <div ref={gridRef} className="mt-4 grid grid-cols-2 gap-3">
            {images.map((src, i) => (
              <TiltCard
                key={src}
                max={10}
                className="rounded-xl"
                style={{
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div
                  style={{
                    transitionDelay: `${i * 100}ms`,
                    transform: gridVisible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.97)",
                  }}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 transition-all duration-700 ease-out ${
                    gridVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={src || "/placeholder.svg"}
                    alt="AI generated preview"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                    v{i + 1}
                  </span>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-neutral-500">
            <span>Rendered in 1.8s · Seed 042817</span>
            <span className="text-orange-500">HD · 2048×1536</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------- Video Studio --------------------------- */

function VideoStudio() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const ratios = ["16:9", "9:16", "1:1", "4:5"]
  const [barRef, barVisible] = useReveal(0.3)

  return (
    <section id="video" className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal delay={100} y={30} className="order-2 lg:order-1">
          <TiltCard max={4} className="overflow-hidden rounded-2xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                <Video className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="truncate text-xs text-neutral-400">
                  A drone flying through snowy mountains during sunrise.
                </span>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                <img
                  src="/snowy-mountains.png"
                  alt="Snowy mountains sunrise"
                  className="h-full w-full object-cover"
                />
                <button
                  aria-label="Play preview"
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate("/video-studio", { state: { prompt: "A drone flying through snowy mountains during sunrise." } })
                    } else {
                      toast({
                        title: "Authentication Required",
                        description: "Please login or create an account to access the studios.",
                      })
                      navigate("/login?redirect=/video-studio")
                    }
                  }}
                  className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-white/90 text-black backdrop-blur transition-transform duration-300 hover:scale-110 active:scale-95"
                >
                  <Play className="h-6 w-6 translate-x-0.5 fill-black" />
                </button>
                <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white">
                  16:9
                </span>
                <div ref={barRef} className="absolute inset-x-3 bottom-3">
                  <div className="flex items-center justify-between font-mono text-[10px] text-white/80">
                    <span>Rendering · Pass 2 of 3</span>
                    <span>62%</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-[width] duration-[1400ms] ease-out"
                      style={{ width: barVisible ? "62%" : "0%" }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {ratios.map((r, i) => (
                  <span
                    key={r}
                    className={`cursor-default rounded-md border px-2.5 py-1 font-mono text-[11px] transition-all duration-300 hover:-translate-y-0.5 ${
                      i === 0
                        ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                        : "border-white/10 bg-white/[0.03] text-neutral-400 hover:border-orange-500/30 hover:text-orange-300"
                    }`}
                  >
                    {r}
                  </span>
                ))}
                <span className="ml-auto font-mono text-[11px] text-neutral-500">00:12 / 00:24</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {["V1 · Drone Aerial", "V2 · Sun Flare", "A1 · Ambient Wind"].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[11px] text-neutral-400 transition-colors duration-300 hover:border-orange-500/20 hover:text-neutral-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </Reveal>

        <Reveal delay={0} y={30} className="order-1 lg:order-2">
          <StudioHeading
            label="02 — Video Studio"
            title="From prompt to cinematic footage."
            desc="Describe a scene. Watch it render into a smooth, cinematic clip — with timeline, aspect ratios and export ready in one flow."
          />
          <div className="mt-8 grid grid-cols-2 gap-3">
            <FeatureRow icon={Video} title="Text-to-Video" status="Active" />
            <FeatureRow icon={Play} title="Cinematic Motion" status="Active" />
            <FeatureRow icon={ImageIcon} title="Aspect Ratios" status="Active" />
            <FeatureRow icon={Zap} title="Fast Rendering" status="Active" />
          </div>
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate("/video-studio")
              } else {
                toast({
                  title: "Authentication Required",
                  description: "Please login or create an account to access the studios.",
                })
                navigate("/login?redirect=/video-studio")
              }
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500/10 border border-orange-500/30 px-4 py-2.5 text-sm font-semibold text-orange-500 transition-all hover:bg-orange-500/20 hover:scale-[1.02] active:scale-95"
          >
            <span>Open Video Studio</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  )
}

/* --------------------------- Blog Studio --------------------------- */

function BlogStudio() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const insights = [
    "Title includes focus keyword",
    "Meta description within 155 chars",
    "5 internal links added",
    "Reading grade level 8",
  ]
  const keywords = ["ai marketing", "personalization", "predictive ai", "roi", "growth"]
  const [insightsRef, insightsVisible] = useReveal(0.3)

  return (
    <section id="blog" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <StudioHeading
          label="03 — Blog Studio"
          title="Publish long-form that actually ranks."
          desc="AI-drafted, SEO-tuned, source-cited articles — formatted in a Notion-style editor and exportable in one click."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* editor */}
        <Reveal delay={100} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <span className="font-mono text-xs text-neutral-500">draft — untitled.md</span>
            <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-500">
              <span>Words 1,842 · Read 7 min</span>
              <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-orange-400">SEO 98/100</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
            <Sparkles className="h-4 w-4 shrink-0 text-orange-500" />
            <span className="text-sm text-neutral-400">Write a blog about AI in digital marketing.</span>
          </div>
          <div className="mt-5 space-y-4">
            <BlogHeading level="H1" text="AI in Digital Marketing: The 2026 Playbook" big />
            <p className="text-sm leading-relaxed text-neutral-500">
              The next wave of marketing is autonomous. Here is how leading teams are turning generative models into
              measurable growth engines this year.
            </p>
            <BlogHeading level="H2" text="1. From Automation to Autonomy" />
            <BlogHeading level="H2" text="2. Personalization at Scale" />
            <BlogHeading level="H2" text="3. Measuring Real ROI" />
          </div>
          <button
            onClick={() => {
              const path = "/blog-studio?view=generate&suggestedTopicName=AI in Digital Marketing: The 2026 Playbook"
              if (isAuthenticated) {
                navigate(path)
              } else {
                toast({
                  title: "Authentication Required",
                  description: "Please login or create an account to access the studios.",
                })
                navigate(`/login?redirect=${encodeURIComponent(path)}`)
              }
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-orange-400 hover:scale-[1.02] active:scale-95"
          >
            <span>Open Blog Studio</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>

        {/* sidebar */}
        <Reveal delay={200} className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-500">
              <BarChart3 className="h-3.5 w-3.5 text-orange-500" />
              SEO Insights
            </div>
            <ul ref={insightsRef} className="mt-4 space-y-3">
              {insights.map((t, i) => (
                <li
                  key={t}
                  style={{
                    transitionDelay: `${i * 90}ms`,
                    transform: insightsVisible ? "translateX(0)" : "translateX(-10px)",
                  }}
                  className={`flex items-start gap-2 text-sm text-neutral-300 transition-all duration-500 ease-out ${
                    insightsVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-500">Suggested Keywords</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span
                  key={k}
                  className="inline-flex cursor-default items-center gap-1 rounded-md border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-neutral-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/30 hover:text-orange-300"
                >
                  <Hash className="h-3 w-3 text-orange-500" />
                  {k}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function BlogHeading({ level, text, big }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500">{level}</span>
      <span className={`font-semibold text-white ${big ? "text-xl" : "text-base"}`}>{text}</span>
    </div>
  )
}

/* ------------------------- Tracker Studio -------------------------- */

function TrackerStudio() {
  const stats = [
    { v: "128.4K", l: "Impressions", d: "+34.2%" },
    { v: "12.5K", l: "Engagement", d: "+18.7%" },
    { v: "492", l: "CTR", d: "+9.1%" },
    { v: "8.4K", l: "Followers", d: "+12.4%" },
  ]
  const bars = [420, 560, 690, 510, 780, 640, 910]
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const posts = [
    { r: "01", t: "How we used AI to write 40 case studies in 4 hours", a: "42.1K", b: "3.8K", c: "6.9%" },
    { r: "02", t: "The prompt template that got us 100K impressions", a: "38.7K", b: "3.1K", c: "5.4%" },
    { r: "03", t: "Why every marketer should learn one AI workflow a week", a: "24.2K", b: "1.9K", c: "4.1%" },
  ]

  const line = useMemo(() => {
    const pts = [120, 240, 210, 360, 420, 500, 620, 760]
    const max = Math.max(...pts)
    return pts.map((p, i) => `${(i / (pts.length - 1)) * 100},${100 - (p / max) * 100}`).join(" ")
  }, [])

  const [statsRef, statsVisible] = useReveal(0.3)
  const [barsRef, barsVisible] = useReveal(0.3)
  const [lineRef, lineVisible] = useReveal(0.3)
  const [postsRef, postsVisible] = useReveal(0.3)

  return (
    <section id="tracker" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <StudioHeading
          label="04 — LinkedIn Tracker"
          title="See what's working. Do more of it."
          desc="A living dashboard tracking impressions, engagement, CTR and follower growth — with content-level analytics baked in."
        />
      </Reveal>

      <div ref={statsRef} className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.l}
            style={{
              transitionDelay: `${i * 90}ms`,
              transform: statsVisible ? "translateY(0)" : "translateY(16px)",
            }}
            className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-orange-500/20 hover:bg-white/[0.05] ${
              statsVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-1 text-xs font-medium text-orange-400">
              <TrendingUp className="h-3.5 w-3.5" />
              {s.d}
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              <StatValue value={s.v} visible={statsVisible} />
            </div>
            <div className="mt-0.5 text-xs text-neutral-500">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* bar chart */}
        <Reveal delay={100} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
              Impressions · Last 7 days
            </span>
            <span className="text-xs font-medium text-orange-400">+34.2% WoW</span>
          </div>
          <div ref={barsRef} className="mt-6 flex h-44 items-end justify-between gap-3">
            {bars.map((b, i) => (
              <div key={days[i]} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-orange-600/40 to-orange-500 transition-[height] ease-out"
                    style={{
                      height: barsVisible ? `${(b / 910) * 100}%` : "0%",
                      transitionDuration: "900ms",
                      transitionDelay: `${i * 70}ms`,
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] text-neutral-600">{days[i]}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* line chart */}
        <Reveal delay={200} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Follower Growth</span>
            <span className="text-xs font-medium text-orange-400">+2,412</span>
          </div>
          <div
            ref={lineRef}
            style={{
              transform: lineVisible ? "scale(1)" : "scale(0.96)",
              transitionDelay: "120ms",
            }}
            className={`mt-6 h-44 origin-bottom transition-all duration-700 ease-out ${
              lineVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,100 ${line} 100,100`} fill="url(#fillGrad)" />
              <polyline
                points={line}
                fill="none"
                stroke="rgb(249 115 22)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="100"
                strokeDasharray="100"
                strokeDashoffset={lineVisible ? "0" : "100"}
                style={{ transition: "stroke-dashoffset 1.4s ease-out 0.2s" }}
              />
            </svg>
          </div>
        </Reveal>
      </div>

      {/* top posts */}
      <Reveal delay={100} className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">Top performing posts</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">This month</span>
        </div>
        <div ref={postsRef} className="mt-4 divide-y divide-white/10">
          {posts.map((p, i) => (
            <div
              key={p.r}
              style={{
                transitionDelay: `${i * 90}ms`,
                transform: postsVisible ? "translateX(0)" : "translateX(-12px)",
              }}
              className={`flex items-center gap-4 rounded-lg py-3.5 pl-2 transition-all duration-500 ease-out hover:bg-white/[0.04] hover:pl-4 ${
                postsVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="font-mono text-sm text-orange-500">#{p.r}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-neutral-200">{p.t}</span>
              <div className="hidden shrink-0 gap-6 font-mono text-xs text-neutral-500 sm:flex">
                <span>{p.a} imp</span>
                <span>{p.b} eng</span>
                <span className="text-orange-400">{p.c}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------- Platform Studio ------------------------- */

function PlatformStudio() {
  const nodes = [
    { icon: ImageIcon, t: "Image Studio", s: "Text-to-Image" },
    { icon: Video, t: "Video Studio", s: "Text-to-Video" },
    { icon: FileText, t: "Blog Studio", s: "Long-form writing" },
    { icon: BarChart3, t: "LinkedIn Tracker", s: "Growth analytics" },
  ]
  const [nodesRef, nodesVisible] = useReveal(0.2)

  return (
    <section id="platform" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal className="text-center">
        <div className="flex justify-center">
          <SectionLabel>05 — Unified Platform</SectionLabel>
        </div>
        <h2 className="mx-auto mt-5 max-w-2xl text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
          Everything you need to create content.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-400">
          One workspace. Four studios. Zero context-switching. Assets, prompts and analytics — all connected through
          the same intelligent core.
        </p>
      </Reveal>

      <div className="mt-14">
        <Reveal delay={100}>
          <div className="cos-core-ring mx-auto mb-8 flex max-w-sm flex-col items-center rounded-2xl border border-orange-500/30 bg-orange-500/[0.06] p-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-black">
              <Sparkles className="h-6 w-6" />
            </span>
            <div className="mt-3 text-lg font-bold text-white">CreativeOS Core</div>
            <div className="font-mono text-xs uppercase tracking-wider text-orange-400/80">Universal prompt bar</div>
          </div>
        </Reveal>

        <div ref={nodesRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nodes.map((n, i) => (
            <div
              key={n.t}
              style={{
                transitionDelay: `${i * 100}ms`,
                transform: nodesVisible ? "translateY(0)" : "translateY(18px)",
              }}
              className={`transition-all duration-700 ease-out ${nodesVisible ? "opacity-100" : "opacity-0"}`}
            >
              <TiltCard max={10}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-orange-500/30 hover:bg-white/[0.05]">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-orange-500/10 text-orange-500">
                    <n.icon className="h-5 w-5" />
                  </span>
                  <div className="mt-4 text-sm font-semibold text-white">{n.t}</div>
                  <div className="mt-0.5 text-xs text-neutral-500">{n.s}</div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Waitlist --------------------------- */

function Waitlist() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  return (
    <section id="waitlist" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full bg-orange-600/20 blur-[120px]" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-neutral-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />3 creators in queue
          </span>
          <h2 className="mx-auto mt-6 max-w-lg text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
            Creative<span className="text-orange-500">OS</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-lg text-neutral-400">
            One AI platform. Unlimited creativity.
          </p>

          {done ? (
            <div className="mx-auto mt-8 inline-flex animate-[cos-float_1s_ease-in-out] items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm font-medium text-orange-300">
              <Check className="h-4 w-4" />
              You&apos;re on the list — see you soon.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email.trim()) setDone(true)
              }}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-orange-500/50"
              />
              <Magnetic strength={0.2}>
                <button
                  type="submit"
                  className="w-full shrink-0 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-orange-400 hover:scale-[1.02] active:scale-95 sm:w-auto"
                >
                  Start Creating Today
                </button>
              </Magnetic>
            </form>
          )}
          <p className="mt-4 text-xs text-neutral-600">No spam. Unsubscribe any time.</p>
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------ Footer ----------------------------- */

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-white">
            Creative<span className="text-orange-500">OS</span>
          </span>
          <span className="font-mono text-xs text-neutral-600">© 2026</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-neutral-400">
          <a href="#" className="transition-colors hover:text-white">
            Home
          </a>
          <a href="#platform" className="transition-colors hover:text-white">
            Studios
          </a>
          <a href="#waitlist" className="transition-colors hover:text-white">
            Waitlist
          </a>
        </nav>
        <span className="font-mono text-xs text-neutral-600">Made for creators.</span>
      </div>
    </footer>
  )
}

/* --------------------------- Background ---------------------------- */

function Starfield() {
  const [mounted, setMounted] = useState(false)
  const fieldRef = useRef(null)
  useEffect(() => setMounted(true), [])

  // Very light parallax drift for the whole field as the page scrolls.
  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        if (fieldRef.current) {
          fieldRef.current.style.transform = `translateY(${window.scrollY * 0.04}px)`
        }
        raf = null
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const dots = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.15,
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0705]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(249,115,22,0.12),transparent_55%)]" />
      <div ref={fieldRef} className="absolute inset-0 transition-transform duration-75 ease-out">
        {mounted &&
          dots.map((d) => (
            <span
              key={d.id}
              className="absolute rounded-full bg-orange-400"
              style={{
                top: `${d.top}%`,
                left: `${d.left}%`,
                width: `${d.size}px`,
                height: `${d.size}px`,
                opacity: d.opacity,
              }}
            />
          ))}
      </div>
    </div>
  )
}

// Support both `import { LandingPage }` and `import LandingPage` styles.
export default LandingPage