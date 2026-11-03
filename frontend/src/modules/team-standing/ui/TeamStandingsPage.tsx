import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TeamStanding } from '../domain/TeamStanding'
import type { GetTeamStanding } from '../application/Getteam_standing'
import { useTeamStandings } from './useTeamStanding'

interface TeamStandingsPageProps {
  getTeamStanding: GetTeamStanding
}

export function TeamStandingsPage({ getTeamStanding }: TeamStandingsPageProps) {
  const state = useTeamStandings(getTeamStanding)

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-white!">Classement des équipes</h1>

      {state.status === 'loading' && (
        <p role="status" className="text-muted-foreground">Chargement du classement…</p>
      )}

      {state.status === 'error' && (
        <p role="alert" className="text-destructive">
          {state.message} Vérifie que le backend est démarré, puis recharge la page.
        </p>
      )}

      {state.status === 'success' && state.standings.length === 0 && (
        <p className="p-4 text-muted-foreground">Aucun classement disponible.</p>
      )}

      {state.status === 'success' && state.standings.length > 0 && (
        <TeamStandingsTable standings={state.standings} />
      )}
    </main>
  )
}

function TeamStandingsTable({ standings }: { standings: TeamStanding[] }) {
  const currentEventName = standings[0]?.nomEvent ?? 'Grand Prix'
  const currentEventDate = standings[0]?.dateEvent 
    ? new Date(standings[0].dateEvent).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{currentEventName}</CardTitle>
        {currentEventDate && (
          <p className="text-sm text-muted-foreground">{currentEventDate}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-16">
                  Pos.
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Équipe
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Points cumulés
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {standings.map((team) => (
                <tr
                  key={team.equipeId}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">
                    #{team.positionGenerale}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                    {team.logoEquipe ? (
                      <img
                        src={`${team.logoEquipe}`} 
                        alt={team.nomEquipe ?? 'Logo équipe'}
                        className="h-20 w-38 object-contain"
                      />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                      <span className="font-medium">{team.nomEquipe ?? 'Équipe inconnue'}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right font-semibold">
                    {team.pointsCumules} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default TeamStandingsPage