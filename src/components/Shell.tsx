import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Minus, Plus, Search, X } from 'lucide-react'
import { getProduct, products } from '../data/products'
import { useStore } from '../state/store'
import { useDialog } from '../hooks/useDialog'
import { formatPrice, normalize } from '../lib/utils'
import './shell.css'

/* ———————— Cart Drawer ———————— */
export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, setQty, removeFromCart, subtotal, cartCount } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(cartOpen)
  useEffect(() => {
    if (cartOpen) setMounted(true)
  }, [cartOpen])
  useDialog(cartOpen, ref, () => setCartOpen(false))
  if (!mounted) return null

  return (
    <div className={`drawer-root ${cartOpen ? 'is-open' : ''}`} onTransitionEnd={(e) => e.target === e.currentTarget && !cartOpen && setMounted(false)}>
      <div className="drawer-scrim" onClick={() => setCartOpen(false)} aria-hidden="true" />
      <aside className="drawer" ref={ref} role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="drawer-head">
          <h2 id="cart-title" className="display drawer-title">
            Sacola <span className="meta">({cartCount})</span>
          </h2>
          <button className="icon-btn" aria-label="Fechar sacola" onClick={() => setCartOpen(false)}>
            <X />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="drawer-empty">
            <p className="display drawer-empty-title">Sua sacola está vazia.</p>
            <p className="meta">Explore o catálogo e adicione uma fragrância para continuar.</p>
            <button
              className="btn btn-solid"
              onClick={() => {
                setCartOpen(false)
                navigate('/perfumes')
              }}
            >
              Ver perfumes
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer-list">
              {cart.map((i) => {
                const p = getProduct(i.slug)!
                const v = p.volumes.find((x) => x.ml === i.ml)!
                return (
                  <li key={`${i.slug}-${i.ml}`} className="cart-item">
                    <img src={p.images.editorial.src} alt="" loading="lazy" />
                    <div className="cart-item-body">
                      <p className="brand-line">{p.brand}</p>
                      <Link to={`/perfume/${p.slug}`} className="cart-item-name" onClick={() => setCartOpen(false)}>
                        {p.name}
                      </Link>
                      <p className="meta">{i.ml} ml</p>
                      <div className="cart-item-row">
                        <div className="qty" role="group" aria-label={`Quantidade de ${p.name}`}>
                          <button aria-label="Diminuir quantidade" onClick={() => setQty(i.slug, i.ml, i.qty - 1)}>
                            <Minus size={14} />
                          </button>
                          <span aria-live="polite">{i.qty}</span>
                          <button aria-label="Aumentar quantidade" disabled={i.qty >= 10} onClick={() => setQty(i.slug, i.ml, i.qty + 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="cart-item-price">{formatPrice(v.price * i.qty)}</span>
                      </div>
                      <button className="cart-remove" onClick={() => removeFromCart(i.slug, i.ml)}>
                        Remover
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <footer className="drawer-foot">
              <div className="drawer-total">
                <span>Subtotal</span>
                <span className="display">{formatPrice(subtotal)}</span>
              </div>
              <p className="meta">Valores demonstrativos. Nenhuma compra ou cobrança é realizada neste protótipo.</p>
              <button
                className="btn btn-solid"
                onClick={() => {
                  setCartOpen(false)
                  navigate('/finalizar')
                }}
              >
                Finalizar pedido demonstrativo
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

/* ———————— Busca instantânea ———————— */
export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  useDialog(searchOpen, ref, () => setSearchOpen(false), inputRef)

  const results = useMemo(() => {
    const n = normalize(q.trim())
    if (!n) return []
    return products
      .filter((p) => normalize(`${p.brand} ${p.name} ${p.familyLabel ?? ''} ${p.notes ? [...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' ') : ''}`).includes(n))
      .slice(0, 8)
  }, [q])

  useEffect(() => {
    if (!searchOpen) setQ('')
  }, [searchOpen])

  if (!searchOpen) return null
  const go = (slug: string) => {
    setSearchOpen(false)
    navigate(`/perfume/${slug}`)
  }

  return (
    <div className="search-root">
      <div className="drawer-scrim" onClick={() => setSearchOpen(false)} aria-hidden="true" />
      <div className="search" ref={ref} role="dialog" aria-modal="true" aria-label="Buscar perfumes">
        <form
          className="search-bar"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            setSearchOpen(false)
            navigate(`/perfumes?q=${encodeURIComponent(q.trim())}`)
          }}
        >
          <Search size={20} aria-hidden="true" />
          <label htmlFor="search-input" className="sr-only">
            Buscar por marca, perfume ou nota
          </label>
          <input
            id="search-input"
            ref={inputRef}
            className="search-input"
            placeholder="Marca, perfume ou nota"
            value={q}
            maxLength={60}
            autoComplete="off"
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="button" className="icon-btn" aria-label="Fechar busca" onClick={() => setSearchOpen(false)}>
            <X />
          </button>
        </form>
        <div className="search-results" aria-live="polite">
          {q.trim() && results.length === 0 && <p className="meta search-empty">Nada encontrado para “{q}”. Tente uma marca ou uma nota, como baunilha.</p>}
          {results.length > 0 && (
            <ul>
              {results.map((p) => (
                <li key={p.slug}>
                  <button className="search-item" onClick={() => go(p.slug)}>
                    <img src={p.images.editorial.src} alt="" />
                    <span>
                      <span className="brand-line">{p.brand}</span>
                      <span className="search-name">{p.name}</span>
                    </span>
                    <span className="meta">{formatPrice(Math.min(...p.volumes.map((v) => v.price)))}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!q.trim() && (
            <div className="search-suggest">
              <p className="meta">Sugestões</p>
              <div className="search-chips">
                {['Creed', 'Baunilha', 'Jasmim', 'Valentino', 'Lavanda', 'Natura'].map((s) => (
                  <button key={s} className="chip" onClick={() => setQ(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ———————— Toast ———————— */
export function Toast() {
  const { toast } = useStore()
  return (
    <div aria-live="polite" role="status">
      {toast && (
        <div className="toast" key={toast}>
          {toast}
        </div>
      )}
    </div>
  )
}

/* ———————— Comparador flutuante ———————— */
export function CompareTray() {
  const { compare, toggleCompare, clearCompare } = useStore()
  const { pathname } = useLocation()
  if (compare.length === 0 || pathname === '/comparar') return null
  return (
    <div className="compare-tray" role="region" aria-label="Perfumes para comparar">
      <ul className="compare-tray-list">
        {compare.map((s) => {
          const p = getProduct(s)!
          return (
            <li key={s}>
              <img src={p.images.editorial.src} alt="" />
              <span className="sr-only">{p.name}</span>
              <button className="compare-tray-x" aria-label={`Remover ${p.name} da comparação`} onClick={() => toggleCompare(s)}>
                <X size={12} />
              </button>
            </li>
          )
        })}
        {Array.from({ length: 3 - compare.length }).map((_, i) => (
          <li key={`e${i}`} className="is-empty" aria-hidden="true" />
        ))}
      </ul>
      <span className="compare-tray-count">{compare.length} de 3</span>
      <Link to="/comparar" className="btn btn-solid compare-tray-go">
        Comparar
      </Link>
      <button className="btn btn-ghost compare-tray-clear" onClick={clearCompare}>
        Limpar
      </button>
    </div>
  )
}
