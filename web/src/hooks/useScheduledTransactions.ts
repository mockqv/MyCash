import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { ScheduledTransaction, ScheduledOccurrence } from "../types/scheduled"

export function useScheduledTransactions() {
    return useQuery<ScheduledTransaction[]>({
        queryKey: ["scheduled"],
        queryFn: async () => {
            const { data } = await api.get("/api/ScheduledTransactions")
            return data
        },
    })
}

export function useScheduledPending() {
    return useQuery<ScheduledOccurrence[]>({
        queryKey: ["scheduled", "pending"],
        queryFn: async () => {
            const { data } = await api.get("/api/ScheduledOccurrences/pending")
            return data
        },
    })
}