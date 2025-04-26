import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "lucide-react"

interface StatsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stats: {
    totalSent: number
    opened: number
    clicked: number
    replied: number
  }
}

export function StatsDialog({
  open,
  onOpenChange,
  stats
}: StatsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <DialogTitle>Statistiques d'engagement</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Emails envoyés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Taux d'ouverture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalSent > 0 ? Math.round((stats.opened / stats.totalSent) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Taux de clic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalSent > 0 ? Math.round((stats.clicked / stats.totalSent) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Taux de réponse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalSent > 0 ? Math.round((stats.replied / stats.totalSent) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 