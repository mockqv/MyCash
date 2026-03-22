import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { PaginatedTransactions, TransactionSummary } from "../types/transaction"

type TransactionFilters = {
  page?: number
  pageSize?: number
  month?: number
  year?: number
  startDate?: string
  endDate?: string
}

export function useTransactions({ page = 1, pageSize = 10, month, year, startDate, endDate }: TransactionFilters = {}) {
  return useQuery<PaginatedTransactions>({
    queryKey: ["transactions", page, pageSize, month, year, startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get("/api/Transactions", {
        params: {
          page,
          pageSize,
          ...(startDate && endDate ? { startDate, endDate } : { ...(month && { month }), ...(year && { year }) }),
        },
      })
      return data
    },
  })
}

export function useTransactionSummary(month?: number, year?: number, startDate?: string, endDate?: string) {
  return useQuery<TransactionSummary>({
    queryKey: ["transactions", "summary", month, year, startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get("/api/Transactions/summary", {
        params: {
          ...(startDate && endDate ? { startDate, endDate } : { ...(month && { month }), ...(year && { year }) }),
        },
      })
      return data
    },
  })
}