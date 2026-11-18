import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { Magnetic } from './Editorial'
import { prefersReducedMotion } from '../lib/utils'
import './footer.css'

export function Footer() {
  return (
    <footer className="footer" data-tone="dark">
      <div className="footer-glow" aria-hidden="true" />
      <div className="wrap footer-top">
        <div className="footer-lead">
          <p className="footer-line display">Sua essência não precisa de apresentação.</p>
          <Magnetic>
            <Link to="/descubra" className="btn btn-champagne">
              Descubra sua essência <ArrowRight className="btn-arrow" />
            </Link>
          </Magnetic>
        </div>

        <div className="footer-cols">
          <nav className="footer-col" aria-label="Navegação do rodapé">
            <p className="footer-h">Explorar</p>
            <ul>
              <li><Link to="/perfumes">Perfumes</Link></li>
              <li><Link to="/#colecoes">Coleções</Link></li>
              <li><Link to="/descubra">Descubra sua essência</Link></li>
              <li><Link to="/comparar">Comparar</Link></li>
              <li><Link to="/favoritos">Favoritos</Link></li>
            </ul>
          </nav>

          <div className="footer-col">
            <p className="footer-h">Institucional</p>
            <ul>
              <li><Link to="/#essencia">Nossa essência</Link></li>
              <li><Link to="/#perguntas">Perguntas frequentes</Link></li>
              <li><Link to="/privacidade">Privacidade</Link></li>
              <li><Link to="/privacidade#cookies">Cookies</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-h">Contato</p>
            <p className="footer-note">
              A NIMBO é uma marca fictícia e não tem canais de atendimento. Para falar sobre o projeto, procure a Or7 pela assinatura abaixo.
            </p>
          </div>
        </div>
      </div>

      {/* wordmark aprovado em escala expressiva, preenchido em champanhe pela própria silhueta */}
      <div className="wrap footer-mark-wrap" aria-hidden="true">
        <span className="footer-mark" style={{ '--footer-wordmark-image': `url("${import.meta.env.BASE_URL}assets/branding/nimbo-wordmark.png")` } as CSSProperties} />
      </div>

      <div className="wrap footer-legal">
        <p>
          Protótipo demonstrativo. Nenhuma compra é processada e nenhuma cobrança é realizada. Preços e volumes são ilustrativos. Marcas, nomes e
          frascos pertencem aos respectivos fabricantes; a NIMBO não declara parceria comercial com eles.
        </p>
        <div className="footer-end">
          <button
            className="footer-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
          >
            <ArrowUp aria-hidden="true" /> Voltar ao topo
          </button>
          <a
            className="footer-or7"
            href="https://github.com/lorenzo-or7"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Or7, idealizado e desenvolvido por Lorenzo Orsetti. Abrir portfólio em nova aba"
          >
            <img src={`${import.meta.env.BASE_URL}assets/branding/or7-signature.webp`} width={640} height={213} alt="" loading="lazy" />
          </a>
        </div>
      </div>
    </footer>
  )
}
