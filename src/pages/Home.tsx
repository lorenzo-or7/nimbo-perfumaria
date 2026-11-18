import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { FloatingGallery } from '../components/hero/FloatingGallery'
import { ProductCard } from '../components/ProductCard'
import { ImageReveal, Magnetic, TextReveal } from '../components/Editorial'
import { collections, faq } from '../data/content'
import { getProduct, products } from '../data/products'
import { gsap } from '../lib/gsap'
import './home.css'

const genderCollections = collections.slice(0, 3)
const familyCollections = collections.slice(3)
const highlights = ['creed-carmina', 'black-opium', 'god-of-fire', 'sauvage-parfum'].map((s) => getProduct(s)!)
const selection = ['y-edp', 'libre', 'red-tobacco', 'divine', 'bad-boy-cobalt', 'green-irish-tweed', 'coral-fantasy', '1-million'].map((s) => getProduct(s)!)

const collectionHref = (q: { gender?: string; family?: string }) =>
  `/perfumes?${new URLSearchParams(Object.entries(q).filter(([, v]) => v) as [string, string][]).toString()}`
const countFor = (q: { gender?: string; family?: string }) =>
  products.filter((p) => (!q.gender || p.gender === q.gender) && (!q.family || p.families.includes(q.family as never))).length
const ed = (slug: string, size: 480 | 960 = 960) => `${import.meta.env.BASE_URL}assets/perfumes/editorial/${slug}-${size}.webp`

export default function Home() {
  return (
    <>
      <FloatingGallery />
      <Collections />
      <Vitrine />
      <FinderTeaser />
      <Manifesto />
      <Selection />
      <Faq />
    </>
  )
}

/* ———————— Coleções ———————— */
function Collections() {
  const [preview, setPreview] = useState(0)

  return (
    <section id="colecoes" className="section collections" aria-labelledby="colecoes-title">
      <div className="wrap">
        <div className="sec-rule">
          <b>Coleções</b>
          <span>3 linhas e {familyCollections.length} famílias olfativas</span>
        </div>
        <div className="col-head">
          <TextReveal as="h2" id="colecoes-title" className="h-section col-title" text="Comece pelo que você já sabe sobre si." />
          <p className="lead">Depois, deixe-se surpreender por uma família que você ainda não usou.</p>
        </div>

        <div className="col-index">
          <ul className="col-index-list">
            {genderCollections.map((c, i) => (
              <li key={c.id}>
                <Link
                  to={collectionHref(c.query)}
                  className={`col-index-item ${preview === i ? 'is-active' : ''}`}
                  onPointerEnter={() => setPreview(i)}
                  onFocus={() => setPreview(i)}
                >
                  <span className="col-index-name display">{c.title}</span>
                  <span className="col-index-line">{c.line}</span>
                  <span className="col-index-count">
                    {countFor(c.query)} perfumes <ArrowUpRight aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="col-index-preview" aria-hidden="true">
            {genderCollections.map((c, i) => (
              <img key={c.id} src={c.image} alt="" loading="lazy" className={preview === i ? 'is-active' : ''} />
            ))}
            <span className="col-index-caption">{genderCollections[preview].title}</span>
          </div>
        </div>

        {/* mosaico arquitetônico: áreas explícitas, contorno externo retangular */}
        <div className="col-mosaic">
          {familyCollections.map((c, i) => (
            <Link key={c.id} to={collectionHref(c.query)} className={`col-tile col-tile-${'abcde'[i]}`}>
              <ImageReveal src={c.image} alt="" className="col-tile-img parallax" from={i % 2 ? 'left' : 'bottom'} />
              <span className="col-tile-text">
                <span className="col-tile-count">{countFor(c.query)} perfumes</span>
                <span className="display col-tile-name">{c.title}</span>
                <span className="col-tile-line">
                  {c.line} <ArrowRight aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ———————— Vitrine em destaque ———————— */
function Vitrine() {
  return (
    <section className="section vitrine" aria-labelledby="destaques-title">
      <div className="wrap">
        <div className="sec-rule">
          <b>Em destaque</b>
          <span>Preços demonstrativos</span>
        </div>
        <div className="vt-head">
          <TextReveal as="h2" id="destaques-title" className="h-section" text="Quatro frascos, quatro temperaturas." />
          <Link to="/perfumes" className="btn btn-ghost">
            Ver todo o catálogo
          </Link>
        </div>
        <div className="vt-grid">
          {highlights.map((p) => (
            <ProductCard key={p.slug} product={p} context="hl" />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ———————— Fragrance Finder (chamada) ———————— */
function FinderTeaser() {
  return (
    <section className="finder-teaser" aria-labelledby="finder-teaser-title">
      <div className="wrap ft-grid">
        <div className="ft-images" aria-hidden="true">
          <span className="halo-ring ft-ring" />
          <ImageReveal src={ed('le-beau-paradise-garden')} alt="" className="ft-img ft-img-a parallax" />
          <ImageReveal src={ed('bright-crystal')} alt="" className="ft-img ft-img-b" from="right" />
        </div>
        <div className="ft-copy">
          <p className="ft-kicker">Fragrance Finder, cinco perguntas</p>
          <TextReveal as="h2" id="finder-teaser-title" className="display ft-title" text="Descubra sua essência." />
          <p className="lead">Paisagens, momentos e aromas. No fim, três sugestões do catálogo, cada uma com o motivo da escolha.</p>
          <Magnetic>
            <Link to="/descubra" className="btn btn-solid">
              Começar o Finder <ArrowRight className="btn-arrow" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

/* ———————— Nossa essência: manifesto visual ———————— */
const STORY = [
  { k: 'Memória', line: 'O olfato é o sentido mais próximo da lembrança.', img: 'creed-carmina', inset: 'black-opium', tone: '#5a1219' },
  { k: 'Identidade', line: 'Um mesmo perfume nunca soa igual em duas peles.', img: 'good-girl', inset: 'essencial-oud', tone: '#15224f' },
  { k: 'Presença', line: 'Fica no ar depois que você vai embora.', img: 'green-stravaganza', inset: 'original-vetiver', tone: '#14361f' },
]

function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (st) => setStep(Math.min(STORY.length - 1, Math.floor(st.progress * STORY.length * 0.999))),
        },
      })
      STORY.forEach((s, i) => {
        const at = i
        if (i > 0) {
          tl.fromTo(`.mf-photo-${i}`, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut' }, at - 0.35)
          tl.fromTo(`.mf-photo-${i} img`, { scale: 1.25 }, { scale: 1.04, duration: 0.9 }, at - 0.35)
          tl.to(`.mf-photo-${i - 1} img`, { scale: 0.96, duration: 0.6 }, at - 0.35)
          tl.fromTo(`.mf-inset-${i}`, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, at - 0.15)
          tl.to(`.mf-inset-${i - 1}`, { yPercent: -40, opacity: 0, duration: 0.4 }, at - 0.35)
          tl.to(el, { '--mf-tone': s.tone, duration: 0.6 }, at - 0.35)
        }
        tl.to(`.mf-inset-${i} img`, { yPercent: -8, duration: 1 }, at)
      })
      tl.to({}, { duration: 0.4 })
      return () => setStep(0)
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="essencia" className="mf" ref={ref} data-tone="dark" aria-labelledby="essencia-title" style={{ '--mf-tone': STORY[0].tone } as CSSProperties}>
      <div className="mf-sticky">
        <div className="mf-bg" aria-hidden="true" />
        <div className="wrap mf-grid">
          <div className="mf-copy">
            <p className="mf-kicker">Nossa essência</p>
            <TextReveal as="h2" id="essencia-title" className="display mf-title" text="Toda fragrância conta uma história." />
            <ol className="mf-steps">
              {STORY.map((s, i) => (
                <li key={s.k} className={`mf-step ${step === i ? 'is-active' : ''}`}>
                  <span className="mf-step-k display">{s.k}</span>
                  <span className="mf-step-line">{s.line}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mf-visual" aria-hidden="true">
            <span className="halo-ring mf-ring" />
            {STORY.map((s, i) => (
              <figure key={s.img} className={`mf-photo mf-photo-${i}`}>
                <img src={ed(s.img)} alt="" loading="lazy" decoding="async" />
                <figcaption className="mf-photo-k display">{s.k}</figcaption>
              </figure>
            ))}
            {STORY.map((s, i) => (
              <figure key={s.inset} className={`mf-inset mf-inset-${i}`}>
                <img src={ed(s.inset, 480)} alt="" loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ———————— Seleção ———————— */
function Selection() {
  return (
    <section className="section selection" aria-labelledby="selecao-title">
      <div className="wrap">
        <div className="sec-rule">
          <b>Seleção NIMBO</b>
          <span>
            {selection.length} de {products.length} perfumes
          </span>
        </div>
        <div className="vt-head">
          <TextReveal as="h2" id="selecao-title" className="h-section" text="Frescos, florais, ambarados." />
          <Link to="/perfumes" className="btn btn-line">
            Ver os {products.length} perfumes <ArrowRight className="btn-arrow" />
          </Link>
        </div>
        <div className="sel-grid">
          {selection.map((p) => (
            <ProductCard key={p.slug} product={p} context="sel" />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ———————— FAQ ———————— */
function Faq() {
  return (
    <section id="perguntas" className="section faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div className="faq-side">
          <TextReveal as="h2" id="faq-title" className="h-section" text="Perguntas frequentes" />
          <p className="meta faq-note">Tudo o que este protótipo faz, e o que ele não faz.</p>
        </div>
        <div className="faq-list">
          {faq.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>
                <span>{f.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
