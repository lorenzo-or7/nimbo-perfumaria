import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { CartDrawer, CompareTray, SearchDialog, Toast } from './components/Shell'
import { CinematicOverlay } from './components/hero/CinematicOverlay'
import { ScrollTrigger } from './lib/gsap'
import { useStore } from './state/store'
import Home from './pages/Home'

const Catalog = lazy(() => import('./pages/Catalog'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const Finder = lazy(() => import('./pages/Finder'))
const Compare = lazy(() => import('./pages/Compare'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))

const TITLES: Record<string, string> = {
  '/perfumes': 'Perfumes',
  '/descubra': 'Descubra sua essência',
  '/comparar': 'Comparar',
  '/favoritos': 'Favoritos',
  '/finalizar': 'Pedido demonstrativo',
  '/privacidade': 'Privacidade e cookies',
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  const { closeOverlay } = useStore()
  useEffect(() => {
    closeOverlay()
    if (!pathname.startsWith('/perfume/')) document.title = TITLES[pathname] ? `${TITLES[pathname]} — NIMBO` : 'NIMBO — Perfumaria multimarcas'
    if (hash) {
      // espera a página montar antes de rolar até a âncora
      const t = window.setTimeout(() => {
        ScrollTrigger.refresh()
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => window.clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <ScrollManager />
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Suspense fallback={<div className="loader-line" role="progressbar" aria-label="Carregando" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfumes" element={<Catalog />} />
            <Route path="/perfume/:slug" element={<ProductPage />} />
            <Route path="/descubra" element={<Finder />} />
            <Route path="/comparar" element={<Compare />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/finalizar" element={<Checkout />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CinematicOverlay />
      <CartDrawer />
      <SearchDialog />
      <CompareTray />
      <Toast />
    </>
  )
}
