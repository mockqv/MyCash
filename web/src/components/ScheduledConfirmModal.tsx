import { useState } from "react";
import {
  Loader2,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useConfirmScheduled } from "../hooks/useScheduledMutations";
import { formatCurrency } from "../utils/formatters";
import { categoryLabels } from "../utils/transaction";
import type { ScheduledTransaction } from "../types/scheduled";
import { TransactionType } from "../types/transaction";

type Props = {
  items: ScheduledTransaction[];
  onDismiss: () => void;
};

export default function ScheduledConfirmModal({ items, onDismiss }: Props) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const { mutateAsync: confirm, isPending: isConfirming } =
    useConfirmScheduled();

  const current = items[index];

  async function handleConfirm() {
    await confirm(current.id);
    setDone((prev) => [...prev, current.id]);
    advance();
  }

  function handleSkip() {
    advance();
  }

  function handleLater() {
    onDismiss();
  }

  function advance() {
    if (index + 1 < items.length) {
      setIndex((i) => i + 1);
    } else {
      onDismiss();
    }
  }

  if (!current) return null;

  const isReceita = current.type === TransactionType.Receita;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative bg-app-card dark:bg-dark-card border border-transparent dark:border-dark-border rounded-3xl shadow-xl w-full max-w-sm mx-4 p-8 flex flex-col items-center text-center gap-6">
        {items.length > 1 && (
          <div className="absolute top-5 right-6 flex items-center gap-1">
            {items.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-4 bg-app-accent dark:bg-dark-accent"
                    : "w-1.5 bg-app-elevated dark:bg-dark-elevated"
                }`}
              />
            ))}
          </div>
        )}

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isReceita ? "bg-green-500/10" : "bg-red-500/10"}`}
        >
          <CalendarClock
            size={24}
            className={isReceita ? "text-green-500" : "text-red-500"}
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-2">
            {isReceita ? "Receita recorrente" : "Despesa recorrente"} — dia{" "}
            {current.dayOfMonth}
          </p>
          <h2 className="text-lg font-black text-app-text dark:text-dark-text mb-1">
            {current.description}
          </h2>
          <p
            className={`text-2xl font-black ${isReceita ? "text-green-600" : "text-red-500"}`}
          >
            {isReceita ? "+" : "-"} {formatCurrency(current.amount)}
          </p>
          <p className="text-xs text-app-muted dark:text-dark-muted mt-2">
            {categoryLabels[current.category]}
          </p>
        </div>

        <p className="text-sm text-app-muted dark:text-dark-muted">
          {isReceita
            ? "Essa receita recorrente aconteceu hoje?"
            : "Essa despesa recorrente foi realizada hoje?"}
        </p>

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity cursor-pointer disabled:opacity-50 bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg hover:opacity-80"
          >
            {isConfirming ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <CheckCircle2 size={15} />
            )}
            Sim, aconteceu
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            <XCircle size={15} />
            Não aconteceu
          </button>

          <button
            onClick={handleLater}
            className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer bg-app-elevated dark:bg-dark-elevated text-app-muted dark:text-dark-muted hover:bg-app-hover dark:hover:bg-dark-hover"
          >
            <Clock size={15} />
            Lembrar depois
          </button>
        </div>
      </div>
    </div>
  );
}
