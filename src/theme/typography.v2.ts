import { Platform, TextStyle } from 'react-native';

const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const sansMedium = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

export const fonts = {
  display: sansMedium,
  body: sans,
};

export const type = {
  displayXL: { fontFamily: sansMedium, fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.4 } as TextStyle,
  displayLG: { fontFamily: sansMedium, fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.3 } as TextStyle,
  displayMD: { fontFamily: sansMedium, fontSize: 19, lineHeight: 25, fontWeight: '700', letterSpacing: -0.2 } as TextStyle,
  title: { fontFamily: sans, fontSize: 17, lineHeight: 22, fontWeight: '600' } as TextStyle,
  body: { fontFamily: sans, fontSize: 15, lineHeight: 22, fontWeight: '400' } as TextStyle,
  bodyBold: { fontFamily: sans, fontSize: 15, lineHeight: 22, fontWeight: '700' } as TextStyle,
  caption: { fontFamily: sans, fontSize: 12, lineHeight: 16, fontWeight: '500' } as TextStyle,
  small: { fontFamily: sans, fontSize: 11, lineHeight: 14, fontWeight: '500' } as TextStyle,
};
