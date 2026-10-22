import { useEffect, useState } from 'react'
import type { Circuit } from '../domain/Circuits'
import type { GetCircuits } from '../application/Getcircuits'

type CircuitsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; circuits: Circuit[] }

export function useCircuits(getCircuits: GetCircuits): CircuitsState {
  const [state, setState] = useState<CircuitsState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    getCircuits()
      .then((circuits) => {
        if (!cancelled) setState({ status: 'success', circuits })
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
  }, [getCircuits])

  return state
}