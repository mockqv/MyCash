import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { ScheduledTransaction, RecurrenceType } from "../types/scheduled"

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

export function useConfirmOccurrence() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (occurrenceId: string) => {
            const { data } = await api.post(`/api/ScheduledOccurrences/${occurrenceId}/confirm`)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["scheduled", "pending"] })
        },
    })
}

export function useSkipOccurrence() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (occurrenceId: string) => {
            await api.post(`/api/ScheduledOccurrences/${occurrenceId}/skip`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scheduled", "pending"] })
        },
    })
}