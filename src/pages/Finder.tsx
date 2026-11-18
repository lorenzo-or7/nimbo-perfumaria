import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { finderSteps, type FinderOption } from '../data/content'
import { FAMILY_LABEL, intensityOf, products, type Family, type Product } from '../data/products'
import { ProductCard } from '../components/ProductCard'
import './finder.css'

/** Palavras procuradas nas notas confirmadas para o último passo. */
const AROMA_NOTES: Record<string, string[]> = {
  cafe: ['Café', 'Baunilha', 'Cacau', 'Fava tonka'],
  citrus: ['Bergamota', 'Chá', 'Limão', 'Mandarina', 'Toranja', 'Tangerina'],
  jasmim: ['Jasmim', 'Rosa', 'Peônia', 'Tuberosa'],
  tabaco: ['Tabaco', 'Couro', 'Oud', 'Cedro'],
  verde: ['Lavanda', 'Folha', 'Sálvia', 'Menta', 'Hortelã', 'Notas verdes'],
}

const INTENSITY_TEXT: Record<number, string> = {
  1: 'colônia leve',
  2: 'eau de toilette',
  3: 'concentração de eau de parfum',
  4: 'concentração de parfum',
}

type Answers = Partial<Record<(typeof finderSteps)[number]['id'], FinderOption>>

function recommend(a: Answers) {
  const weights: Partial<Record<Family, number>> = {}
  for (const k of ['familia', 'ocasiao', 'aroma'] as const) {
    Object.entries(a[k]?.families ?? {}).forEach(([f, w]) => (weights[f as Family] = (weights[f as Family] ?? 0) + (w ?? 0)))
  }
  const gender = a.estilo?.gender
  const target = a.intensidade?.intensity ?? 3
  const aromaWords = AROMA_NOTES[a.aroma?.id ?? ''] ?? []

  return products
    .filter((p) => p.families.length > 0 && (gender === 'todos' || !gender || p.gender === gender || p.gender === 'unissex'))
    .map((p) => {
      const notes = p.notes ? Object.values(p.notes).flat() : []
      const matchedNotes = notes.filter((n) => aromaWords.some((w) => n.toLowerCase().includes(w.toLowerCase())))
      const fam = p.families.reduce((s, f) => s + (weights[f] ?? 0), 0)
      const pi = intensityOf(p)
      const inten = pi ? 3 - Math.abs(pi - target) * 1.5 : 0
      return { p, score: fam + inten + matchedNotes.length * 1.5, matchedNotes, pi }
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map(({ p, matchedNotes, pi }) => ({ p, reasons: reasonsFor(p, a, weights, matchedNotes, pi, target) }))
}

function reasonsFor(p: Product, a: Answers, weights: Partial<Record<Family, number>>, matched: string[], pi: number | null, target: number) {
  const r: string[] = []
  const topFam = [...p.families].sort((x, y) => (weights[y] ?? 0) - (weights[x] ?? 0))[0]
  if (topFam && (weights[topFam] ?? 0) > 0) r.push(`É ${FAMILY_LABEL[topFam].toLowerCase()}, em sintonia com ${a.familia?.label.toLowerCase() ?? 'sua escolha'}.`)
  if (matched.length) r.push(`Tem ${matched.slice(0, 2).join(' e ').toLowerCase()} entre as notas.`)
  if (pi && Math.abs(pi - target) <= 0.5) r.push(`A ${INTENSITY_TEXT[pi]} combina com a presença que você pediu.`)
  else if (pi) r.push(`Fica ${pi < target ? 'mais discreto' : 'mais marcante'} do que o pedido, mas é o mais próximo no restante.`)
  return r.slice(0, 2)
}

export default function Finder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [dir, setDir] = useState<1 | -1>(1)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const done = step >= finderSteps.length
  const results = useMemo(() => (done ? recommend(answers) : []), [done, answers])
  const current = finderSteps[step]

  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus())
  const choose = (o: FinderOption) => {
    setAnswers((a) => ({ ...a, [current.id]: o }))
    setDir(1)
    setStep((s) => s + 1)
    focusHeading()
  }
  const back = () => {
    setDir(-1)
    setStep((s) => Math.max(0, s - 1))
    focusHeading()
  }
  const restart = () => {
    setAnswers({})
    setDir(-1)
    setStep(0)
    focusHeading()
  }

  return (
    <div className="finder page-enter">
      <div className="wrap">
        <header className="fd-head">
          <p className="fd-kicker">Descubra sua essência</p>
          <div className="fd-progress" role="progressbar" aria-label="Progresso do questionário" aria-valuemin={0} aria-valuemax={finderSteps.length} aria-valuenow={Math.min(step, finderSteps.length)}>
            {finderSteps.map((s, i) => (
              <span key={s.id} className={i < step ? 'is-done' : i === step ? 'is-current' : ''} />
            ))}
          </div>
          <p className="meta">{done ? 'Resultado' : `Pergunta ${step + 1} de ${finderSteps.length}`}</p>
        </header>

        {!done ? (
          <section key={current.id} className={`fd-step fd-dir-${dir}`} aria-labelledby="fd-q">
            <div className="fd-q-wrap">
              <h1 id="fd-q" ref={headingRef} tabIndex={-1} className="display fd-q">
                {current.title}
              </h1>
              <p className="lead">{current.lead}</p>
            </div>
            <div className={`fd-options fd-options-${current.options.length}`} role="list">
              {current.options.map((o, i) => (
                <button
                  key={o.id}
                  role="listitem"
                  className={`fd-opt ${answers[current.id]?.id === o.id ? 'is-picked' : ''}`}
                  style={{ animationDelay: `${i * 70}ms` }}
                  onClick={() => choose(o)}
                >
                  <span className="fd-opt-img">
                    <img src={o.image} alt="" loading="lazy" />
                  </span>
                  <span className="fd-opt-label display">{o.label}</span>
                  <span className="fd-opt-hint">{o.hint}</span>
                </button>
              ))}
            </div>
            <div className="fd-nav">
              <button className="btn btn-line" onClick={back} disabled={step === 0}>
                <ArrowLeft size={16} /> Anterior
              </button>
              {answers[current.id] && (
                <button className="btn btn-ghost" onClick={() => choose(answers[current.id]!)}>
                  Manter “{answers[current.id]!.label}” e seguir
                </button>
              )}
            </div>
          </section>
        ) : (
          <section className="fd-result" aria-labelledby="fd-res">
            <div className="fd-q-wrap">
              <h1 id="fd-res" ref={headingRef} tabIndex={-1} className="display fd-q">
                Três caminhos para você.
              </h1>
              <p className="lead">
                Sugestões calculadas a partir das famílias olfativas, da concentração e das notas cadastradas de cada perfume. É um ponto de partida, não um veredito: a pele sempre tem a palavra final.
              </p>
            </div>
            <ol className="fd-results">
              {results.map(({ p, reasons }) => (
                <li key={p.slug} className="fd-res-item">
                  <ProductCard product={p} context="finder" />
                  <ul className="fd-reasons">
                    {reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <div className="fd-nav">
              <button className="btn btn-line" onClick={back}>
                <ArrowLeft size={16} /> Rever última resposta
              </button>
              <button className="btn btn-ghost" onClick={restart}>
                Recomeçar
              </button>
              <Link to="/perfumes" className="btn btn-solid">
                Ver catálogo completo
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
