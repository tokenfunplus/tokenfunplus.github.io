# TokenFunPlus product websites

Independent English product pages, published through GitHub Pages:

- [Cove](https://tokenfunplus.github.io/cove/) — an AI chat app for Mac, in development.
- [Binance Studio](https://tokenfunplus.github.io/binance-studio/) — a browser extension with public source and installation instructions.

## Develop

The site uses plain HTML, CSS, and JavaScript, with no build step or runtime dependencies. Product pages include original WebGL artwork and self-hosted fonts.

```sh
make check
make preview
```

Open `http://localhost:4178/`. Product content lives in `docs/cove/` and `docs/binance-studio/`; shared styles and interactions live in `docs/assets/`.

GitHub Pages publishes `docs/` from `main`. A push to that branch triggers a new deployment. Keep this source setting when updating the site.

## Content and privacy

- All copy is English. Product capabilities must match the relevant project documentation.
- Cove is in development and has no public download. Do not link to its application repository until public access is available. Its interactive preview uses illustrative sample content; it does not contact a model provider.
- Cove stores history locally, while prompts go to the selected provider. Do not imply that model execution is local or that all providers support confidential inference.
- Binance Studio screenshots come from its public simulation pages. Prices and orders shown are examples, with no account connected.
- Keep credentials, conversation data, personal notes, and local application state out of this repository.
- The site has no analytics, forms, external fonts, or third-party runtime scripts.

## Motion and graphics

`docs/assets/scenes.js` renders Cove's reflective sculpture and Binance Studio's wireframe terrain with native WebGL. Pointer movement changes their perspective. The terrain palette follows the selected cockpit preview.

Motion can be paused in the hero. Reduced-motion preferences and data-saving mode start with a still frame. Rendering stops outside the viewport and when the page is hidden. The drawing resolution and frame rate are capped, with lower limits on small screens. Static SVG artwork remains visible when WebGL is unavailable or its context is lost; a restored context recreates the graphics resources.

When editing graphics, check actual shader compilation, pause/resume, context loss/restoration, no-WebGL fallback, and both desktop and mobile layouts. Product content and navigation must remain usable without JavaScript.

## Assets

Binance Studio screenshots and its icon come from [tokenfunplus/binance-theme](https://github.com/tokenfunplus/binance-theme), commit `82804157c44a6cfe70b29edb1d8f2b239cfefe00`. Its Apache 2.0 license is retained at `docs/binance-studio/assets/LICENSE.txt`.

The Cove icon is the product's supplied app icon. Product social images use the website's original procedural artwork. The TokenFunPlus social image is the original organization artwork. Do not replace screenshots with illustrations that imply unimplemented features.

Manrope and Space Grotesk are self-hosted Latin variable fonts from [Google Fonts](https://github.com/google/fonts). Their SIL Open Font Licenses are retained in `docs/assets/fonts/`.
