// src/modules/session-results/ui/RaceSessionResultsPage.tsx
import { useParams } from 'react-router'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import type {
  EventOption,
  ResultStatus,
  RiderOption,
  SessionType,
} from '../domain/SessionResult'
import type { SaveSessionResults } from '../application/SaveSessionResults'
import { useSessionResultsData } from './useSessionResultsData'
import { useSessionResultsForm } from './useSessionResultsForm'
import { SESSION_LABEL, STATUS_LABEL } from './labels'

interface RaceSessionResultsPageProps {
  getRiders: () => Promise<RiderOption[]>
  getRaceEvents: () => Promise<EventOption[]>
  saveSessionResults: SaveSessionResults
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })

const selectClass =
  'w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm'

function RaceSessionResultsPage({
  getRiders,
  getRaceEvents,
  saveSessionResults,
}: RaceSessionResultsPageProps) {
  const { eventId = '' } = useParams()
  const data = useSessionResultsData(getRiders, getRaceEvents, eventId)

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-1 text-3xl font-bold tracking-tight text-white!">
        Saisie des résultats
      </h1>

      {data.status === 'loading' && (
        <p role="status" className="text-muted-foreground">
          Chargement…
        </p>
      )}

      {data.status === 'error' && (
        <p role="alert" className="text-destructive">
          {data.message}
        </p>
      )}

      {data.status === 'success' && !data.event && (
        <p role="alert" className="text-destructive">
          Événement introuvable.
        </p>
      )}

      {data.status === 'success' && data.event && data.event.statut !== 'TERMINE' && (
        <p role="alert" className="text-destructive">
          « {data.event.nom} » n'est pas terminé : marque-le d'abord comme terminé
          dans le calendrier avant de saisir ses résultats.
        </p>
      )}

      {data.status === 'success' && data.event && data.event.statut === 'TERMINE' && (
        <SessionResultsForm
          eventId={eventId}
          event={data.event}
          riders={data.riders}
          saveSessionResults={saveSessionResults}
        />
      )}
    </main>
  )
}

interface SessionResultsFormProps {
  eventId: string
  event: EventOption
  riders: RiderOption[]
  saveSessionResults: SaveSessionResults
}

// Monté seulement quand l'événement est chargé et terminé : le hook reçoit son nom dès le départ.
function SessionResultsForm({
  eventId,
  event,
  riders,
  saveSessionResults,
}: SessionResultsFormProps) {
  const form = useSessionResultsForm({
    eventId,
    eventName: event.nom,
    saveSessionResults,
  })

  return (
    <>
      <p className="mb-6 text-sm text-white/70">
        {event.nom} · {dateFormatter.format(event.date)}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-6 rounded-xl border border-border bg-card p-4 text-card-foreground">
        <label className="flex items-center gap-2 text-sm font-semibold">
          Session
          <select
            value={form.sessionType}
            onChange={(e) => form.changeSession(e.target.value as SessionType)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm font-normal"
          >
            {(Object.keys(SESSION_LABEL) as SessionType[]).map((type) => (
              <option key={type} value={type}>
                {SESSION_LABEL[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.withWildcards}
            onChange={(e) => form.setWithWildcards(e.target.checked)}
          />
          Ajouter 2 lignes (wildcards)
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card text-card-foreground">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Pos.</th>
              <th className="p-3">Pilote</th>
              <th className="p-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {form.rows.map((row) => (
              <tr key={row.position} className="border-b border-border/50 last:border-0">
                <td className="w-16 p-3 font-bold">P{row.position}</td>
                <td className="p-2">
                  <select
                    aria-label={`Pilote en position ${row.position}`}
                    value={row.fimNumber ?? ''}
                    onChange={(e) =>
                      form.selectRider(row.position, e.target.value || null)
                    }
                    className={selectClass}
                  >
                    <option value="">— Sélectionner un pilote —</option>
                    {riders.map((rider) => (
                      <option
                        key={rider.fimNumber}
                        value={rider.fimNumber}
                        disabled={
                          form.assigned.has(rider.fimNumber) &&
                          rider.fimNumber !== row.fimNumber
                        }
                      >
                        #{rider.fimNumber} · {rider.prenom} {rider.nom}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <select
                    aria-label={`Statut en position ${row.position}`}
                    value={row.statut}
                    onChange={(e) =>
                      form.setStatus(row.position, e.target.value as ResultStatus)
                    }
                    className={selectClass}
                  >
                    {(Object.keys(STATUS_LABEL) as ResultStatus[]).map((statut) => (
                      <option key={statut} value={statut}>
                        {STATUS_LABEL[statut]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form.formError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {form.formError}
        </p>
      )}
      {form.notice && (
        <p role="status" className="mt-4 text-sm text-green-500">
          {form.notice}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={form.requestSave}
          className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Valider les résultats ({SESSION_LABEL[form.sessionType]})
        </button>
      </div>

      <ConfirmDialog {...form.dialogProps} />
    </>
  )
}

export default RaceSessionResultsPage
