import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { PaginatedTransactions, TransactionSummary } from "../types/transaction"

type TransactionFilters = {
  page?: number
  pageSize?: number
  month?: number
  year?: number
}

export function useTransactions({ page = 1, pageSize = 10, month, year }: TransactionFilters = {}) {
  return useQuery<PaginatedTransactions>({
    queryKey: ["transactions", page, pageSize, month, year],
    queryFn: async () => {
      const { data } = await api.get("/api/Transactions", {
        params: { page, pageSize, ...(month && { month }), ...(year && { year }) },
      })
      return data
    },
  })
}

export function useTransactionSummary(month?: number, year?: number) {
  return useQuery<TransactionSummary>({
    queryKey: ["transactions", "summary", month, year],
    queryFn: async () => {
      const { data } = await api.get("/api/Transactions/summary", {
        params: { ...(month && { month }), ...(year && { year }) },
      })
      return data
    },
  })
}