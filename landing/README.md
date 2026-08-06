# Organiq — landing page

A standalone marketing page for **Organiq / AI Organic Growth**. Plain HTML, CSS and vanilla JS —
**no build step, no dependencies, no framework**.

```
landing/
├── index.html            the whole page
├── README.md             this file
└── assets/
    ├── styles.css        tokens, layout, components, animations
    ├── main.js           scroll reveals, nav state, motion gate, CTA links
    └── favicon.svg       the sprout mark (same as ../public/favicon.svg)
```

## Preview

Any static server works:

```bash
python3 -m http.server 4173 -d landing
# → http://localhost:4173
```

or

```bash
npx serve landing
```

Opening `landing/index.html` directly from disk (`file://`) also renders correctly — only the
Google Fonts request needs the network, and the page falls back to `system-ui` without it.

## Design

Tokens are copied from [`../src/index.css`](../src/index.css) so the page shares one visual language
with the app: `#12A150` / `#12D06A` green, `#5B5BD6` indigo, `#0A0F0C` night, the `--radius: 0.7rem`
scale, and the app's long low-opacity shadows. Type is **Plus Jakarta Sans** with **JetBrains Mono**
for eyebrows and step numbers — the same pairing as the app.

The dark hero reuses the layered radial-gradient wash and the `#12D06A → #7CE0A8` headline gradient
from `src/features/auth/LoginPage.tsx`.

### Sections

Nav → Hero (dark) → Problem → Visibility gap → Solution (Monitor/Diagnose/Solve) → How it works
(8-step pipeline) → Core features → Dashboard bento → Free-tools marquee → CTA (dark) → Footer.

The free-tools row is a full-bleed marquee that slides right to left forever. `main.js` clones the
single group in the HTML twice (`aria-hidden`, links taken out of the tab order), because the CSS
shifts the track by exactly one group width — three identical groups is what makes the loop
seamless. It pauses on hover and whenever a card inside it holds keyboard focus. Without JS, or
under reduce-motion, it stays a single static row you can scroll sideways.

### Motion

Every animation sits behind `[data-motion="on"]`, which `main.js` sets **only** when the visitor has
not asked to reduce motion. Without JS, or with reduce-motion on, the page renders complete and
static — nothing is ever left stuck at `opacity: 0`. Animations use `transform` / `opacity` only.

## Book a demo

Every CTA on the page — nav, hero, closing band, footer, and the free-tool cards — carries
`data-demo` and opens the same **Book a demo** dialog. There is no sign-in link; a demo request is
the only funnel.

The dialog is a native `<dialog>`, so Esc, focus trapping and the backdrop come from the browser.
Backdrop clicks and the ✕ close it. Fields: name, work email, company, website to analyse, and an
optional note. Validation is native HTML5, held back until submit (`novalidate` + `checkValidity()`)
so nothing turns red while the visitor is still typing.

### Wiring it to a real endpoint

**The form does not send anywhere yet.** Replace `submitDemoRequest()` near the top of
[`assets/main.js`](assets/main.js) — it is the only place that needs to change, and the comment
above it contains the `fetch()` shape to drop in. Everything downstream already works against the
promise it returns: pending state on the button, the success panel (which echoes the submitted
email), and an inline error panel if the promise rejects. Right now it resolves after ~700ms and
logs the payload to the console.

Two more things worth doing when you wire it up: add a real contact address to the `<noscript>`
note in the dialog, and put spam protection (honeypot field, or a captcha) in front of the endpoint.

## Notes before deploying

1. **Vercel.** [`../vercel.json`](../vercel.json) currently rewrites `/(.*)` → `/index.html`, so this
   folder is **not** served as-is on Vercel. To host it at `/` in front of the app you would add an
   exclusion for `/landing/...` (or copy `landing/` into `public/` and give it its own path). That
   integration is intentionally not wired up.

2. **No performance claims.** The page deliberately contains no Google Search Console figures. The
   numbers in `Organic-Growth-Proven-by-Data.pdf` disagree with themselves — slide 5 labels Banana
   Ice as *before 4.1 → after 7.8* while slide 7's chart shows *7.8 → 4.1* (the opposite direction).
   Resolve that before any proof section is added here.
