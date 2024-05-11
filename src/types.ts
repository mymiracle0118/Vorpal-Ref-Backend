export type GameResult = {
  date: number;
  playerOne: string;
  playerTwo: string;
  winner: 1 | 2;
  star_id_one: number;
  star_id_two: number;
  planet_id_one: number;
  planet_id_two: number;
};

export type PlayerStats = {
  address: string;
  games: number;
  wins: number;
};

export type ResponseObject = {
  success: boolean;
  message: string;
};

export type Race = 'Waters' | 'Humans' | 'Insects' | 'Lizards';

export type Coords = {
  X: number;
  Y: number;
  Z: number;
};

export type StarParams = {
  name: string;
  isLive: boolean;
  creation: number; // timestamp
  updated: number;
  level: number;
  fuel: number;
  levelUpFuel: number;
  fuelSpendings: number; // per hour
  habitableZoneMin: number;
  habitableZoneMax: number;
  planetSlots: number;
  mass: number;
  race: Race;
  coords: Coords;
};

export type StarData = {
  id: number;
  owner: string;
  params: StarParams;
};

export type StarList = StarData[];
export type boxOpenResults =
  | 'laser1'
  | 'laser2'
  | 'laser3'
  | 'spore'
  | 'spice'
  | 'metal'
  | 'biomass'
  | 'carbon'
  | 'token';

export interface TelegramAuthData {
  auth_date: number;
  first_name: string;
  hash: string;
  id: number;
  last_name: string;
  username: string;
}

export interface DuelInfo {
  duel_id: string;
  login1: string;
  login2?: string;
  creation: number;
  isfinished?: string;
  isexpired?: string;
  winner?: string;
}

export interface storeItem {
	item_name: string;
  item_type?: string;
  item_img?: string;
	price?: number;
	currency?: string
}

export interface storeItemBalance {
	user_name: string;
  item_name: string;
  balance: number;
}

export interface uniqueItem {
  item_id: string;
	item_img?: string;
	item_name: string;
	item_type?: string;
	price?: number;
  currency?: string;
  owner?: string;
}

export interface watchingChannel {
  channel_name: string;
	channel_username: string;
	channel_id: string;
}
