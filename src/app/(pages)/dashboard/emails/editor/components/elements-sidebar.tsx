"use client"

import { TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipContent } from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Layout, Type, Image as LucideImage, MousePointer, SeparatorHorizontal, StretchHorizontal, Share2, PlaySquare, Table as LucideTable, PanelTopOpen, List as LucideList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
    { id: "mj-section-1col", icon: <Image src="/layout1.png" alt="1 colonne" width={32} height={32} />, label: "1 colonne", shortcut: "1", mjmlType: "mj-section", columns: 1 },
    { id: "mj-section-2col", icon: <Image src="/layout2.png" alt="2 colonnes" width={32} height={32} />, label: "2 colonnes", shortcut: "2", mjmlType: "mj-section", columns: 2 },
    { id: "mj-section-3col", icon: <Image src="/layout3.png" alt="3 colonnes" width={32} height={32} />, label: "3 colonnes", shortcut: "3", mjmlType: "mj-section", columns: 3 },
]

const CONTENT_TOOLS: LayoutTool[] = [
    { id: "mj-text", icon: <Type className="h-8 w-8 text-red-500" />, label: "Texte", shortcut: "T", mjmlType: "mj-text" },
    { id: "mj-image", icon: <LucideImage className="h-8 w-8 text-green-500" />, label: "Image", shortcut: "I", mjmlType: "mj-image" },
    { id: "mj-button", icon: <MousePointer className="h-8 w-8 text-blue-500" />, label: "Bouton", shortcut: "B", mjmlType: "mj-button" },
    { id: "mj-divider", icon: <SeparatorHorizontal className="h-8 w-8 text-yellow-500" />, label: "Diviseur", shortcut: "D", mjmlType: "mj-divider" },
    { id: "mj-spacer", icon: <StretchHorizontal className="h-8 w-8 text-purple-500" />, label: "Espace", shortcut: "E", mjmlType: "mj-spacer" },
    { id: "mj-social", icon: <Share2 className="h-8 w-8 text-pink-500" />, label: "Réseaux sociaux", shortcut: "S", mjmlType: "mj-social" },
    { id: "mj-video", icon: <PlaySquare className="h-8 w-8 text-orange-500" />, label: "Vidéo", shortcut: "V", mjmlType: "mj-video" },
    { id: "mj-table", icon: <LucideTable className="h-8 w-8 text-teal-500" />, label: "Tableau", shortcut: "T", mjmlType: "mj-table" },
    { id: "mj-accordion", icon: <PanelTopOpen className="h-8 w-8 text-indigo-500" />, label: "Accordéon", shortcut: "A", mjmlType: "mj-accordion" },
    { id: "mj-list", icon: <LucideList className="h-8 w-8 text-cyan-500" />, label: "Liste", shortcut: "L", mjmlType: "mj-list" },
]

const handleDragStart = (  layoutTool: LayoutTool) => {
 
}

export function ElementsSidebar() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="layout" className="border-b-0">
                <AccordionTrigger className="h-14 px-6 hover:no-underline hover:bg-neutral-50 text-base font-medium">
                    <div className="flex items-center gap-3 w-full">
                        <Layout className="h-5 w-5 text-blue-600 shrink-0" />
                        <span className="flex-1 text-left truncate">Mise en page</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <ScrollArea className="h-auto max-h-[250px]">
                        <div className="grid grid-cols-2 gap-1.5 p-4">
                            {LAYOUT_TOOLS.map((tool) => (
                                <div key={tool.id} >
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "h-[65px] w-full flex flex-col items-center justify-center p-2 gap-1 rounded-md transition-colors text-neutral-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300",
                                                )}
                                            >
                                                {tool.icon}
                                                <span className="text-xs leading-tight font-medium text-center">{tool.label}</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="center">
                                            <p>{tool.label} <span className="text-xs text-muted-foreground">({tool.shortcut})</span></p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        ))}
                    </div>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="content" className="border-b-0">
                <AccordionTrigger className="  px-6 hover:no-underline hover:bg-neutral-50 text-base font-medium">
                    <div className="flex items-center gap-3 w-full">
                        <Layout className="h-5 w-5 text-blue-600 shrink-0" />
                        <span className="flex-1 text-left truncate">Contenu</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <ScrollArea className="h-auto  ">
                        <div className="grid grid-cols-2 gap-1.5 p-4">
                            {CONTENT_TOOLS.map((tool) => (
                                <div key={tool.id} >
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "h-[65px] w-full flex flex-col items-center justify-center p-2 gap-1 rounded-md transition-colors text-neutral-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300",
                                                )}
                                            >
                                                {tool.icon}
                                                <span className="text-xs leading-tight font-medium text-center">{tool.label}</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="center">
                                            <p>{tool.label} <span className="text-xs text-muted-foreground">({tool.shortcut})</span></p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        ))}
                    </div>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}