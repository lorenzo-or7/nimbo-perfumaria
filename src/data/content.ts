import type { Family, Gender } from './products'

export interface Collection {
  id: string
  title: string
  line: string
  image: string
  query: { gender?: Gender; family?: Family }
}

export const collections: Collection[] = [
  { id: 'masculino', title: 'Masculino', line: 'Madeiras, especiarias, presença.', image: `${import.meta.env.BASE_URL}assets/perfumes/editorial/sauvage-parfum-960.webp`, query: { gender: 'masculino' } },
  { id: 'feminino', title: 'Feminino', line: 'Flores brancas e baunilha.', image: `${import.meta.env.BASE_URL}assets/perfumes/editorial/divine-960.webp`, query: { gender: 'feminino' } },
  { id: 'unissex', title: 'Unissex', line: 'Para qualquer pele.', image: `${import.meta.env.BASE_URL}assets/perfumes/editorial/vibrato-960.webp`, query: { gender: 'unissex' } },
  { id: 'frescos', title: 'Frescos', line: 'Água, folhas, ar.', image: `${import.meta.env.BASE_URL}assets/perfumes/editorial/kaiak-960.webp`, query: { family: 'fresco' } },
  { id: 'florais', title: 'Florais', line: 'Pétalas em várias luzes.', image: `${import.meta.env.BASE_URL}assets/perfumes/editorial/bright-crystal-960.webp`, query: { family: 'floral' } },
  { id: 'amadeirados', title: 'Amadeirados', line: 'Cedro, vetiver, oud.', image: `${import.meta.env.BASE_URL}assets/perfumes/editorial/original-vetiver-960.webp`, query: { family: 'amadeirado' } },
  { id: 'ambarados', title: 'Ambarados', line: 'Calor que fica na pele.', image: `${import.meta.env.BASE_URL}assets/perfumes/editorial/red-tobacco-960.webp`, query: { family: 'ambarado' } },
  { id: 'gourmand', title: 'Gourmand', line: 'Café, cacau, mel.', image: `${import.meta.env.BASE_URL}assets/perfumes/editorial/black-opium-960.webp`, query: { family: 'gourmand' } },
]

export const faq = [
  {
    q: 'A NIMBO vende de verdade?',
    a: 'Não. A NIMBO é uma marca fictícia criada pela Or7 como protótipo de portfólio. O carrinho e a finalização funcionam apenas como demonstração: nenhuma compra é processada e nenhuma cobrança é feita.',
  },
  {
    q: 'Os perfumes são reais?',
    a: 'Sim. Todos os produtos do catálogo são fragrâncias reais das marcas indicadas. As marcas pertencem aos seus fabricantes, e a NIMBO não declara parceria com nenhuma delas.',
  },
  {
    q: 'De onde vêm os preços?',
    a: 'Os preços e volumes exibidos são demonstrativos, criados para o protótipo. Não são ofertas e não refletem valores praticados no mercado.',
  },
  {
    q: 'Como as notas olfativas foram definidas?',
    a: 'As pirâmides reúnem as notas divulgadas para cada fragrância. Quando não foi possível confirmar a composição, a ficha avisa e não lista notas.',
  },
  {
    q: 'O que é concentração?',
    a: 'É a proporção de essência na fórmula. Em geral, colônias são mais leves, eau de toilette fica no meio, e eau de parfum e parfum são mais densos e duradouros. A percepção varia de pele para pele.',
  },
  {
    q: 'Meus favoritos e meu carrinho ficam salvos?',
    a: 'Ficam apenas neste navegador, por armazenamento local. Nada é enviado a servidores, e você pode limpar tudo a qualquer momento.',
  },
]

/* ——— Fragrance Finder ——— */

export interface FinderOption {
  id: string
  label: string
  hint: string
  image: string
  /** pesos aplicados às famílias */
  families?: Partial<Record<Family, number>>
  gender?: Gender | 'todos'
  intensity?: number
}

export interface FinderStep {
  id: 'estilo' | 'familia' | 'intensidade' | 'ocasiao' | 'aroma'
  title: string
  lead: string
  options: FinderOption[]
}

const img = (slug: string) => `${import.meta.env.BASE_URL}assets/perfumes/editorial/${slug}-480.webp`

export const finderSteps: FinderStep[] = [
  {
    id: 'estilo',
    title: 'Para quem é a fragrância?',
    lead: 'Isso só organiza as sugestões. Perfume não tem regra.',
    options: [
      { id: 'masc', label: 'Linha masculina', hint: 'Perfumes lançados como masculinos', image: img('myslf'), gender: 'masculino' },
      { id: 'fem', label: 'Linha feminina', hint: 'Perfumes lançados como femininos', image: img('divine'), gender: 'feminino' },
      { id: 'todos', label: 'Sem preferência', hint: 'Mostre tudo, inclusive unissex', image: img('vibrato'), gender: 'todos' },
    ],
  },
  {
    id: 'familia',
    title: 'Qual paisagem te atrai?',
    lead: 'Escolha a imagem que mais se parece com você.',
    options: [
      { id: 'agua', label: 'Água e vento', hint: 'Frescos e cítricos', image: img('kaiak'), families: { fresco: 3, citrico: 2 } },
      { id: 'jardim', label: 'Um jardim em flor', hint: 'Florais e frutados', image: img('bright-crystal'), families: { floral: 3, frutado: 1 } },
      { id: 'floresta', label: 'Madeira e terra', hint: 'Amadeirados', image: img('original-vetiver'), families: { amadeirado: 3, aromatico: 1 } },
      { id: 'brasa', label: 'Brasa e especiarias', hint: 'Ambarados', image: img('red-tobacco'), families: { ambarado: 3, gourmand: 1 } },
    ],
  },
  {
    id: 'intensidade',
    title: 'Quanto você quer que ela apareça?',
    lead: 'Baseado na concentração declarada de cada perfume.',
    options: [
      { id: 'leve', label: 'Perto da pele', hint: 'Colônias e eau de toilette', image: img('silver-mountain-water'), intensity: 2 },
      { id: 'media', label: 'Presente', hint: 'Eau de parfum', image: img('libre'), intensity: 3 },
      { id: 'forte', label: 'Marcante', hint: 'Parfum e versões intensas', image: img('le-male-elixir'), intensity: 4 },
    ],
  },
  {
    id: 'ocasiao',
    title: 'Quando você vai usar?',
    lead: 'A ocasião ajusta o peso de cada família olfativa.',
    options: [
      { id: 'dia', label: 'Durante o dia', hint: 'Trabalho, rua, calor', image: img('versace-eros'), families: { fresco: 2, citrico: 2, aromatico: 1 } },
      { id: 'noite', label: 'À noite', hint: 'Jantares, encontros', image: img('creed-carmina'), families: { ambarado: 2, gourmand: 2, amadeirado: 1 } },
      { id: 'sempre', label: 'Em qualquer momento', hint: 'Uma assinatura diária', image: img('y-edp'), families: { aromatico: 1, floral: 1, amadeirado: 1 } },
    ],
  },
  {
    id: 'aroma',
    title: 'Qual destes aromas te chama?',
    lead: 'Último passo. Escolha um acorde.',
    options: [
      { id: 'cafe', label: 'Café e baunilha', hint: 'Gourmand', image: img('black-opium'), families: { gourmand: 3 } },
      { id: 'citrus', label: 'Bergamota e chá', hint: 'Cítrico', image: img('silver-mountain-water'), families: { citrico: 3 } },
      { id: 'jasmim', label: 'Jasmim e rosa', hint: 'Floral', image: img('donna-born-in-roma'), families: { floral: 3 } },
      { id: 'tabaco', label: 'Tabaco e couro', hint: 'Amadeirado e ambarado', image: img('1-million'), families: { amadeirado: 2, ambarado: 2 } },
      { id: 'verde', label: 'Folhas e lavanda', hint: 'Aromático', image: img('green-irish-tweed'), families: { aromatico: 3 } },
    ],
  },
]
