import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { TransactionCategory, TransactionType } from "../types/transaction";
import { RecurrenceType } from "../types/scheduled";
import type { ScheduledTransaction } from "../types/scheduled";
import { categoryLabels, categoriesByType } from "../utils/transaction";
import {
  useCreateScheduled,
  useUpdateScheduled,
} from "../hooks/useScheduledMutations";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  scheduled?: ScheduledTransaction | null;
};

type FormState = {
  description: string;
  amount: string;
  type: TransactionType;
  category: TransactionCategory;
  dayOfMonth: string;
};

const defaultForm: FormState = {
  description: "",
  amount: "",
  type: TransactionType.Despesa,
  category: TransactionCategory.Alimentacao,
  dayOfMonth: "1",
};

export default function ScheduledModal({ isOpen, onClose, scheduled }: Props) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const isEditing = !!scheduled;

  const { mutateAsync: create, isPending: isCreating } = useCreateScheduled();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateScheduled();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (scheduled) {
      setForm({
        description: scheduled.description,
        amount: String(scheduled.amount),
        type: scheduled.type,
        category: scheduled.category,
        dayOfMonth: String(scheduled.dayOfMonth),
      });
    } else {
      setForm(defaultForm);
    }
  }, [scheduled, isOpen]);

  function handleTypeChange(type: TransactionType) {
    const firstCategory = categoriesByType[type][0];
    setForm((prev) => ({ ...prev, type, category: firstCategory }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      description: form.description,
      amount: parseFloat(form.amount),
      type: Number(form.type),
      category: Number(form.category),
      recurrence: RecurrenceType.Monthly,
      dayOfMonth: parseInt(form.dayOfMonth),
      isActive: true,
    };

    if (isEditing && scheduled) {
      await update({ id: scheduled.id, ...payload });
    } else {
      await create(payload);
    }
    onClose();
  }

  if (!isOpen) return null;

  const availableCategories =
    categoriesByType[Number(form.type) as TransactionType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-app-card dark:bg-dark-card border border-transparent dark:border-dark-border rounded-3xl shadow-xl w-full max-w-md mx-4 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-app-text dark:text-dark-text">
            {isEditing ? "Editar Agendado" : "Novo Agendado"}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover transition-colors cursor-pointer text-app-muted dark:text-dark-muted"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex gap-2 p-1 bg-app-elevated dark:bg-dark-elevated rounded-2xl">
            {[
              { label: "Receita", value: TransactionType.Receita },
              { label: "Despesa", value: TransactionType.Despesa },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleTypeChange(option.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  Number(form.type) === option.value
                    ? option.value === TransactionType.Receita
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-red-500 text-white shadow-sm"
                    : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
              Descrição
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ex: Netflix, Salário..."
              required
              className="w-full px-4 py-3 rounded-2xl border border-app-border dark:border-dark-border bg-app-card dark:bg-dark-elevated text-sm outline-none transition-all text-app-text dark:text-dark-text placeholder:text-app-faint dark:placeholder:text-dark-faint focus:border-app-text dark:focus:border-dark-muted"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
                Valor
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0,00"
                min="0.01"
                step="0.01"
                required
                className="w-full px-4 py-3 rounded-2xl border border-app-border dark:border-dark-border bg-app-card dark:bg-dark-elevated text-sm outline-none transition-all text-app-text dark:text-dark-text placeholder:text-app-faint dark:placeholder:text-dark-faint focus:border-app-text dark:focus:border-dark-muted"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-32">
              <label className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
                Dia do mês
              </label>
              <input
                type="number"
                name="dayOfMonth"
                value={form.dayOfMonth}
                onChange={handleChange}
                min="1"
                max="31"
                required
                className="w-full px-4 py-3 rounded-2xl border border-app-border dark:border-dark-border bg-app-card dark:bg-dark-elevated text-sm outline-none transition-all text-app-text dark:text-dark-text focus:border-app-text dark:focus:border-dark-muted"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, category: cat }))
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    Number(form.category) === cat
                      ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg border-transparent"
                      : "bg-app-elevated dark:bg-dark-elevated text-app-muted dark:text-dark-muted border-app-border dark:border-dark-border hover:text-app-text dark:hover:text-dark-text"
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
              Recorrência
            </label>
            <div className="px-4 py-3 rounded-2xl border border-app-border dark:border-dark-border bg-app-elevated dark:bg-dark-elevated text-sm text-app-muted dark:text-dark-muted">
              Mensal
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Criar agendado"}
          </button>
        </form>
      </div>
    </div>
  );
}
