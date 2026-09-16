# Brand assets

## The logo

Put a file called **`logo.svg`** in this folder and it appears in the top-left
corner of the site. `logo.png`, `logo.webp`, `logo.avif` and `logo.jpg` work
too — the build picks up whichever is here, preferring the SVG if there is more
than one. Nothing to edit in code.

Until there is one, the corner shows the word **VUNLE** set in the site's own
typeface, so the page is never missing its mark.

**Size:** it renders 28px tall on desktop and 22px on a phone, capped at 160px
wide, scaled to fit either way. An SVG is ideal — it stays crisp at any size
and any screen density. If you supply a bitmap, make it about **3x** the display
size (roughly 480px wide, 84px tall) so it is sharp on a retina screen, and give
it a transparent background: it sits directly on the page, not in a box.

The mark is drawn in the site's ink colour when it falls back to text, but an
image file is used exactly as supplied — so bake the colour you want into it.

## Anywhere else

Everything under `public/` is served from the root of the site, so
`public/brand/logo.svg` is reachable at `/brand/logo.svg`. That is where any
other odds and ends belong. The folders in use:

| Folder | What lives there |
| --- | --- |
| `public/brand` | the logo, and anything else brand-level |
| `public/floating` | the tiles that orbit the hero and the chapters |
| `public/case-studies` | the case study portraits |
| `public/audio` | audio used by the app flow |

A favicon is a special case: it goes at `src/app/icon.png` (or `icon.svg`), not
here, and Next.js wires it up on its own.
