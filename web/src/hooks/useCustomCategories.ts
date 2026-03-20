import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { CustomCategory } from "../types/customCategory"
import { useAuth } from "../contexts/AuthContext"

export function useCustomCategories() {
  const { user } = useAuth()
  return useQuery<CustomCategory[]>({
    queryKey: ["customCategories"],
    queryFn: async () => {
      const { data } = await api.get("/api/CustomCategories")
      return data
    },
    enabled: !!user,
  })
}

export function useCreateCustomCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name: string; color: string; icon: string; type: number }) => {
      const { data } = await api.post("/api/CustomCategories", payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCategories"] })
    },
  })
}

export function useUpdateCustomCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name: string; color: string; icon: string; type: number }) => {
      await api.put(`/api/CustomCategories/${id}`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCategories"] })
    },
  })
}

export function useDeleteCustomCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/CustomCategories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCategories"] })
    },
  })
}
