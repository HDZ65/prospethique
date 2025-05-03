"use client"

import { TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipContent } from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SplitSquareVertical, Columns, Rows, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LayoutTool {
    id: string
    icon: React.ReactNode
    label: string
    shortcut: string
    mjmlType: string
    columns?: number
    layout?: string
}

const LAYOUT_TOOLS: LayoutTool[] = [
    { id: "mj-section-1col", icon: <Rows />, label: "1 colonne", shortcut: "1", mjmlType: "mj-section", columns: 1 },
    { id: "mj-section-2col", icon: <Columns />, label: "2 colonnes", shortcut: "2", mjmlType: "mj-section", columns: 2 },
    { id: "mj-section-3col", icon: <Columns />, label: "3 colonnes", shortcut: "3", mjmlType: "mj-section", columns: 3 },
    { id: "mj-section-sidebar", icon: <SplitSquareVertical />, label: "Sidebar", shortcut: "D", mjmlType: "mj-section", layout: "sidebar" },
]

const handleDragStart = (layoutTool: LayoutTool) => {
}

export function ElementsSidebar() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="layout" className="border-b-0">
                <AccordionTrigger className="h-14 px-6 hover:no-underline hover:bg-neutral-50 text-base font-medium">
                    <div className="flex items-center gap-3 w-full">
                        <Rows className="h-5 w-5 text-blue-600 shrink-0" />
                        <span className="flex-1 text-left truncate">Mise en page</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <ScrollArea className="h-auto max-h-[250px]">
                        <div className="grid grid-cols-4 gap-1.5 p-4">
                            {LAYOUT_TOOLS.map((tool) => (
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                draggable
                                                onDragStart={handleDragStart}
                                                variant="outline"
                                                className={cn( 
                                                    "cursor-grab h-[50px] w-full flex flex-col items-center justify-center p-1 gap-0.5 rounded-md transition-colors text-neutral-600 hover:bg-blue-50 hover:text-blue-700",
                                                )}
                                            >
                                                <span className="text-[10px] leading-tight font-medium text-center">{tool.label}</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="center">
                                            <p>{tool.label} <span className="text-xs text-muted-foreground">({tool.shortcut})</span></p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}