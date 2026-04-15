"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Image from "next/image"
import ProfileCardAnimation from "./profile-card-animation"
import RecruitingFlowAnimation from "./recruiting-flow-animation"

/* ───────────── ASSETS ───────────── */

const LOGO_WHITE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20horizontal%20-%20white%20%281%29-w4MXPtuKK8TZkVh7B4oOWkRyeA1Mgy.png"
const LOGO_BLUE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20horizontal%20-%20blue%20%281%29-gzr0AeM5R5vdBKUShZHk06hiM63QdC.png"

/* ───────────── ANIMATION HOOK ───────────── */

function useStagger(active: boolean, count: number, baseDelay = 80) {
  const [visible, setVisible] = useState<boolean[]>(new Array(count).fill(false))
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    if (active) {
      const newVisible = new Array(count).fill(false)
      for (let i = 0; i < count; i++) {
        timeouts.current.push(
          setTimeout(() => {
            setVisible((prev) => { const next = [...prev]; next[i] = true; return next })
          }, i * baseDelay + 120)
        )
      }
      setVisible(newVisible)
    } else {
      setVisible(new Array(count).fill(false))
    }
    return () => timeouts.current.forEach(clearTimeout)
  }, [active, count, baseDelay])

  return visible
}

/* ───────────── SHARED UI ───────────── */

function An({ show, delay = 0, from = "bottom", children, className = "" }: {
  show: boolean; delay?: number; from?: "bottom" | "left" | "right" | "scale" | "fade"; children: React.ReactNode; className?: string
}) {
  const transforms: Record<string, string> = { bottom: "translateY(28px)", left: "translateX(-32px)", right: "translateX(32px)", scale: "scale(0.92)", fade: "none" }
  return (
    <div className={`transition-all duration-700 ease-out ${className}`} style={{ opacity: show ? 1 : 0, transform: show ? "none" : transforms[from], transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-3.5 py-1 text-[11px] font-semibold tracking-wider uppercase ${className}`}>{children}</span>
}

function DotGrid({ opacity = "0.15" }: { opacity?: string }) {
  return <div className="pointer-events-none absolute inset-0" style={{ opacity, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
}

/* Responsive iframe: scales fixed-dimension content to fit its container */
function ResponsiveIframe({
  src,
  designW,
  designH,
  title,
  pointerEvents,
}: {
  src: string
  designW: number
  designH: number
  title: string
  pointerEvents?: "none" | "auto"
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      const s = Math.min(r.width / designW, r.height / designH)
      setScale(s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [designW, designH])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <iframe
        src={src}
        className="border-0 absolute"
        style={{
          width: designW,
          height: designH,
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          pointerEvents,
        }}
        title={title}
      />
    </div>
  )
}

/* ───────────── ANIMATED FLOATING ICONS ───────────── */

const ICON_SETS: Record<string, string[]> = {
  "Roles y Permisos": ["🔑", "🛡️", "👤", "⚙️", "🔐", "✅", "📋", "🏷️", "👥", "🔒", "🎫", "📊"],
  "Onboarding 2.0": ["👋", "🚀", "📝", "🎯", "✨", "📱", "🤝", "💡", "🎓", "📧", "🏠", "🎪"],
  "Workflows": ["🔄", "⚡", "📊", "🔗", "🎛️", "📬", "⏱️", "🔀", "📌", "🧩", "🔧", "💫"],
  "Reclutamiento": ["💼", "📄", "🔍", "👔", "📩", "🏢", "🎯", "📋", "💬", "⭐", "📊", "🤝"],
  "Sammy 2.0": ["🤖", "💬", "🧠", "✨", "💡", "🎙️", "📡", "⚡", "🔮", "🌟", "🎪", "🦾"],
  "Legajo Digital": ["📂", "📁", "🗂️", "📑", "🔖", "🏷️", "📎", "✏️", "📋", "🔍", "📊", "💾"],
  "Ciclo de Vida": ["🔄", "📈", "🌱", "🎯", "📅", "🏆", "📊", "🔔", "🎓", "💼", "🚪", "⭐"],
  "Payroll": ["💳", "💰", "📊", "🧾", "🏦", "📅", "💵", "📋", "⚙️", "✅", "📈", "🔢"],
  "Segmentación Admin y Usuario": ["👥", "🎯", "🔑", "📊", "🏷️", "⚙️", "👤", "🛡️", "📋", "🔍", "✨", "🎛️"],
  "Microloans": ["💳", "💰", "📱", "✨", "🏦", "📊", "💵", "🎯", "⚡", "📋", "🔐", "💡"],
}

function FloatingIcons({ active, product }: { active: boolean; product: string }) {
  const icons = useMemo(() => {
    const iconSet = ICON_SETS[product] || ICON_SETS["Workflows"]
    return iconSet.map((icon, i) => ({
      icon,
      x: 5 + (i * 17) % 90,
      y: 5 + (i * 23) % 85,
      size: 18 + (i % 3) * 6,
      duration: 12 + (i % 5) * 4,
      delay: i * 0.7,
    }))
  }, [product])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {icons.map((item, i) => (
        <span
          key={i}
          className="absolute transition-opacity duration-1000"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            opacity: active ? 0.18 : 0,
            animation: active ? `wander-a ${item.duration}s ease-in-out infinite` : "none",
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  )
}

/* ───────────── SLIDE 1: INTRO ───────────── */

function SlideIntro({ active }: { active: boolean }) {
  const v = useStagger(active, 4)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.08" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full border border-white/[0.10]" />

      <An show={v[0]} from="scale">
        <Image src={LOGO_WHITE} alt="Humand" width={200} height={54} className="h-14 w-auto" priority />
      </An>
      <An show={v[1]} delay={100} className="mt-8">
        <h1
          className="text-balance text-[clamp(2.2rem,6cqw,4.5rem)] font-black leading-[1] tracking-tight text-white"
          style={{ animation: active ? "float-slow 4s ease-in-out infinite" : "none" }}
        >
          Lanzamientos<br />de Producto
        </h1>
      </An>
      <An show={v[2]} delay={250} className="mt-5">
        <div className="flex flex-wrap justify-center gap-2">
          <Tag className="border border-white/20 bg-white/10 text-white/90 backdrop-blur-sm">2026</Tag>
        </div>
      </An>
      <An show={v[3]} delay={400} className="mt-6">
        <div className="h-1 w-16 rounded-full bg-white/30" />
      </An>
    </div>
  )
}

/* ───────────── PRODUCT SLIDE (reusable for slides 2-5, 7-12) ───────────── */

function ProductSlide({ active, title, image }: { active: boolean; title: string; slideNumber?: string; image?: string }) {
  const v = useStagger(active, 3)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <FloatingIcons active={active} product={title} />

      <An show={v[0]} delay={120} className="mt-5">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white whitespace-pre-line">
          {title}
        </h2>
      </An>

      <An show={v[1]} delay={280} className="mt-8">
        <div className="relative w-full max-w-lg">
          {image ? (
            <div className="w-full rounded-2xl border-2 border-white/15 shadow-2xl shadow-black/20 overflow-hidden transition-all duration-500 hover:border-white/25 hover:shadow-black/30">
              <Image src={image} alt={title} width={800} height={500} className="w-full h-auto block" />
            </div>
          ) : (
            <div className="aspect-[16/10] w-full rounded-2xl border-2 border-white/15 bg-white/10 backdrop-blur-sm shadow-2xl shadow-black/20 flex items-center justify-center transition-all duration-500 hover:border-white/25 hover:shadow-black/30">
              <div className="flex flex-col items-center gap-3 text-white/40">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <span className="text-sm font-medium">Imagen del producto</span>
              </div>
            </div>
          )}
        </div>
      </An>

      <An show={v[2]} delay={420} className="mt-4">
        <div className="h-1 w-12 rounded-full bg-white/20" />
      </An>
    </div>
  )
}

/* ───────────── CAROUSEL SLIDE ───────────── */

function CarouselCard({ title, preview, active }: { title: string; preview?: { type: "iframe" | "video"; src: string }; active: boolean }) {
  return (
    <div className="flex-shrink-0 w-[280px] h-[230px] rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm shadow-xl shadow-black/10 flex flex-col items-center justify-center gap-4 p-6">
      <div className="flex-1 w-full rounded-xl overflow-hidden relative bg-white/5" style={{ border: preview ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
        {preview && active ? (
          preview.type === "video" ? (
            <video autoPlay loop muted playsInline className="w-full h-full object-cover" src={preview.src} />
          ) : (
            <ResponsiveIframe
              src={preview.src}
              designW={820}
              designH={540}
              title={title}
              pointerEvents="none"
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-white/30">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <span className="text-[10px] font-medium">Portada</span>
          </div>
        )}
      </div>
      <p className="text-sm font-bold text-white tracking-wide">{title}</p>
    </div>
  )
}

function CarouselSlide({ active, products, title }: { active: boolean; products: { title: string; preview?: { type: "iframe" | "video"; src: string } }[]; title: string }) {
  const v = useStagger(active, 3)
  const [offset, setOffset] = useState(0)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!active) {
      setOffset(0)
      cancelAnimationFrame(animRef.current)
      return
    }
    let start: number | null = null
    const speed = 0.03
    function tick(ts: number) {
      if (start === null) start = ts
      setOffset((ts - start) * speed)
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [active])

  const cardWidth = 280
  const gap = 24
  const totalWidth = products.length * (cardWidth + gap)

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-0" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.05" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full border border-white/[0.04]" />

      <An show={v[0]} from="scale" className="mb-8 px-6 w-full">
        <h2 className="text-[clamp(1.6rem,4cqw,2.5rem)] font-black text-white tracking-tight text-center text-balance">
          {title}
        </h2>
      </An>

      <An show={v[1]} delay={200} className="w-full overflow-hidden">
        <div className="relative w-full h-[260px]">
          <div
            className="absolute top-0 flex gap-6 will-change-transform"
            style={{ transform: `translateX(-${offset % totalWidth}px)` }}
          >
            {[...products, ...products, ...products, ...products].map((p, i) => (
              <CarouselCard key={i} title={p.title} preview={p.preview} active={active} />
            ))}
          </div>
        </div>
      </An>

      <An show={v[2]} delay={400} className="mt-6">
        <div className="flex gap-2">
          {products.map((_, i) => (
            <div key={i} className="h-1.5 w-6 rounded-full bg-white/30" />
          ))}
        </div>
      </An>
    </div>
  )
}

/* ───────────── SLIDE 2: HUMAND EN 5 MINUTOS ───────────── */

function SlideHumand5Min({ active }: { active: boolean }) {
  const v = useStagger(active, 4)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.08" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full border border-white/[0.10]" />

      <An show={v[0]} from="scale">
        <Image src={LOGO_WHITE} alt="Humand" width={200} height={54} className="h-14 w-auto" priority />
      </An>
      <An show={v[1]} delay={100} className="mt-6">
        <h1
          className="text-balance text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white"
          style={{ animation: active ? "float-slow 4s ease-in-out infinite" : "none" }}
        >
          Productos que acabamos de lanzar
        </h1>
      </An>
      <An show={v[2]} delay={250} className="mt-5 w-full max-w-2xl">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9" }}>
          {active && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="/humand-5min.mp4"
            />
          )}
        </div>
      </An>
      <An show={v[3]} delay={400} className="mt-6">
        <div className="h-1 w-16 rounded-full bg-white/30" />
      </An>
    </div>
  )
}

/* ───────────── INDIVIDUAL PRODUCT SLIDES ───────────── */

function S02_Roles({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Roles y Permisos
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/roles-permisos-animation.html"
              designW={820}
              designH={540}
              title="Roles y Permisos Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S_Chats({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3 shrink-0">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Chats 2.0
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/chats-animation.html"
              designW={600}
              designH={1000}
              title="Chats 2.0 Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S_Llamadas({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Llamadas
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/calls-animation.html"
              designW={820}
              designH={540}
              title="Llamadas Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S03_Onboarding({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Onboarding 2.0
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9" }}>
          {active && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="/onboarding.mp4"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S_Prode({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          PRODE
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/prode-animation.html"
              designW={820}
              designH={540}
              title="PRODE Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S_Shifts({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Turnos laborales
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/shifts-animation.html"
              designW={820}
              designH={540}
              title="Turnos laborales Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S04_Workflows({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Workflows
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/workflows-animation.html"
              designW={820}
              designH={540}
              title="Workflows Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S05_ATS({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Reclutamiento
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/ats-animation.html"
              designW={820}
              designH={540}
              title="Reclutamiento Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}

function S06_Carousel1({ active }: { active: boolean }) {
  return (
    <CarouselSlide
      active={active}
      title="Productos que acabamos de lanzar"
      products={[
        { title: "Roles y Permisos", preview: { type: "iframe", src: "/roles-permisos-animation.html" } },
        { title: "Chats 2.0", preview: { type: "iframe", src: "/chats-animation.html" } },
        { title: "Llamadas", preview: { type: "iframe", src: "/calls-animation.html" } },
        { title: "Onboarding 2.0", preview: { type: "video", src: "/onboarding.mp4" } },
        { title: "PRODE", preview: { type: "iframe", src: "/prode-animation.html" } },
        { title: "Workflows", preview: { type: "iframe", src: "/workflows-animation.html" } },
        { title: "Turnos laborales", preview: { type: "iframe", src: "/shifts-animation.html" } },
        { title: "Reclutamiento", preview: { type: "iframe", src: "/ats-animation.html" } },
      ]}
    />
  )
}

function SlideTransition({ active }: { active: boolean }) {
  const v = useStagger(active, 4, 600)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.08" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full border border-white/[0.10]" />

      <div className="flex flex-col items-center">
        <An show={v[0]} from="bottom" delay={0}>
          <h1 className="text-[clamp(2.2rem,6cqw,4.5rem)] font-black leading-[1] tracking-tight text-white">
            Próximos grandes
          </h1>
        </An>
        <An show={v[1]} delay={200}>
          <h1 className="text-[clamp(2.2rem,6cqw,4.5rem)] font-black leading-[1] tracking-tight text-white mt-2">
            lanzamientos
          </h1>
        </An>
      </div>
      <An show={v[2]} delay={400} className="mt-8">
        <div className="h-1 w-16 rounded-full bg-white/30" />
      </An>
      <An show={v[3]} delay={600} from="scale" className="mt-8">
        <Image src={LOGO_WHITE} alt="Humand" width={200} height={54} className="h-14 w-auto" />
      </An>
    </div>
  )
}

function S07_Sammy({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Sammy 2.0
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9" }}>
          {active && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="/sammy.mp4"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S_Insights({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Insights 2.0
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/insights-animation.html"
              designW={820}
              designH={540}
              title="Insights 2.0 Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S08_Legajo({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Legajo Digital
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/legajo-animation.html"
              designW={820}
              designH={540}
              title="Legajo Digital Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S09_Ciclo({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Ciclo de Vida
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/lifecycle-animation.html"
              designW={820}
              designH={540}
              title="Ciclo de Vida Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S10_Payroll({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Payroll
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/payroll-animation.html"
              designW={820}
              designH={540}
              title="Payroll Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S12_Microloans({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3 shrink-0">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Microloans
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/microloans-animation.html"
              designW={600}
              designH={1000}
              title="Microloans Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S_CertificadosCursos({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white">
          Certificados de cursos
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/certificados-animation.html"
              designW={820}
              designH={540}
              title="Certificados de cursos Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}
function S11_Segmentacion({ active }: { active: boolean }) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="mt-3">
        <h2 className="text-[clamp(2rem,5.5cqw,3.5rem)] font-black leading-[1.05] tracking-tight text-white whitespace-pre-line">
          {"Segmentación\nAdmin y Usuario"}
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-4 w-full max-w-2xl">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10.5" }}>
          {active && (
            <ResponsiveIframe
              src="/ryp-segmentado-animation.html"
              designW={820}
              designH={540}
              title="Segmentación Admin y Usuario Animation"
            />
          )}
        </div>
      </An>
    </div>
  )
}

function S13_Carousel2({ active }: { active: boolean }) {
  return (
    <CarouselSlide
      active={active}
      title="Resumen de próximos grandes productos"
      products={[
        { title: "Sammy 2.0", preview: { type: "video", src: "/sammy.mp4" } },
        { title: "Insights 2.0", preview: { type: "iframe", src: "/insights-animation.html" } },
        { title: "Legajo Digital", preview: { type: "iframe", src: "/legajo-animation.html" } },
        { title: "Ciclo de Vida", preview: { type: "iframe", src: "/lifecycle-animation.html" } },
        { title: "Payroll", preview: { type: "iframe", src: "/payroll-animation.html" } },
        { title: "Segmentación Admin y Usuario", preview: { type: "iframe", src: "/ryp-segmentado-animation.html" } },
      ]}
    />
  )
}

function SlideFuncionalidadesIA({ active }: { active: boolean }) {
  const v = useStagger(active, 4, 600)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.08" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full border border-white/[0.10]" />

      <An show={v[0]} from="scale" delay={0} className="mb-4">
        <style>{`
          @keyframes sparkle-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.7; } }
          @keyframes sparkle-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes sparkle-float-1 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; } 50% { transform: translate(-8px, -6px) scale(1.2); opacity: 1; } }
          @keyframes sparkle-float-2 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; } 50% { transform: translate(6px, -8px) scale(0.8); opacity: 1; } }
          @keyframes sparkle-float-3 { 0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.5; } 50% { transform: translate(5px, 7px) scale(1.1); opacity: 0.9; } }
        `}</style>
        <div className="relative h-20 w-20 flex items-center justify-center">
          <svg className="absolute h-16 w-16 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ animation: "sparkle-pulse 3s ease-in-out infinite" }}>
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <svg className="absolute -top-2 -right-2 h-9 w-9 text-white/80" viewBox="0 0 24 24" fill="currentColor" style={{ animation: "sparkle-float-1 2.5s ease-in-out infinite" }}>
            <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          <svg className="absolute -bottom-1 -right-1 h-7 w-7 text-white/60" viewBox="0 0 24 24" fill="currentColor" style={{ animation: "sparkle-float-2 3.2s ease-in-out infinite 0.5s" }}>
            <path d="M16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          <svg className="absolute -top-1 -left-2 h-7 w-7 text-white/50" viewBox="0 0 24 24" fill="currentColor" style={{ animation: "sparkle-float-3 2.8s ease-in-out infinite 1s" }}>
            <path d="M16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
      </An>
      <div className="flex flex-col items-center">
        <An show={v[1]} from="bottom" delay={200}>
          <h1 className="text-[clamp(2.2rem,6cqw,4.5rem)] font-black leading-[1] tracking-tight text-white">
            Próximas funcionalidades
          </h1>
        </An>
        <An show={v[2]} delay={400}>
          <h1 className="text-[clamp(2.2rem,6cqw,4.5rem)] font-black leading-[1] tracking-tight text-white mt-2">
            con IA
          </h1>
        </An>
      </div>
      <An show={v[3]} delay={600} className="mt-8">
        <div className="h-1 w-16 rounded-full bg-white/30" />
      </An>
    </div>
  )
}

function S_CrearCursoIA({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Crear curso con IA" image="/createcourse.png" badge="Learning" />
}
function S_AtsAI({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Recomendaciones de perfil y resúmenes con IA" image="/atsAI.png" badge="Reclutamiento" />
}
function S_PostAI({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Mejorar publicaciones con IA" image="/postAI.png" badge="Feed & Grupos" />
}
function S_AutoShiftIA({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Recomendación automática de turnos" image="/autoshift-ai.png" badge="Turnos laborales" />
}
function S_TimeTrackingInsightsIA({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Insights automáticos sobre horas extra" image="/autotimetrackingAI.png" badge="Control Horario" />
}
function S_ResumenObjetivosIA({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Generar resumen de Objetivos con IA" image="/autosummary-goals-ai.png" badge="Performance & Goals" />
}

function SlideOtrosLanzamientos({ active }: { active: boolean }) {
  const v = useStagger(active, 4, 600)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.08" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full border border-white/[0.10]" />

      <div className="flex flex-col items-center">
        <An show={v[0]} from="bottom" delay={0}>
          <h1 className="text-[clamp(2.2rem,6cqw,4.5rem)] font-black leading-[1] tracking-tight text-white">
            Otros próximos
          </h1>
        </An>
        <An show={v[1]} delay={200}>
          <h1 className="text-[clamp(2.2rem,6cqw,4.5rem)] font-black leading-[1] tracking-tight text-white mt-2">
            lanzamientos
          </h1>
        </An>
      </div>
      <An show={v[2]} delay={400} className="mt-8">
        <div className="h-1 w-16 rounded-full bg-white/30" />
      </An>
      <An show={v[3]} delay={600} from="scale" className="mt-8">
        <Image src={LOGO_WHITE} alt="Humand" width={200} height={54} className="h-14 w-auto" />
      </An>
    </div>
  )
}

/* ───────────── CARD SLIDE (Q2 Huge Releases) ───────────── */

function CardSlide({ active, title, image, badge, badgeBg = "#E8EBFA", badgeColor = "#4A5BC2" }: {
  active: boolean; title: string; image: string; badge: string; badgeBg?: string; badgeColor?: string
}) {
  const v = useStagger(active, 2)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <An show={v[0]} delay={120} className="w-full flex items-center justify-center">
        <div className="w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-2xl shadow-black/12" style={{ border: "1px solid #e5e7eb" }}>
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ background: badgeBg, color: badgeColor }}>{badge}</span>
          <h3 className="mt-3 text-xl font-semibold leading-snug text-neutral-950">{title}</h3>
          {image ? (
            <div className="mt-4 overflow-hidden rounded-xl">
              <Image src={image} alt={title} width={460} height={400} className="w-full h-auto block" />
            </div>
          ) : (
            <div className="mt-4 aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
              <svg className="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}
        </div>
      </An>
      <An show={v[1]} delay={320} className="mt-5">
        <div className="h-1 w-12 rounded-full bg-white/20" />
      </An>
    </div>
  )
}

function S_Calibration({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Calibración de Performance" image="/calibration.png" badge="Performance & Goals" />
}
function S_CareersSite({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Careers Site" image="/careers-site.png" badge="Reclutamiento" />
}
function S_VoicenoteCEO({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Voicenote CEO" image="/voicenote-ceo.png" badge="Chats" />
}
function S_SharePosts({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Compartir publicaciones del Feed" image="/share-posts.png" badge="Feed & Grupos" />
}
function S_NotifBubble({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Bubble para notificaciones" image="/notif-bubble.png" badge="Gestión de Servicios" />
}
function S_ChatGallery({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Galería de archivos, links e imágenes" image="/chat-gallery.png" badge="Chats" />
}
function S_Certificates({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Gestión de certificados de finalización" image="/certificates.png" badge="Learning" />
}
function S_TimeTrackingPerms({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Permisos segmentados para Control Horario" image="/time-tracking-perms.jpg" badge="Control Horario" />
}
function S_Preboarding({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Preboarding" image="/preboarding.png" badge="Onboarding" />
}
function S_UniversalSearch({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Búsqueda Universal" image="/universal-search.png" badge="Búsqueda Universal" />
}
function S_RenameSplitPDFs({ active }: { active: boolean }) {
  return <CardSlide active={active} title="Renombrar y separar PDFs en Humand" image="/rename-split-pdfs.png" badge="Documentos" />
}

/* ───────────── Q2 SUMMARY CAROUSEL ───────────── */

const Q2_CARDS = [
  { title: "Calibración de Performance", image: "/calibration.png", badge: "Performance & Goals" },
  { title: "Careers Site", image: "/careers-site.png", badge: "Reclutamiento" },
  { title: "Voicenote CEO", image: "/voicenote-ceo.png", badge: "Chats" },
  { title: "Compartir publicaciones del Feed", image: "/share-posts.png", badge: "Feed & Grupos" },
  { title: "Galería de archivos, links e imágenes", image: "/chat-gallery.png", badge: "Chats" },
  { title: "Permisos segmentados para Control Horario", image: "/time-tracking-perms.jpg", badge: "Control Horario" },
  { title: "Preboarding", image: "/preboarding.png", badge: "Onboarding" },
  { title: "Búsqueda Universal", image: "/universal-search.png", badge: "Búsqueda Universal" },
  { title: "Renombrar y separar PDFs en Humand", image: "/rename-split-pdfs.png", badge: "Documentos" },
  { title: "Certificados de cursos", image: "/certificates.png", badge: "Learning" },
  { title: "Smart shift recommendations", image: "/autoshift-ai.png", badge: "AI" },
  { title: "Automated Overtime insights", image: "/autotimetrackingAI.png", badge: "AI" },
  { title: "Automated Goal Summary", image: "/autosummary-goals-ai.png", badge: "AI" },
]

function MarqueeRow({ cards, direction, active }: { cards: typeof Q2_CARDS; direction: "left" | "right"; active: boolean }) {
  const doubled = [...cards, ...cards]
  const animName = direction === "left" ? "marqueeLeft" : "marqueeRight"
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: active ? `${animName} ${cards.length * 14}s linear infinite` : "none",
        }}
      >
        {doubled.map((card, i) => (
          <div key={i} className="shrink-0 rounded-xl bg-white p-2.5 shadow-lg" style={{ border: "1px solid #e5e7eb", width: "calc(24cqw - 16px)" }}>
            <span className="inline-block rounded-full px-2 py-0.5 text-[8px] font-semibold" style={{ background: "#E8EBFA", color: "#4A5BC2" }}>{card.badge}</span>
            <h4 className="mt-1 text-[10px] font-semibold leading-snug text-neutral-950 line-clamp-2">{card.title}</h4>
            <div className="mt-1.5 overflow-hidden rounded-md" style={{ aspectRatio: "4/3" }}>
              <Image src={card.image} alt={card.title} width={200} height={150} className="w-full h-full object-cover object-top block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function S_Q2Summary({ active }: { active: boolean }) {
  const v = useStagger(active, 3)
  const row1 = Q2_CARDS.slice(0, 7)
  const row2 = Q2_CARDS.slice(7)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-0" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.06" />
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <An show={v[0]} delay={120} className="shrink-0">
        <h2 className="text-[clamp(1rem,2.6cqw,1.8rem)] font-black leading-[1.05] tracking-tight text-white text-center">
          Resumen de próximos lanzamientos
        </h2>
      </An>
      <An show={v[1]} delay={280} className="mt-2 w-full">
        <div className="flex flex-col gap-2 w-full overflow-hidden">
          <MarqueeRow cards={row1} direction="left" active={active} />
          <MarqueeRow cards={row2} direction="right" active={active} />
        </div>
      </An>
    </div>
  )
}

function S_Thanks({ active }: { active: boolean }) {
  const v = useStagger(active, 2, 400)
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: "linear-gradient(180deg, #213478 0%, #2a4499 45%, #ffffff 100%)" }}>
      <DotGrid opacity="0.08" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full border border-white/[0.10]" />
      <An show={v[0]} from="scale" delay={0}>
        <h1 className="text-[clamp(3rem,10cqw,7rem)] font-black leading-[1] tracking-tight text-white">
          ¡GRACIAS!
        </h1>
      </An>
      <An show={v[1]} delay={300} className="mt-8">
        <div className="h-1 w-20 rounded-full bg-white/30" />
      </An>
    </div>
  )
}

/* ───────────── SLIDES REGISTRY ───────────── */

const SLIDES: { component: React.FC<{ active: boolean; onNext?: () => void }>; bg: string }[] = [
  { component: SlideIntro, bg: "bg-[#213478]" },       // 01 Intro
  { component: SlideHumand5Min, bg: "bg-[#213478]" },  // 02 Humand en 5 Minutos
  { component: S02_Roles, bg: "bg-[#213478]" },        // 03 Roles y Permisos
  { component: S_Chats, bg: "bg-[#213478]" },           // 04 Chats 2.0
  { component: S_Llamadas, bg: "bg-[#213478]" },       // 05 Llamadas
  { component: S03_Onboarding, bg: "bg-[#213478]" },   // 06 Onboarding 2.0
  { component: S_Prode, bg: "bg-[#213478]" },          // 04 PRODE
  { component: S04_Workflows, bg: "bg-[#213478]" },    // 05 Workflows
  { component: S_Shifts, bg: "bg-[#213478]" },         // 06 Turnos laborales
  { component: S05_ATS, bg: "bg-[#213478]" },          // 05 Reclutamiento
  { component: S06_Carousel1, bg: "bg-[#213478]" },    // 11 Carousel 1
  { component: SlideFuncionalidadesIA, bg: "bg-[#213478]" }, // 12 Funcionalidades con IA
  { component: S_CrearCursoIA, bg: "bg-[#213478]" },   // 13 Crear curso con IA
  { component: S_PostAI, bg: "bg-[#213478]" },              // Mejorar publicaciones con IA
  { component: S_AtsAI, bg: "bg-[#213478]" },               // Recomendaciones de perfil con IA
  { component: S_VoicenoteCEO, bg: "bg-[#213478]" },        // Voicenote CEO
  { component: S_TimeTrackingInsightsIA, bg: "bg-[#213478]" }, // Insights automáticos horas extra
  { component: S_AutoShiftIA, bg: "bg-[#213478]" },    // 14 Recomendación automática de turnos
  { component: S_ResumenObjetivosIA, bg: "bg-[#213478]" }, // 15 Resumen Objetivos con IA
  { component: SlideTransition, bg: "bg-[#213478]" },  // 15 Próximos grandes lanzamientos
  { component: S07_Sammy, bg: "bg-[#213478]" },        // 08 Sammy 2.0
  { component: S_Insights, bg: "bg-[#213478]" },       // 09 Insights 2.0
  { component: S08_Legajo, bg: "bg-[#213478]" },       // 10 Legajo Digital
  { component: S09_Ciclo, bg: "bg-[#213478]" },        // 09 Ciclo de Vida
  { component: S10_Payroll, bg: "bg-[#213478]" },      // 10 Payroll
  { component: S12_Microloans, bg: "bg-[#213478]" },  // Microloans
  { component: S_CertificadosCursos, bg: "bg-[#213478]" }, // Certificados de cursos
  { component: S11_Segmentacion, bg: "bg-[#213478]" }, // 11 Segmentación
  { component: S13_Carousel2, bg: "bg-[#213478]" },    // 13 Carousel 2
  { component: SlideOtrosLanzamientos, bg: "bg-[#213478]" }, // Otros próximos lanzamientos
  { component: S_Calibration, bg: "bg-[#213478]" },         // Performance Calibration
  { component: S_CareersSite, bg: "bg-[#213478]" },         // Careers Site
  { component: S_SharePosts, bg: "bg-[#213478]" },          // Share Feed Posts
  { component: S_NotifBubble, bg: "bg-[#213478]" },         // Bubble para notificaciones
  { component: S_ChatGallery, bg: "bg-[#213478]" },         // Shared Files & Gallery
  { component: S_TimeTrackingPerms, bg: "bg-[#213478]" },   // Time Tracking Permissions
  { component: S_Preboarding, bg: "bg-[#213478]" },         // Preboarding
  { component: S_UniversalSearch, bg: "bg-[#213478]" },     // Universal Search
  { component: S_RenameSplitPDFs, bg: "bg-[#213478]" },     // Rename & Split PDFs
  { component: S_Q2Summary, bg: "bg-[#213478]" },            // Resumen Q2
  { component: S_Thanks, bg: "bg-[#213478]" },                // ¡GRACIAS!
]

/* ───────────── MAIN DECK ───────────── */

export function SlideDeck() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState<"next" | "prev">("next")
  const [locked, setLocked] = useState(false)

  const total = SLIDES.length

  const goTo = useCallback(
    (i: number) => {
      if (locked || i === current || i < 0 || i >= total) return
      setDir(i > current ? "next" : "prev")
      setLocked(true)
      setCurrent(i)
      setTimeout(() => setLocked(false), 300)
    },
    [current, locked, total]
  )

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); next() }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); prev() }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [next, prev])

  // Touch / swipe support for mobile
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    if (Math.max(absX, absY) < 40) return
    if (absX > absY) {
      if (dx < 0) next(); else prev()
    } else {
      if (dy < 0) next(); else prev()
    }
  }

  const SlideComponent = SLIDES[current].component

  return (
    <div
      className={`relative h-dvh w-full overflow-hidden select-none transition-colors duration-500 ${SLIDES[current].bg}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ containerType: "size" }}
    >
      {/* Click zones */}
      <button onClick={prev} className="absolute top-0 left-0 z-30 h-full w-[15%] bg-transparent focus:outline-none" aria-label="Previous slide" disabled={current === 0} />
      <button onClick={next} className="absolute top-0 right-0 z-30 h-full w-[15%] bg-transparent focus:outline-none" aria-label="Next slide" disabled={current === total - 1} />

      {/* Slide */}
      <div key={current} className="absolute inset-0 z-10" style={{ animation: `slide-${dir === "next" ? "in-up" : "in-down"} 280ms cubic-bezier(0.22, 1, 0.36, 1) both` }}>
        <div className="absolute inset-0 origin-center" style={{ transform: "scale(1.2)" }}>
          <SlideComponent active={true} onNext={next} />
        </div>
      </div>

      {/* Progress */}
      <div className="absolute bottom-0 left-0 z-40 h-[5px] w-full bg-white/10">
        <div className="h-full bg-white/50 transition-all duration-500 ease-out" style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>

      {/* Counter */}
      <div className="absolute right-5 bottom-3 z-40 font-mono text-[11px] font-medium text-white/30">
        {String(current + 1).padStart(2, "0")} / {total}
      </div>

      {/* Logo */}
      <div className="absolute bottom-2 left-5 z-40">
        <Image
          src={LOGO_WHITE}
          alt="Humand"
          width={72}
          height={20}
          className="h-3 w-auto opacity-30"
          priority
        />
      </div>
    </div>
  )
}
