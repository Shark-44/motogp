// src/modules/auth/ui/UpdateRaceStatusModal.tsx
import { useState } from 'react';

export type StatutGP = 'PLANIFIE' | 'TERMINE' | 'ANNULE';

interface UpdateRaceStatusModalProps {
  open: boolean;
  eventId: string;
  currentStatut: StatutGP;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const UpdateRaceStatusModal = ({
  open,
  eventId,
  onOpenChange,
  onSuccess,
}: UpdateRaceStatusModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const storedToken = localStorage.getItem('admin_token');
      const token = storedToken ? JSON.parse(storedToken)[0] : '';

      const response = await fetch(`/raceEvents/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ statut: 'TERMINE' }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Erreur lors de la mise à jour.');
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError((err as Error).message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Terminer l'événement
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Êtes-vous sûr de vouloir passer le statut de cet événement à <strong className="text-red-600">TERMINE</strong> ?
        </p>

        <form onSubmit={handleUpdateStatus} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? 'Mise à jour...' : 'Confirmer comme terminé'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};