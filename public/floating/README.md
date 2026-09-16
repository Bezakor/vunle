# Floating assets

The tiles that orbit the hero, drift through the manifesto chapters, and burst
out of the closing section. One shared pool — the same file is reused in all
three places, so there is one set to make, not three.

## Just put the files here

Drop them in this folder. Names don't matter and neither does the mix: `.jpg`,
`.png`, `.webp`, `.avif`, `.gif` are treated as images, and `.webm`, `.mp4`,
`.mov`, `.m4v`, `.ogv` as video. `scripts/generate-floating-manifest.mjs` scans
this folder and wires up whatever it finds, and it runs automatically before
`npm run dev` and `npm run build`, so a deploy after uploading picks them up.
To regenerate by hand: `npm run assets`.

Files fill the tiles in filename order, sorted naturally — `asset-2` comes
before `asset-10`, not after. Number the files if you care which goes where.

There are **21 tiles**. Fewer files than that is fine: the rest keep their
placeholder gradient, so the pool can be filled a few at a time. More than 21
and the extras go unused.

Tile shapes are 3:4, 1:1 and 4:5, but they are a property of the frame rather
than of your files — each tile crops whatever it is given to its own shape,
centred. Square or portrait sources crop most predictably.

## Size

The largest a tile is ever drawn is 162px on its longest side, and it does not
grow past that even on a very large display. **512px on the longest side**
covers a 3x retina screen; beyond that is wasted bytes on a thumbnail.

Video autoplays muted and loops. At this size detail is lost, so movement and
colour read far better than content — short, slow, quiet clips work best, and
keep the files small since several play at once.
