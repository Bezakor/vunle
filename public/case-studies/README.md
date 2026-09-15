# Case study portraits

One square portrait per case study, named after that study's `id` in
`src/lib/caseStudies.ts`:

| File               | Person           |
| ------------------ | ---------------- |
| `jordan.jpg`       | Michael Jordan   |
| `gaga.jpg`         | Lady Gaga        |
| `robbins-tony.jpg` | Tony Robbins     |
| `robbins-mel.jpg`  | Mel Robbins      |
| `dispenza.jpg`     | Dr. Joe Dispenza |

The carousel renders them at 80px as a circle with `object-fit: cover`, so
square images around 400x400 are ideal and anything square will crop sensibly.

Any portrait that is missing or fails to load falls back to the person's
initials on a gradient disc, so the carousel never shows a broken image — which
is what it does today, until these files are added.
