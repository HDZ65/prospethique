import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History } from "lucide-react"
import { EmailHistory } from "../types"

interface HistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  emailHistory: EmailHistory[]
}

export function HistoryDialog({
  open,
  onOpenChange,
  emailHistory
}: HistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <DialogTitle>Historique des emails</DialogTitle>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {emailHistory.map((email) => (
              <div key={email.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{email.recipient}</div>
                    <div className="text-sm text-muted-foreground">{email.subject}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {email.sentDate?.toLocaleDateString() ?? 'Date inconnue'}
                  </div>
                </div>
                {email.engagement && (
                  <div className="mt-2 flex gap-2">
                    <Badge variant={email.engagement.opened ? "default" : "secondary"}>
                      {email.engagement.opened ? "Ouvert" : "Non ouvert"}
                    </Badge>
                    <Badge variant={email.engagement.clicked ? "default" : "secondary"}>
                      {email.engagement.clicked ? "Cliqué" : "Non cliqué"}
                    </Badge>
                    <Badge variant={email.engagement.replied ? "default" : "secondary"}>
                      {email.engagement.replied ? "Répondu" : "Non répondu"}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 