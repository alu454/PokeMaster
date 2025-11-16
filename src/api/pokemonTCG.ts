import axios from 'axios';
import type { PokemonTCGCard, PokemonTCGResponse } from '@/types';

const API_BASE_URL = 'https://api.pokemontcg.io/v2';
// You'll need to get your API key from https://pokemontcg.io/
const API_KEY = import.meta.env.VITE_POKEMON_TCG_API_KEY || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
});

export class PokemonTCGAPI {
  /**
   * Search for cards by name
   */
  static async searchCards(query: string, page = 1, pageSize = 20): Promise<PokemonTCGResponse<PokemonTCGCard>> {
    try {
      const response = await apiClient.get<PokemonTCGResponse<PokemonTCGCard>>('/cards', {
        params: {
          q: `name:"${query}"*`,
          page,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching cards:', error);
      throw error;
    }
  }

  /**
   * Get a specific card by ID
   */
  static async getCard(cardId: string): Promise<PokemonTCGCard> {
    try {
      const response = await apiClient.get<{ data: PokemonTCGCard }>(`/cards/${cardId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching card:', error);
      throw error;
    }
  }

  /**
   * Get all sets
   */
  static async getSets(page = 1, pageSize = 250): Promise<PokemonTCGResponse<any>> {
    try {
      const response = await apiClient.get<PokemonTCGResponse<any>>('/sets', {
        params: {
          page,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sets:', error);
      throw error;
    }
  }

  /**
   * Search cards by set
   */
  static async getCardsBySet(setId: string, page = 1, pageSize = 250): Promise<PokemonTCGResponse<PokemonTCGCard>> {
    try {
      const response = await apiClient.get<PokemonTCGResponse<PokemonTCGCard>>('/cards', {
        params: {
          q: `set.id:"${setId}"`,
          page,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cards by set:', error);
      throw error;
    }
  }

  /**
   * Advanced search with multiple criteria
   */
  static async advancedSearch(params: {
    name?: string;
    setId?: string;
    rarity?: string;
    type?: string;
    supertype?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PokemonTCGResponse<PokemonTCGCard>> {
    try {
      const queryParts: string[] = [];
      
      if (params.name) queryParts.push(`name:"${params.name}"*`);
      if (params.setId) queryParts.push(`set.id:"${params.setId}"`);
      if (params.rarity) queryParts.push(`rarity:"${params.rarity}"`);
      if (params.type) queryParts.push(`types:"${params.type}"`);
      if (params.supertype) queryParts.push(`supertype:"${params.supertype}"`);

      const response = await apiClient.get<PokemonTCGResponse<PokemonTCGCard>>('/cards', {
        params: {
          q: queryParts.join(' '),
          page: params.page || 1,
          pageSize: params.pageSize || 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }
}

