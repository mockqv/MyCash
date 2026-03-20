import { useCustomCategories } from "./useCustomCategories"
import { categoryLabels, categoryColors, categoryStyles, categoryIcons } from "../utils/transaction"
import type { TransactionCategory } from "../types/transaction"

export type CategoryDisplay = {
  label: string
  color: string
  style: string
  icon: string
  isCustom: boolean
}

export function useCategoryDisplay() {
  const { data: customCategories = [] } = useCustomCategories()

  function getCategoryDisplay(
    category: TransactionCategory,
    customCategoryId?: string | null
  ): CategoryDisplay {
    if (customCategoryId) {
      const custom = customCategories.find((c) => c.id === customCategoryId)
      if (custom) {
        return {
          label: custom.name,
          color: custom.color,
          style: "", // custom categories use inline color instead of tailwind classes
          icon: custom.icon,
          isCustom: true,
        }
      }
    }

    return {
      label: categoryLabels[category] ?? "Outros",
      color: categoryColors[category] ?? "#71717a",
      style: categoryStyles[category] ?? "",
      icon: categoryIcons[category] ?? "Tag",
      isCustom: false,
    }
  }

  return { getCategoryDisplay }
}
