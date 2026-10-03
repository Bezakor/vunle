# Step animations

One short clip for each of the three steps in the "how it works" section, shown
at the top of its card.

## Just put the files here

Drop them in this folder. Names don't matter beyond their order: files are
sorted naturally and the first goes to **01 Describe your goal**, the second to
**02 Choose your voice**, the third to **03 Download & listen**. Numbering them
`step-1`, `step-2`, `step-3` is the clearest way to be sure.

`.webm` is ideal — it is the only common format that carries **transparency**,
which matters here because the clip sits directly on the card rather than in a
box. `.mp4`, `.mov` and `.ogv` play too, and a still image (`.png`, `.webp`,
`.gif`…) works if a step doesn't need motion.

Fewer than three files is fine: any step without one keeps its line-drawn icon,
which is also what shows if a clip fails to load. Nothing to edit in code —
`scripts/generate-asset-manifest.mjs` picks up whatever is here before each
`npm run dev` and `npm run build`. To regenerate by hand: `npm run assets`.

## Size and shape

The clip is drawn **112px tall** on desktop and 96px on a phone, scaled to fit
and never cropped, so any proportion works — square or landscape sit most
naturally. Export at about **3x** that height (roughly 340px) so it stays sharp
on a retina screen.

Keep them **short, quiet and small**. They autoplay, loop and are silent — any
audio track is ignored, so leave it out and save the bytes. All three play at
once on screen, so a few hundred kilobytes each is a good ceiling.

A clip that starts and ends on the same frame loops without a visible jump.

Under "reduce motion" the clip is left paused on its first frame, so make that
frame one that reads on its own.
