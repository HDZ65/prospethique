"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Settings, UserPlus, FileText, Wand2, Sparkles, MessageSquare, Mail, Clock, Maximize2, Minimize2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ToolsAccordionProps {
  selectedProspect: any
  setSelectedProspect: (prospect: any) => void
  selectedTemplate: any
  setSelectedTemplate: (template: any) => void
  emailSubject: string
  setEmailSubject: (subject: string) => void
  manualProspect: any
  setManualProspect: (prospect: any) => void
  showNewTemplateModal: boolean
  setShowNewTemplateModal: (show: boolean) => void
  customTemplates: any[]
  selectedSuggestionCategory: string
  setSelectedSuggestionCategory: (category: string) => void
  suggestions: any[]
  setSuggestions: (suggestions: any[]) => void
  textBlocks: any[]
  setTextBlocks: (blocks: any[]) => void
  generateNewSuggestions: () => void
  filterSuggestionsByCategory: (category: string) => void
  SAMPLE_PROSPECTS: any[]
  DEFAULT_TEMPLATES: any[]
}

export function ToolsAccordion({
  selectedProspect,
  setSelectedProspect,
  selectedTemplate,
  setSelectedTemplate,
  emailSubject,
  setEmailSubject,
  manualProspect,
  setManualProspect,
  showNewTemplateModal,
  setShowNewTemplateModal,
  customTemplates,
  selectedSuggestionCategory,
  setSelectedSuggestionCategory,
  suggestions,
  setSuggestions,
  textBlocks,
  setTextBlocks,
  generateNewSuggestions,
  filterSuggestionsByCategory,
  SAMPLE_PROSPECTS,
  DEFAULT_TEMPLATES
}: ToolsAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full">
      {/* Configuration Section */}
      <AccordionItem value="configuration">
        <AccordionTrigger className="px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <span>Configuration</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="p-4 space-y-4">
            {/* Prospect Selection */}
            <div className="space-y-2">
              <Label htmlFor="prospect" className="flex items-center gap-2">
                Sélectionner un prospect
                {!selectedProspect && !manualProspect && (
                  <Badge variant="destructive" className="text-xs">Requis</Badge>
                )}
              </Label>
              <Select onValueChange={(value) => {
                const prospect = SAMPLE_PROSPECTS.find(p => p.id.toString() === value)
                setSelectedProspect(prospect || null)
                if (prospect) {
                  setManualProspect({
                    prenom: '',
                    email: '',
                    date_proposition: ''
                  })
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un prospect" />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_PROSPECTS.map((prospect) => (
                    <SelectItem key={prospect.id} value={prospect.id.toString()}>
                      {prospect.prenom} ({prospect.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prospect Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom" className="flex items-center gap-2">
                  Prénom
                  {!selectedProspect?.prenom && !manualProspect.prenom && (
                    <Badge variant="secondary" className="text-xs">Requis</Badge>
                  )}
                </Label>
                <Input
                  id="prenom"
                  type="text"
                  placeholder="Prénom du prospect"
                  value={selectedProspect?.prenom || manualProspect.prenom}
                  onChange={(e) => {
                    if (!selectedProspect) {
                      setManualProspect(prev => ({ ...prev, prenom: e.target.value }))
                    }
                  }}
                  disabled={!!selectedProspect}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email
                  {!selectedProspect?.email && !manualProspect.email && (
                    <Badge variant="secondary" className="text-xs">Requis</Badge>
                  )}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email du prospect"
                  value={selectedProspect?.email || manualProspect.email}
                  onChange={(e) => {
                    if (!selectedProspect) {
                      setManualProspect(prev => ({ ...prev, email: e.target.value }))
                    }
                  }}
                  disabled={!!selectedProspect}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_proposition" className="flex items-center gap-2">
                Date de proposition
                {!selectedProspect?.date_proposition && !manualProspect.date_proposition && (
                  <Badge variant="secondary" className="text-xs">Requis</Badge>
                )}
              </Label>
              <Input
                id="date_proposition"
                type="text"
                placeholder="Ex: la semaine prochaine"
                value={selectedProspect?.date_proposition || manualProspect.date_proposition}
                onChange={(e) => {
                  if (selectedProspect) {
                    setSelectedProspect({
                      ...selectedProspect,
                      date_proposition: e.target.value
                    })
                  } else {
                    setManualProspect(prev => ({ ...prev, date_proposition: e.target.value }))
                  }
                }}
              />
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="template" className="flex items-center gap-2">
                  Template d'email
                  {!selectedTemplate && (
                    <Badge variant="secondary" className="text-xs">Requis</Badge>
                  )}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewTemplateModal(true)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Nouveau template
                </Button>
              </div>
              <Select onValueChange={(value) => {
                const template = [...DEFAULT_TEMPLATES, ...customTemplates].find(t => t.id.toString() === value)
                setSelectedTemplate(template || null)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un template" />
                </SelectTrigger>
                <SelectContent>
                  {[...DEFAULT_TEMPLATES, ...customTemplates].map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      <div className="flex items-center justify-between">
                        <span>{template.name}</span>
                        {template.isCustom && (
                          <Badge variant="secondary" className="ml-2">Personnalisé</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="flex items-center gap-2">
                Objet de l'email
                {!emailSubject && !selectedTemplate?.name && (
                  <Badge variant="secondary" className="text-xs">Requis</Badge>
                )}
              </Label>
              <Input
                id="subject"
                placeholder="Entrez l'objet de l'email"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
          </CardContent>
        </AccordionContent>
      </AccordionItem>

      {/* Suggestions Section */}
      <AccordionItem value="suggestions">
        <AccordionTrigger className="px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wand2 className="h-4 w-4 text-primary" />
            </div>
            <span>Suggestions IA</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={generateNewSuggestions}
                className="hover:bg-primary/10"
              >
                <Sparkles className="h-4 w-4 mr-1 text-primary/70" />
                Générer
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant={selectedSuggestionCategory === 'all' ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => filterSuggestionsByCategory('all')}
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
                  variant={selectedSuggestionCategory === category.value ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => filterSuggestionsByCategory(category.value)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    variant="outline"
                    className="w-full justify-start text-left whitespace-normal h-auto py-3 hover:bg-primary/5 transition-colors"
                    onClick={() => {
                      const newBlock = {
                        id: `suggestion-${Date.now()}`,
                        content: suggestion.text,
                        type: 'custom' as const
                      }
                      setTextBlocks(prev => [...prev, newBlock])
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-1 shrink-0 text-primary/70" />
                    <span className="line-clamp-2">{suggestion.text}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
} 