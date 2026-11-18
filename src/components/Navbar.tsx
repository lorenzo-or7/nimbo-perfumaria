import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, X } from 'lucide-react'
import { useStore } from '../state/store'
import { useDialog } from '../hooks/useDialog'
import { Wordmark } from './Wordmark'
import './navbar.css'

const links = [
  { to: '/', label: 'Início', section: 'inicio' },
  { to: '/perfumes', label: 'Perfumes' },
  { to: '/#colecoes', label: 'Coleções', section: 'colecoes' },
  { to: '/descubra', label: 'Descubra' },
  { to: '/#essencia', label: 'Nossa essência', section: 'essencia' },
]

export function Navbar() {
  const { theme, toggleTheme, cartCount, favorites, setCartOpen, setSearchOpen } = useStore()
  const { pathname, hash } = useLocation()
  const [compact, setCompact] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const [section, setSection] = useState('inicio')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useDialog(menuOpen, menuRef, () => setMenuOpen(false))

  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      setCompact(window.scrollY > 40)
      // a navbar assume o tom da seção que está sob ela
      const y = 30
      let dark = false
      document.querySelectorAll<HTMLElement>('[data-tone="dark"]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= y && r.bottom >= y) dark = true
      })
      setOnDark(dark)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    const late = window.setTimeout(measure, 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(late)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  useEffect(() => setMenuOpen(false), [pathname, hash])

  // indicador da seção atual na home
  useEffect(() => {
    if (pathname !== '/') return
    const ids = ['inicio', 'colecoes', 'essencia']
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSection(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  const isActive = (l: (typeof links)[number]) => {
    if (l.section) return pathname === '/' && section === l.section
    return pathname.startsWith(l.to)
  }

  return (
    <>
      <header className={`nav ${compact ? 'is-compact' : ''} ${pathname === '/' ? 'is-home' : ''} ${onDark ? 'is-on-dark' : ''}`}>
        <div className="nav-inner">
          <button className="icon-btn nav-burger" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>

          <nav className="nav-links" aria-label="Principal">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className={`nav-link ${isActive(l) ? 'is-active' : ''}`} aria-current={isActive(l) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <Link to="/" className="nav-logo" aria-label="NIMBO, página inicial">
            <Wordmark label={false} />
          </Link>

          <div className="nav-actions">
            <button className="icon-btn" aria-label="Buscar perfumes" onClick={() => setSearchOpen(true)}>
              <Search />
            </button>
            <button className="icon-btn nav-hide-sm" aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'} onClick={toggleTheme}>
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <NavLink to="/favoritos" className="icon-btn nav-hide-sm" aria-label={`Favoritos, ${favorites.length} itens`}>
              <Heart />
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </NavLink>
            <button className="icon-btn" aria-label={`Abrir sacola, ${cartCount} itens`} onClick={() => setCartOpen(true)}>
              <ShoppingBag />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`menu-sheet ${menuOpen ? 'is-open' : ''}`} ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu" hidden={!menuOpen}>
        <div className="menu-top">
          <Wordmark className="menu-logo" />
          <button className="icon-btn" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>
        <nav aria-label="Menu móvel">
          <ul className="menu-list">
            {links.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="menu-link display">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/favoritos" className="menu-link display">
                Favoritos {favorites.length > 0 && <small>({favorites.length})</small>}
              </Link>
            </li>
            <li>
              <Link to="/comparar" className="menu-link display">
                Comparar
              </Link>
            </li>
          </ul>
        </nav>
        <button className="btn btn-line menu-theme" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        </button>
      </div>
    </>
  )
}
