export interface Investment {
  id: string
  name: string
  description?: string
  amount: number
  color: string
  icon: string
  createdAt: string
}

export interface CreateInvestmentPayload {
  name: string
  description?: string
  amount: number
  color: string
  icon: string
}

export interface UpdateInvestmentPayload {
  name: string
  description?: string
  amount: number
  color: string
  icon: string
}
