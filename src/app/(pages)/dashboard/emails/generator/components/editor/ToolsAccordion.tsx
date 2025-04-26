import { Suggestion } from "../../types"

interface ToolsAccordionProps {
  selectedSuggestionCategory: string
  setSelectedSuggestionCategory: (category: string) => void
  suggestions: Suggestion[]
  generateNewSuggestions: () => void
  addTextBlock: (content: string, buttonProps?: Record<string, any>) => void
}

export function ToolsAccordion({
  selectedSuggestionCategory,
  setSelectedSuggestionCategory,
  suggestions,
  generateNewSuggestions,
  addTextBlock
}: ToolsAccordionProps) {
  // ... rest of the component code ...
} 