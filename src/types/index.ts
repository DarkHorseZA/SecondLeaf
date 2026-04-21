export type ListingMode = 'sell' | 'trade' | 'giveaway';

export type PlantCategory =
  | 'houseplant'
  | 'succulent'
  | 'cactus'
  | 'herb'
  | 'shrub'
  | 'tree'
  | 'flower'
  | 'veg'
  | 'seeds'
  | 'cutting';

export type CareLevel = 'easy' | 'moderate' | 'expert';
export type LightLevel = 'low' | 'medium' | 'bright' | 'direct';

export interface User {
  id: string;
  name: string;
  handle: string;
  town: string;
  avatarColor: string;
  initials: string;
  rating: number;
  trades: number;
  joinedMonths: number;
  bio?: string;
}

export interface Listing {
  id: string;
  title: string;
  species: string;
  description: string;
  mode: ListingMode;
  price: number | null;
  tradeFor?: string;
  category: PlantCategory;
  care: CareLevel;
  light: LightLevel;
  petFriendly: boolean;
  height: string;
  potIncluded: boolean;
  town: string;
  distanceMiles: number;
  postedAgo: string;
  sellerId: string;
  imageSeed: string;
  likes: number;
  saved?: boolean;
}

export interface Message {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  userId: string;
  listingId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

export interface Notification {
  id: string;
  kind: 'message' | 'offer' | 'like' | 'system';
  title: string;
  body: string;
  time: string;
  unread: boolean;
}
