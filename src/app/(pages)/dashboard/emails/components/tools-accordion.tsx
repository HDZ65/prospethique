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
  BoxIcon,
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
      { id: "text", icon: <Type />, label: "Texte", shortcut: "T" },
      { id: "button", icon: <BoxIcon />, label: "Bouton", shortcut: "B" },
      { id: "list", icon: <ListOrdered />, label: "Liste", shortcut: "L" },
      { id: "link", icon: <Link />, label: "Lien", shortcut: "K" },
      { id: "table", icon: <Table />, label: "Tableau", shortcut: "M" },
      { id: "social", icon: <Share2 />, label: "Social", shortcut: "S" },
    ],
    media: [
      { id: "image", icon: <Image />, label: "Image", shortcut: "I" },
      { id: "video", icon: <Video />, label: "Vidéo", shortcut: "V" },
      { id: "gallery", icon: <FileImage />, label: "Galerie", shortcut: "G" },
    ],
    layout: [
      { id: "1col", icon: <Rows />, label: "1 colonne", shortcut: "1" },
      { id: "2col", icon: <Columns />, label: "2 colonnes", shortcut: "2" },
      { id: "3col", icon: <Columns />, label: "3 colonnes", shortcut: "3" },
      { id: "sidebar", icon: <SplitSquareVertical />, label: "Sidebar", shortcut: "D" },
    ],
  }

  const handleGenerateSuggestions = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <TooltipProvider delayDuration={1200}>
      <div className="flex flex-col h-full bg-background w-full border-r overflow-hidden">
        <div className="h-[60px] px-4 border-b flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-medium text-sm truncate">Éditeur d'email</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSearch(!showSearch)}>
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Rechercher</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Ajouter (Action à définir)</p></TooltipContent>
            </Tooltip>
          </div>
        </div>

        {showSearch && (
          <div className="px-4 py-3 border-b shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Rechercher..."
                className="h-9 pl-8 text-sm"
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
              <AccordionTrigger className="h-11 px-4 hover:no-underline hover:bg-neutral-50 text-sm font-medium">
                <div className="flex items-center gap-2 w-full">
                  <Settings className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="flex-1 text-left truncate">Configuration</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Destinataire</Label>
                    <div className="flex gap-2">
                      <Select>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Sélectionner un contact" />
                            </SelectTrigger>
                          </TooltipTrigger>
                          <TooltipContent><p>Choisir ou ajouter un contact</p></TooltipContent>
                        </Tooltip>
                        <SelectContent>
                          <SelectItem value="new">Nouveau contact</SelectItem>
                          <SelectItem value="import">Importer des contacts</SelectItem>
                          <SelectItem value="list">Liste de diffusion</SelectItem>
                        </SelectContent>
                      </Select>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                         </TooltipTrigger>
                         <TooltipContent><p>Ajouter un nouveau contact</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Template</Label>
                    <div className="flex gap-2">
                      <Select>
                         <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Choisir un template" />
                            </SelectTrigger>
                          </TooltipTrigger>
                          <TooltipContent><p>Sélectionner un modèle d'email</p></TooltipContent>
                        </Tooltip>
                        <SelectContent>
                          <SelectItem value="blank">Template vierge</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                        </SelectContent>
                      </Select>
                      <Tooltip>
                         <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                         <TooltipContent><p>Créer un nouveau template</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Sujet</Label>
                     <Tooltip>
                      <TooltipTrigger asChild>
                        <Input placeholder="Entrez le sujet de l'email" className="h-9 text-sm" />
                      </TooltipTrigger>
                       <TooltipContent side="bottom" align="start"><p>Le sujet qui apparaîtra dans la boîte de réception</p></TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Expéditeur</Label>
                    <Select>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Sélectionner l'expéditeur" />
                          </SelectTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Adresse email d'envoi</p></TooltipContent>
                      </Tooltip>
                      <SelectContent>
                        <SelectItem value="default">contact@entreprise.com</SelectItem>
                        <SelectItem value="support">support@entreprise.com</SelectItem>
                        <SelectItem value="custom">Personnalisé...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="content" className="border-b">
              <AccordionTrigger className="h-11 px-4 hover:no-underline hover:bg-neutral-50 text-sm font-medium">
                <div className="flex items-center gap-2 w-full">
                  <Shapes className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="flex-1 text-left truncate">Contenu</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 overflow-hidden">
                <Tabs defaultValue="elements" className="w-full">
                  <TabsList className="w-full h-9 mb-4 bg-neutral-100 p-0.5 text-sm">
                    <TabsTrigger value="elements" className="h-8 flex-1">Éléments</TabsTrigger>
                    <TabsTrigger value="media" className="h-8 flex-1">Média</TabsTrigger>
                    <TabsTrigger value="layout" className="h-8 flex-1">Layout</TabsTrigger>
                  </TabsList>

                  {Object.entries(tools).map(([category, items]) => (
                    <TabsContent key={category} value={category} className="mt-0">
                      <div className="grid grid-cols-2 gap-2">
                        {items.map((tool) => (
                           <Tooltip key={tool.id}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-[52px] flex flex-col items-center justify-center gap-1.5 p-1",
                                  "hover:bg-blue-50 hover:border-blue-300",
                                  selectedTool === tool.id && "border-blue-600 bg-blue-100 text-blue-700"
                                )}
                                onClick={() => setSelectedTool(tool.id)}
                              >
                                {React.cloneElement(tool.icon, {
                                  className: cn(
                                    "h-4 w-4 shrink-0",
                                    selectedTool === tool.id ? "text-blue-600" : "text-neutral-500"
                                  )
                                })}
                                <span className="text-xs truncate">{tool.label}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ajouter: {tool.label}</p>
                              {tool.shortcut && <p><Badge variant="secondary" className="h-auto px-1.5 py-0.5 text-[10px]">Raccourci: {tool.shortcut}</Badge></p>}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai" className="border-b">
              <AccordionTrigger className="h-11 px-4 hover:no-underline hover:bg-neutral-50 text-sm font-medium">
                <div className="flex items-center gap-2 w-full">
                  <Wand2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="flex-1 text-left truncate">Suggestions IA</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 overflow-hidden">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      "Toutes", "Introduction", "Accroche", "Valorisation", "Transition",
                      "Proposition", "Bénéfices", "Objection", "Conclusion"
                    ].map((category) => (
                      <Tooltip key={category}>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={selectedCategory === category.toLowerCase() ? "default" : "secondary"}
                            className={cn(
                              "cursor-pointer h-6 px-1.5 text-[10px] font-normal truncate",
                              selectedCategory === category.toLowerCase()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            )}
                            onClick={() => setSelectedCategory(category.toLowerCase())}
                          >
                            {category}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent><p>Filtrer par: {category}</p></TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-[52px] justify-start text-left px-3 py-2 border-neutral-200 hover:bg-blue-50 hover:border-blue-300 gap-2",
                             customSuggestionClicked && "bg-blue-100 border-blue-300"
                          )}
                           onClick={() => setCustomSuggestionClicked(!customSuggestionClicked)}
                        >
                          <MessageSquare className="h-4 w-4 text-neutral-500 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-neutral-800 truncate">Suggestion personnalisée</div>
                            <div className="text-[11px] text-neutral-500 truncate">Générer du texte sur mesure</div>
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start"><p>Générer une suggestion basée sur votre contexte.</p></TooltipContent>
                    </Tooltip>
                     <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                             "w-full h-[52px] justify-start text-left px-3 py-2 border-neutral-200 hover:bg-blue-50 hover:border-blue-300 gap-2",
                             styleImprovementClicked && "bg-blue-100 border-blue-300"
                          )}
                           onClick={() => setStyleImprovementClicked(!styleImprovementClicked)}
                        >
                          <Sparkles className="h-4 w-4 text-neutral-500 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-neutral-800 truncate">Amélioration du style</div>
                            <div className="text-[11px] text-neutral-500 truncate">Reformuler le texte sélectionné</div>
                          </div>
                        </Button>
                      </TooltipTrigger>
                       <TooltipContent side="bottom" align="start"><p>Améliorer le ton, la clarté ou la concision.</p></TooltipContent>
                    </Tooltip>
                  </div>

                   <Tooltip>
                    <TooltipTrigger asChild>
                       <Button
                        className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                         onClick={handleGenerateSuggestions}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin shrink-0" />
                        ) : (
                          <Wand2 className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                        )}
                        <span className="truncate">
                          {isGenerating ? "Génération..." : "Générer suggestions"}
                        </span>
                      </Button>
                    </TooltipTrigger>
                     <TooltipContent><p>Obtenir de nouvelles suggestions IA.</p></TooltipContent>
                  </Tooltip>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="analytics" className="border-b-0">
              <AccordionTrigger className="h-11 px-4 hover:no-underline hover:bg-neutral-50 text-sm font-medium">
                <div className="flex items-center gap-2 w-full">
                  <BarChart className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="flex-1 text-left truncate">Analytics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 overflow-hidden">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                     <Card className="p-3 rounded-lg">
                      <CardHeader className="p-0 pb-1">
                        <CardTitle className="text-xs font-medium text-neutral-600">Taux d'ouverture</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                         <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-xl font-bold text-blue-600 cursor-default">85%</div>
                          </TooltipTrigger>
                          <TooltipContent><p>Pourcentage d'emails ouverts</p></TooltipContent>
                        </Tooltip>
                      </CardContent>
                    </Card>
                     <Card className="p-3 rounded-lg">
                      <CardHeader className="p-0 pb-1">
                        <CardTitle className="text-xs font-medium text-neutral-600">Taux de clic</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-xl font-bold text-blue-600 cursor-default">42%</div>
                           </TooltipTrigger>
                          <TooltipContent><p>Pourcentage de clics sur les liens</p></TooltipContent>
                        </Tooltip>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Historique récent</Label>
                     <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-[52px] justify-start text-left px-3 py-2 gap-2 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <History className="h-4 w-4 text-neutral-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-neutral-800 truncate">Campaign #1</div>
                            <div className="text-[11px] text-neutral-500 truncate">Envoyé il y a 2 jours</div>
                          </div>
                          <Badge className="h-5 px-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 text-[11px] shrink-0">
                            85% ouvert
                          </Badge>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start"><p>Voir les détails de la campagne "Campaign #1".</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}
