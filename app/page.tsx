import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import Footer from '@/components/Footer'
import Link from 'next/link'

const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Chalet rustique au bord du lac avec sauna',
    region: 'Laurentides',
    capacity: 8,
    bedrooms: 3,
    price: 285,
    imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80',
    tags: ['Coup de cœur'],
  },
  {
    id: '2',
    title: 'Refuge de montagne avec vue panoramique',
    region: 'Charlevoix',
    capacity: 6,
    bedrooms: 2,
    price: 220,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    tags: ['Nouveau'],
  },
  {
    id: '3',
    title: 'Chalet 4 saisons en forêt boréale',
    region: 'Saguenay–Lac-Saint-Jean',
    capacity: 10,
    bedrooms: 4,
    price: 340,
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=80',
    tags: [],
  },
  {
    id: '4',
    title: 'Micro-chalet minimaliste pour deux',
    region: 'Cantons-de-l\'Est',
    capacity: 2,
    bedrooms: 1,
    price: 145,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    tags: ['Populaire'],
  },
  {
    id: '5',
    title: 'Grand chalet familial avec plage privée',
    region: 'Mauricie',
    capacity: 14,
    bedrooms: 5,
    price: 480,
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80',
    tags: [],
  },
  {
    id: '6',
    title: 'Yourte confortable au coeur des bois',
    region: 'Lanaudière',
    capacity: 4,
    bedrooms: 2,
    price: 165,
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
    tags: ['Insolite'],
  },
]

const REGIONS = [
  { name: 'Laurentides', emoji: '🏔️', count: 142 },
  { name: 'Charlevoix', emoji: '🌊', count: 89 },
  { name: 'Cantons-de-l\'Est', emoji: '🍂', count: 76 },
  { name: 'Mauricie', emoji: '🌲', count: 65 },
  { name: 'Lanaudière', emoji: '🦌', count: 54 },
  { name: 'Saguenay', emoji: '❄️', count: 48 },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <section className="relative py-24 px-4" style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 50%, #0F6E56 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Votre chalet idéal<br />vous attend au Québec
          </h1>
          <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
            Des centaines de chalets authentiques loués par des propriétaires locaux passionnés.
          </p>
          <SearchBar />
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
          </svg>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explorer par région</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {REGIONS.map((region) => (
            <Link key={region.name} href={`/chalets?region=${region.name}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors text-center group">
              <span className="text-3xl">{region.emoji}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">{region.name}</span>
              <span className="text-xs text-gray-400">{region.count} chalets</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Chalets à la une</h2>
          <Link href="/chalets" className="text-sm font-medium hover:underline" style={{ color: '#0F6E56' }}>
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LISTINGS.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </section>

      <section className="mx-4 sm:mx-8 lg:mx-auto max-w-6xl mb-16 rounded-3xl overflow-hidden">
        <div className="p-10 sm:p-14 text-center" style={{ background: '#F0FDF8' }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Vous avez un chalet à louer ?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Rejoignez des centaines de propriétaires québécois. Publiez votre annonce en quelques minutes pour 299 $/an.
          </p>
          <Link href="/auth/register"
            className="inline-block text-white font-semibold px-8 py-4 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: '#0F6E56' }}>
            Publier mon chalet
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
