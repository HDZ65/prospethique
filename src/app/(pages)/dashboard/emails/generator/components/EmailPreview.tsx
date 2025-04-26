import { useState, useCallback, forwardRef, ReactNode, MutableRefObject } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Send, Clock, Wand2, Maximize2, Minimize2 } from "lucide-react"
import { useDroppable } from "@dnd-kit/core"

interface EmailPreviewProps {
  children: ReactNode
  dimensions: { width: string; height: string }
  position: { x: number; y: number }
  isFullscreen: boolean
  isMoving: boolean
  recipient: string
  subject: string
  onFullscreenToggle: () => void
  onSchedule: () => void
  setPreviewDimensions: (dimensions: { width: string; height: string }) => void
  setPreviewPosition: (position: { x: number; y: number }) => void
  startPositionRef: MutableRefObject<{ x: number; y: number }>
  initialDimensionsRef: MutableRefObject<{ width: number; height: number }>
  initialPositionRef: MutableRefObject<{ x: number; y: number }>
  resizingRef: MutableRefObject<boolean>
  movingRef: MutableRefObject<boolean>
}

export const EmailPreview = forwardRef<HTMLDivElement, EmailPreviewProps>(({
  children,
  dimensions,
  position,
  isFullscreen,
  isMoving,
  recipient,
  subject,
  onFullscreenToggle,
  onSchedule,
  setPreviewDimensions,
  setPreviewPosition,
  startPositionRef,
  initialDimensionsRef,
  initialPositionRef,
  resizingRef,
  movingRef
}, ref) => {
  // Hook useDroppable
  const { setNodeRef } = useDroppable({
    id: 'email-preview-content',
  });

  // Fonction pour gérer le redimensionnement
  const handleResize = useCallback((e: MouseEvent, direction: string) => {
    if (!resizingRef.current) return
    
    const deltaX = e.clientX - startPositionRef.current.x
    const deltaY = e.clientY - startPositionRef.current.y
    
    const newPreviewPosition = { ...position }
    const newDimensions = { 
      width: initialDimensionsRef.current.width, 
      height: initialDimensionsRef.current.height 
    }
    
    // Redimensionnement horizontal
    if (direction.includes('right')) {
      newDimensions.width += deltaX
    } else if (direction.includes('left')) {
      newDimensions.width -= deltaX
      newPreviewPosition.x = initialPositionRef.current.x + deltaX
    }
    
    // Redimensionnement vertical
    if (direction.includes('bottom')) {
      newDimensions.height += deltaY
    } else if (direction.includes('top')) {
      newDimensions.height -= deltaY
      newPreviewPosition.y = initialPositionRef.current.y + deltaY
    }
    
    // Vérifier les dimensions minimales
    const minWidth = 400
    const minHeight = 500
    
    if (newDimensions.width < minWidth) {
      newDimensions.width = minWidth
      if (direction.includes('left')) {
        newPreviewPosition.x = initialPositionRef.current.x + (initialDimensionsRef.current.width - minWidth)
      }
    }
    
    if (newDimensions.height < minHeight) {
      newDimensions.height = minHeight
      if (direction.includes('top')) {
        newPreviewPosition.y = initialPositionRef.current.y + (initialDimensionsRef.current.height - minHeight)
      }
    }
    
    setPreviewDimensions({
      width: `${newDimensions.width}px`,
      height: `${newDimensions.height}px`
    })
    
    setPreviewPosition(newPreviewPosition)
  }, [position, setPreviewDimensions, setPreviewPosition, startPositionRef, initialDimensionsRef, initialPositionRef, resizingRef])
  
  // Fonction pour gérer le début du redimensionnement
  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault()
    resizingRef.current = true
    startPositionRef.current = { x: e.clientX, y: e.clientY }
    
    // Sauvegarder les dimensions et positions initiales
    const element = ref as React.RefObject<HTMLDivElement>
    if (element.current) {
      initialDimensionsRef.current = {
        width: element.current.offsetWidth,
        height: element.current.offsetHeight
      }
    }
    initialPositionRef.current = { x: position.x, y: position.y }
    
    // Ajouter les gestionnaires d'événements pour le redimensionnement
    document.addEventListener('mousemove', (e) => handleResize(e, direction), false)
    document.addEventListener('mouseup', handleResizeEnd, false)
  }, [position, handleResize, ref, initialPositionRef, initialDimensionsRef, startPositionRef, resizingRef])
  
  // Fonction pour gérer la fin du redimensionnement
  const handleResizeEnd = useCallback(() => {
    resizingRef.current = false
    document.removeEventListener('mousemove', handleResize as any, false)
    document.removeEventListener('mouseup', handleResizeEnd, false)
  }, [handleResize, resizingRef])

  // Fonction pour gérer le début du déplacement
  const handleMoveStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    movingRef.current = true
    startPositionRef.current = { x: e.clientX, y: e.clientY }
    initialPositionRef.current = { x: position.x, y: position.y }
    
    // Ajouter les gestionnaires d'événements pour le déplacement
    document.addEventListener('mousemove', handleMove, false)
    document.addEventListener('mouseup', handleMoveEnd, false)
  }, [position, initialPositionRef, startPositionRef, movingRef])
  
  // Fonction pour gérer le déplacement
  const handleMove = useCallback((e: MouseEvent) => {
    if (!movingRef.current) return
    
    const deltaX = e.clientX - startPositionRef.current.x
    const deltaY = e.clientY - startPositionRef.current.y
    
    setPreviewPosition({
      x: initialPositionRef.current.x + deltaX,
      y: initialPositionRef.current.y + deltaY
    })
  }, [setPreviewPosition, initialPositionRef, startPositionRef, movingRef])
  
  // Fonction pour gérer la fin du déplacement
  const handleMoveEnd = useCallback(() => {
    movingRef.current = false
    document.removeEventListener('mousemove', handleMove, false)
    document.removeEventListener('mouseup', handleMoveEnd, false)
  }, [handleMove, movingRef])

  return (
    <div 
      ref={ref}
      className="absolute"
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        maxWidth: '100%', 
        maxHeight: '100%',
        minWidth: '400px',
        minHeight: '500px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isMoving ? 20 : 10,
        boxShadow: isMoving ? '0 8px 30px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.05)'
      }}
    >
      <Card className="h-full flex flex-col overflow-hidden border-blue-100">
        <CardHeader 
          className="border-b bg-blue-50/50 py-3 px-4 cursor-move"
          onMouseDown={handleMoveStart}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium text-neutral-800">Prévisualisation</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Améliorer avec l'IA</p>
                  </TooltipContent>
                </Tooltip>
              
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onSchedule}
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Programmer l'envoi</p>
                  </TooltipContent>
                </Tooltip>
              
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onFullscreenToggle}
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFullscreen ? "Réduire" : "Agrandir"} la prévisualisation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="border rounded-lg shadow-sm mb-4">
            <div className="p-3 bg-blue-50/50 border-b rounded-t-lg">
              <div className="space-y-1">
                <div className="text-sm font-medium text-neutral-800">À: {recipient}</div>
                <div className="text-xs text-neutral-500">Objet: {subject}</div>
              </div>
            </div>
            
            <div className="p-4" ref={setNodeRef}>
              {children}
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 h-9 text-sm">
            <Send className="h-4 w-4 mr-1.5" />
            Envoyer l'email
          </Button>
        </CardContent>
      </Card>
      
      {/* Poignées de redimensionnement */}
      {/* Coin inférieur droit */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10 hover:opacity-80"
        onMouseDown={(e) => handleResizeStart(e, 'right-bottom')}
        style={{
          background: 'transparent',
          border: '2px solid #3b82f6',
          borderLeft: 'none',
          borderTop: 'none',
          opacity: 0.4,
          borderBottomRightRadius: '3px'
        }}
      />
      
      {/* Coin supérieur droit */}
      <div 
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10 hover:opacity-80"
        onMouseDown={(e) => handleResizeStart(e, 'right-top')}
        style={{
          background: 'transparent',
          border: '2px solid #3b82f6',
          borderLeft: 'none',
          borderBottom: 'none',
          opacity: 0.4,
          borderTopRightRadius: '3px'
        }}
      />
      
      {/* Coin inférieur gauche */}
      <div 
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10 hover:opacity-80"
        onMouseDown={(e) => handleResizeStart(e, 'left-bottom')}
        style={{
          background: 'transparent',
          border: '2px solid #3b82f6',
          borderRight: 'none',
          borderTop: 'none',
          opacity: 0.4,
          borderBottomLeftRadius: '3px'
        }}
      />
      
      {/* Coin supérieur gauche */}
      <div 
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10 hover:opacity-80"
        onMouseDown={(e) => handleResizeStart(e, 'left-top')}
        style={{
          background: 'transparent',
          border: '2px solid #3b82f6',
          borderRight: 'none',
          borderBottom: 'none',
          opacity: 0.4,
          borderTopLeftRadius: '3px'
        }}
      />
      
      {/* Bord droit */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-16 cursor-e-resize z-10 hover:opacity-80"
        onMouseDown={(e) => handleResizeStart(e, 'right')}
        style={{
          background: '#3b82f6',
          opacity: 0.2,
          borderRadius: '1px'
        }}
      />
      
      {/* Bord gauche */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 cursor-w-resize z-10 hover:opacity-80"
        onMouseDown={(e) => handleResizeStart(e, 'left')}
        style={{
          background: '#3b82f6',
          opacity: 0.2,
          borderRadius: '1px'
        }}
      />
      
      {/* Bord inférieur */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5 w-16 cursor-s-resize z-10 hover:opacity-80"
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
        style={{
          background: '#3b82f6',
          opacity: 0.2,
          borderRadius: '1px'
        }}
      />
      
      {/* Bord supérieur */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-16 cursor-n-resize z-10 hover:opacity-80"
        onMouseDown={(e) => handleResizeStart(e, 'top')}
        style={{
          background: '#3b82f6',
          opacity: 0.2,
          borderRadius: '1px'
        }}
      />
    </div>
  )
}) 