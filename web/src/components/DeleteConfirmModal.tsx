import { Loader2, Trash2 } from "lucide-react"
import { useDeleteTransaction } from "../hooks/useTransactionMutations"
import type { Transaction } from "../types/transaction"

type Props = {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

export default function DeleteConfirmModal({ isOpen, onClose, transaction }: Props) {
  const { mutateAsync: deleteTransaction, isPending } = useDeleteTransaction()

  async function handleDelete() {
    if (!transaction) return
    await deleteTransaction(transaction.id)
    onClose()
  }

  if (!isOpen || !transaction) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-[32px] shadow-xl w-full max-w-sm mx-4 p-8 flex flex-col items-center text-center gap-6">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 size={24} className="text-red-500" />
        </div>

        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: "#375b4e" }}>Excluir transação</h2>
          <p className="text-sm text-slate-500">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-slate-700">"{transaction.description}"</span>?
            Essa ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
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
  )
}