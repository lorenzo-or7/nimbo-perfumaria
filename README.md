# NIMBO — protótipo demonstrativo Or7

Perfumaria multimarcas fictícia. Nenhuma compra é processada e nenhuma cobrança é realizada.

## Executar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # checagem TypeScript + build de produção em dist/
npm run preview    # serve o build
```

## Estrutura

- `src/data/products.ts` — catálogo central (33 perfumes, caminhos de imagem, atmosferas da hero).
- `src/data/content.ts` — coleções, FAQ e perguntas do Fragrance Finder.
- `src/components/hero/` — Floating Fragrance Gallery e Cinematic Overlay.
- `src/pages/` — catálogo, página do perfume, finder, comparador, favoritos, finalização demonstrativa.
- `scripts/build-assets.mjs` — gera os WebP otimizados em `public/assets` a partir dos originais na pasta pai (`node scripts/build-assets.mjs ..`).

Stack: React 19, TypeScript, Vite, GSAP + ScrollTrigger, React Router, Lucide. CSS próprio com tokens (sem framework).
Fontes: Instrument Serif (Google Fonts, OFL) e Satoshi (Fontshare, licença ITF Free Font).
