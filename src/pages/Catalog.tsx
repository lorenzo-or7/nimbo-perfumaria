import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { brands, concentrations, FAMILY_LABEL, GENDER_LABEL, minPrice, products, type Family, type Gender } from '../data/products'
import { useDialog } from '../hooks/useDialog'
import { formatPrice, normalize } from '../lib/utils'
import './catalog.css'

const PRICE_CEIL = Math.ceil(Math.max(...products.map(minPrice)) / 100) * 100
const SORTS = {
  destaque: 'Destaques',
  'preco-asc': 'Menor preço',
  'preco-desc': 'Maior preço',
  nome: 'Nome, A a Z',
} as const
type Sort = keyof typeof SORTS

const featured = products.filter((p) => p.featured)
const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [sheetOpen, setSheetOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  useDialog(sheetOpen, sheetRef, () => setSheetOpen(false))

  const q = params.get('q') ?? ''
  const genders = list(params.get('gender')) as Gender[]
  const families = list(params.get('family')) as Family[]
  const brandSel = list(params.get('brand'))
  const concSel = list(params.get('conc'))
  const max = Number(params.get('max')) || PRICE_CEIL
  const sort = (params.get('sort') as Sort) in SORTS ? (params.get('sort') as Sort) : 'destaque'

  const update = (key: string, value: string | string[] | null) => {
    const next = new URLSearchParams(params)
    const v = Array.isArray(value) ? value.join(',') : value
    if (!v) next.delete(key)
    else next.set(key, v)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const toggle = (key: string, current: string[], value: string) =>
    update(key, current.includes(value) ? current.filter((x) => x !== value) : [...current, value])

  const results = useMemo(() => {
    const n = normalize(q.trim())
    const r = products.filter((p) => {
      if (n) {
        const hay = normalize(`${p.brand} ${p.name} ${p.familyLabel ?? ''} ${p.notes ? Object.values(p.notes).flat().join(' ') : ''}`)
        if (!hay.includes(n)) return false
      }
      if (genders.length && !genders.includes(p.gender)) return false
      if (families.length && !families.some((f) => p.families.includes(f))) return false
      if (brandSel.length && !brandSel.includes(p.brand)) return false
      if (concSel.length && (!p.concentration || !concSel.includes(p.concentration))) return false
      if (minPrice(p) > max) return false
      return true
    })
    if (sort === 'preco-asc') r.sort((a, b) => minPrice(a) - minPrice(b))
    if (sort === 'preco-desc') r.sort((a, b) => minPrice(b) - minPrice(a))
    if (sort === 'nome') r.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    return r
  }, [q, genders, families, brandSel, concSel, max, sort])

  const activeCount = genders.length + families.length + brandSel.length + concSel.length + (max < PRICE_CEIL ? 1 : 0) + (q ? 1 : 0)
  const clearAll = () => setParams(sort !== 'destaque' ? { sort } : {}, { replace: true, preventScrollReset: true })
  const showFeatured = activeCount === 0

  const filters = (
    <div className="cat-filters">
      <fieldset className="cf-group">
        <legend>Gênero</legend>
        <div className="cf-chips">
          {(Object.keys(GENDER_LABEL) as Gender[]).map((g) => (
            <button key={g} type="button" className="chip" aria-pressed={genders.includes(g)} onClick={() => toggle('gender', genders, g)}>
              {GENDER_LABEL[g]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="cf-group">
        <legend>Família olfativa</legend>
        <div className="cf-chips">
          {(Object.keys(FAMILY_LABEL) as Family[]).map((f) => (
            <button key={f} type="button" className="chip" aria-pressed={families.includes(f)} onClick={() => toggle('family', families, f)}>
              {FAMILY_LABEL[f]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="cf-group">
        <legend>Preço demonstrativo</legend>
        <label className="cf-range">
          <span className="sr-only">Preço máximo</span>
          <input
            type="range"
            min={100}
            max={PRICE_CEIL}
            step={100}
            value={max}
            onChange={(e) => update('max', Number(e.target.value) >= PRICE_CEIL ? null : e.target.value)}
          />
          <span className="meta">Até {formatPrice(max)}</span>
        </label>
      </fieldset>

      <fieldset className="cf-group">
        <legend>Concentração</legend>
        <div className="cf-checks">
          {concentrations.map((c) => (
            <label key={c} className="cf-check">
              <input type="checkbox" checked={concSel.includes(c)} onChange={() => toggle('conc', concSel, c)} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="cf-group">
        <legend>Marca</legend>
        <div className="cf-checks">
          {brands.map((b) => (
            <label key={b} className="cf-check">
              <input type="checkbox" checked={brandSel.includes(b)} onChange={() => toggle('brand', brandSel, b)} />
              <span>{b}</span>
              <span className="cf-count">{products.filter((p) => p.brand === b).length}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )

  return (
    <div className="catalog page-enter">
      <header className="wrap cat-hero">
        <h1 className="display cat-title">Perfumes</h1>
        <p className="lead">
          {products.length} fragrâncias de {brands.length} casas. Preços demonstrativos, apenas para o protótipo.
        </p>
      </header>

      {showFeatured && (
        <section className="wrap cat-featured" aria-labelledby="cat-featured-title">
          <h2 id="cat-featured-title" className="cat-sub">
            Os seis da galeria
          </h2>
          <div className="cat-featured-grid">
            {featured.map((p, i) => (
              <div key={p.slug} className={`cfg-cell ${i === 0 || i === 5 ? 'cfg-wide' : ''}`}>
                <ProductCard product={p} size={i === 0 || i === 5 ? 'wide' : 'regular'} context="feat" priority={i < 3} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="wrap cat-main" aria-labelledby="cat-all-title">
        <div className="cat-toolbar">
          <h2 id="cat-all-title" className="cat-sub">
            {showFeatured ? 'Catálogo completo' : 'Resultados'}
          </h2>
          <form className="cat-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <Search size={16} aria-hidden="true" />
            <label htmlFor="cat-q" className="sr-only">
              Buscar no catálogo
            </label>
            <input id="cat-q" type="search" placeholder="Buscar marca, nome ou nota" value={q} maxLength={60} onChange={(e) => update('q', e.target.value)} />
          </form>
          <label className="cat-sort">
            <span className="sr-only">Ordenar por</span>
            <select className="select" value={sort} onChange={(e) => update('sort', e.target.value === 'destaque' ? null : e.target.value)}>
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-line cat-filter-btn" onClick={() => setSheetOpen(true)} aria-haspopup="dialog">
            <SlidersHorizontal size={16} /> Filtros {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>

        <div className="cat-layout">
          <aside className="cat-aside" aria-label="Filtros">
            {filters}
          </aside>

          <div className="cat-results">
            <div className="cat-status">
              <p className="meta" aria-live="polite">
                {results.length} {results.length === 1 ? 'perfume' : 'perfumes'}
              </p>
              {activeCount > 0 && (
                <button className="btn btn-ghost" onClick={clearAll}>
                  Limpar filtros
                </button>
              )}
            </div>
            {results.length === 0 ? (
              <div className="cat-empty">
                <p className="display">Nenhum perfume com essa combinação.</p>
                <p className="meta">Remova um dos filtros ou tente outra busca.</p>
                <button className="btn btn-solid" onClick={clearAll}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="cat-grid">
                {results.map((p) => (
                  <ProductCard key={p.slug} product={p} context="cat" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className={`filter-sheet ${sheetOpen ? 'is-open' : ''}`} hidden={!sheetOpen}>
        <div className="drawer-scrim" onClick={() => setSheetOpen(false)} aria-hidden="true" />
        <div className="filter-sheet-panel" ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="fs-title">
          <div className="filter-sheet-head">
            <h2 id="fs-title" className="display">
              Filtros
            </h2>
            <button className="icon-btn" aria-label="Fechar filtros" onClick={() => setSheetOpen(false)}>
              <X />
            </button>
          </div>
          <div className="filter-sheet-body">{filters}</div>
          <div className="filter-sheet-foot">
            <button className="btn btn-line" onClick={clearAll}>
              Limpar
            </button>
            <button className="btn btn-solid" onClick={() => setSheetOpen(false)}>
              Ver {results.length} {results.length === 1 ? 'perfume' : 'perfumes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
