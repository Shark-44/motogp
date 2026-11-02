import { useEffect, useState } from 'react'
import type { Rider } from '../domain/Riders'
import type { GetRiders } from '../application/Getriders'

type RidersState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; riders: Rider[] }

export function useRiders(getRiders: GetRiders): RidersState {
  const [state, setState] = useState<RidersState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    getRiders()
      .then((riders) => {
        if (!cancelled) setState({ status: 'success', riders })
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
  }, [getRiders])

  return state
}