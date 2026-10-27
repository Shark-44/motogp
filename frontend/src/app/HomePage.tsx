// app/HomePage.tsx
import { LinkButton } from '@/components/ui/button'

const entries = [
  { path: '/raceEvents', label: 'Calendrier', offset: 'ml-0 md:ml-[-100px]' },
  { path: '/circuits', label: 'Circuits', offset: 'ml-0 md:ml-[-40px]' },
  { path: '/riders', label: 'Pilotes', offset: 'ml-0 md:ml-[20px]' },
  { path: '/teams', label: 'Équipes', offset: 'ml-0 md:ml-[80px]' },
  { path: '/classements', label: 'Classements', offset: 'ml-0 md:ml-[140px]' },
]

function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-6 text-center">
      <header className="mb-12">
        <h3 className="text-3xl font-bold tracking-tight text-white">
          MotoGP – étude hexagonale
        </h3>
        <p className="mt-2 text-muted-foreground">
          Un projet qui cherche à être un modèle de conception de code,
          sur un thème qui me passionne.
        </p>
      </header>

      <div className="flex flex-col items-start gap-4 max-w-md mx-auto">
        {entries.map(({ path, label, offset }, index) => (
          <LinkButton
            key={path}
            href={path} // React Aria utilise 'href' pour les liens
            size="lg"
            className={`w-80 py-6 bg-red-600 text-black text-xl hover:bg-red-700 font-semibold shadow-lg justify-center transition-all duration-300 ${offset}`}
          >
            {index + 1}. {label}
          </LinkButton>
        ))}
      </div>
    </main>
  )
}

export default HomePage