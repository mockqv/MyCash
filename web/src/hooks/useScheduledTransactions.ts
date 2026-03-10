import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { ScheduledTransaction } from "../types/scheduled"

export function useScheduledTransactions() {
    return useQuery<ScheduledTransaction[]>({
        queryKey: ["scheduled"],
        queryFn: async () => {
            const { data } = await api.get("/api/ScheduledTransactions")
            return data
        },
    })
}

export function useScheduledDueToday() {
    return useQuery<ScheduledTransaction[]>({
        queryKey: ["scheduled", "due-today"],
        queryFn: async () => {
            const { data } = await api.get("/api/ScheduledTransactions/due-today")
            return data
        },
    })
}