import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { getProduct } from '../data/products'
import { useStore } from '../state/store'
import './pages.css'

export default function Favorites() {
  const { favorites } = useStore()
  const items = favorites.map((s) => getProduct(s)!).filter(Boolean)
  return (
    <div className="page page-enter">
      <div className="wrap">
        <header className="page-head">
          <h1 className="display page-title">Favoritos</h1>
          <p className="lead">
            {items.length ? `${items.length} ${items.length === 1 ? 'perfume salvo' : 'perfumes salvos'} neste navegador.` : 'Os perfumes que você salvar aparecem aqui, guardados apenas neste navegador.'}
          </p>
        </header>
        {items.length === 0 ? (
          <div className="empty">
            <p className="display empty-title">Nenhum favorito ainda.</p>
            <p className="meta">Toque no coração de qualquer perfume para guardá-lo.</p>
            <Link to="/perfumes" className="btn btn-solid">
              Explorar perfumes
            </Link>
          </div>
        ) : (
          <div className="sel-grid">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} context="fav" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
