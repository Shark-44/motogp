import { useEffect, useRef, useState } from 'react';
import type { GetRaceEventsIncomplet } from '../application/GetRaceEventsIncomplet';
import { useRaceEvents } from './use-race-events';
import { Link } from 'react-router';

interface IncompleteRaceEventsCarouselProps {
  getRaceEvents: GetRaceEventsIncomplet; 
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });

export function IncompleteRaceEventsCarousel({
  getRaceEvents,
}: IncompleteRaceEventsCarouselProps) {
  const { state } = useRaceEvents(getRaceEvents);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(0);

  const events = state.status === 'success' ? state.raceEvents : [];
  const current = selected ?? 0;

  useEffect(() => {
    if (events.length > 0) {
      cardRefs.current[0]?.scrollIntoView({
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [events.length]);

  function goTo(index: number) {
    const target = Math.min(Math.max(index, 0), events.length - 1);
    setSelected(target);
    cardRefs.current[target]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }

  const buttonClass =
    'rounded-md border border-white/40 px-3 py-2 text-white disabled:opacity-40';

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Grands Prix en attente de résultats
        </h2>
      </div>

      <div className="mb-6 flex items-center justify-center">
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
          {state.message}
        </p>
      )}

      {state.status === 'success' && events.length === 0 && (
        <p className="text-lg text-white">
          Aucun Grand Prix en attente de résultats. Tout est à jour !
        </p>
      )}

      {state.status === 'success' && events.length > 0 && (
        <ul className="flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[calc(50%-10rem)] py-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {events.map((event, index) => (
            <li
              key={event.id}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className="flex w-80 shrink-0 snap-center flex-col justify-between rounded-xl border bg-card p-6 shadow-md transition-all duration-300 text-left scale-100"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Résultats requis
                </span>
                <h3 className="text-xl font-bold tracking-tight text-card-foreground">
                  {event.nom}
                </h3>
              </div>

              <div className="mt-6 border-t border-border/50 pt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {dateFormatter.format(event.date)}
                </p>
              </div>

              <Link
                to={`/events/${event.id}/results`}
                className="mt-4 block w-full rounded-md bg-red-600 py-2 text-center text-white hover:bg-red-700 font-semibold shadow"
              >
                Mettre a jour
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}