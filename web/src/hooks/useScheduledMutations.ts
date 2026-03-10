import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { ScheduledTransaction } from "../types/scheduled"
import type { RecurrenceType } from "../types/scheduled"

type ScheduledPayload = {
    description: string
    amount: number
    type: number
    category: number
    recurrence: RecurrenceType
    dayOfMonth: number
    isActive: boolean
}

export function useCreateScheduled() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: ScheduledPayload) => {
            const { data } = await api.post("/api/ScheduledTransactions", payload)
            return data as ScheduledTransaction
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scheduled"] })
        },
    })
}

export function useUpdateScheduled() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, ...payload }: ScheduledPayload & { id: string }) => {
            await api.put(`/api/ScheduledTransactions/${id}`, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scheduled"] })
        },
    })
}

export function useDeleteScheduled() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/api/ScheduledTransactions/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scheduled"] })
        },
    })
}

export function useConfirmScheduled() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.post(`/api/ScheduledTransactions/${id}/confirm`)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["scheduled"] })
        },
    })
}