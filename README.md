# TokenFunPlus product websites

Independent English product pages, published through GitHub Pages:

- [Cove](https://tokenfunplus.github.io/cove/) — a local-first AI chat app for Mac, available in public beta.
- [Binance Studio](https://tokenfunplus.github.io/binance-studio/) — a browser extension with public source and installation instructions.

## Develop

The site uses plain HTML, CSS, and JavaScript, with no build step or runtime dependencies. Cove uses a light product layout with actual application screenshots; Binance Studio includes original WebGL artwork. Fonts are self-hosted.

```sh
make check
make preview
```

Open `http://localhost:4178/`. Product content lives in `docs/cove/` and `docs/binance-studio/`; Cove has its own stylesheet and interactions in `docs/cove/`; shared site assets and Binance Studio visuals live in `docs/assets/`.

GitHub Pages publishes `docs/` from `main`. A push to that branch triggers a new deployment. Keep this source setting when updating the site.

## Content and privacy

- All copy is English. Product capabilities must match the relevant project documentation.
- Cove is public and its `0.1.0-beta.2` release is available. Keep the version, requirements, release links, file chat limits, and download link aligned with the published GitHub release. The current UI is English and user content supports Unicode. Screenshot previews on the website do not contact a model provider.
- Cove stores history locally, while prompts go to the selected provider. Do not imply that model execution is local or that all providers support confidential inference.
- Binance Studio screenshots come from its public simulation pages. Prices and orders shown are examples, with no account connected.
- Keep credentials, conversation data, personal notes, and local application state out of this repository.
- The site has no analytics, forms, external fonts, or third-party runtime scripts.

## Motion and graphics

`docs/assets/scenes.js` renders Binance Studio's wireframe terrain with native WebGL. Pointer movement changes its perspective, and its palette follows the selected cockpit preview. Cove uses restrained interface transitions and static application captures, with reduced-motion support.

Motion can be paused in the hero. Reduced-motion preferences and data-saving mode start with a still frame. Rendering stops outside the viewport and when the page is hidden. The drawing resolution and frame rate are capped, with lower limits on small screens. Static SVG artwork remains visible when WebGL is unavailable or its context is lost; a restored context recreates the graphics resources.

When editing graphics, check actual shader compilation, pause/resume, context loss/restoration, no-WebGL fallback, and both desktop and mobile layouts. Product content and navigation must remain usable without JavaScript.

## Assets

Binance Studio screenshots and its icon come from [tokenfunplus/binance-theme](https://github.com/tokenfunplus/binance-theme), commit `82804157c44a6cfe70b29edb1d8f2b239cfefe00`. Its Apache 2.0 license is retained at `docs/binance-studio/assets/LICENSE.txt`.

Cove screenshots were captured from its actual Chat Surface at Beta 2 commit `d82c39f`, using an isolated temporary data directory, synthetic conversations, and a local simulated provider. Atlas and Lumen are demo model labels. The screenshots include text chat, model comparisons, saved source citations, four skins, and desktop/mobile views. They contain no user conversation history or real credentials. The Cove icon uses the shared blue and teal wave mark introduced in Beta 2, and its social image uses the actual application capture. Binance Studio's social image uses original procedural artwork. Do not replace screenshots with illustrations that imply unimplemented features.

Manrope and Space Grotesk are self-hosted Latin variable fonts from [Google Fonts](https://github.com/google/fonts). Their SIL Open Font Licenses are retained in `docs/assets/fonts/`.

Cove uses the self-hosted Geist Latin variable font from its application dependency `@fontsource-variable/geist` 5.2.9. Its SIL Open Font License is retained at `docs/cove/assets/geist-OFL.txt`.
