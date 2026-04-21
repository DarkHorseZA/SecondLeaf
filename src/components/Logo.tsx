import { isV2 } from '@/theme/variant';
import { Logo as LogoV1, LogoMark as LogoMarkV1 } from './Logo.v1';
import { LogoV2, LogoMarkV2 } from './Logo.v2';

export const Logo = isV2 ? LogoV2 : LogoV1;
export const LogoMark = isV2 ? LogoMarkV2 : LogoMarkV1;
