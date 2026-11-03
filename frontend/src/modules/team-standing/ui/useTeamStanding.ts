import { useEffect, useState } from 'react'
import type { TeamStanding } from '../domain/TeamStanding'
import type { GetTeamStanding } from '../application/Getteam_standing'

type TeamStandingsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; standings: TeamStanding[] }

export function useTeamStandings(getTeamStanding: GetTeamStanding): TeamStandingsState {
  const [state, setState] = useState<TeamStandingsState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    getTeamStanding()
      .then((standings) => {
        if (!cancelled) setState({ status: 'success', standings })
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Erreur inconnue.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [getTeamStanding])

  return state
}