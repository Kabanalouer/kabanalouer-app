import Link from 'next/link'

interface ListingCardProps {
  id: string
  title: string
  region: string
  capacity: number
  bedrooms: number
  price: number
  imageUrl: string
  tags?: string[]
}

export default function ListingCard({
  id,
  title,
  region,
  capacity,
  bedrooms,
  price,
  imageUrl,
  tags = [],
}: ListingCardProps) {
  return (
    <Link href={`/chalets/${id}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2 py-1 rounded-full bg-white/90 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
              {title}
            </h3>
          </div>

          <p className="text-xs text-gray-500 mb-3">{region}</p>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span>{capacity} personnes</span>
            <span>·</span>
            <span>{bedrooms} chambres</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-gray-900">{price} $</span>
              <span className="text-xs text-gray-500"> / nuit</span>
            </div>
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: '#E1F5EE', color: '#0F6E56' }}
            >
              Disponible
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
