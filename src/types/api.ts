// src/types/api.ts

export interface Character {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
    origin: Location;
    location: Location;
    image: string;
    episode: string[];
    url: string;
    created: string;
  }
  
  export interface Location {
    name: string;
    url: string;
  }
  
  export interface ApiResponse {
    info: {
      count: number;
      pages: number;
      next: string | null;
      prev: string | null;
    };
    results: Character[];
  }
  
  export interface CharacterFilters {
    name?: string;
    status?: string;
    species?: string;
    type?: string;
    gender?: string;
  }