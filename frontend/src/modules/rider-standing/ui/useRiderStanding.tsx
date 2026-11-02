import { useEffect, useState } from 'react'
import type { RiderStanding } from '../domain/RiderStanding'
import type { GetRiderStanding } from '../application/Getrider_standing'

type RiderStandingsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; standings: RiderStanding[] }

export function useRiderStandings(getRiderStanding: GetRiderStanding): RiderStandingsState {
  const [state, setState] = useState<RiderStandingsState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    getRiderStanding()
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
  }, [getRiderStanding])

  return state
}