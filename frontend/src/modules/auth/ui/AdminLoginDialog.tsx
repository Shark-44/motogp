// src/modules/auth/ui/AdminLoginDialog.tsx
interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AdminLoginDialog = ({ open, onOpenChange, onSuccess }: AdminLoginDialogProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold">Connexion admin</h2>
        <button
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          onClick={onSuccess}
        >
          Simuler login OK
        </button>
      </div>
    </div>
  );
};
