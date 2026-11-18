import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { GENDER_LABEL, getProduct, products } from '../data/products'
import { useStore } from '../state/store'
import { formatPrice } from '../lib/utils'
import './pages.css'

export default function Compare() {
  const store = useStore()
  const items = store.compare.map((s) => getProduct(s)!).filter(Boolean)
  const suggestions = products.filter((p) => !store.compare.includes(p.slug)).slice(0, 6)

  const rows: { label: string; render: (p: (typeof items)[number]) => ReactNode }[] = [
    { label: 'Família olfativa', render: (p) => p.familyLabel ?? 'Não confirmada' },
    { label: 'Concentração', render: (p) => p.concentration ?? 'Não informada' },
    { label: 'Linha', render: (p) => GENDER_LABEL[p.gender] },
    { label: 'Saída', render: (p) => p.notes?.top.join(', ') ?? '—' },
    { label: 'Coração', render: (p) => p.notes?.heart.join(', ') ?? '—' },
    { label: 'Fundo', render: (p) => p.notes?.base.join(', ') ?? '—' },
    { label: 'Volumes', render: (p) => p.volumes.map((v) => `${v.ml} ml`).join(', ') },
    {
      label: 'Preço demonstrativo',
      render: (p) => (
        <ul className="cmp-prices">
          {p.volumes.map((v) => (
            <li key={v.ml}>
              {v.ml} ml <span>{formatPrice(v.price)}</span>
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <div className="page page-enter">
      <div className="wrap">
        <header className="page-head">
          <h1 className="display page-title">Comparar</h1>
          <p className="lead">Até três perfumes lado a lado. Ocasião e desempenho não aparecem porque não há dados confirmados para isso.</p>
        </header>

        {items.length === 0 ? (
          <div className="empty">
            <p className="display empty-title">Nenhum perfume na comparação.</p>
            <p className="meta">No catálogo, use “Comparar” em até três produtos. Ou comece por uma destas sugestões:</p>
            <div className="chip-row">
              {suggestions.map((p) => (
                <button key={p.slug} className="chip" onClick={() => store.toggleCompare(p.slug)}>
                  + {p.name}
                </button>
              ))}
            </div>
            <Link to="/perfumes" className="btn btn-solid">
              Ir ao catálogo
            </Link>
          </div>
        ) : (
          <div className="cmp-scroll" tabIndex={0} role="region" aria-label="Tabela de comparação">
            <table className="cmp" style={{ '--n': items.length } as CSSProperties}>
              <caption className="sr-only">Comparação entre {items.map((p) => p.name).join(', ')}</caption>
              <thead>
                <tr>
                  <td />
                  {items.map((p) => (
                    <th key={p.slug} scope="col">
                      <div className="cmp-head">
                        <Link to={`/perfume/${p.slug}`} className="cmp-img">
                          <img src={p.images.editorial.src} alt="" />
                        </Link>
                        <p className="brand-line">{p.brand}</p>
                        <Link to={`/perfume/${p.slug}`} className="cmp-name display">
                          {p.name}
                        </Link>
                        <div className="cmp-actions">
                          <button className="btn btn-solid" onClick={() => store.addToCart(p.slug)}>
                            Adicionar
                          </button>
                          <button className="icon-btn" aria-label={`Remover ${p.name} da comparação`} onClick={() => store.toggleCompare(p.slug)}>
                            <X />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  {items.length < 3 && (
                    <td className="cmp-add">
                      <Link to="/perfumes" className="cmp-add-box">
                        <span className="display">+</span>
                        Adicionar perfume
                      </Link>
                    </td>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    {items.map((p) => (
                      <td key={p.slug}>{r.render(p)}</td>
                    ))}
                    {items.length < 3 && <td />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
