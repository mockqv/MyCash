import { TransactionCategory, TransactionType } from "./transaction"

export const RecurrenceType = {
    Monthly: 0,
} as const

export type RecurrenceType = (typeof RecurrenceType)[keyof typeof RecurrenceType]

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