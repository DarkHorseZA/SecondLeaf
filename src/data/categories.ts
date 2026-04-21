import { PlantCategory } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export interface CategoryDef {
  id: PlantCategory | 'all';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const categories: CategoryDef[] = [
  { id: 'all', label: 'All', icon: 'sparkles-outline' },
  { id: 'houseplant', label: 'Houseplants', icon: 'leaf-outline' },
  { id: 'succulent', label: 'Succulents', icon: 'prism-outline' },
  { id: 'cactus', label: 'Cacti', icon: 'flower-outline' },
  { id: 'herb', label: 'Herbs', icon: 'nutrition-outline' },
  { id: 'shrub', label: 'Shrubs', icon: 'rose-outline' },
  { id: 'tree', label: 'Trees', icon: 'git-branch-outline' },
  { id: 'flower', label: 'Flowers', icon: 'flower' },
  { id: 'veg', label: 'Veg', icon: 'fast-food-outline' },
  { id: 'seeds', label: 'Seeds', icon: 'egg-outline' },
  { id: 'cutting', label: 'Cuttings', icon: 'cut-outline' },
];

export const modes = [
  { id: 'all', label: 'All', icon: 'apps-outline' },
  { id: 'sell', label: 'For sale', icon: 'pricetag-outline' },
  { id: 'trade', label: 'Swaps', icon: 'swap-horizontal' },
  { id: 'giveaway', label: 'Free', icon: 'gift-outline' },
] as const;

export const sorts = [
  { id: 'newest', label: 'Newest' },
  { id: 'nearby', label: 'Nearest' },
  { id: 'price_low', label: 'Price ↑' },
  { id: 'price_high', label: 'Price ↓' },
  { id: 'popular', label: 'Most loved' },
] as const;

export type SortId = typeof sorts[number]['id'];
