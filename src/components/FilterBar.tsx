import { useState } from 'react'
import { CharacterFilters } from '@/types/api'

interface FilterBarProps {
  onFilterChange: (filters: CharacterFilters) => void
}

 // Filtre state'ini tanımlıyoruz
export const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<CharacterFilters>({
    name: '',
    status: '',
    species: '',
    gender: ''
  })

  // Input/select değişikliklerini yakalayan fonksiyon
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
     {/* İsim arama input'u */}
      <input
        type="text"
        name="name"
        placeholder="Search by name..."
        value={filters.name}
        onChange={handleChange}
        className="p-2 border rounded-lg"
      />

     {/* Durum filtresi select'i */}  
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="p-2 border rounded-lg"
      >
        <option value="">Any Status</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>

     {/* Tür filtreleme input'u */}
      <input
        type="text"
        name="species"
        placeholder="Filter by species..."
        value={filters.species}
        onChange={handleChange}
        className="p-2 border rounded-lg"
      />

     {/* Cinsiyet filtresi select'i */}
      <select
        name="gender"
        value={filters.gender}
        onChange={handleChange}
        className="p-2 border rounded-lg"
      >
        <option value="">Any Gender</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="genderless">Genderless</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
  )
}