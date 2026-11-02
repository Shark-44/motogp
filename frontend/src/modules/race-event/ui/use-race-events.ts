import { useEffect, useState } from 'react'
import type { RaceEvent } from '../domain/RaceEvents'
import type { GetRaceEvents } from '../application/Getrace_events'

// Union discriminée pour typer précisément l'état de l'UI
export type RaceEventsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; raceEvents: RaceEvent[] }

export function useRaceEvents(getRaceEvents: GetRaceEvents): RaceEventsState {
  const [state, setState] = useState<RaceEventsState>({ status: 'loading' })

  useEffect(() => {
    let isMounted = true

    async function fetchRaceEvents() {
      try {
        const events = await getRaceEvents()

        if (isMounted) {
          setState({
            status: 'success',
            raceEvents: events,
          })
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Impossible de récupérer les événements de course.'

          setState({
            status: 'error',
            message: errorMessage,
          })
        }
      }
    }

    fetchRaceEvents()

    // Nettoyage en cas de démontage du composant (évite les memory leaks)
    return () => {
      isMounted = false
    }
  }, [getRaceEvents])

  return state
}