/**
 * v2 palette — matches the live secondleaf.co.uk branding.
 * Vibrant sprout green for CTAs, deep teal for text accents, clean white.
 */
export const colors = {
  leaf: '#2ECC71',          // primary bright green (buttons, banner, search circle)
  leafDark: '#27AE60',      // pressed / darker shade
  leafLight: '#7FE0A4',
  leafMuted: '#DDF5E5',     // pale mint backgrounds
  moss: '#1F8A4F',
  sprout: '#A5EDC2',
  bark: '#0B5454',          // brand teal (used for body-accent text, pill buttons)
  soil: '#083D3D',
  cream: '#FFFFFF',         // v2 is pure white
  paper: '#FFFFFF',
  ink: '#0F2020',
  inkMuted: '#5B7272',
  line: '#E4EDE6',
  accent: '#F2A93B',        // reserve for rating stars
  danger: '#E05A5A',
  success: '#2ECC71',
  badge: '#DDF5E5',
  overlay: 'rgba(11, 84, 84, 0.55)',
} as const;

export type ColorKey = keyof typeof colors;
