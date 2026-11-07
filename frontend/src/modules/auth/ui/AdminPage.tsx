import { LinkButton } from '@/components/ui/button'

const entries = [
  { path: '/raceEvents', label: 'Calendrier', offset: 'ml-0 md:ml-[-160px]' },
  { path: '/circuits', label: 'Circuits', offset: 'ml-0 md:ml-[60px]' },
  { path: '/riders', label: 'Pilotes', offset: 'ml-0 md:ml-[320px]' },
  { path: '/teams', label: 'Équipes', offset: 'ml-0 md:ml-[-160px]' },
  { path: '/riderStandings', label: 'Classement par pilote', offset: 'ml-0 md:ml-[60px]' },
  { path: '/teamStandings', label: 'Classement par équipe', offset: 'ml-0 md:ml-[320px]' },

]

function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 text-center">
      <header className="mb-12">
        <h3 className="text-3xl font-bold tracking-tight text-white">
          Gestion du championnat 
        </h3>
        
      </header>

      <div className="flex flex-col items-start gap-6 max-w-md mx-auto">
        {entries.map(({ path, label, offset }, index) => (
          <div
            key={`${path}-${index}`}
            
            className={`p-2 border-t-4 border-l-4 border-r-4 border-white/80 rounded-t-lg transition-all duration-300 ${offset}`}
          >
            <LinkButton
              href={path}
              size="lg"
              className="w-70 py-4 bg-red-600 text-black text-xl hover:bg-red-700 font-semibold shadow-lg justify-center transition-all duration-300"
            >
              {index + 1}. {label}
            </LinkButton>
          </div>
        ))}
      </div>
    </main>
  )
}

export default AdminPage