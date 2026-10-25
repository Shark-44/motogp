import type { GetTeams } from '../application/Getteams'
import { useTeams } from './useTeams'

interface TeamsPageProps {
  getTeams: GetTeams
}

function TeamsPage({ getTeams }: TeamsPageProps) {
  const state = useTeams(getTeams)

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl text-white! font-bold tracking-tight">Les équipes</h1>

      {state.status === 'loading' && (
        <p role="status" className="text-muted-foreground">
          Chargement des equipes…
        </p>
      )}

      {state.status === 'error' && (
        <p role="alert" className="text-destructive">
          {state.message} Vérifie que le backend est démarré, puis recharge la
          page.
        </p>
      )}

      {state.status === 'success' && state.teams.length === 0 && (
        <p className="text-muted-foreground">Aucune equipe enregistré.</p>
      )}

      {state.status === 'success' && state.teams.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
          {state.teams.map((team) => (
            <li key={team.id} className="overflow-hidden rounded-lg border bg-white">
              <img
                src={team.logo}
                alt={`Photo du circuit ${team.nom}`}
                loading="lazy"
                className="h-90 w-full object-contain bg-white border-2 border-black" 
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{team.nom}</h2>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default TeamsPage
