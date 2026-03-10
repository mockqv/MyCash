import { TransactionCategory, TransactionType } from "./transaction"

export const RecurrenceType = {
    Monthly: 0,
} as const
export type RecurrenceType = (typeof RecurrenceType)[keyof typeof RecurrenceType]

export const OccurrenceStatus = {
    Pending: 0,
    Confirmed: 1,
    Skipped: 2,
} as const
export type OccurrenceStatus = (typeof OccurrenceStatus)[keyof typeof OccurrenceStatus]

export type ScheduledTransaction = {
    id: string
    description: string
    amount: number
    type: TransactionType
    category: TransactionCategory
    recurrence: RecurrenceType
    dayOfMonth: number
    isActive: boolean
    createdAt: string
}

export type ScheduledOccurrence = {
    id: string
    scheduledTransactionId: string
    description: string
    amount: number
    type: TransactionType
    category: TransactionCategory
    dayOfMonth: number
    month: number
    year: number
    status: OccurrenceStatus
}