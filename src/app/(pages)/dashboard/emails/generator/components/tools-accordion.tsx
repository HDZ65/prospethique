"use client"

import React from "react"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Settings,
  ChevronRight,
  Mail,
  Plus,
  Search,
  MessageSquare,
  Sparkles,
  Wand2,
  BarChart,
  Shapes,
  Type,
  Box as BoxIcon,
  ListOrdered,
  Link,
  Table,
  Share2,
  Image,
  Video,
  FileImage,
  Rows,
  Columns,
  SplitSquareVertical,
  History,
  Loader2,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

// Ajouté: Composant réutilisable pour un outil draggable
function DraggableTool({ id, data, children }: { id: string, data: Record<string, any>, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: data, // Pour passer le type de bloc, ex: { type: 'mj-text' }
  });
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10 // Pour que l'élément soit au-dessus pendant le drag
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

export function ToolsAccordion() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [customSuggestionClicked, setCustomSuggestionClicked] = useState(false)
  const [styleImprovementClicked, setStyleImprovementClicked] = useState(false)

  const tools = {
    elements: [
      { id: "mj-text", icon: <Type />, label: "Texte", shortcut: "T", mjmlType: "mj-text" },
      { id: "mj-button", icon: <BoxIcon />, label: "Bouton", shortcut: "B", mjmlType: "mj-button" },
      { id: "mj-list", icon: <ListOrdered />, label: "Liste", shortcut: "L", mjmlType: "mj-text" },
      { id: "mj-link", icon: <Link />, label: "Lien", shortcut: "K", mjmlType: "mj-text" },
      { id: "mj-table", icon: <Table />, label: "Tableau", shortcut: "M", mjmlType: "mj-table" },
      { id: "mj-social", icon: <Share2 />, label: "Social", shortcut: "S", mjmlType: "mj-social" },
    ],
    media: [
      { id: "mj-image", icon: <Image />, label: "Image", shortcut: "I", mjmlType: "mj-image" },
      { id: "mj-video", icon: <Video />, label: "Vidéo", shortcut: "V", mjmlType: "mj-video" },
      { id: "mj-gallery", icon: <FileImage />, label: "Galerie", shortcut: "G", mjmlType: "mj-carousel" },
    ],
    layout: [
      { id: "mj-section-1col", icon: <Rows />, label: "1 colonne", shortcut: "1", mjmlType: "mj-section", columns: 1 },
      { id: "mj-section-2col", icon: <Columns />, label: "2 colonnes", shortcut: "2", mjmlType: "mj-section", columns: 2 },
      { id: "mj-section-3col", icon: <Columns />, label: "3 colonnes", shortcut: "3", mjmlType: "mj-section", columns: 3 },
      { id: "mj-section-sidebar", icon: <SplitSquareVertical />, label: "Sidebar", shortcut: "D", mjmlType: "mj-section", layout: "sidebar" },
    ],
  }

  const handleGenerateSuggestions = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full bg-background w-full border-r overflow-hidden">
      <div className="h-[60px] px-6 border-b flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <span className="font-medium text-base truncate">Éditeur d'email</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowSearch(!showSearch)}>
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Rechercher</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Ajouter (Action à définir)</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {showSearch && (
        <div className="px-6 py-3 border-b shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input
              placeholder="Rechercher..."
              className="h-10 pl-10 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="configuration" className="border-b">
            <AccordionTrigger className="h-14 px-6 hover:no-underline hover:bg-neutral-50 text-base font-medium">
              <div className="flex items-center gap-3 w-full">
                <Settings className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="flex-1 text-left truncate">Configuration</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Destinataire</Label>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="h-10 text-base">
                        <SelectValue placeholder="Sélectionner un contact" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nouveau contact</SelectItem>
                        <SelectItem value="import">Importer des contacts</SelectItem>
                        <SelectItem value="list">Liste de diffusion</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Template</Label>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="h-10 text-base">
                        <SelectValue placeholder="Choisir un template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blank">Template vierge</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sujet</Label>
                  <Input placeholder="Entrez le sujet de l'email" className="h-10 text-base" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="suggestions" className="border-b">
            <AccordionTrigger className="h-14 px-6 hover:no-underline hover:bg-neutral-50 text-base font-medium">
              <div className="flex items-center gap-3 w-full">
                <Wand2 className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="flex-1 text-left truncate">Suggestions IA</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="default"
                    onClick={handleGenerateSuggestions}
                    disabled={isGenerating}
                    className="hover:bg-blue-50 h-10 text-base"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin text-blue-600" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                        Générer
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedCategory === 'all' ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-blue-50 transition-colors text-sm px-3 py-1"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Toutes
                  </Badge>
                  {[
                    { value: 'introduction', label: 'Introduction' },
                    { value: 'accroche', label: 'Accroche' },
                    { value: 'valorisation', label: 'Valorisation' },
                    { value: 'transition', label: 'Transition' },
                    { value: 'proposition', label: 'Proposition' },
                    { value: 'benefices', label: 'Bénéfices' },
                    { value: 'objection', label: 'Objection' },
                    { value: 'conclusion', label: 'Conclusion' }
                  ].map((category) => (
                    <Badge
                      key={category.value}
                      variant={selectedCategory === category.value ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-blue-50 transition-colors text-sm px-3 py-1"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>

                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left whitespace-normal h-auto py-3 px-4",
                        "hover:bg-blue-50 transition-colors",
                        customSuggestionClicked && "bg-blue-50"
                      )}
                      onClick={() => setCustomSuggestionClicked(!customSuggestionClicked)}
                    >
                      <MessageSquare className="h-5 w-5 mr-2 shrink-0 text-blue-600" />
                      <span className="line-clamp-2 text-base">
                        Je me permets de vous contacter suite à notre échange lors du salon...
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left whitespace-normal h-auto py-3 px-4",
                        "hover:bg-blue-50 transition-colors",
                        styleImprovementClicked && "bg-blue-50"
                      )}
                      onClick={() => setStyleImprovementClicked(!styleImprovementClicked)}
                    >
                      <MessageSquare className="h-5 w-5 mr-2 shrink-0 text-blue-600" />
                      <span className="line-clamp-2 text-base">
                        Votre expertise dans le domaine de la santé connectée m'a particulièrement...
                      </span>
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="elements" className="border-b-0">
            <AccordionTrigger className="h-14 px-6 hover:no-underline hover:bg-neutral-50 text-base font-medium">
              <div className="flex items-center gap-3 w-full">
                <Shapes className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="flex-1 text-left truncate">Éléments</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <ScrollArea className="h-[250px]">
                <div className="grid grid-cols-4 gap-1.5 p-4">
                  {tools.elements.map((tool) => (
                    <DraggableTool key={tool.id} id={tool.id} data={{ type: tool.mjmlType }}>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-[50px] w-full flex flex-col items-center justify-center p-1 gap-0.5 rounded-md transition-colors text-neutral-600 hover:bg-blue-50 hover:text-blue-700",
                                selectedTool === tool.id && "bg-blue-50 text-blue-700 border-blue-200"
                              )}
                            >
                              {React.cloneElement(tool.icon, { className: "h-4 w-4 mb-0.5" })}
                              <span className="text-[10px] leading-tight font-medium text-center">{tool.label}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <p>{tool.label} <span className="text-xs text-muted-foreground">({tool.shortcut})</span></p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DraggableTool>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="media" className="border-b-0">
            <AccordionTrigger className="h-14 px-6 hover:no-underline hover:bg-neutral-50 text-base font-medium">
              <div className="flex items-center gap-3 w-full">
                <Image className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="flex-1 text-left truncate">Média</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <ScrollArea className="h-auto max-h-[250px]">
                <div className="grid grid-cols-4 gap-1.5 p-4">
                  {tools.media.map((tool) => (
                    <DraggableTool key={tool.id} id={tool.id} data={{ type: tool.mjmlType }}>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-[50px] w-full flex flex-col items-center justify-center p-1 gap-0.5 rounded-md transition-colors text-neutral-600 hover:bg-blue-50 hover:text-blue-700",
                                selectedTool === tool.id && "bg-blue-50 text-blue-700 border-blue-200"
                              )}
                            >
                              {React.cloneElement(tool.icon, { className: "h-4 w-4 mb-0.5" })}
                              <span className="text-[10px] leading-tight font-medium text-center">{tool.label}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <p>{tool.label} <span className="text-xs text-muted-foreground">({tool.shortcut})</span></p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DraggableTool>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

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
                  {tools.layout.map((tool) => (
                    <DraggableTool key={tool.id} id={tool.id} data={{ type: tool.mjmlType, columns: tool.columns, layout: tool.layout }}>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-[50px] w-full flex flex-col items-center justify-center p-1 gap-0.5 rounded-md transition-colors text-neutral-600 hover:bg-blue-50 hover:text-blue-700",
                                selectedTool === tool.id && "bg-blue-50 text-blue-700 border-blue-200"
                              )}
                            >
                              {React.cloneElement(tool.icon, { className: "h-4 w-4 mb-0.5" })}
                              <span className="text-[10px] leading-tight font-medium text-center">{tool.label}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <p>{tool.label} <span className="text-xs text-muted-foreground">({tool.shortcut})</span></p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DraggableTool>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  )
} 