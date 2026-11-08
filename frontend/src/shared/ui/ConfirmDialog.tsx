// src/shared/ui/ConfirmDialog.tsx
// Modale de confirmation générique : de l'affichage pur, aucune logique métier.
// Tout ce qu'elle affiche et déclenche lui est donné en props.
interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  isSubmitting?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  isSubmitting = false,
  error = null,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      // Pendant l'envoi, un clic à côté ne ferme pas la modale.
      onClick={() => {
        if (!isSubmitting) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="confirm-dialog-title"
          className="mb-2 text-lg font-semibold text-gray-900 dark:text-white"
        >
          {title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="button"
            className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mise à jour...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
