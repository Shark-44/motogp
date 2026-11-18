// src/modules/session-results/ui/useSessionResultsData.ts
// Charge ce dont la page a besoin avant d'afficher le formulaire : les pilotes et l'événement.
import { useEffect, useState } from 'react'
import type { EventOption, RiderOption } from '../domain/SessionResult'

export type SessionResultsDataState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; riders: RiderOption[]; event: EventOption | undefined }

export function useSessionResultsData(
  getRiders: () => Promise<RiderOption[]>,
  getRaceEvents: () => Promise<EventOption[]>,
  eventId: string,
): SessionResultsDataState {
  const [state, setState] = useState<SessionResultsDataState>({ status: 'loading' })

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const [riders, events] = await Promise.all([getRiders(), getRaceEvents()])
        if (isMounted) {
          setState({
            status: 'success',
            riders,
            event: events.find((event) => event.id === eventId),
          })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            status: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'Impossible de charger les données de la saisie.',
          })
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [getRiders, getRaceEvents, eventId])

  return state
}
