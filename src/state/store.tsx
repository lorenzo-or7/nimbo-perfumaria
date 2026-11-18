import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getProduct } from '../data/products'
import { readStore, writeStore } from '../lib/utils'

export type Theme = 'light' | 'dark'
export interface CartItem {
  slug: string
  ml: number
  qty: number
}
export interface OverlayState {
  slug: string
  /** retângulo de origem do frasco/imagem, para a transição compartilhada */
  origin: DOMRect | null
  /** se o recorte transparente deve ser usado na transição */
  useCutout: boolean
  /** seletor do elemento de origem, para devolver a transição ao fechar */
  returnSelector?: string
}

interface Store {
  theme: Theme
  toggleTheme: () => void
  cart: CartItem[]
  addToCart: (slug: string, ml?: number, qty?: number) => void
  setQty: (slug: string, ml: number, qty: number) => void
  removeFromCart: (slug: string, ml: number) => void
  clearCart: () => void
  cartCount: number
  subtotal: number
  favorites: string[]
  toggleFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
  compare: string[]
  toggleCompare: (slug: string) => void
  clearCompare: () => void
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  overlay: OverlayState | null
  openOverlay: (o: OverlayState) => void
  closeOverlay: () => void
  toast: string | null
  notify: (msg: string) => void
}

const Ctx = createContext<Store | null>(null)
const MAX_COMPARE = 3

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const [cart, setCart] = useState<CartItem[]>(() =>
    readStore<CartItem[]>('nimbo:cart', []).filter((i) => getProduct(i.slug)?.volumes.some((v) => v.ml === i.ml)),
  )
  const [favorites, setFavorites] = useState<string[]>(() =>
    readStore<string[]>('nimbo:favorites', []).filter((s) => getProduct(s)),
  )
  const [compare, setCompare] = useState<string[]>(() =>
    readStore<string[]>('nimbo:compare', []).filter((s) => getProduct(s)).slice(0, MAX_COMPARE),
  )
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [overlay, setOverlay] = useState<OverlayState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transition')
    root.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#000000' : '#F9F6EF')
    writeStore('nimbo:theme', theme)
    const t = window.setTimeout(() => root.classList.remove('theme-transition'), 500)
    return () => window.clearTimeout(t)
  }, [theme])

  useEffect(() => writeStore('nimbo:cart', cart), [cart])
  useEffect(() => writeStore('nimbo:favorites', favorites), [favorites])
  useEffect(() => writeStore('nimbo:compare', compare), [compare])

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const addToCart = useCallback(
    (slug: string, ml?: number, qty = 1) => {
      const p = getProduct(slug)
      if (!p) return
      const vol = p.volumes.find((v) => v.ml === ml) ?? p.volumes[0]
      setCart((c) => {
        const found = c.find((i) => i.slug === slug && i.ml === vol.ml)
        if (found) return c.map((i) => (i === found ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
        return [...c, { slug, ml: vol.ml, qty: Math.min(10, qty) }]
      })
      notify(`${p.name} ${vol.ml} ml adicionado à sacola`)
    },
    [notify],
  )

  const setQty = useCallback((slug: string, ml: number, qty: number) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((i) => !(i.slug === slug && i.ml === ml))
        : c.map((i) => (i.slug === slug && i.ml === ml ? { ...i, qty: Math.min(10, qty) } : i)),
    )
  }, [])

  const removeFromCart = useCallback((slug: string, ml: number) => {
    setCart((c) => c.filter((i) => !(i.slug === slug && i.ml === ml)))
  }, [])

  const toggleFavorite = useCallback(
    (slug: string) => {
      setFavorites((f) => {
        const has = f.includes(slug)
        const p = getProduct(slug)
        notify(has ? `${p?.name} removido dos favoritos` : `${p?.name} salvo nos favoritos`)
        return has ? f.filter((s) => s !== slug) : [...f, slug]
      })
    },
    [notify],
  )

  const toggleCompare = useCallback(
    (slug: string) => {
      setCompare((c) => {
        if (c.includes(slug)) return c.filter((s) => s !== slug)
        if (c.length >= MAX_COMPARE) {
          notify('O comparador aceita até três perfumes')
          return c
        }
        return [...c, slug]
      })
    },
    [notify],
  )

  const value = useMemo<Store>(() => {
    const subtotal = cart.reduce((sum, i) => {
      const v = getProduct(i.slug)?.volumes.find((x) => x.ml === i.ml)
      return sum + (v ? v.price * i.qty : 0)
    }, 0)
    return {
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      cart,
      addToCart,
      setQty,
      removeFromCart,
      clearCart: () => setCart([]),
      cartCount: cart.reduce((n, i) => n + i.qty, 0),
      subtotal,
      favorites,
      toggleFavorite,
      isFavorite: (s) => favorites.includes(s),
      compare,
      toggleCompare,
      clearCompare: () => setCompare([]),
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      overlay,
      openOverlay: setOverlay,
      closeOverlay: () => setOverlay(null),
      toast,
      notify,
    }
  }, [theme, cart, favorites, compare, cartOpen, searchOpen, overlay, toast, addToCart, setQty, removeFromCart, toggleFavorite, toggleCompare, notify])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore fora do StoreProvider')
  return s
}
