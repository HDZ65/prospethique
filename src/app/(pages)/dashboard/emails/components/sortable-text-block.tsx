"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { GripVertical, PenLine, X, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortableTextBlockProps {
  block: {
    id: string
    content: string
    type: 'template' | 'custom'
  }
  onRemove?: (id: string) => void
  onUpdate?: (id: string, content: string) => void
}

export function SortableTextBlock({ block, onRemove, onUpdate }: SortableTextBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempContent, setTempContent] = useState(block.content)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleSave = () => {
    onUpdate?.(block.id, tempContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempContent(block.content)
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group rounded-md p-3 border",
        block.type === 'custom' ? 'bg-accent/50' : 'bg-background',
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      )}
      {...attributes}
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" {...listeners}>
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <PenLine className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove?.(block.id)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <div className="px-8">
        {isEditing ? (
          <Textarea
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 shadow-none"
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{block.content}</div>
        )}
      </div>
    </div>
  )
} 