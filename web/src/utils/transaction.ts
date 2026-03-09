import { TransactionCategory } from "../types/transaction"

export const categoryLabels: Record<TransactionCategory, string> = {
  [TransactionCategory.Alimentacao]: "Alimentação",
  [TransactionCategory.Transporte]: "Transporte",
  [TransactionCategory.Entretenimento]: "Entretenimento",
  [TransactionCategory.Saude]: "Saúde",
  [TransactionCategory.Educacao]: "Educação",
  [TransactionCategory.Renda]: "Renda",
  [TransactionCategory.Outros]: "Outros",
}

export const categoryStyles: Record<TransactionCategory, string> = {
  [TransactionCategory.Renda]: "bg-green-100 text-green-700",
  [TransactionCategory.Alimentacao]: "bg-slate-100 text-slate-600",
  [TransactionCategory.Transporte]: "bg-blue-100 text-blue-700",
  [TransactionCategory.Entretenimento]: "bg-purple-100 text-purple-700",
  [TransactionCategory.Saude]: "bg-red-100 text-red-700",
  [TransactionCategory.Educacao]: "bg-yellow-100 text-yellow-700",
  [TransactionCategory.Outros]: "bg-slate-100 text-slate-600",
}