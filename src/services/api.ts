import axios from 'axios';
import { ApiResponse, CharacterFilters } from '../types/api';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const api = axios.create({
  baseURL: BASE_URL,
});

export const getCharacters = async (
  filters: CharacterFilters = {}
): Promise<ApiResponse> => {
  const params = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
    ),
  });

  try {
    // İlk istekte toplam sayfa sayısını alıyoruz
    const initialResponse = await api.get<ApiResponse>(`/character?${params}`);
    const totalPages = initialResponse.data.info.pages;

    // Tüm sayfalar için istekleri oluşturuyoruz
    const requests = Array.from({ length: totalPages }, (_, index) =>
      api.get<ApiResponse>(`/character?${params}&page=${index + 1}`)
    );

    // Tüm sayfalardan gelen sonuçları birleştiriyoruz
    const responses = await Promise.all(requests);
    const allResults = responses.flatMap(response => response.data.results);

    return {
      results: allResults,
      info: initialResponse.data.info,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch characters');
    }
    throw error;
  }
};
