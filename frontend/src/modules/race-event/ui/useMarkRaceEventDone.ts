// src/modules/race-event/ui/useMarkRaceEventDone.ts
// Toute la logique de l'action « marquer comme terminé » : quel événement est visé,
// envoi en cours, erreur à afficher. La modale (ConfirmDialog) ne fait qu'afficher.
import { useState } from 'react'
import type { RaceEvent } from '../domain/RaceEvents'
import type { MarkRaceEventDone } from '../application/MarkRaceEventDone'

export function useMarkRaceEventDone(
  markRaceEventDone: MarkRaceEventDone,
  onDone: () => void,
) {
  // null = modale fermée
  const [target, setTarget] = useState<RaceEvent | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ouvre la modale pour l'événement visé.
  const request = (event: RaceEvent) => {
    setError(null)
    setTarget(event)
  }

  // Fermer pendant l'envoi laisserait un état incohérent : on l'interdit.
  const cancel = () => {
    if (isSubmitting) return
    setTarget(null)
    setError(null)
  }

  const confirm = async () => {
    if (!target || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      await markRaceEventDone(target.id)
      setTarget(null)
      onDone()
    } catch (e) {
      // La modale reste ouverte et affiche la raison.
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    request,
    // Tout ce dont ConfirmDialog a besoin, prêt à être branché : <ConfirmDialog {...dialogProps} />
    dialogProps: {
      open: target !== null,
      title: "Terminer l'événement",
      message: target ? `Marquer « ${target.nom} » comme terminé ?` : '',
      confirmLabel: 'Confirmer',
      isSubmitting,
      error,
      onConfirm: confirm,
      onCancel: cancel,
    },
  }
}
