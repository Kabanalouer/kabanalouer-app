'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const REGIONS = [
  'Laurentides',
  'Charlevoix',
  'Lanaudière',
  'Cantons-de-l\'Est',
  'Mauricie',
  'Saguenay–Lac-Saint-Jean',
  'Outaouais',
  'Chaudière-Appalaches',
]

export default function SearchBar() {
  const [region, setRegion] = useState('')
  const [guests, setGuests] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (region) params.set('region', region)
    if (guests) params.set('personnes', guests)
    router.push(`/chalets?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
    >
      <div className="flex-1 flex flex-col px-4 py-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Région
        </label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="text-sm text-gray-700 bg-transparent outline-none"
        >
          <option value="">Toutes les régions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="hidden sm:block w-px bg-gray-200 my-2" />

      <div className="flex-1 flex flex-col px-4 py-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Personnes
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="text-sm text-gray-700 bg-transparent outline-none"
        >
          <option value="">Nombre de personnes</option>
          {[2, 4, 6, 8, 10, 12, 15, 20].map((n) => (
            <option key={n} value={n}>{n} personnes</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="text-white font-medium px-6 py-3 rounded-xl transition-opacity hover:opacity-90 whitespace-nowrap"
        style={{ background: '#0F6E56' }}
      >
        Rechercher
      </button>
    </form>
  )
}
