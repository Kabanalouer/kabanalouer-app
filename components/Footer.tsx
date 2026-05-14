import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0F6E56' }}>
                <span className="text-white text-xs font-bold">K</span>
              </div>
              <span className="font-semibold" style={{ color: '#0F6E56' }}>Kabanalouer</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              La marketplace de chalets québécois. Trouvez votre escapade idéale.
            </p>
          </div>

          {/* Explorer */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Explorer</h4>
            <ul className="space-y-2">
              {['Laurentides', 'Charlevoix', 'Cantons-de-l\'Est', 'Mauricie'].map((r) => (
                <li key={r}>
                  <Link href={`/chalets?region=${r}`} className="text-sm text-gray-500 hover:text-gray-700">
                    {r}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hôtes */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Hôtes</h4>
            <ul className="space-y-2">
              {[
                { label: 'Publier mon chalet', href: '/auth/register' },
                { label: 'Comment ça marche', href: '/comment-ca-marche' },
                { label: 'Tarifs', href: '/tarifs' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-gray-700">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Kabanalouer</h4>
            <ul className="space-y-2">
              {[
                { label: 'À propos', href: '/a-propos' },
                { label: 'Confidentialité', href: '/confidentialite' },
                { label: 'Conditions', href: '/conditions' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-gray-700">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2025 Kabanalouer. Tous droits réservés.</p>
          <p className="text-xs text-gray-400">Fait avec ❤️ au Québec</p>
        </div>
      </div>
    </footer>
  )
}
