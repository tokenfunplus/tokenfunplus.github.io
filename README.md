# TokenFunPlus product websites

Independent English product pages, published through GitHub Pages:

- [Cove](https://tokenfunplus.github.io/cove/) — an AI chat app for Mac, in development.
- [Binance Studio](https://tokenfunplus.github.io/binance-studio/) — a browser extension with public source and installation instructions.

## Develop

The site uses plain HTML, CSS, and JavaScript, with no build step or runtime dependencies.

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

## Assets

Binance Studio screenshots and its icon come from [tokenfunplus/binance-theme](https://github.com/tokenfunplus/binance-theme), commit `82804157c44a6cfe70b29edb1d8f2b239cfefe00`. Its Apache 2.0 license is retained at `docs/binance-studio/assets/LICENSE.txt`.

The Cove icon is the product's supplied app icon. Social images are the original TokenFunPlus organization artwork. Do not replace screenshots with illustrations that imply unimplemented features.
