import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { Goal, CreateGoalPayload, UpdateGoalPayload } from "../types/goal"
import { useAuth } from "../contexts/AuthContext"

export function useGoals() {
  const { user } = useAuth()
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data } = await api.get("/api/Goals")
      return data
    },
    enabled: !!user,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateGoalPayload) => {
      const { data } = await api.post("/api/Goals", payload)
      return data as Goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["totalBalance"] })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & UpdateGoalPayload) => {
      await api.put(`/api/Goals/${id}`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
    },
  })
}

export function useAllocateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, allocatedAmount }: { id: string; allocatedAmount: number }) => {
      await api.patch(`/api/Goals/${id}/allocate`, { allocatedAmount })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["totalBalance"] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/Goals/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["totalBalance"] })
    },
  })
}
