import { VARIANT } from './variant';
import { colors as v1Colors } from './colors';
import { colors as v2Colors } from './colors.v2';
import { type as v1Type, fonts as v1Fonts } from './typography';
import { type as v2Type, fonts as v2Fonts } from './typography.v2';

export const colors = VARIANT === 'v2' ? v2Colors : v1Colors;
export const type = VARIANT === 'v2' ? v2Type : v1Type;
export const fonts = VARIANT === 'v2' ? v2Fonts : v1Fonts;

export * from './spacing';
export * from './variant';
