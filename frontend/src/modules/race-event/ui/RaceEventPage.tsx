import { useEffect, useRef, useState } from 'react'
import type { GetRaceEvents } from '../application/Getrace_events'
import { findNextEventIndex } from './findNextEventIndex'
import { useRaceEvents } from './use-race-events'

interface RaceEventPageProps {
  getRaceEvents: GetRaceEvents
}

// Créé une seule fois, hors du composant : inutile de le refabriquer à chaque rendu.
const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })

// Le libellé affiché sur chaque carte : un état écrit, pas seulement un contraste.
function labelFor(statut: string, isPast: boolean, isNext: boolean): string {
  if (statut === 'ANNULE') return 'Annulé'
  if (isPast) return 'Terminé'
  if (isNext) return 'Prochain'
  return 'À venir'
}

function RaceEventPage({ getRaceEvents }: RaceEventPageProps) {
  const state = useRaceEvents(getRaceEvents)

  // Une référence par carte, pour pouvoir faire défiler jusqu'à elle.
  const cardRefs = useRef<(HTMLLIElement | null)[]>([])

  // null = l'utilisateur n'a encore rien choisi : on reste sur le prochain événement.
  const [selected, setSelected] = useState<number | null>(null)

  const events = state.status === 'success' ? state.raceEvents : []

  // -1 si la saison est terminée (aucun événement à venir).
  const nextIndex = findNextEventIndex(events, new Date())

  // La carte sur laquelle on se centre : le prochain, sinon le dernier de la saison.
  const focusIndex = nextIndex >= 0 ? nextIndex : events.length - 1
  const current = selected ?? focusIndex

  // Au chargement : on centre la carte du prochain événement.
  useEffect(() => {
    if (focusIndex >= 0) {
      cardRefs.current[focusIndex]?.scrollIntoView({
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [focusIndex])

  // Pour les boutons : on borne l'index puis on fait défiler en douceur.
  function goTo(index: number) {
    const target = Math.min(Math.max(index, 0), events.length - 1)
    setSelected(target)
    cardRefs.current[target]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }

  const buttonClass =
    'rounded-md border border-white/40 px-3 py-2 text-white disabled:opacity-40'

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white!">
          Calendrier des Grands Prix
        </h1>

        
      </div>
      <div className='mb-6 flex items-center justify-center '>
      {state.status === 'success' && events.length > 0 && (
          <div className="flex gap-6">
            <button
              type="button"
              aria-label="Événement précédent"
              className={buttonClass}
              disabled={current <= 0}
              onClick={() => goTo(current - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Événement suivant"
              className={buttonClass}
              disabled={current >= events.length - 1}
              onClick={() => goTo(current + 1)}
            >
              ›
            </button>
          </div>
        )}
      </div>
      {state.status === 'loading' && (
        <p role="status" className="text-muted-foreground">
          Chargement des événements…
        </p>
      )}

      {state.status === 'error' && (
        <p role="alert" className="text-destructive">
          {state.message} Vérifie que le backend est démarré, puis recharge la
          page.
        </p>
      )}

      {state.status === 'success' && events.length === 0 && (
        <p className="text-muted-foreground">Aucun événement enregistré.</p>
      )}

      {state.status === 'success' && events.length > 0 && (
        // Le remplissage latéral (moitié de la largeur moins la moitié d'une carte,
        // soit 10rem pour w-80) permet de centrer aussi la première et la dernière carte.
        <ul className="flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[calc(50%-10rem)] py-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {events.map((event, index) => {
            const isNext = index === nextIndex
            // Passé = avant le prochain, ou toute la liste si la saison est terminée.
            const isPast = nextIndex === -1 || index < nextIndex
            const isDimmed = isPast || event.statut === 'ANNULE'

            return (
              <li
                key={event.id}
                ref={(element) => {
                  cardRefs.current[index] = element
                }}
                aria-current={isNext ? 'true' : undefined}
                className={`flex w-80 shrink-0 snap-center flex-col justify-between rounded-xl border bg-card p-6 shadow-md transition-all duration-300 ${
                  isDimmed ? 'scale-95 opacity-60 grayscale' : ''
                } ${isNext ? 'scale-105 ring-2 ring-primary' : ''}`}
              >
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {labelFor(event.statut, isPast, isNext)}
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-card-foreground">
                    {event.nom}
                  </h2>
                </div>

                <div className="mt-6 border-t border-border/50 pt-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {dateFormatter.format(event.date)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

export default RaceEventPage
