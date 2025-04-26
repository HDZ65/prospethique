import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Save } from "lucide-react"
import { Template } from "../types"

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <DialogTitle>Nouveau template</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nom du template</Label>
            <Input
              value={template.name}
              onChange={(e) => onTemplateChange({ ...template, name: e.target.value })}
              placeholder="Ex: Template de relance"
            />
          </div>
          <div>
            <Label>Catégorie</Label>
            <Select
              value={template.category}
              onValueChange={(value) => onTemplateChange({ ...template, category: value as Template['category'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="event">Événement</SelectItem>
                <SelectItem value="followup">Suivi</SelectItem>
                <SelectItem value="relance">Relance</SelectItem>
                <SelectItem value="remerciement">Remerciement</SelectItem>
                <SelectItem value="invitation">Invitation</SelectItem>
                <SelectItem value="presentation">Présentation</SelectItem>
                <SelectItem value="devis">Devis</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Contenu</Label>
            <Textarea
              value={template.content}
              onChange={(e) => onTemplateChange({ ...template, content: e.target.value })}
              placeholder="Contenu du template..."
              className="h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-1" />
              Sauvegarder
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
} 