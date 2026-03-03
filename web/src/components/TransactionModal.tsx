import { useEffect, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { TransactionCategory, TransactionType } from "../types/transaction"
import type { Transaction } from "../types/transaction"
import { categoryLabels } from "../utils/transaction"
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useTransactionMutations"


type Props = {
  isOpen: boolean
  onClose: () => void
  transaction?: Transaction | null
}

type FormState = {
  description: string
  amount: string
  date: string
  type: number
  category: number
}

const defaultForm: FormState = {
  description: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  type: TransactionType.Receita,
  category: TransactionCategory.Renda,
}

export default function TransactionModal({ isOpen, onClose, transaction }: Props) {
  const [form, setForm] = useState<FormState>(defaultForm)
  const isEditing = !!transaction

  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateTransaction()
  const { mutateAsync: updateTransaction, isPending: isUpdating } = useUpdateTransaction()

  const isLoading = isCreating || isUpdating

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: String(transaction.amount),
        date: transaction.date.split("T")[0],
        type: transaction.type,
        category: transaction.category,
      })
    } else {
      setForm(defaultForm)
    }
  }, [transaction, isOpen])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      description: form.description,
      amount: parseFloat(form.amount),
      date: new Date(form.date).toISOString(),
      type: Number(form.type),
      category: Number(form.category),
    }

    if (isEditing && transaction) {
      await updateTransaction({ id: transaction.id, ...payload })
    } else {
      await createTransaction(payload)
    }

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[32px] shadow-xl w-full max-w-md mx-4 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold" style={{ color: "#375b4e" }}>
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            {[
              { label: "Receita", value: TransactionType.Receita },
              { label: "Despesa", value: TransactionType.Despesa },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: option.value }))}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  Number(form.type) === option.value
                    ? option.value === TransactionType.Receita
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-red-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "#375b4e" }}>Descrição</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ex: Salário, Aluguel..."
              required
              className="w-full px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all"
              style={{ borderColor: "#d4cdc8", color: "#375b4e" }}
              onFocus={(e) => (e.target.style.borderColor = "#4A7766")}
              onBlur={(e) => (e.target.style.borderColor = "#d4cdc8")}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium" style={{ color: "#375b4e" }}>Valor</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0,00"
                min="0.01"
                step="0.01"
                required
                className="w-full px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all"
                style={{ borderColor: "#d4cdc8", color: "#375b4e" }}
                onFocus={(e) => (e.target.style.borderColor = "#4A7766")}
                onBlur={(e) => (e.target.style.borderColor = "#d4cdc8")}
              />
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium" style={{ color: "#375b4e" }}>Data</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all"
                style={{ borderColor: "#d4cdc8", color: "#375b4e" }}
                onFocus={(e) => (e.target.style.borderColor = "#4A7766")}
                onBlur={(e) => (e.target.style.borderColor = "#d4cdc8")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "#375b4e" }}>Categoria</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all cursor-pointer"
              style={{ borderColor: "#d4cdc8", color: "#375b4e" }}
              onFocus={(e) => (e.target.style.borderColor = "#4A7766")}
              onBlur={(e) => (e.target.style.borderColor = "#d4cdc8")}
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            style={{ backgroundColor: "#4A7766" }}
            onMouseEnter={(e) => !isLoading && ((e.currentTarget as HTMLElement).style.backgroundColor = "#375b4e")}
            onMouseLeave={(e) => !isLoading && ((e.currentTarget as HTMLElement).style.backgroundColor = "#4A7766")}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar transação"}
          </button>
        </form>
      </div>
    </div>
  )
}