import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, Maximize2, Minus, Plus, X } from 'lucide-react'
import { FAMILY_LABEL, GENDER_LABEL, getProduct, products, type Product } from '../data/products'
import { ProductCard } from '../components/ProductCard'
import { ScentPyramid } from '../components/Editorial'
import { useStore } from '../state/store'
import { useDialog } from '../hooks/useDialog'
import { formatPrice } from '../lib/utils'
import NotFound from './NotFound'
import './product.css'

interface Frame {
  id: string
  kind: 'photo' | 'detail' | 'cutout'
  src: string
  alt: string
  caption: string
}

const framesFor = (p: Product): Frame[] => {
  const f: Frame[] = [
    { id: 'photo', kind: 'photo', src: p.images.editorial.srcLarge, alt: `${p.brand} ${p.name}, fotografia editorial`, caption: 'Fotografia editorial' },
    { id: 'detail', kind: 'detail', src: p.images.editorial.srcLarge, alt: `Detalhe do frasco de ${p.name}`, caption: 'Detalhe do frasco' },
  ]
  if (p.images.cutout) f.push({ id: 'cutout', kind: 'cutout', src: p.images.cutout.srcLarge, alt: `Frasco de ${p.name} isolado`, caption: `Atmosfera: ${p.atmosphere.label.toLowerCase()}` })
  return f
}

const related = (p: Product) =>
  products
    .filter((o) => o.slug !== p.slug)
    .map((o) => ({ o, score: o.families.filter((f) => p.families.includes(f)).length * 2 + (o.brand === p.brand ? 1 : 0) + (o.gender === p.gender ? 0.5 : 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.o)

export default function ProductPage() {
  const { slug = '' } = useParams()
  const p = getProduct(slug)
  if (!p) return <NotFound />
  return <ProductView key={p.slug} p={p} />
}

function ProductView({ p }: { p: Product }) {
  const store = useStore()
  const frames = useMemo(() => framesFor(p), [p])
  const [frame, setFrame] = useState(0)
  const [ml, setMl] = useState(p.volumes[0].ml)
  const [qty, setQty] = useState(1)
  const [zoom, setZoom] = useState(false)
  const vol = p.volumes.find((v) => v.ml === ml)!
  const fav = store.isFavorite(p.slug)
  const rel = useMemo(() => related(p), [p])

  useEffect(() => {
    document.title = `${p.name}, ${p.brand} — NIMBO`
  }, [p])

  const go = (d: number) => setFrame((f) => (f + d + frames.length) % frames.length)

  return (
    <article className="pp page-enter" style={{ '--atmos': p.atmosphere[store.theme], '--photo-r': p.images.editorial.ratio } as CSSProperties}>
      <div className="pp-top">
        <section className="pp-gallery" aria-roledescription="galeria" aria-label={`Imagens de ${p.name}`}>
          <div className="pp-stage" onKeyDown={(e) => (e.key === 'ArrowRight' ? go(1) : e.key === 'ArrowLeft' ? go(-1) : null)}>
            {frames.map((f, i) => (
              <figure key={f.id} className={`pp-frame pp-frame-${f.kind} ${i === frame ? 'is-active' : ''}`} aria-hidden={i !== frame}>
                {f.kind === 'cutout' && <span className="halo-ring pp-ring" aria-hidden="true" />}
                <span className="pp-print">
                  <img src={f.src} alt={f.alt} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} />
                </span>
              </figure>
            ))}
            <div className="pp-stage-ui">
              <p className="pp-caption" aria-live="polite">
                {frames[frame].caption}
                <span className="meta">
                  {' '}
                  {frame + 1}/{frames.length}
                </span>
              </p>
              <div className="pp-stage-btns">
                <button className="icon-btn pp-ui-btn" aria-label="Imagem anterior" onClick={() => go(-1)}>
                  <ChevronLeft />
                </button>
                <button className="icon-btn pp-ui-btn" aria-label="Próxima imagem" onClick={() => go(1)}>
                  <ChevronRight />
                </button>
                <button className="icon-btn pp-ui-btn" aria-label="Ampliar imagem" aria-haspopup="dialog" onClick={() => setZoom(true)}>
                  <Maximize2 />
                </button>
              </div>
            </div>
          </div>
          <div className="pp-thumbs" role="group" aria-label="Escolher imagem">
            {frames.map((f, i) => (
              <button key={f.id} className={`pp-thumb pp-thumb-${f.kind}`} aria-label={f.caption} aria-current={i === frame} onClick={() => setFrame(i)}>
                <img src={f.kind === 'cutout' ? p.images.cutout!.src : p.images.editorial.src} alt="" />
              </button>
            ))}
          </div>
        </section>

        <section className="pp-info" aria-labelledby="pp-title">
          <nav className="pp-crumbs meta" aria-label="Trilha">
            <Link to="/perfumes">Perfumes</Link> / <span>{p.brand}</span>
          </nav>
          <p className="brand-line">{p.brand}</p>
          <h1 id="pp-title" className="display pp-title">
            {p.name}
          </h1>
          <p className="pp-desc">{p.description}</p>

          <dl className="pp-specs">
            <div>
              <dt>Concentração</dt>
              <dd>{p.concentration ?? 'Não informada'}</dd>
            </div>
            <div>
              <dt>Família olfativa</dt>
              <dd>{p.familyLabel ?? 'Não confirmada'}</dd>
            </div>
            <div>
              <dt>Linha</dt>
              <dd>{GENDER_LABEL[p.gender]}</dd>
            </div>
          </dl>

          <fieldset className="pp-field">
            <legend className="meta">Volume</legend>
            <div className="pp-chips">
              {p.volumes.map((v) => (
                <button key={v.ml} type="button" className="chip" aria-pressed={ml === v.ml} onClick={() => setMl(v.ml)}>
                  {v.ml} ml
                </button>
              ))}
            </div>
          </fieldset>

          <div className="pp-buy">
            <div>
              <p className="pp-price display">{formatPrice(vol.price * qty)}</p>
              <p className="demo-tag">Preço demonstrativo{qty > 1 ? `, ${qty} × ${formatPrice(vol.price)}` : ''}</p>
            </div>
            <div className="qty" role="group" aria-label="Quantidade">
              <button aria-label="Diminuir quantidade" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus size={14} />
              </button>
              <span aria-live="polite">{qty}</span>
              <button aria-label="Aumentar quantidade" disabled={qty >= 10} onClick={() => setQty((q) => Math.min(10, q + 1))}>
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="pp-actions">
            <button
              className="btn btn-solid"
              onClick={() => {
                store.addToCart(p.slug, ml, qty)
                setQty(1)
              }}
            >
              Adicionar à sacola
            </button>
            <button className="icon-btn pp-fav" aria-pressed={fav} aria-label={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'} onClick={() => store.toggleFavorite(p.slug)}>
              <Heart />
            </button>
          </div>
          <button className="btn btn-ghost" onClick={() => store.toggleCompare(p.slug)}>
            {store.compare.includes(p.slug) ? 'Remover da comparação' : 'Adicionar à comparação'}
          </button>
          <p className="meta pp-note">Protótipo: nenhuma compra é processada. Marca e frasco pertencem a {p.brand}.</p>
        </section>
      </div>

      <section className="pp-pyramid" aria-labelledby="pp-pyr-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="pp-pyr-title" className="h-section">
              Pirâmide olfativa
            </h2>
            <p className="lead">
              {p.notes
                ? 'Passe o cursor ou toque em cada camada para ver como a fragrância se transforma na pele.'
                : 'Não foi possível confirmar as notas deste perfume. Preferimos não listar ingredientes por suposição.'}
            </p>
          </div>
          {p.notes ? (
            <ScentPyramid notes={p.notes} tint={p.atmosphere[store.theme]} />
          ) : (
            p.families.length > 0 && <p className="meta">Família indicada: {p.families.map((f) => FAMILY_LABEL[f]).join(', ')}.</p>
          )}
        </div>
      </section>

      {rel.length > 0 && (
        <section className="section pp-related" aria-labelledby="pp-rel-title">
          <div className="wrap">
            <h2 id="pp-rel-title" className="h-section pp-rel-title">
              Na mesma atmosfera
            </h2>
            <div className="sel-grid pp-rel-grid">
              {rel.map((r) => (
                <ProductCard key={r.slug} product={r} context="rel" />
              ))}
            </div>
          </div>
        </section>
      )}

      {zoom && <Lightbox frames={frames} start={frame} onClose={(i) => { setFrame(i); setZoom(false) }} />}
    </article>
  )
}

function Lightbox({ frames, start, onClose }: { frames: Frame[]; start: number; onClose: (i: number) => void }) {
  const [i, setI] = useState(start)
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const ref = useRef<HTMLDivElement>(null)
  useDialog(true, ref, () => onClose(i))
  const f = frames[i]

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!zoomed) return
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}% ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`)
  }
  const go = (d: number) => {
    setZoomed(false)
    setI((x) => (x + d + frames.length) % frames.length)
  }

  return (
    <div
      className="lb"
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Imagem ampliada"
      onKeyDown={(e) => (e.key === 'ArrowRight' ? go(1) : e.key === 'ArrowLeft' ? go(-1) : null)}
    >
      <button className="icon-btn lb-close" aria-label="Fechar imagem ampliada" onClick={() => onClose(i)}>
        <X />
      </button>
      <div className={`lb-stage lb-${f.kind} ${zoomed ? 'is-zoomed' : ''}`} onPointerMove={onMove}>
        <button className="lb-img-btn" aria-label={zoomed ? 'Reduzir zoom' : 'Aumentar zoom'} onClick={() => setZoomed((z) => !z)}>
          <img src={f.src} alt={f.alt} style={{ transformOrigin: origin }} />
        </button>
      </div>
      <div className="lb-bar">
        <button className="icon-btn" aria-label="Imagem anterior" onClick={() => go(-1)}>
          <ChevronLeft />
        </button>
        <span className="meta">
          {f.caption}, {i + 1}/{frames.length}
        </span>
        <button className="icon-btn" aria-label="Próxima imagem" onClick={() => go(1)}>
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
