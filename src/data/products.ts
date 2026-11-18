/**
 * Catálogo central da NIMBO.
 *
 * Regras de dados:
 * - Produtos identificados visualmente pelos rótulos das fotografias fornecidas.
 * - Notas olfativas só aparecem quando confirmadas em fontes do fabricante ou de
 *   varejistas/bases públicas consistentes entre si. Quando não houve confirmação,
 *   `notes` fica `null` e a interface informa isso.
 * - Preços e volumes são DEMONSTRATIVOS (protótipo). Não representam ofertas.
 */

export type Gender = 'masculino' | 'feminino' | 'unissex'
export type Family =
  | 'fresco'
  | 'citrico'
  | 'aromatico'
  | 'floral'
  | 'frutado'
  | 'amadeirado'
  | 'ambarado'
  | 'gourmand'

export interface Notes {
  top: string[]
  heart: string[]
  base: string[]
}

export interface Volume {
  ml: number
  price: number
}

export interface Atmosphere {
  /** cor de fundo no tema claro */
  light: string
  /** cor de fundo no tema escuro */
  dark: string
  /** descrição artística curta */
  label: string
}

export interface Product {
  id: string
  slug: string
  brand: string
  name: string
  concentration: string | null
  gender: Gender
  families: Family[]
  familyLabel: string | null
  notes: Notes | null
  description: string
  volumes: Volume[]
  atmosphere: Atmosphere
  images: {
    /** recorte transparente (apenas os seis da hero) */
    cutout?: { src: string; srcLarge: string; ratio: number }
    /** fotografia editorial principal */
    editorial: { src: string; srcLarge: string; ratio: number }
  }
  featured?: boolean
}

export const FAMILY_LABEL: Record<Family, string> = {
  fresco: 'Fresco',
  citrico: 'Cítrico',
  aromatico: 'Aromático',
  floral: 'Floral',
  frutado: 'Frutado',
  amadeirado: 'Amadeirado',
  ambarado: 'Ambarado',
  gourmand: 'Gourmand',
}

export const GENDER_LABEL: Record<Gender, string> = {
  masculino: 'Masculino',
  feminino: 'Feminino',
  unissex: 'Unissex',
}

const ed = (slug: string, w: number, h: number) => ({
  src: `${import.meta.env.BASE_URL}assets/perfumes/editorial/${slug}-480.webp`,
  srcLarge: `${import.meta.env.BASE_URL}assets/perfumes/editorial/${slug}-960.webp`,
  ratio: w / h,
})
const cut = (slug: string, w: number, h: number) => ({
  src: `${import.meta.env.BASE_URL}assets/perfumes/hero/${slug}-420.webp`,
  srcLarge: `${import.meta.env.BASE_URL}assets/perfumes/hero/${slug}-840.webp`,
  ratio: w / h,
})

const neutral = (light: string, dark: string, label: string): Atmosphere => ({ light, dark, label })

export const products: Product[] = [
  // ——— Protagonistas da hero ———
  {
    id: 'creed-aventus',
    slug: 'creed-aventus',
    brand: 'Creed',
    name: 'Aventus',
    concentration: 'Eau de Parfum',
    gender: 'masculino',
    families: ['frutado', 'amadeirado'],
    familyLabel: 'Chipre frutado',
    notes: {
      top: ['Abacaxi', 'Bergamota', 'Groselha-negra', 'Maçã'],
      heart: ['Bétula', 'Patchouli', 'Jasmim', 'Rosa'],
      base: ['Almíscar', 'Musgo de carvalho', 'Âmbar-gris', 'Baunilha'],
    },
    description:
      'Abacaxi luminoso sobre bétula defumada. Um clássico moderno de presença firme, que abre frutado e assenta em musgo e almíscar.',
    volumes: [
      { ml: 50, price: 2190 },
      { ml: 100, price: 3290 },
    ],
    atmosphere: neutral('#E4E4E1', '#1C1E21', 'Grafite e prata'),
    images: { cutout: cut('creed-aventus', 663, 1202), editorial: ed('creed-aventus', 960, 1200) },
    featured: true,
  },
  {
    id: 'versace-eros-flame',
    slug: 'versace-eros-flame',
    brand: 'Versace',
    name: 'Eros Flame',
    concentration: 'Eau de Parfum',
    gender: 'masculino',
    families: ['amadeirado', 'aromatico', 'citrico'],
    familyLabel: 'Amadeirado especiado',
    notes: {
      top: ['Limão', 'Tangerina', 'Laranja amarga', 'Pimenta-preta', 'Alecrim'],
      heart: ['Pimenta', 'Gerânio', 'Rosa'],
      base: ['Cedro', 'Patchouli', 'Vetiver', 'Musgo de carvalho', 'Sândalo', 'Fava tonka', 'Baunilha'],
    },
    description:
      'Cítricos acesos e pimenta-preta abrindo caminho para um fundo quente de tonka e madeiras. Intenso sem perder o brilho.',
    volumes: [
      { ml: 50, price: 489 },
      { ml: 100, price: 689 },
    ],
    atmosphere: neutral('#EED6CF', '#2B0B0C', 'Vermelho profundo'),
    images: { cutout: cut('versace-eros-flame', 431, 668), editorial: ed('versace-eros-flame', 960, 1172) },
    featured: true,
  },
  {
    id: 'good-girl',
    slug: 'good-girl',
    brand: 'Carolina Herrera',
    name: 'Good Girl',
    concentration: 'Eau de Parfum',
    gender: 'feminino',
    families: ['ambarado', 'floral', 'gourmand'],
    familyLabel: 'Ambarado floral',
    notes: {
      top: ['Amêndoa', 'Café'],
      heart: ['Tuberosa', 'Jasmim sambac'],
      base: ['Fava tonka', 'Cacau'],
    },
    description:
      'O contraste entre a luz da tuberosa e a sombra do cacau. Um floral noturno, doce na medida, inconfundível desde o frasco.',
    volumes: [
      { ml: 30, price: 429 },
      { ml: 50, price: 579 },
      { ml: 80, price: 749 },
    ],
    atmosphere: neutral('#D8DDEA', '#0B1126', 'Azul noturno'),
    images: { cutout: cut('good-girl', 551, 1115), editorial: ed('good-girl', 960, 1200) },
    featured: true,
  },
  {
    id: 'le-male-elixir',
    slug: 'le-male-elixir',
    brand: 'Jean Paul Gaultier',
    name: 'Le Male Elixir',
    concentration: 'Parfum',
    gender: 'masculino',
    families: ['ambarado', 'aromatico', 'gourmand'],
    familyLabel: 'Ambarado fougère',
    notes: {
      top: ['Lavanda', 'Menta'],
      heart: ['Baunilha', 'Benjoim'],
      base: ['Mel', 'Fava tonka', 'Tabaco'],
    },
    description:
      'Lavanda e menta envolvidas por mel e tabaco. A versão mais densa e envolvente do torso dourado de Gaultier.',
    volumes: [
      { ml: 75, price: 749 },
      { ml: 125, price: 999 },
    ],
    atmosphere: neutral('#EFE0C3', '#24170A', 'Dourado e âmbar'),
    images: { cutout: cut('le-male-elixir', 554, 1280), editorial: ed('le-male-elixir', 960, 1200) },
    featured: true,
  },
  {
    id: 'essencial-oud',
    slug: 'essencial-oud',
    brand: 'Natura',
    name: 'Essencial Oud',
    concentration: 'Deo Parfum',
    gender: 'masculino',
    families: ['amadeirado'],
    familyLabel: 'Amadeirado',
    notes: {
      top: ['Bergamota', 'Cardamomo', 'Açafrão'],
      heart: ['Canela', 'Praliné', 'Gerânio'],
      base: ['Oud', 'Copaíba'],
    },
    description:
      'Oud encontra a copaíba, ingrediente da biodiversidade brasileira. Uma madeira densa e noturna, com especiarias na abertura.',
    volumes: [{ ml: 100, price: 319 }],
    atmosphere: neutral('#D3DDE6', '#061624', 'Azul profundo'),
    images: { cutout: cut('essencial-oud', 593, 1050), editorial: ed('essencial-oud', 960, 1200) },
    featured: true,
  },
  {
    id: 'donna-born-in-roma',
    slug: 'donna-born-in-roma',
    brand: 'Valentino',
    name: 'Donna Born in Roma',
    concentration: 'Eau de Parfum',
    gender: 'feminino',
    families: ['floral', 'ambarado'],
    familyLabel: 'Floral ambarado',
    notes: {
      top: ['Groselha-negra', 'Pimenta-rosa', 'Bergamota'],
      heart: ['Jasmim sambac', 'Chá de jasmim'],
      base: ['Baunilha bourbon', 'Cashmeran', 'Guaiaco'],
    },
    description:
      'Jasmim em três versões sobre baunilha bourbon e madeiras macias. Romântico e contemporâneo, como as tachas do frasco.',
    volumes: [
      { ml: 30, price: 439 },
      { ml: 50, price: 619 },
      { ml: 100, price: 899 },
    ],
    atmosphere: neutral('#F1DEDE', '#2A1519', 'Rosa suave'),
    images: { cutout: cut('donna-born-in-roma', 873, 1261), editorial: ed('donna-born-in-roma', 960, 1200) },
    featured: true,
  },

  // ——— Catálogo ———
  {
    id: 'creed-carmina',
    slug: 'creed-carmina',
    brand: 'Creed',
    name: 'Carmina',
    concentration: 'Eau de Parfum',
    gender: 'feminino',
    families: ['floral', 'ambarado', 'frutado'],
    familyLabel: 'Floral ambarado',
    notes: {
      top: ['Cereja-negra', 'Açafrão', 'Pimenta-rosa'],
      heart: ['Rosa', 'Peônia'],
      base: ['Âmbar', 'Almíscar'],
    },
    description: 'Rosa e cereja-negra aquecidas por açafrão. Um floral carmim, profundo e luminoso ao mesmo tempo.',
    volumes: [{ ml: 75, price: 3190 }],
    atmosphere: neutral('#EFD9DE', '#2A0A16', 'Carmim'),
    images: { editorial: ed('creed-carmina', 960, 1200) },
  },
  {
    id: 'green-irish-tweed',
    slug: 'green-irish-tweed',
    brand: 'Creed',
    name: 'Green Irish Tweed',
    concentration: 'Eau de Parfum',
    gender: 'masculino',
    families: ['aromatico', 'fresco'],
    familyLabel: 'Aromático verde',
    notes: {
      top: ['Verbena-limão', 'Hortelã-pimenta'],
      heart: ['Íris', 'Folha de violeta'],
      base: ['Âmbar-gris', 'Sândalo'],
    },
    description: 'Folhas de violeta e íris sobre sândalo. Verde, limpo e elegante, com o frescor de um campo depois da chuva.',
    volumes: [
      { ml: 50, price: 2090 },
      { ml: 100, price: 2990 },
    ],
    atmosphere: neutral('#DCE5DD', '#0A1A12', 'Verde floresta'),
    images: { editorial: ed('green-irish-tweed', 960, 1200) },
  },
  {
    id: 'silver-mountain-water',
    slug: 'silver-mountain-water',
    brand: 'Creed',
    name: 'Silver Mountain Water',
    concentration: 'Eau de Parfum',
    gender: 'unissex',
    families: ['fresco', 'citrico'],
    familyLabel: 'Cítrico aromático',
    notes: {
      top: ['Bergamota', 'Mandarina'],
      heart: ['Chá verde', 'Groselha-negra'],
      base: ['Almíscar', 'Sândalo'],
    },
    description: 'Chá verde e groselha-negra sobre almíscar. Frio, cristalino e sereno, como ar de montanha.',
    volumes: [
      { ml: 50, price: 2090 },
      { ml: 100, price: 2990 },
    ],
    atmosphere: neutral('#E3E6E8', '#15181B', 'Prata'),
    images: { editorial: ed('silver-mountain-water', 960, 1200) },
  },
  {
    id: 'original-vetiver',
    slug: 'original-vetiver',
    brand: 'Creed',
    name: 'Original Vetiver',
    concentration: 'Eau de Parfum',
    gender: 'unissex',
    families: ['fresco', 'amadeirado', 'citrico'],
    familyLabel: 'Cítrico amadeirado',
    notes: {
      top: ['Bergamota', 'Mandarina'],
      heart: ['Vetiver'],
      base: ['Sândalo', 'Almíscar'],
    },
    description: 'Vetiver limpo e cítricos verdes. Um amadeirado arejado, de uso diário e acabamento impecável.',
    volumes: [{ ml: 100, price: 2890 }],
    atmosphere: neutral('#DFE7D8', '#0E1A0B', 'Musgo'),
    images: { editorial: ed('original-vetiver', 960, 1440) },
  },
  {
    id: 'queen-of-silk',
    slug: 'queen-of-silk',
    brand: 'Creed',
    name: 'Queen of Silk',
    concentration: null,
    gender: 'feminino',
    families: [],
    familyLabel: null,
    notes: null,
    description: 'Frasco violeta da coleção feminina da Creed. A ficha olfativa completa ainda não foi confirmada para este protótipo.',
    volumes: [{ ml: 75, price: 3290 }],
    atmosphere: neutral('#E4DCEC', '#1A0F26', 'Violeta'),
    images: { editorial: ed('queen-of-silk', 960, 1200) },
  },
  {
    id: 'versace-eros',
    slug: 'versace-eros',
    brand: 'Versace',
    name: 'Eros',
    concentration: 'Eau de Toilette',
    gender: 'masculino',
    families: ['aromatico', 'fresco', 'gourmand'],
    familyLabel: 'Aromático fougère',
    notes: {
      top: ['Hortelã', 'Maçã verde', 'Limão'],
      heart: ['Fava tonka', 'Ambroxan', 'Gerânio'],
      base: ['Baunilha', 'Vetiver', 'Musgo de carvalho', 'Cedro'],
    },
    description: 'Hortelã gelada e maçã verde sobre baunilha. Fresco na saída, magnético no fundo.',
    volumes: [
      { ml: 50, price: 399 },
      { ml: 100, price: 569 },
    ],
    atmosphere: neutral('#D2E6E8', '#05202A', 'Turquesa'),
    images: { editorial: ed('versace-eros', 960, 1200) },
  },
  {
    id: '212-vip-black',
    slug: '212-vip-black',
    brand: 'Carolina Herrera',
    name: '212 VIP Black',
    concentration: 'Eau de Parfum',
    gender: 'masculino',
    families: ['aromatico', 'gourmand'],
    familyLabel: 'Aromático fougère',
    notes: {
      top: ['Absinto', 'Anis', 'Erva-doce'],
      heart: ['Lavanda'],
      base: ['Baunilha negra', 'Almíscar'],
    },
    description: 'Absinto e lavanda sobre baunilha negra. Noturno, polido e direto.',
    volumes: [
      { ml: 50, price: 449 },
      { ml: 100, price: 629 },
    ],
    atmosphere: neutral('#E2E2E2', '#121212', 'Mármore escuro'),
    images: { editorial: ed('212-vip-black', 960, 1200) },
  },
  {
    id: 'black-opium',
    slug: 'black-opium',
    brand: 'Yves Saint Laurent',
    name: 'Black Opium',
    concentration: 'Eau de Parfum',
    gender: 'feminino',
    families: ['gourmand', 'ambarado'],
    familyLabel: 'Ambarado baunilha',
    notes: {
      top: ['Pera', 'Pimenta-rosa', 'Flor de laranjeira'],
      heart: ['Café', 'Jasmim', 'Amêndoa amarga'],
      base: ['Baunilha', 'Patchouli', 'Cedro'],
    },
    description: 'Café preto e flores brancas sobre baunilha. Energia noturna com acabamento aveludado.',
    volumes: [
      { ml: 30, price: 469 },
      { ml: 50, price: 649 },
      { ml: 90, price: 899 },
    ],
    atmosphere: neutral('#F0DDD2', '#2A130B', 'Terracota'),
    images: { editorial: ed('black-opium', 960, 1200) },
  },
  {
    id: 'bright-crystal',
    slug: 'bright-crystal',
    brand: 'Versace',
    name: 'Bright Crystal',
    concentration: 'Eau de Toilette',
    gender: 'feminino',
    families: ['floral', 'frutado', 'fresco'],
    familyLabel: 'Floral frutado',
    notes: {
      top: ['Yuzu', 'Romã', 'Acorde gelado'],
      heart: ['Peônia', 'Magnólia', 'Lótus'],
      base: ['Almíscar', 'Mogno', 'Âmbar'],
    },
    description: 'Peônia e romã sobre almíscar claro. Leve, translúcido e solar.',
    volumes: [
      { ml: 30, price: 289 },
      { ml: 50, price: 389 },
      { ml: 90, price: 499 },
    ],
    atmosphere: neutral('#F1E2E8', '#22131A', 'Cristal rosado'),
    images: { editorial: ed('bright-crystal', 960, 1200) },
  },
  {
    id: 'bad-boy-cobalt',
    slug: 'bad-boy-cobalt',
    brand: 'Carolina Herrera',
    name: 'Bad Boy Cobalt',
    concentration: 'Eau de Parfum',
    gender: 'masculino',
    families: ['aromatico', 'amadeirado'],
    familyLabel: 'Aromático amadeirado',
    notes: {
      top: ['Pimenta-rosa', 'Lavanda'],
      heart: ['Gerânio', 'Ameixa'],
      base: ['Acorde de trufa', 'Vetiver', 'Cedro'],
    },
    description: 'Lavanda e pimenta-rosa com um fundo mineral de vetiver. O raio azul da linha Bad Boy.',
    volumes: [
      { ml: 50, price: 469 },
      { ml: 100, price: 659 },
    ],
    atmosphere: neutral('#D6DCEA', '#0A1028', 'Cobalto'),
    images: { editorial: ed('bad-boy-cobalt', 960, 1200) },
  },
  {
    id: 'y-edp',
    slug: 'y-edp',
    brand: 'Yves Saint Laurent',
    name: 'Y',
    concentration: 'Eau de Parfum',
    gender: 'masculino',
    families: ['aromatico', 'fresco'],
    familyLabel: 'Aromático fougère',
    notes: {
      top: ['Maçã', 'Gengibre', 'Bergamota'],
      heart: ['Sálvia', 'Zimbro', 'Gerânio'],
      base: ['Âmbar amadeirado', 'Fava tonka', 'Cedro', 'Vetiver', 'Olíbano'],
    },
    description: 'Maçã e sálvia sobre madeiras ambaradas. Fresco e estruturado, com o degradê azul do frasco.',
    volumes: [
      { ml: 60, price: 559 },
      { ml: 100, price: 759 },
    ],
    atmosphere: neutral('#D9DFE8', '#0B1220', 'Azul meia-noite'),
    images: { editorial: ed('y-edp', 960, 1200) },
  },
  {
    id: 'myslf',
    slug: 'myslf',
    brand: 'Yves Saint Laurent',
    name: 'MYSLF',
    concentration: 'Eau de Parfum',
    gender: 'masculino',
    families: ['floral', 'amadeirado'],
    familyLabel: 'Amadeirado floral',
    notes: {
      top: ['Bergamota'],
      heart: ['Flor de laranjeira'],
      base: ['Patchouli'],
    },
    description: 'Flor de laranjeira sobre madeiras e patchouli. Um floral masculino, sóbrio e luminoso.',
    volumes: [
      { ml: 60, price: 589 },
      { ml: 100, price: 799 },
    ],
    atmosphere: neutral('#E0E0DE', '#141414', 'Ônix'),
    images: { editorial: ed('myslf', 960, 1200) },
  },
  {
    id: 'libre',
    slug: 'libre',
    brand: 'Yves Saint Laurent',
    name: 'Libre',
    concentration: 'Eau de Parfum',
    gender: 'feminino',
    families: ['floral', 'ambarado', 'aromatico'],
    familyLabel: 'Floral lavanda',
    notes: {
      top: ['Lavanda', 'Mandarina', 'Groselha-negra', 'Petitgrain'],
      heart: ['Lavanda', 'Flor de laranjeira', 'Jasmim'],
      base: ['Baunilha de Madagascar', 'Almíscar', 'Cedro', 'Âmbar-gris'],
    },
    description: 'Lavanda francesa e flor de laranjeira marroquina. Um floral de contraste, livre e seguro.',
    volumes: [
      { ml: 30, price: 489 },
      { ml: 50, price: 679 },
      { ml: 90, price: 929 },
    ],
    atmosphere: neutral('#F1E2D6', '#26170D', 'Areia dourada'),
    images: { editorial: ed('libre', 960, 1200) },
  },
  {
    id: 'bad-boy',
    slug: 'bad-boy',
    brand: 'Carolina Herrera',
    name: 'Bad Boy',
    concentration: 'Eau de Toilette',
    gender: 'masculino',
    families: ['amadeirado', 'ambarado', 'gourmand'],
    familyLabel: 'Amadeirado ambarado',
    notes: {
      top: ['Pimenta-branca', 'Pimenta-preta', 'Bergamota'],
      heart: ['Sálvia', 'Cedro'],
      base: ['Fava tonka', 'Cacau', 'Âmbar'],
    },
    description: 'Pimentas e sálvia sobre cacau e tonka. Contraste de luz e sombra, como o raio do frasco.',
    volumes: [
      { ml: 50, price: 419 },
      { ml: 100, price: 599 },
    ],
    atmosphere: neutral('#ECE2CF', '#1C150A', 'Ônix e ouro'),
    images: { editorial: ed('bad-boy', 960, 1152) },
  },
  {
    id: 'homem-coragio',
    slug: 'homem-coragio',
    brand: 'Natura',
    name: 'Homem Coragio',
    concentration: 'Deo Parfum',
    gender: 'masculino',
    families: [],
    familyLabel: null,
    notes: null,
    description: 'Da linha Natura Homem. A pirâmide olfativa completa não foi confirmada para este protótipo.',
    volumes: [{ ml: 100, price: 229 }],
    atmosphere: neutral('#E1DEDB', '#161413', 'Carvão'),
    images: { editorial: ed('homem-coragio', 960, 1200) },
  },
  {
    id: 'sauvage-parfum',
    slug: 'sauvage-parfum',
    brand: 'Dior',
    name: 'Sauvage',
    concentration: 'Parfum',
    gender: 'masculino',
    families: ['amadeirado', 'ambarado', 'citrico'],
    familyLabel: 'Amadeirado ambarado',
    notes: {
      top: ['Bergamota', 'Mandarina'],
      heart: ['Sândalo', 'Elemi'],
      base: ['Baunilha', 'Olíbano'],
    },
    description: 'Cítricos e sândalo envolvidos por baunilha e olíbano. A leitura mais densa e redonda de Sauvage.',
    volumes: [
      { ml: 60, price: 749 },
      { ml: 100, price: 1049 },
    ],
    atmosphere: neutral('#D8DEE8', '#0B1220', 'Azul tempestade'),
    images: { editorial: ed('sauvage-parfum', 960, 1200) },
  },
  {
    id: 'god-of-fire',
    slug: 'god-of-fire',
    brand: 'Stéphane Humbert Lucas 777',
    name: 'God of Fire',
    concentration: null,
    gender: 'unissex',
    families: [],
    familyLabel: null,
    notes: null,
    description: 'Criação de Stéphane Humbert Lucas para a casa 777. A ficha olfativa não foi confirmada para este protótipo.',
    volumes: [{ ml: 50, price: 2690 }],
    atmosphere: neutral('#D7E6EA', '#061C24', 'Turquesa e ouro'),
    images: { editorial: ed('god-of-fire', 960, 1200) },
  },
  {
    id: 'kaiak',
    slug: 'kaiak',
    brand: 'Natura',
    name: 'Kaiak',
    concentration: 'Desodorante Colônia',
    gender: 'masculino',
    families: ['fresco'],
    familyLabel: 'Aquático',
    notes: null,
    description: 'Um dos frescos mais conhecidos da perfumaria brasileira. Leve, aquático, de uso livre.',
    volumes: [{ ml: 100, price: 169 }],
    atmosphere: neutral('#D6E6F1', '#06192A', 'Azul oceano'),
    images: { editorial: ed('kaiak', 960, 960) },
  },
  {
    id: 'le-beau-paradise-garden',
    slug: 'le-beau-paradise-garden',
    brand: 'Jean Paul Gaultier',
    name: 'Le Beau Paradise Garden',
    concentration: 'Eau de Parfum',
    gender: 'masculino',
    families: ['fresco', 'aromatico'],
    familyLabel: 'Aromático verde',
    notes: {
      top: ['Notas verdes', 'Notas aquáticas', 'Menta', 'Gengibre'],
      heart: ['Coco', 'Figo', 'Sal'],
      base: ['Sândalo', 'Fava tonka'],
    },
    description: 'Figo, coco e folhas verdes sobre sândalo. Um jardim úmido e solar, sem excesso de doçura.',
    volumes: [
      { ml: 75, price: 619 },
      { ml: 125, price: 829 },
    ],
    atmosphere: neutral('#DEE6D3', '#101A0C', 'Verde úmido'),
    images: { editorial: ed('le-beau-paradise-garden', 960, 1200) },
  },
  {
    id: 'divine',
    slug: 'divine',
    brand: 'Jean Paul Gaultier',
    name: 'Divine',
    concentration: 'Eau de Parfum',
    gender: 'feminino',
    families: ['floral', 'gourmand'],
    familyLabel: 'Floral gourmand',
    notes: {
      top: ['Acorde salino'],
      heart: ['Lírio'],
      base: ['Acorde de merengue'],
    },
    description: 'Lírio entre o sal do mar e a doçura do merengue. Solar, luminoso, dourado como o corpete do frasco.',
    volumes: [
      { ml: 50, price: 649 },
      { ml: 100, price: 899 },
    ],
    atmosphere: neutral('#F1E6D2', '#241B0C', 'Ouro claro'),
    images: { editorial: ed('divine', 960, 1200) },
  },
  {
    id: 'green-stravaganza',
    slug: 'green-stravaganza',
    brand: 'Valentino',
    name: 'Donna Born in Roma Green Stravaganza',
    concentration: 'Eau de Parfum',
    gender: 'feminino',
    families: ['floral'],
    familyLabel: 'Floral',
    notes: {
      top: ['Acorde de chá Lapsang Souchong'],
      heart: ['Jasmim'],
      base: ['Baunilha'],
    },
    description: 'Chá defumado, jasmim e baunilha. Uma releitura verde e vibrante do clássico de Valentino.',
    volumes: [
      { ml: 30, price: 459 },
      { ml: 50, price: 649 },
      { ml: 100, price: 929 },
    ],
    atmosphere: neutral('#E3EBCF', '#141D07', 'Verde-limão'),
    images: { editorial: ed('green-stravaganza', 960, 1200) },
  },
  {
    id: 'luna',
    slug: 'luna',
    brand: 'Natura',
    name: 'Luna',
    concentration: null,
    gender: 'feminino',
    families: [],
    familyLabel: null,
    notes: null,
    description: 'Da linha Luna, da Natura. A ficha olfativa completa não foi confirmada para este protótipo.',
    volumes: [{ ml: 75, price: 199 }],
    atmosphere: neutral('#F3E3E7', '#22151A', 'Rosa perolado'),
    images: { editorial: ed('luna', 960, 1200) },
  },
  {
    id: 'red-tobacco',
    slug: 'red-tobacco',
    brand: 'Mancera',
    name: 'Red Tobacco',
    concentration: 'Eau de Parfum',
    gender: 'unissex',
    families: ['ambarado', 'amadeirado'],
    familyLabel: 'Ambarado especiado',
    notes: {
      top: ['Canela', 'Açafrão', 'Noz-moscada'],
      heart: ['Patchouli', 'Jasmim'],
      base: ['Tabaco', 'Baunilha', 'Oud', 'Âmbar'],
    },
    description: 'Tabaco, canela e oud. Quente, especiado e generoso, para noites longas.',
    volumes: [{ ml: 120, price: 989 }],
    atmosphere: neutral('#EDD7CF', '#260C08', 'Tabaco'),
    images: { editorial: ed('red-tobacco', 960, 1280) },
  },
  {
    id: '1-million',
    slug: '1-million',
    brand: 'Rabanne',
    name: '1 Million',
    concentration: 'Eau de Toilette',
    gender: 'masculino',
    families: ['ambarado', 'amadeirado'],
    familyLabel: 'Amadeirado especiado',
    notes: {
      top: ['Toranja', 'Menta', 'Tangerina sanguínea'],
      heart: ['Rosa', 'Canela', 'Especiarias'],
      base: ['Couro', 'Madeiras', 'Âmbar', 'Patchouli'],
    },
    description: 'Canela e couro sobre âmbar. Ousado, dourado e impossível de passar despercebido.',
    volumes: [
      { ml: 50, price: 389 },
      { ml: 100, price: 559 },
    ],
    atmosphere: neutral('#EFE3C8', '#231A08', 'Ouro'),
    images: { editorial: ed('1-million', 960, 1112) },
  },
  {
    id: 'una-brilho',
    slug: 'una-brilho',
    brand: 'Natura',
    name: 'Una Brilho',
    concentration: null,
    gender: 'feminino',
    families: [],
    familyLabel: null,
    notes: null,
    description: 'Da linha Una, da Natura. A pirâmide olfativa não foi confirmada para este protótipo.',
    volumes: [{ ml: 75, price: 289 }],
    atmosphere: neutral('#F1E5CF', '#241A0A', 'Mel'),
    images: { editorial: ed('una-brilho', 960, 1200) },
  },
  {
    id: 'coral-fantasy',
    slug: 'coral-fantasy',
    brand: 'Valentino',
    name: 'Uomo Born in Roma Coral Fantasy',
    concentration: 'Eau de Toilette',
    gender: 'masculino',
    families: ['frutado', 'aromatico', 'amadeirado'],
    familyLabel: 'Frutado aromático',
    notes: {
      top: ['Maçã vermelha', 'Cardamomo', 'Bergamota da Calábria'],
      heart: ['Lavanda', 'Gerânio bourbon', 'Sálvia esclareia'],
      base: ['Vetiver do Haiti', 'Folha de tabaco', 'Patchouli'],
    },
    description: 'Maçã vermelha e sálvia sobre tabaco e vetiver. O pôr do sol de Roma em versão masculina.',
    volumes: [
      { ml: 50, price: 489 },
      { ml: 100, price: 689 },
    ],
    atmosphere: neutral('#F1DAD3', '#2A100C', 'Coral'),
    images: { editorial: ed('coral-fantasy', 960, 1200) },
  },
  {
    id: 'vibrato',
    slug: 'vibrato',
    brand: 'Sospiro',
    name: 'Vibrato',
    concentration: 'Eau de Parfum',
    gender: 'unissex',
    families: ['floral', 'citrico', 'amadeirado'],
    familyLabel: 'Floral cítrico',
    notes: {
      top: ['Toranja', 'Bergamota', 'Jasmim', 'Magnólia'],
      heart: ['Gengibre', 'Notas herbais'],
      base: ['Almíscar', 'Cedro', 'Âmbar', 'Patchouli'],
    },
    description: 'Cítricos e magnólia com um toque de gengibre. Fresco na abertura, macio no fundo amadeirado.',
    volumes: [{ ml: 100, price: 2190 }],
    atmosphere: neutral('#DCE7DF', '#0A1C14', 'Verde-esmeralda'),
    images: { editorial: ed('vibrato', 960, 1200) },
  },
]

export const heroOrder = [
  'creed-aventus',
  'donna-born-in-roma',
  'versace-eros-flame',
  'good-girl',
  'le-male-elixir',
  'essencial-oud',
]

export const bySlug = new Map(products.map((p) => [p.slug, p]))
export const getProduct = (slug: string) => bySlug.get(slug)

export const brands = [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
export const concentrations = [...new Set(products.map((p) => p.concentration).filter(Boolean) as string[])]

export const minPrice = (p: Product) => Math.min(...p.volumes.map((v) => v.price))

/** Intensidade derivada da concentração declarada (1 leve – 4 intensa). */
export const intensityOf = (p: Product): number | null => {
  switch (p.concentration) {
    case 'Desodorante Colônia':
      return 1
    case 'Eau de Toilette':
      return 2
    case 'Eau de Parfum':
    case 'Deo Parfum':
      return 3
    case 'Parfum':
      return 4
    default:
      return null
  }
}
