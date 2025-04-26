import { Template } from "../../types"

interface NewTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: Partial<Template>
  onTemplateChange: (template: Partial<Template>) => void
  onSave: () => void
}

export function NewTemplateDialog({
  open,
  onOpenChange,
  template,
  onTemplateChange,
  onSave
}: NewTemplateDialogProps) {
  // ... rest of the component code ...
} 