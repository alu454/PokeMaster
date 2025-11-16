// Core data types for PokeMaster

export interface Card {
  id?: number;
  name: string;
  set_id: string;
  set_name: string;
  number?: string;
  rarity?: string;
  type?: string;
  supertype?: string;
  subtype?: string;
  hp?: number;
  image_url?: string;
  small_image_url?: string;
  large_image_url?: string;
  tcgplayer_id?: string;
  cardmarket_id?: string;
  condition?: string;
  grade?: string;
  quantity?: number;
  notes?: string;
  date_added?: string;
  date_updated?: string;
}

export interface Set {
  id: string;
  name: string;
  series?: string;
  printed_total?: number;
  total?: number;
  release_date?: string;
  symbol_url?: string;
  logo_url?: string;
}

export interface Price {
  id?: number;
  card_id: number;
  source: string;
  low_price?: number;
  mid_price?: number;
  high_price?: number;
  market_price?: number;
  direct_low_price?: number;
  trend_price?: number;
  currency?: string;
  last_updated?: string;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
  created_at?: string;
}

export interface WishListItem {
  id?: number;
  card_name: string;
  set_id?: string;
  set_name?: string;
  priority?: number;
  max_price?: number;
  notes?: string;
  date_added?: string;
}

// API Response types
export interface PokemonTCGCard {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: string;
  types?: string[];
  number: string;
  rarity?: string;
  images: {
    small?: string;
    large?: string;
  };
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal?: number;
    total?: number;
    releaseDate?: string;
    images?: {
      symbol?: string;
      logo?: string;
    };
  };
  tcgplayer?: {
    url?: string;
    updatedAt?: string;
    prices?: {
      normal?: { low?: number; mid?: number; high?: number; market?: number; directLow?: number };
      holofoil?: { low?: number; mid?: number; high?: number; market?: number; directLow?: number };
      reverseHolofoil?: { low?: number; mid?: number; high?: number; market?: number; directLow?: number };
      "1stEditionHolofoil"?: { low?: number; mid?: number; high?: number; market?: number; directLow?: number };
      "1stEditionNormal"?: { low?: number; mid?: number; high?: number; market?: number; directLow?: number };
    };
  };
  cardmarket?: {
    url?: string;
    updatedAt?: string;
    prices?: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
      germanProLow?: number;
      suggestedPrice?: number;
      reverseHoloSell?: number;
      reverseHoloLow?: number;
      reverseHoloTrend?: number;
      lowPriceExPlus?: number;
      avg1?: number;
      avg7?: number;
      avg30?: number;
      reverseHoloAvg1?: number;
      reverseHoloAvg7?: number;
      reverseHoloAvg30?: number;
    };
  };
}

export interface PokemonTCGResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

