import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getProduct } from '../data/products'
import { useStore } from '../state/store'
import { formatPrice } from '../lib/utils'
import './pages.css'

export default function Checkout() {
  const { cart, subtotal, clearCart } = useStore()
  const [done, setDone] = useState<{ total: number; count: number } | null>(null)

  if (done) {
    return (
      <div className="page page-enter">
        <div className="wrap checkout-done">
          <h1 className="display page-title">Pedido demonstrativo concluído.</h1>
          <p className="lead">
            Você simulou um pedido de {done.count} {done.count === 1 ? 'item' : 'itens'} no valor demonstrativo de {formatPrice(done.total)}. Nenhuma compra foi processada e nenhuma cobrança foi feita.
          </p>
          <Link to="/perfumes" className="btn btn-solid">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page page-enter">
      <div className="wrap">
        <header className="page-head">
          <h1 className="display page-title">Finalizar pedido</h1>
          <p className="lead">Esta é uma finalização demonstrativa. Não pedimos dados pessoais nem de pagamento, e nada será cobrado.</p>
        </header>

        {cart.length === 0 ? (
          <div className="empty">
            <p className="display empty-title">Sua sacola está vazia.</p>
            <Link to="/perfumes" className="btn btn-solid">
              Ver perfumes
            </Link>
          </div>
        ) : (
          <div className="checkout">
            <ul className="checkout-list">
              {cart.map((i) => {
                const p = getProduct(i.slug)!
                const v = p.volumes.find((x) => x.ml === i.ml)!
                return (
                  <li key={`${i.slug}-${i.ml}`}>
                    <img src={p.images.editorial.src} alt="" />
                    <div>
                      <p className="brand-line">{p.brand}</p>
                      <p className="display checkout-name">{p.name}</p>
                      <p className="meta">
                        {i.ml} ml, {i.qty} × {formatPrice(v.price)}
                      </p>
                    </div>
                    <p className="checkout-line-total">{formatPrice(v.price * i.qty)}</p>
                  </li>
                )
              })}
            </ul>
            <aside className="checkout-summary" aria-label="Resumo">
              <div className="checkout-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="checkout-row meta">
                <span>Frete</span>
                <span>Não se aplica</span>
              </div>
              <div className="checkout-row checkout-total">
                <span>Total demonstrativo</span>
                <span className="display">{formatPrice(subtotal)}</span>
              </div>
              <p className="checkout-warn">Protótipo Or7. Ao confirmar, a sacola é esvaziada e nenhuma compra é realizada.</p>
              <button
                className="btn btn-solid"
                onClick={() => {
                  setDone({ total: subtotal, count: cart.reduce((n, i) => n + i.qty, 0) })
                  clearCart()
                  window.scrollTo({ top: 0 })
                }}
              >
                Confirmar pedido demonstrativo
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
