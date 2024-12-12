import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCharacters } from '@/services/api';
import { Character, CharacterFilters } from '@/types/api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Sıralanabilir karakter özelliklerini tanımlıyoruz
type SortableCharacterKey = keyof Pick<Character, 'name' | 'status' | 'species' | 'gender'> | 'origin.name';

// Karakterin durumuna göre renk sınıfını döndüren yardımcı fonksiyon
const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    alive: 'status-alive',
    dead: 'status-dead',
    unknown: 'status-unknown',
  };
  return colors[status.toLowerCase()] || 'status-unknown';
};

export const CharacterTable = () => {
  const [currentPage, setCurrentPage] = useState(1);                                       // Mevcut sayfa
  const [pageSize, setPageSize] = useState(20);                                           // Sayfa başına gösterilen karakter sayısı
  const [filters, setFilters] = useState<CharacterFilters>({});                           // API filtreleri
  const [localFilters, setLocalFilters] = useState<CharacterFilters>({});                 // Yerel filtreler
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);    // Seçilen karakter
  const [sortBy, setSortBy] = useState<SortableCharacterKey | null>(null);               // Sıralama sütunu
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');      // Sıralama düzeni

  
  // API sorgusu (karakterleri almak için)
  const { data: currentData, isLoading } = useQuery({
    queryKey: ['characters', filters],
    queryFn: () => getCharacters(filters),
    staleTime: 500,
    refetchOnWindowFocus: false,
  });

// Filtre değişikliklerini geciktirme (debounce) işlemi
  const debounceSetFilters = useCallback(
    (newFilters: CharacterFilters) => {
      const timeoutId = setTimeout(() => {
        setFilters(newFilters);
        setCurrentPage(1);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [] 
  );

// Filtre değişikliklerini izleme
  useEffect(() => {
    const cleanup = debounceSetFilters(localFilters);
    return cleanup;
  }, [localFilters, debounceSetFilters]);

// Filtre değişikliklerini yönetme
  const handleFilterChange = (key: keyof CharacterFilters) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // Sıralama işlemlerini yönetme
  const handleSort = (column: SortableCharacterKey) => {
    if (sortBy === column) {
      setSortOrder((prevOrder) => {
        if (prevOrder === 'asc') return 'desc';
        if (prevOrder === 'desc') return 'default';
        return 'asc';
      });
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

// Filtreleri sıfırlama
  const handleResetFilters = () => {
    setLocalFilters({});
    setFilters({});
    setSortBy(null);
    setSortOrder('default');
    setCurrentPage(1);
  };

// Verileri sıralama
  const sortedData = currentData?.results
    ? [...currentData.results].sort((a, b) => {
        if (!sortBy || sortOrder === 'default') return 0;

        const valueA = sortBy === 'origin.name' ? a.origin.name : a[sortBy];
        const valueB = sortBy === 'origin.name' ? b.origin.name : b[sortBy];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        return 0;
      })
    : [];

 // Sayfalama hesaplamaları
  const totalResults = sortedData?.length || 0;
  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Tablo içeriğini oluşturma
  const renderTableContent = () => {
    if (isLoading) {
      // Veriler yükleniyorsa skeleton gösterir
      return Array.from({ length: pageSize }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: 5 }).map((_, i) => (
            <td key={i}>
              <Skeleton height={20} />
            </td>
          ))}
        </tr>
      ));
    }
    
    // Veri yoksa mesaj gösterimi
    if (!sortedData.length) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-8">
            No characters found
          </td>
        </tr>
      );
    }

    // Verileri listele
    return paginatedData.map((character) => (
      <tr
        key={character.id}
        onClick={() => setSelectedCharacter(character)}
        className="table-row-dark"
      >
        <td>{character.name}</td>
        <td className={getStatusColor(character.status)}>{character.status}</td>
        <td>{character.species}</td>
        <td>{character.gender}</td>
        <td>{character.origin.name}</td>
      </tr>
    ));
  };

  // Bileşen render'ı
  return (
    <div className="container">
      <h1 className="title">Rick and Morty Characters</h1>

      <div className="filters-and-controls">
        <div className="grid">
          <input
            type="text"
            placeholder="Search by name..."
            value={localFilters.name || ''}
            onChange={handleFilterChange('name')}
            className="filter-input"
          />

          <select
            value={localFilters.status || ''}
            onChange={handleFilterChange('status')}
            className="filter-select"
          >
            <option value="">Any Status</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>

          <select
            value={localFilters.species || ''}
            onChange={handleFilterChange('species')}
            className="filter-select"
          >
            <option value="">Any Species</option>
            <option value="Human">Human</option>
            <option value="Alien">Alien</option>
          </select>

          <select
            value={localFilters.gender || ''}
            onChange={handleFilterChange('gender')}
            className="filter-select"
          >
            <option value="">Any Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="page-size-control">
          <label>Show:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="page-size-select"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span>entries</span>
        </div>

        <button
          className="reset-button"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>

      <div className="table-container">
        <table style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead>
            <tr>
              <th className={`sortable-header ${sortBy === 'name' ? (sortOrder === 'asc' ? 'asc' : sortOrder === 'desc' ? 'desc' : '') : ''}`} onClick={() => handleSort('name')}>
                Name
              </th>
              <th className={`sortable-header ${sortBy === 'status' ? (sortOrder === 'asc' ? 'asc' : sortOrder === 'desc' ? 'desc' : '') : ''}`} onClick={() => handleSort('status')}>
                Status
              </th>
              <th className={`sortable-header ${sortBy === 'species' ? (sortOrder === 'asc' ? 'asc' : sortOrder === 'desc' ? 'desc' : '') : ''}`} onClick={() => handleSort('species')}>
                Species
              </th>
              <th className={`sortable-header ${sortBy === 'gender' ? (sortOrder === 'asc' ? 'asc' : sortOrder === 'desc' ? 'desc' : '') : ''}`} onClick={() => handleSort('gender')}>
                Gender
              </th>
              <th className={`sortable-header ${sortBy === 'origin.name' ? (sortOrder === 'asc' ? 'asc' : sortOrder === 'desc' ? 'desc' : '') : ''}`} onClick={() => handleSort('origin.name')}>
                Origin
              </th>
            </tr>
          </thead>
          <tbody>
            {renderTableContent()}
          </tbody>
        </table>
      </div>

      {sortedData.length > 0 && (
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, totalResults)} of{' '}
            {totalResults} entries
          </span>
          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}

      {selectedCharacter && (
        <>
          <div className="modal-overlay" onClick={() => setSelectedCharacter(null)}></div>
          <div className="modal">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedCharacter.name}</h2>
                <button onClick={() => setSelectedCharacter(null)} className="close-button">
                  ✕
                </button>
              </div>
              <div className="modal-grid">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="character-image"
                />
                <div className="character-info">
                  <p>
                    <strong>Status: </strong>
                    <span className={getStatusColor(selectedCharacter.status)}>
                      {selectedCharacter.status}
                    </span>
                  </p>
                  <p><strong>Species: </strong>{selectedCharacter.species}</p>
                  <p><strong>Gender: </strong>{selectedCharacter.gender}</p>
                  <p><strong>Origin: </strong>{selectedCharacter.origin.name}</p>
                  <p><strong>Location: </strong>{selectedCharacter.location.name}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};