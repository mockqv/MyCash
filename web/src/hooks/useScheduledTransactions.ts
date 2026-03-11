import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { ScheduledTransaction, ScheduledOccurrence } from "../types/scheduled"
import { useAuth } from "../contexts/AuthContext"

export function useScheduledTransactions() {
    const { user } = useAuth()
    return useQuery<ScheduledTransaction[]>({
        queryKey: ["scheduled"],
        queryFn: async () => {
            const { data } = await api.get("/api/ScheduledTransactions")
            return data
        },
        enabled: !!user,
    })
}

export function useScheduledPending() {
    const { user } = useAuth()
    return useQuery<ScheduledOccurrence[]>({
        queryKey: ["scheduled", "pending"],
        queryFn: async () => {
            const { data } = await api.get("/api/ScheduledOccurrences/pending")
            return data
        },
        enabled: !!user,
    })
}