import { createElement, Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/utils'
import type { Notes } from '../data/products'
import './editorial.css'

/* ———————— Cinematic Image Reveal ———————— */
export function ImageReveal({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  ratio,
  children,
  from = 'bottom',
}: {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  className?: string
  ratio?: string
  children?: ReactNode
  from?: 'bottom' | 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`ir ir-${from} ${inView ? 'is-in' : ''} ${className}`} style={ratio ? ({ aspectRatio: ratio } as CSSProperties) : undefined}>
      <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} loading="lazy" decoding="async" />
      {children}
    </div>
  )
}

/* ———————— Scent Pyramid ———————— */
const LAYERS = [
  { key: 'top', label: 'Saída', when: 'O primeiro contato. Em geral, as notas mais voláteis.' },
  { key: 'heart', label: 'Coração', when: 'O caráter que se revela depois da abertura.' },
  { key: 'base', label: 'Fundo', when: 'O que permanece na pele por mais tempo.' },
] as const

export function ScentPyramid({ notes, tint }: { notes: Notes; tint: string }) {
  const [active, setActive] = useState<(typeof LAYERS)[number]['key']>('top')
  const idx = LAYERS.findIndex((l) => l.key === active)
  const layer = LAYERS[idx]

  return (
    <div className="sp" style={{ '--sp-tint': tint } as CSSProperties}>
      <div className="sp-figure" role="tablist" aria-label="Camadas da pirâmide olfativa" aria-orientation="vertical">
        {LAYERS.map((l, i) => (
          <button
            key={l.key}
            role="tab"
            id={`sp-tab-${l.key}`}
            aria-selected={active === l.key}
            aria-controls="sp-panel"
            tabIndex={active === l.key ? 0 : -1}
            className={`sp-layer sp-layer-${i}`}
            onClick={() => setActive(l.key)}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(l.key)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                const next = LAYERS[(i + (e.key === 'ArrowDown' ? 1 : 2)) % 3]
                setActive(next.key)
                document.getElementById(`sp-tab-${next.key}`)?.focus()
              }
            }}
          >
            <span className="sp-shape" aria-hidden="true" />
            <span className="sp-label">
              <span className="sp-num">{i + 1}</span>
              {l.label}
            </span>
          </button>
        ))}
      </div>

      <div className="sp-panel" id="sp-panel" role="tabpanel" aria-labelledby={`sp-tab-${active}`} key={active}>
        <p className="sp-when">{layer.when}</p>
        <ul className="sp-notes">
          {notes[active].map((n, i) => (
            <li key={n} style={{ animationDelay: `${i * 60}ms` }}>
              {n}
            </li>
          ))}
        </ul>
        <div className="sp-track" aria-hidden="true">
          {LAYERS.map((l, i) => (
            <span key={l.key} className={i <= idx ? 'is-on' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ———————— Text Reveal: palavras sobem de uma máscara ao entrar na tela ———————— */
export function TextReveal({ as = 'h2', text, className = '', id }: { as?: 'h1' | 'h2' | 'h3' | 'p'; text: string; className?: string; id?: string }) {
  const [el, setEl] = useState<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [el])
  return createElement(
    as,
    { ref: setEl, id, className: `tr ${inView ? 'is-in' : ''} ${className}` },
    <span className="sr-only">{text}</span>,
    <span aria-hidden="true">
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="tr-word">
            <span style={{ '--i': i } as CSSProperties}>{w}</span>
          </span>{' '}
        </Fragment>
      ))}
    </span>,
  )
}

/* ———————— Magnetic: o elemento acompanha o cursor por poucos pixels ———————— */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [strength])
  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  )
}
