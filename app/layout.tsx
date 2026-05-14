import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kabanalouer — Chalets au Québec',
  description: 'Trouvez le chalet parfait au Québec. Locations de chalets par des propriétaires locaux.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
