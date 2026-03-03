import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { Transaction } from "../types/transaction"

type TransactionPayload = {
  description: string
  amount: number
  date: string
  type: number
  category: number
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: TransactionPayload) => {
      const { data } = await api.post("/api/Transactions", payload)
      return data as Transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: TransactionPayload & { id: string }) => {
      const { data } = await api.put(`/api/Transactions/${id}`, payload)
      return data as Transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/Transactions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}