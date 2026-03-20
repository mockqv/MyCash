export const TransactionType = {
  Receita: 0,
  Despesa: 1,
} as const;

export const TransactionCategory = {
  Outros: 0,
  Alimentacao: 1,
  Transporte: 2,
  Salario: 3,
  Lazer: 4,
  Saude: 5,
  Moradia: 6,
} as const;

export type CreateTransactionPayload = Omit<
  Transaction,
  "id" | "createdAt" | "customCategory"
>;

export type UpdateTransactionPayload = Omit<
  Transaction,
  "createdAt" | "customCategory"
>;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];
export type TransactionCategory = typeof TransactionCategory[keyof typeof TransactionCategory];

export type Transaction = {
  id: string
  description: string
  amount: number
  date: string
  type: typeof TransactionType[keyof typeof TransactionType]
  category: typeof TransactionCategory[keyof typeof TransactionCategory]
  customCategoryId?: string
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