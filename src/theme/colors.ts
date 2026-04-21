export const colors = {
  leaf: '#2E7D4F',
  leafDark: '#1E5733',
  leafLight: '#6FB989',
  leafMuted: '#C6E1CF',
  moss: '#4A8A5C',
  sprout: '#A8D5A2',
  bark: '#5C4A3A',
  soil: '#3E2F22',
  cream: '#F4F7F1',
  paper: '#FFFFFF',
  ink: '#1C2A20',
  inkMuted: '#5B6B5F',
  line: '#E4EBE1',
  accent: '#E8A13A',
  danger: '#C25450',
  success: '#2E7D4F',
  badge: '#FFF4DA',
  overlay: 'rgba(28, 42, 32, 0.55)',
} as const;

export type ColorKey = keyof typeof colors;
