import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { PaginatedTransactions, TransactionSummary } from "../types/transaction"

export function useTransactions(page = 1, pageSize = 10) {
  return useQuery<PaginatedTransactions>({
    queryKey: ["transactions", page, pageSize],
    queryFn: async () => {
      const { data } = await api.get("/api/Transactions", {
        params: { page, pageSize },
      })
      return data
    },
  })
}

export function useTransactionSummary() {
  return useQuery<TransactionSummary>({
    queryKey: ["transactions", "summary"],
    queryFn: async () => {
      const { data } = await api.get("/api/Transactions/summary")
      return data
    },
  })
}