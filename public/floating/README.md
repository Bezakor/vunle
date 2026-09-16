# Floating assets

The 21 tiles that orbit the hero, drift through the manifesto chapters, and
burst out of the closing section. One shared pool — the same file is reused
in all three places, so there is one set to make, not three.

Drop a file in beside this README using the exact name below. Anything not
there yet falls back to its placeholder gradient, so you can add them a few
at a time and the page never shows a broken image.

| File | Shape | Ring |
| --- | --- | --- |
| `asset-01-3x4.jpg` | 3:4 | outer |
| `asset-02-1x1.jpg` | 1:1 | outer |
| `asset-03-4x5.jpg` | 4:5 | outer |
| `asset-04-1x1.jpg` | 1:1 | outer |
| `asset-05-3x4.jpg` | 3:4 | outer |
| `asset-06-1x1.jpg` | 1:1 | outer |
| `asset-07-3x4.jpg` | 3:4 | outer |
| `asset-08-4x5.jpg` | 4:5 | outer |
| `asset-09-3x4.jpg` | 3:4 | outer |
| `asset-10-1x1.jpg` | 1:1 | outer |
| `asset-11-3x4.jpg` | 3:4 | outer |
| `asset-12-4x5.jpg` | 4:5 | outer |
| `asset-13-3x4.jpg` | 3:4 | outer |
| `asset-14-3x4.jpg` | 3:4 | inner |
| `asset-15-1x1.jpg` | 1:1 | inner |
| `asset-16-4x5.jpg` | 4:5 | inner |
| `asset-17-1x1.jpg` | 1:1 | inner |
| `asset-18-3x4.jpg` | 3:4 | inner |
| `asset-19-1x1.jpg` | 1:1 | inner |
| `asset-20-3x4.jpg` | 3:4 | inner |
| `asset-21-4x5.jpg` | 4:5 | inner |

## Size

The largest a tile is ever drawn is 162px on its longest side, and it does
not grow past that even on a very large display. **512px on the longest side**
covers a 3x retina screen; beyond that is wasted bytes on a thumbnail.

Keep to the shape in the table — the frame crops to it.

## Video

A tile takes video as happily as an image, but the entry needs telling. Name
the file `.mp4` and add `kind: 'video'` to that asset in `src/lib/assets.ts`,
alongside its `src`. Video autoplays muted and loops.

At this size detail is lost, so movement and colour read far better than
content. Short, quiet, slow clips work best.
