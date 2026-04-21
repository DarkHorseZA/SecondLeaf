import { Platform, TextStyle } from 'react-native';

const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const fonts = {
  display: serif,
  body: sans,
};

export const type = {
  displayXL: { fontFamily: serif, fontSize: 32, lineHeight: 38, fontWeight: '600' } as TextStyle,
  displayLG: { fontFamily: serif, fontSize: 26, lineHeight: 32, fontWeight: '600' } as TextStyle,
  displayMD: { fontFamily: serif, fontSize: 20, lineHeight: 26, fontWeight: '600' } as TextStyle,
  title: { fontFamily: sans, fontSize: 17, lineHeight: 22, fontWeight: '600' } as TextStyle,
  body: { fontFamily: sans, fontSize: 15, lineHeight: 22, fontWeight: '400' } as TextStyle,
  bodyBold: { fontFamily: sans, fontSize: 15, lineHeight: 22, fontWeight: '600' } as TextStyle,
  caption: { fontFamily: sans, fontSize: 12, lineHeight: 16, fontWeight: '500' } as TextStyle,
  small: { fontFamily: sans, fontSize: 11, lineHeight: 14, fontWeight: '500' } as TextStyle,
};
