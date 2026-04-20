export interface Goal {
  id: string
  name: string
  description?: string
  targetAmount: number
  allocatedAmount: number
  deadline?: string
  color: string
  icon: string
  isCompleted: boolean
  createdAt: string
}

export interface CreateGoalPayload {
  name: string
  description?: string
  targetAmount: number
  initialAllocation: number
  deadline?: string
  color: string
  icon: string
}

export interface UpdateGoalPayload {
  name: string
  description?: string
  targetAmount: number
  deadline?: string
  color: string
  icon: string
  isCompleted: boolean
}
