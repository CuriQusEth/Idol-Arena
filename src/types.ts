export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Special Edition';

export interface CardStats {
  attack: number;
  defense: number;
  charm: number;
  stagePresence: number;
  fanPower: number;
}

export interface IdolCard {
  id: string;
  name: string;
  groupName?: string;
  rarity: Rarity;
  imageUrl: string;
  element: 'Fire' | 'Water' | 'Electric' | 'Light' | 'Dark';
  stats: CardStats;
  level: number;
  maxLevel: number;
}

export type ViewState = 'MainMenu' | 'Collection' | 'Battle' | 'Shop' | 'Events' | 'Deck' | 'Wallet' | 'Settings' | 'Profile';

