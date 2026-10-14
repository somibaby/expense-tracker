# 2 · UI kit — shared building blocks

Nothing here knows about a specific screen. Skim it, then come back when a
screen imports something from here.

- `theme.ts` — colors, radii, spacing, category colors
- `format.ts` — `₩` currency formatting
- `components/` — `Screen` (page wrapper) and `Card` (white box)
- `hooks/` — `useNow` (ticking clock), `useScreenPadding` (space for tab bar)
- `toast/` — one-line "saved" messages: call `useToast().showToast(msg)`
  anywhere; `ToastHost` draws it
