import CountryFlag from '@/shared/ui/CoutryFlag'
import type { GetRiders } from '../application/Getriders'
import { useRiders } from './useRiders'

interface RidersPageProps {
  getRiders: GetRiders
}

function RidersPage({ getRiders }: RidersPageProps) {
  const state = useRiders(getRiders)

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-white!">Les pilotes</h1>

      {state.status === 'loading' && (
        <p role="status" className="text-muted-foreground">
          Chargement des pilotes…
        </p>
      )}

      {state.status === 'error' && (
        <p role="alert" className="text-destructive">
          {state.message} Vérifie que le backend est démarré, puis recharge la page.
        </p>
      )}

      {state.status === 'success' && state.riders.length === 0 && (
        <p className="text-muted-foreground">Aucun pilote enregistré.</p>
      )}

      {state.status === 'success' && state.riders.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {state.riders.map((rider) => {
            return (
              <li key={rider.id} className="overflow-hidden rounded-lg border bg-white">
                <img
                  src={rider.photo}
                  alt={`Photo du pilote ${rider.nom}`}
                  loading="lazy"
                  className="h-90 w-full bg-white object-contain"
                />
                <div className="p-4">                  
                  <div className="flex items-center justify-center gap-2.5">
                    <h2 className="text-lg font-semibold">{`${rider.prenom} ${rider.nom}`}</h2>
                    {rider.fimNumber && (
                      <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-black italic text-white shadow-xs">
                        #{rider.fimNumber}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 inline-flex items-center gap-2 text-muted-foreground">
                    <span>{rider.pays}</span>
                    <CountryFlag country={rider.pays} />
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

export default RidersPage