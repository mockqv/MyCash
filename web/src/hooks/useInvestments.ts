import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { Investment, CreateInvestmentPayload, UpdateInvestmentPayload } from "../types/investment"
import { useAuth } from "../contexts/AuthContext"

export function useInvestments() {
  const { user } = useAuth()
  return useQuery<Investment[]>({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data } = await api.get("/api/Investments")
      return data
    },
    enabled: !!user,
  })
}

export function useCreateInvestment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateInvestmentPayload) => {
      const { data } = await api.post("/api/Investments", payload)
      return data as Investment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] })
      queryClient.invalidateQueries({ queryKey: ["totalBalance"] })
    },
  })
}

export function useUpdateInvestment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & UpdateInvestmentPayload) => {
      await api.put(`/api/Investments/${id}`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] })
      queryClient.invalidateQueries({ queryKey: ["totalBalance"] })
    },
  })
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/Investments/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] })
      queryClient.invalidateQueries({ queryKey: ["totalBalance"] })
    },
  })
}
