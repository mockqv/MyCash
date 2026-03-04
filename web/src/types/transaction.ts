export const TransactionType = {
  Receita: 0,
  Despesa: 1,
} as const

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export const TransactionCategory = {
  Alimentacao: 0,
  Transporte: 1,
  Entretenimento: 2,
  Saude: 3,
  Educacao: 4,
  Renda: 5,
  Outros: 6,
} as const

export type TransactionCategory = (typeof TransactionCategory)[keyof typeof TransactionCategory]

export type Transaction = {
  id: string
  description: string
  amount: number
  date: string
  type: TransactionType
  category: TransactionCategory
}

export type PaginatedTransactions = {
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
  items: Transaction[]
}

export type TransactionSummary = {
  totalIncome: number
  totalExpense: number
}