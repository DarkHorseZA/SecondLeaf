import { isV2 } from '@/theme/variant';
import { BrowseScreen as BrowseScreenV1 } from './BrowseScreen.v1';
import { BrowseScreenV2 } from './BrowseScreen.v2';

export const BrowseScreen = isV2 ? BrowseScreenV2 : BrowseScreenV1;
