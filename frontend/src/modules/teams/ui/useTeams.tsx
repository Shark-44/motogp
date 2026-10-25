import { useEffect, useState } from 'react'
import type { Team } from '../domain/Teams'
import type { GetTeams } from '../application/Getteams'

type TeamsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; teams: Team[] }

export function useTeams(getTeams: GetTeams): TeamsState {
  const [state, setState] = useState<TeamsState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    getTeams()
      .then((teams) => {
        if (!cancelled) setState({ status: 'success', teams })
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message:
              error instanceof Error ? error.message : 'Erreur inconnue.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [getTeams])

  return state
}