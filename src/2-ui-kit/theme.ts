import type { CategoryName } from '../1-data/types';

// Design tokens straight from the handoff spec.
export const colors = {
  ink: '#12130F',
  paper: '#FAF9F6',
  surface: '#FFFFFF',
  accent: '#1F6F4A',
  accentSoft: '#7FD1A6',
  warn: '#D9603B',
  hairline: 'rgba(0,0,0,0.07)',
  divider: 'rgba(0,0,0,0.05)',
  text2: 'rgba(0,0,0,0.45)',
  text3: 'rgba(0,0,0,0.40)',
};

export const radius = { hero: 22, card: 18, row: 16, key: 14, tile: 11, pill: 999 };

// screenTop/screenBottom aren't fixed here -- they depend on each device's
// safe-area insets (notch/Dynamic Island, home indicator), which only
// `useSafeAreaInsets()` at render time can answer. See TAB_BAR_CONTENT_HEIGHT
// below, combined with insets.bottom, for how screens compute their bottom
// padding.
export const spacing = { screenX: 20, cardGap: 18, rowGap: 10 };

// Height of the tab bar's own content, excluding the device's bottom safe-area
// inset (added on top of this at render time) -- keeps the bar a consistent
// visual height across devices with different home-indicator heights.
export const TAB_BAR_CONTENT_HEIGHT = 78;

// The spec's category colors are given in oklch(0.55 0.09 H) for H in
// {40,150,250,75,300,200,110} -- equal lightness/chroma so no category
// visually dominates. Approximated here as hex (same intent: fixed
// saturation/lightness, hue rotates per category) since RN style colors
// don't support oklch().
export const categoryColors: Record<CategoryName, string> = {
  Food: '#B06C4F',
  Groceries: '#4FB080',
  Transport: '#4F6FB0',
  Cafe: '#B0984F',
  Home: '#904FB0',
  Health: '#4F98B0',
  Fun: '#77B04F',
};

export function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}
