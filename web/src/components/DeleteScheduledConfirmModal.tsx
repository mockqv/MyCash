import { Loader2, Trash2 } from "lucide-react";
import { useDeleteScheduled } from "../hooks/useScheduledMutations";
import type { ScheduledTransaction } from "../types/scheduled";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  scheduled: ScheduledTransaction | null;
  onSuccess?: () => void;
};

export default function DeleteScheduledConfirmModal({
  isOpen,
  onClose,
  scheduled,
  onSuccess,
}: Props) {
  const { mutateAsync: deleteScheduled, isPending } = useDeleteScheduled();

  async function handleDelete() {
    if (!scheduled) return;
    await deleteScheduled(scheduled.id);
    onSuccess?.();
    onClose();
  }

  if (!isOpen || !scheduled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-app-card dark:bg-dark-card border border-transparent dark:border-dark-border rounded-3xl shadow-xl w-full max-w-sm mx-4 p-8 flex flex-col items-center text-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-black text-app-text dark:text-dark-text mb-1">
            Excluir agendado
          </h2>
          <p className="text-sm text-app-muted dark:text-dark-muted">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-app-text dark:text-dark-text">
              "{scheduled.description}"
            </span>
            ? Essa ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-app-elevated dark:bg-dark-elevated text-app-muted dark:text-dark-muted hover:bg-app-hover dark:hover:bg-dark-hover transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
