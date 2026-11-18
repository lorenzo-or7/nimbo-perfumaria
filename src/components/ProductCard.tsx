import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { Eye, GitCompareArrows, Heart, Plus } from 'lucide-react'
import { minPrice, type Product } from '../data/products'
import { useStore } from '../state/store'
import { formatPrice } from '../lib/utils'
import './product-card.css'

interface Props {
  product: Product
  /** regular: fotografia 4:5 · wide: frasco recortado sobre a atmosfera do perfume (quando houver recorte) */
  size?: 'regular' | 'wide'
  /** prefixo do seletor de retorno da transição */
  context?: string
  priority?: boolean
}

/** 3D Product Card + Morphing Product Card (abre o Quick View a partir da própria imagem). */
export function ProductCard({ product: p, size = 'regular', context = 'card', priority = false }: Props) {
  const store = useStore()
  const mediaRef = useRef<HTMLDivElement>(null)
  const fav = store.isFavorite(p.slug)
  const comparing = store.compare.includes(p.slug)
  const flipId = `${context}-${p.slug}`
  const wide = size === 'wide' && !!p.images.cutout

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = mediaRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 3).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 4).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
  }
  const onLeave = () => {
    const el = mediaRef.current
    el?.style.setProperty('--rx', '0deg')
    el?.style.setProperty('--ry', '0deg')
  }

  const quickView = () => {
    const img = mediaRef.current?.querySelector('img')
    store.openOverlay({ slug: p.slug, origin: img?.getBoundingClientRect() ?? null, useCutout: false, returnSelector: `[data-flip="${flipId}"]` })
  }

  return (
    <article className={`pc ${wide ? 'pc-wide' : 'pc-regular'}`}>
      <div className="pc-media" ref={mediaRef} onPointerMove={onMove} onPointerLeave={onLeave}>
        <Link to={`/perfume/${p.slug}`} className="pc-link" aria-label={`${p.brand} ${p.name}`} tabIndex={-1}>
          {wide ? (
            <span className="pc-stage" style={{ '--atmos': p.atmosphere[store.theme] } as CSSProperties}>
              <span className="pc-ring" aria-hidden="true" />
              <img src={p.images.cutout!.srcLarge} alt={`${p.brand} ${p.name}`} loading={priority ? 'eager' : 'lazy'} decoding="async" data-flip={flipId} />
            </span>
          ) : (
            <img
              src={p.images.editorial.src}
              srcSet={`${p.images.editorial.src} 480w, ${p.images.editorial.srcLarge} 960w`}
              sizes="(max-width: 760px) 50vw, 25vw"
              alt={`${p.brand} ${p.name}`}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              data-flip={flipId}
            />
          )}
          <span className="pc-sheen" aria-hidden="true" />
        </Link>
        <button className="icon-btn pc-fav" aria-pressed={fav} aria-label={fav ? `Remover ${p.name} dos favoritos` : `Salvar ${p.name} nos favoritos`} onClick={() => store.toggleFavorite(p.slug)}>
          <Heart />
        </button>
        <div className="pc-tools">
          <button className="pc-tool" onClick={quickView} aria-haspopup="dialog" aria-label={`Ver rápido: ${p.name}`}>
            <Eye size={15} /> <span className="pc-tool-label">Ver rápido</span>
          </button>
          <button className="pc-tool" aria-pressed={comparing} aria-label={`Comparar ${p.name}`} onClick={() => store.toggleCompare(p.slug)}>
            <GitCompareArrows size={15} /> <span className="pc-tool-label">{comparing ? 'Comparando' : 'Comparar'}</span>
          </button>
        </div>
      </div>
      <div className="pc-body">
        <p className="brand-line">{p.brand}</p>
        <h3 className="pc-name">
          <Link to={`/perfume/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="pc-meta">{p.concentration ?? 'Concentração não informada'}</p>
      </div>
      <div className="pc-foot">
        <p className="pc-price">
          {p.volumes.length > 1 && <small>a partir de</small>}
          {formatPrice(minPrice(p))}
        </p>
        <button className="pc-add" aria-label={`Adicionar ${p.name} ${p.volumes[0].ml} ml à sacola`} onClick={() => store.addToCart(p.slug, p.volumes[0].ml)}>
          <Plus aria-hidden="true" />
          <span className="pc-add-label">Sacola</span>
        </button>
      </div>
    </article>
  )
}
