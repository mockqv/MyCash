import { TransactionCategory, TransactionType } from "../types/transaction"

export const categoryLabels: Record<TransactionCategory, string> = {
  [TransactionCategory.Outros]: "Outros",
  [TransactionCategory.Alimentacao]: "Alimentação",
  [TransactionCategory.Transporte]: "Transporte",
  [TransactionCategory.Salario]: "Salário",
  [TransactionCategory.Lazer]: "Lazer",
  [TransactionCategory.Saude]: "Saúde",
  [TransactionCategory.Moradia]: "Moradia",
}

export const categoryStyles: Record<TransactionCategory, string> = {
  [TransactionCategory.Outros]: "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400",
  [TransactionCategory.Alimentacao]: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  [TransactionCategory.Transporte]: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  [TransactionCategory.Salario]: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  [TransactionCategory.Lazer]: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  [TransactionCategory.Saude]: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
  [TransactionCategory.Moradia]: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
}

export const categoryColors: Record<TransactionCategory, string> = {
  [TransactionCategory.Outros]: "#71717a",
  [TransactionCategory.Alimentacao]: "#f97316",
  [TransactionCategory.Transporte]: "#3b82f6",
  [TransactionCategory.Salario]: "#22c55e",
  [TransactionCategory.Lazer]: "#a855f7",
  [TransactionCategory.Saude]: "#ef4444",
  [TransactionCategory.Moradia]: "#eab308",
}

export const categoryIcons: Record<TransactionCategory, string> = {
  [TransactionCategory.Outros]: "Tag",
  [TransactionCategory.Alimentacao]: "Utensils",
  [TransactionCategory.Transporte]: "Car",
  [TransactionCategory.Salario]: "Briefcase",
  [TransactionCategory.Lazer]: "Gamepad2",
  [TransactionCategory.Saude]: "Stethoscope",
  [TransactionCategory.Moradia]: "Home",
}

// Categorias disponíveis por tipo de transação
export const categoriesByType: Record<TransactionType, TransactionCategory[]> = {
  [TransactionType.Receita]: [
    TransactionCategory.Salario,
    TransactionCategory.Outros,
  ],
  [TransactionType.Despesa]: [
    TransactionCategory.Alimentacao,
    TransactionCategory.Transporte,
    TransactionCategory.Lazer,
    TransactionCategory.Saude,
    TransactionCategory.Moradia,
    TransactionCategory.Outros,
  ],
}