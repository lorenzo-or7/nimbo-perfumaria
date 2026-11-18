import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { getProduct, heroOrder, type Product } from '../../data/products'
import { useStore } from '../../state/store'
import { prefersReducedMotion } from '../../lib/utils'
import { Magnetic } from '../Editorial'
import './hero.css'

/**
 * Composição da cena (desktop). Posição do centro do frasco (% da largura), topo (% da altura),
 * altura relativa, profundidade (0 fundo – 1 frente) e rotação.
 * A headline fica no plano 5: frascos com z < 0.5 passam atrás dela, os demais à frente.
 */
const SCENE: Record<string, { x: number; y: number; h: number; z: number; r: number }> = {
  'essencial-oud': { x: 33, y: 9, h: 26, z: 0.15, r: -8 },
  'versace-eros-flame': { x: 53, y: 10, h: 18, z: 0.25, r: 9 },
  'good-girl': { x: 75, y: 11, h: 33, z: 0.4, r: 8 },
  'creed-aventus': { x: 88, y: 28, h: 47, z: 0.72, r: -4 },
  'le-male-elixir': { x: 66, y: 39, h: 53, z: 1, r: 2 },
  'donna-born-in-roma': { x: 45, y: 58, h: 27, z: 0.55, r: -7 },
}

const heroProducts = heroOrder.map((s) => getProduct(s)!) as Product[]

function useIsDesktop() {
  const q = '(min-width: 900px) and (hover: hover) and (pointer: fine)'
  const [v, setV] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setV(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return v
}

export function FloatingGallery() {
  const isDesktop = useIsDesktop()
  return isDesktop ? <DesktopGallery /> : <MobileGallery />
}

/** Camadas de atmosfera compartilhadas: luz, halo, piso mineral e névoa. */
function Atmosphere({ spotRef }: { spotRef?: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="fg-atmos" aria-hidden="true">
      <div className="fg-bg" />
      {spotRef && <div className="fg-spot" ref={spotRef} />}
      <div className="fg-beam fg-beam-a" />
      <div className="fg-beam fg-beam-b" />
      <svg className="fg-halo" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <ellipse cx="500" cy="500" rx="497" ry="497" pathLength={1} />
      </svg>
      <div className="fg-floor" />
      <div className="fg-mist" />
      <div className="fg-fade" />
    </div>
  )
}

/* ———————————————————————— Desktop ———————————————————————— */

function DesktopGallery() {
  const { openOverlay, overlay, theme } = useStore()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const selected = overlay?.useCutout && SCENE[overlay.slug] ? overlay.slug : null
  const reduced = prefersReducedMotion()

  // entrada + flutuação + scroll + parallax
  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    const ctx = gsap.context(() => {
      const bottles = gsap.utils.toArray<HTMLElement>('.fg-bottle')
      if (reduced) return

      // 1. luz e halo: a cena acende
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
      intro
        .from('.fg-bg', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
        .fromTo('.fg-halo ellipse', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, ease: 'power3.inOut' }, 0.1)
        .from('.fg-beam', { opacity: 0, duration: 2.2, stagger: 0.3, ease: 'power2.out' }, 0.2)
        // 2. headline e interface
        .from('.fg-line', { yPercent: 110, duration: 1.2, stagger: 0.09 }, 0.25)
        .from('.fg-sub, .fg-ctas, .fg-scroll, .fg-now', { opacity: 0, y: 14, duration: 1, stagger: 0.07 }, 0.75)
        // 3. os frascos entram do fundo para a frente
        .from(
          [...bottles].sort((a, b) => Number(a.dataset.z) - Number(b.dataset.z)).map((b) => b.querySelector('.fg-img')),
          {
            opacity: 0,
            y: (_i, el: HTMLElement) => 120 + Number(el.closest<HTMLElement>('.fg-bottle')!.dataset.z) * 140,
            scale: 0.88,
            rotation: (i) => (i % 2 ? 7 : -7),
            duration: 1.7,
            stagger: 0.1,
            clearProps: 'transform',
          },
          0.35,
        )
        .from('.fg-shadow, .fg-fshadow', { opacity: 0, scaleX: 0.3, duration: 1.8, stagger: 0.06 }, 0.6)

      // 4. movimento ambiente independente
      bottles.forEach((b, i) => {
        const z = Number(b.dataset.z)
        const float = b.querySelector('.fg-float')!
        const shadow = b.querySelector('.fg-shadow')!
        const amp = 8 + z * 14
        const dur = 3.4 + ((i * 0.7) % 2.2)
        gsap.to(float, { y: -amp, rotation: `+=${i % 2 ? 1.4 : -1.4}`, duration: dur, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 + i * 0.15 })
        gsap.to(shadow, { scaleX: 0.78, opacity: 0.5, duration: dur, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 + i * 0.15 })
      })

      // 5. scroll cinematográfico: a cena fica fixa (sticky) enquanto a câmera atravessa os planos
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.9 },
      })
      tl.to('.fg-title', { y: -110, opacity: 0, duration: 0.3 }, 0)
      tl.to('.fg-bottom, .fg-now', { y: 30, opacity: 0, duration: 0.18 }, 0)
      tl.to('.fg-fshadow', { opacity: 0, duration: 0.25 }, 0)
      tl.to('.fg-halo', { scale: 1.9, opacity: 0, duration: 0.7, ease: 'power1.in' }, 0.05)
      tl.to('.fg-beam-a', { xPercent: -30, opacity: 0.2, duration: 1 }, 0)
      tl.to('.fg-beam-b', { xPercent: 20, duration: 1 }, 0)
      bottles.forEach((b) => {
        const z = Number(b.dataset.z)
        const x0 = Number(b.dataset.x)
        const side = x0 < 58 ? -1 : 1
        // fase 1 — a câmera desliza: planos próximos andam mais que os distantes
        tl.to(b, { xPercent: -(30 + z * 110), x: `-${4 + z * 14}vw`, scale: 1 + (z - 0.5) * 0.3, rotation: (z - 0.5) * 10, duration: 0.45 }, 0)
        // fase 2 — os frascos se afastam e atravessam o plano do observador
        tl.to(
          b,
          {
            x: `${side * (24 + z * 46)}vw`,
            y: `${(0.5 - z) * 36}vh`,
            scale: 0.7 + z * 1.15,
            opacity: z < 0.4 ? 0 : 1,
            duration: 0.55,
            ease: 'power1.in',
          },
          0.45,
        )
      })
      tl.fromTo('.fg-statement', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.22 }, 0.66)
      tl.to('.fg-floor, .fg-mist, .fg-fshadow', { opacity: 0, duration: 0.3 }, 0.62)
      tl.fromTo('.fg-fade', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7)
      tl.fromTo('.fg-statement-line', { scaleX: 0 }, { scaleX: 1, duration: 0.2 }, 0.74)
    }, section)

    // parallax por profundidade + spotlight que segue o cursor
    const movers = [...stage.querySelectorAll<HTMLElement>('.fg-par')].map((el) => {
      const z = Number(el.closest<HTMLElement>('.fg-bottle')!.dataset.z)
      return { z, x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }) }
    })
    const spot = spotRef.current
    const spotX = spot ? gsap.quickTo(spot, 'x', { duration: 1.6, ease: 'power3.out' }) : null
    const spotY = spot ? gsap.quickTo(spot, 'y', { duration: 1.6, ease: 'power3.out' }) : null
    const onMove = (e: PointerEvent) => {
      if (reduced) return
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      movers.forEach((m) => {
        m.x(nx * (10 + m.z * 44))
        m.y(ny * (6 + m.z * 24))
      })
      spotX?.(e.clientX)
      spotY?.(e.clientY)
    }
    section.addEventListener('pointermove', onMove)
    return () => {
      section.removeEventListener('pointermove', onMove)
      ctx.revert()
    }
  }, [reduced])

  // seleção: os outros recuam, o escolhido some para dar lugar ao overlay
  const prevSelected = useRef<string | null>(null)
  useEffect(() => {
    const stage = stageRef.current
    const had = prevSelected.current
    prevSelected.current = selected
    if (!stage || (!selected && !had)) return
    stage.querySelectorAll<HTMLElement>('.fg-bottle').forEach((b) => {
      const slug = b.dataset.slug!
      const inner = b.querySelector<HTMLElement>('.fg-img')
      const par = b.querySelector<HTMLElement>('.fg-par')
      if (!inner || !par) return
      if (!selected) {
        gsap.to(inner, { opacity: 1, scale: 1, x: 0, duration: 0.9, ease: 'expo.out', overwrite: 'auto', clearProps: 'opacity,scale,x,transform,translate,rotate' })
        gsap.to(par, { filter: 'blur(0px)', duration: 0.6, clearProps: 'filter' })
        return
      }
      if (slug === selected) {
        gsap.set(inner, { opacity: 0 })
      } else {
        const side = Number(b.dataset.x) < SCENE[selected].x ? -1 : 1
        gsap.to(inner, { opacity: 0.22, scale: 0.84, x: side * 70, duration: 0.9, ease: 'expo.out', overwrite: 'auto' })
        gsap.to(par, { filter: 'blur(3px)', duration: 0.9 })
      }
    })
  }, [selected])

  const onSelect = useCallback(
    (p: Product, el: HTMLElement) => {
      const img = el.querySelector<HTMLElement>('.fg-img')
      openOverlay({ slug: p.slug, origin: img?.getBoundingClientRect() ?? null, useCutout: true, returnSelector: `[data-flip="hero-${p.slug}"]` })
    },
    [openOverlay],
  )

  const focus = getProduct(hovered ?? selected ?? '')
  const tint = focus ? focus.atmosphere[theme] : null

  return (
    <section id="inicio" className="fg" ref={sectionRef} aria-label="Galeria de fragrâncias em suspensão">
      <div className={`fg-sticky ${focus ? 'has-focus' : ''}`} style={{ '--tint': tint ?? 'var(--hero-base)' } as CSSProperties}>
        <Atmosphere spotRef={spotRef} />

        <div className="fg-stage" ref={stageRef}>
          <h1 className="display fg-title">
            <span className="fg-mask"><span className="fg-line">O invisível</span></span>
            <span className="fg-mask fg-mask-2"><span className="fg-line">deixa marcas.</span></span>
          </h1>

          {/* sombras projetadas no piso: mais largas e difusas quanto mais alto o frasco flutua */}
          {heroProducts.map((p) => {
            const s = SCENE[p.slug]
            return (
              <span
                key={p.slug}
                className="fg-fshadow"
                aria-hidden="true"
                style={{ '--x': `${s.x - 2}%`, '--w': s.h * p.images.cutout!.ratio * (0.75 + s.z * 0.4), '--z': s.z } as CSSProperties}
              />
            )
          })}

          {heroProducts.map((p) => {
            const s = SCENE[p.slug]
            const cut = p.images.cutout!
            return (
              <button
                key={p.slug}
                className={`fg-bottle ${hovered === p.slug ? 'is-hover' : ''} ${s.z < 0.3 ? 'is-far' : ''}`}
                data-slug={p.slug}
                data-z={s.z}
                data-x={s.x}
                style={{ '--x': `${s.x}%`, '--y': `${s.y}%`, '--h': s.h, '--r': cut.ratio, '--rot': `${s.r}deg`, '--z': s.z, zIndex: Math.round(s.z * 10) } as CSSProperties}
                onClick={(e) => onSelect(p, e.currentTarget)}
                onPointerEnter={() => setHovered(p.slug)}
                onPointerLeave={() => setHovered((h) => (h === p.slug ? null : h))}
                onFocus={() => setHovered(p.slug)}
                onBlur={() => setHovered(null)}
                aria-label={`${p.brand} ${p.name}: abrir apresentação`}
                aria-haspopup="dialog"
              >
                <span className="fg-par">
                  <span className="fg-shadow" aria-hidden="true" />
                  <span className="fg-float">
                    <img
                      className="fg-img"
                      src={cut.srcLarge}
                      alt=""
                      data-flip={`hero-${p.slug}`}
                      draggable={false}
                      fetchPriority={s.z > 0.6 ? 'high' : 'auto'}
                      decoding="async"
                    />
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="fg-now" aria-hidden="true">
          <span className="fg-now-k">{focus ? focus.brand : 'Em cena'}</span>
          <span className="fg-now-name display">{focus ? focus.name : 'Seis fragrâncias'}</span>
          <span className="fg-now-d">{focus ? focus.atmosphere.label : 'Escolha um frasco para conhecê-lo'}</span>
        </div>

        <div className="fg-bottom">
          <div className="fg-intro">
            <p className="fg-sub">Fragrâncias que transformam instantes em memórias.</p>
            <div className="fg-ctas">
              <Magnetic>
                <Link to="/perfumes" className="btn btn-solid fg-cta">
                  Explorar fragrâncias <ArrowRight className="btn-arrow" />
                </Link>
              </Magnetic>
              <Link to="/descubra" className="btn btn-ghost">
                Descubra sua essência
              </Link>
            </div>
          </div>
          <div className="fg-scroll" aria-hidden="true">
            <span>Role</span>
            <span className="fg-scroll-line" />
          </div>
        </div>

        <div className="fg-statement" aria-hidden="true">
          <p className="display">Há fragrâncias que permanecem.</p>
          <span className="fg-statement-line" />
        </div>
      </div>
    </section>
  )
}

/* ———————————————————————— Mobile ———————————————————————— */

function MobileGallery() {
  const { openOverlay, theme } = useStore()
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const current = heroProducts[active]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const slides = [...track.querySelectorAll<HTMLElement>('.mg-slide')]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        })
      },
      { root: track, threshold: 0.6 },
    )
    slides.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.fg-halo ellipse', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: 'power3.inOut' })
      gsap.from('.mg-line', { yPercent: 110, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.1 })
      gsap.from('.mg-slide img', { opacity: 0, y: 60, duration: 1.2, stagger: 0.08, ease: 'expo.out', delay: 0.3, clearProps: 'transform' })
    }, trackRef.current?.parentElement ?? undefined)
    return () => ctx.revert()
  }, [])

  const goTo = (i: number) => {
    const track = trackRef.current
    const slide = track?.querySelector<HTMLElement>(`[data-index="${i}"]`)
    if (!track || !slide) return
    track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <section id="inicio" className="mg" aria-label="Galeria de fragrâncias" style={{ '--tint': current.atmosphere[theme] } as CSSProperties}>
      <Atmosphere />
      <div className="mg-copy wrap">
        <h1 className="display mg-title">
          <span className="fg-mask"><span className="mg-line">O invisível</span></span>
          <span className="fg-mask fg-mask-2"><span className="mg-line">deixa marcas.</span></span>
        </h1>
      </div>

      <div className="mg-track" ref={trackRef} aria-roledescription="galeria" aria-label="Frascos em destaque">
        {heroProducts.map((p, i) => (
          <button
            key={p.slug}
            className={`mg-slide ${i === active ? 'is-active' : ''}`}
            data-index={i}
            aria-label={`${p.brand} ${p.name}: ${i === active ? 'abrir apresentação' : 'mostrar'}`}
            aria-haspopup={i === active ? 'dialog' : undefined}
            onClick={(e) => {
              if (i !== active) return goTo(i)
              const img = e.currentTarget.querySelector('img')
              openOverlay({ slug: p.slug, origin: img?.getBoundingClientRect() ?? null, useCutout: true, returnSelector: `[data-flip="mobile-${p.slug}"]` })
            }}
          >
            <span className="mg-shadow" aria-hidden="true" />
            <span className="mg-float" style={{ animationDelay: `${i * -0.7}s` }}>
              <img src={p.images.cutout!.src} alt="" data-flip={`mobile-${p.slug}`} draggable={false} />
            </span>
          </button>
        ))}
      </div>

      <div className="mg-meta wrap">
        <div aria-live="polite">
          <p className="brand-line">{current.brand}</p>
          <p className="mg-name display">{current.name}</p>
        </div>
        <div className="mg-dots" role="group" aria-label="Escolher frasco">
          {heroProducts.map((p, i) => (
            <button key={p.slug} className={`mg-dot ${i === active ? 'is-active' : ''}`} aria-label={`${p.brand} ${p.name}`} aria-current={i === active} onClick={() => goTo(i)} />
          ))}
        </div>
      </div>

      <div className="mg-actions wrap">
        <p className="mg-sub">Fragrâncias que transformam instantes em memórias.</p>
        <Link to="/perfumes" className="btn btn-solid">
          Explorar fragrâncias <ArrowRight className="btn-arrow" />
        </Link>
        <p className="meta mg-hint">Deslize e toque no frasco ao centro</p>
      </div>
    </section>
  )
}
