# Case study portraits

One square portrait per case study. Each study's `avatar` field in
`src/lib/caseStudies.ts` points at its file:

| File                              | Person           |
| --------------------------------- | ---------------- |
| `profile_01-MJ-michael-jordan.jpg`| Michael Jordan   |
| `profile_02-LG-lady-gaga.jpg`     | Lady Gaga        |
| `profile_03-TR-tony-robbins.jpg`  | Tony Robbins     |
| `profile_04-MR-mel-robbins.jpg`   | Mel Robbins      |
| `profile_05-JD-joe-dispenza.jpg`  | Dr. Joe Dispenza |

The carousel renders them at 80px as a circle with `object-fit: cover`, so
square images crop cleanly — these are 842x842.

Renaming a file means updating that study's `avatar` path too. Any portrait
that is missing or fails to load falls back to the person's initials on a
gradient disc, so the carousel never shows a broken image.
