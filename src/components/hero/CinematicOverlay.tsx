import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, X } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { getProduct, GENDER_LABEL } from '../../data/products'
import { useStore } from '../../state/store'
import { useDialog } from '../../hooks/useDialog'
import { formatPrice, prefersReducedMotion } from '../../lib/utils'
import './overlay.css'

/**
 * Cinematic Product Overlay — extensão da hero.
 * Usa transição compartilhada (FLIP): o frasco ou a fotografia parte
 * exatamente do ponto clicado e assume a nova composição.
 */
export function CinematicOverlay() {
  const { overlay } = useStore()
  if (!overlay) return null
  return <OverlayInner key={overlay.slug} />
}

function OverlayInner() {
  const store = useStore()
  const { overlay, closeOverlay, theme } = store
  const navigate = useNavigate()
  const p = getProduct(overlay!.slug)!
  const rootRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const [ml, setMl] = useState(p.volumes[0].ml)
  const closing = useRef(false)
  const useCutout = overlay!.useCutout && !!p.images.cutout
  const reduced = prefersReducedMotion()
  const vol = p.volumes.find((v) => v.ml === ml)!
  const fav = store.isFavorite(p.slug)

  /* abertura */
  useLayoutEffect(() => {
    const root = rootRef.current
    const target = flipRef.current
    if (!root || !target) return
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.from(root, { opacity: 0, duration: 0.2 })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.co-bg', { opacity: 0, duration: 0.7, ease: 'power2.out' }, 0)
      const o = overlay!.origin
      if (o && o.width > 0) {
        const t = target.getBoundingClientRect()
        if (useCutout) {
          tl.from(target, { x: o.left - t.left, y: o.top - t.top, scale: o.height / t.height, transformOrigin: '0 0', duration: 1.1 }, 0)
        } else {
          tl.fromTo(
            target,
            { x: o.left - t.left, y: o.top - t.top, width: o.width, height: o.height },
            { x: 0, y: 0, width: t.width, height: t.height, duration: 1, clearProps: 'width,height,transform' },
            0,
          )
        }
      } else {
        tl.from(target, { opacity: 0, y: 40, duration: 0.9 }, 0)
      }
      if (useCutout) tl.fromTo('.co-photo', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'expo.inOut' }, 0.1)
      tl.from('.co-reveal', { opacity: 0, y: 24, duration: 0.9, stagger: 0.05 }, 0.35)
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* fechamento: devolve a peça ao lugar de origem */
  const close = useCallback(
    (instant = false) => {
      if (closing.current) return
      closing.current = true
      const root = rootRef.current
      const target = flipRef.current
      if (instant || reduced || !root || !target) {
        closeOverlay()
        return
      }
      const back = overlay!.returnSelector ? document.querySelector<HTMLElement>(overlay!.returnSelector) : null
      const r = back?.getBoundingClientRect()
      const visible = r && r.width > 0 && r.bottom > 0 && r.top < window.innerHeight
      const tl = gsap.timeline({ onComplete: closeOverlay })
      tl.to('.co-reveal', { opacity: 0, y: 12, duration: 0.3, stagger: 0.02, ease: 'power2.in' }, 0)
      if (useCutout) tl.to('.co-photo', { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut' }, 0)
      if (visible) {
        const t = target.getBoundingClientRect()
        if (useCutout) {
          tl.to(target, { x: `+=${r.left - t.left}`, y: `+=${r.top - t.top}`, scale: r.height / (t.height / (Number(gsap.getProperty(target, 'scale')) || 1)), transformOrigin: '0 0', duration: 0.85, ease: 'expo.inOut' }, 0.05)
        } else {
          tl.to(target, { x: r.left - t.left, y: r.top - t.top, width: r.width, height: r.height, duration: 0.8, ease: 'expo.inOut' }, 0.05)
        }
        tl.to('.co-bg', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.4)
      } else {
        tl.to(root, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 0.1)
      }
    },
    [closeOverlay, overlay, reduced, useCutout],
  )

  useDialog(true, rootRef, () => close(), closeBtn)

  const goDetails = () => {
    close(true)
    navigate(`/perfume/${p.slug}`)
  }

  const photo = (
    <figure className="co-photo-cell">
      <div className="co-photo" ref={useCutout ? undefined : flipRef}>
        <img src={p.images.editorial.srcLarge} alt={`${p.brand} ${p.name}, fotografia editorial`} />
      </div>
    </figure>
  )

  return (
    <div
      className={`co ${useCutout ? 'has-cutout' : 'no-cutout'}`}
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="co-title"
      style={{ '--atmos': p.atmosphere[theme] } as CSSProperties}
    >
      <div className="co-bg" aria-hidden="true" onClick={() => close()} />
      <button ref={closeBtn} className="icon-btn co-close co-reveal" aria-label="Fechar apresentação" onClick={() => close()}>
        <X />
      </button>

      <div className="co-grid">
        {photo}

        {useCutout && (
          <div className="co-stage" aria-hidden="true">
            <div className="co-bottle" ref={flipRef}>
              <img src={p.images.cutout!.srcLarge} alt="" />
            </div>
          </div>
        )}

        <div className="co-info">
          <p className="brand-line co-reveal">{p.brand}</p>
          <h2 id="co-title" className="display co-title co-reveal">
            {p.name}
          </h2>
          <p className="co-meta co-reveal">
            {[p.concentration, p.familyLabel, GENDER_LABEL[p.gender]].filter(Boolean).join(', ')}
          </p>
          <p className="co-desc co-reveal">{p.description}</p>

          {p.notes ? (
            <dl className="co-notes co-reveal">
              <div>
                <dt>Saída</dt>
                <dd>{p.notes.top.join(', ')}</dd>
              </div>
              <div>
                <dt>Coração</dt>
                <dd>{p.notes.heart.join(', ')}</dd>
              </div>
              <div>
                <dt>Fundo</dt>
                <dd>{p.notes.base.join(', ')}</dd>
              </div>
            </dl>
          ) : (
            <p className="meta co-reveal">Notas olfativas não confirmadas para este perfume.</p>
          )}

          <fieldset className="co-volumes co-reveal">
            <legend className="meta">Volume</legend>
            <div className="co-chips">
              {p.volumes.map((v) => (
                <button key={v.ml} type="button" className="chip" aria-pressed={v.ml === ml} onClick={() => setMl(v.ml)}>
                  {v.ml} ml
                </button>
              ))}
            </div>
          </fieldset>

          <div className="co-price co-reveal">
            <span className="co-price-value">{formatPrice(vol.price)}</span>
            <span className="demo-tag">Preço demonstrativo</span>
          </div>

          <div className="co-actions co-reveal">
            <button className="btn btn-solid" onClick={() => store.addToCart(p.slug, ml)}>
              Adicionar à sacola
            </button>
            <button className="icon-btn co-fav" aria-pressed={fav} aria-label={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'} onClick={() => store.toggleFavorite(p.slug)}>
              <Heart />
            </button>
          </div>
          <div className="co-links co-reveal">
            <Link
              to={`/perfume/${p.slug}`}
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault()
                goDetails()
              }}
            >
              Ver detalhes
            </Link>
            <button className="btn btn-ghost" onClick={() => store.toggleCompare(p.slug)}>
              {store.compare.includes(p.slug) ? 'Remover da comparação' : 'Comparar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
