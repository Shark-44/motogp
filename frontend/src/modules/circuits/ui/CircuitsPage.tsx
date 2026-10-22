import type { GetCircuits } from '../application/Getcircuits'
import { useCircuits } from './useCircuits'

interface CircuitsPageProps {
  getCircuits: GetCircuits
}

function CircuitsPage({ getCircuits }: CircuitsPageProps) {
  const state = useCircuits(getCircuits)

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl text-white! font-bold tracking-tight">Les circuits</h1>

      {state.status === 'loading' && (
        <p role="status" className="text-muted-foreground">
          Chargement des circuits…
        </p>
      )}

      {state.status === 'error' && (
        <p role="alert" className="text-destructive">
          {state.message} Vérifie que le backend est démarré, puis recharge la
          page.
        </p>
      )}

      {state.status === 'success' && state.circuits.length === 0 && (
        <p className="text-muted-foreground">Aucun circuit enregistré.</p>
      )}

      {state.status === 'success' && state.circuits.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
          {state.circuits.map((circuit) => (
            <li key={circuit.id} className="overflow-hidden rounded-lg border bg-white">
              <img
                src={circuit.photo}
                alt={`Photo du circuit ${circuit.nom}`}
                loading="lazy"
                className="h-90 w-full object-contain bg-white" // Remplacé object-cover par object-contain + un petit padding si besoin
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{circuit.nom}</h2>
                <p className="text-muted-foreground">{circuit.pays}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default CircuitsPage
