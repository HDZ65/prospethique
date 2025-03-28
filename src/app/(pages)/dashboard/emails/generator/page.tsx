"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Send, Clock, Plus, Linkedin, Sparkles, Calendar, MessageSquare, History, BarChart, Save, Settings, UserPlus, FileText, Mail, PenLine, GripVertical, X, Maximize2, Minimize2, Wand2, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/empty-state"

// Types
interface Prospect {
  id: number
  prenom: string
  email: string
  date_proposition?: string
  notes?: string
  linkedInData?: LinkedInData
}

interface Template {
  id: number
  name: string
  content: string
  category: 'commercial' | 'event' | 'followup' | 'other' | 'relance' | 'remerciement' | 'invitation' | 'presentation' | 'devis' | 'newsletter'
  description?: string
  isCustom?: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface LinkedInData {
  profileUrl: string
  derniereSynchronisation: Date
  activites: {
    type: 'post' | 'like' | 'comment' | 'share'
    date: Date
    contenu: string
  }[]
  opportunites: {
    type: 'promotion' | 'nouveau_poste' | 'publication'
    date: Date
    description: string
  }[]
}

interface Suggestion {
  id: string
  text: string
  category: 'introduction' | 'valorisation' | 'proposition' | 'conclusion' | 'relance' | 'remerciement' | 'accroche' | 'transition' | 'objection' | 'benefices'
}

interface ScheduledEmail {
  id: string
  content: string
  recipient: string
  scheduledDate: Date
  status: 'pending' | 'sent' | 'failed'
}

interface EmailHistory {
  id: string
  recipient: string
  subject: string
  content: string
  sentAt: Date
  status: 'sent' | 'failed'
  engagement?: {
    opened: boolean
    clicked: boolean
    replied: boolean
    openedAt?: Date
    clickedAt?: Date
    repliedAt?: Date
  }
}

interface TextBlock {
  id: string
  content: string
  type: 'template' | 'custom'
}

interface SortableTextBlockProps {
  block: TextBlock
  onRemove?: (id: string) => void
  onUpdate?: (id: string, content: string) => void
}

function SortableTextBlock({ block, onRemove, onUpdate }: SortableTextBlockProps) {
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
    backgroundColor: block.type === 'custom' ? 'var(--accent)' : 'transparent',
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

// Données temporaires
const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 1,
    name: "Première prise de contact",
    category: 'commercial',
    description: "Pour initier une relation professionnelle",
    content: `Bonjour {{prenom}},

Je me permets de vous contacter car votre profil de {{poste}} chez {{entreprise}} a retenu mon attention.

[Votre message personnalisé]

Seriez-vous disponible {{date_proposition}} pour échanger à ce sujet ?

Cordialement,`
  },
  {
    id: 2,
    name: "Suivi commercial",
    category: 'followup',
    description: "Pour relancer après un premier contact",
    content: `Bonjour {{prenom}},

Suite à notre précédent échange concernant votre poste de {{poste}} chez {{entreprise}}, je souhaitais reprendre contact avec vous.

[Contexte du précédent échange]

Seriez-vous disponible pour faire le point ?

Cordialement,`
  }
]

const ALL_SUGGESTIONS: Suggestion[] = [
  // Introduction
  {
    id: 'intro1',
    text: "Suite à notre recherche approfondie dans votre secteur d'activité",
    category: 'introduction'
  },
  {
    id: 'intro2',
    text: "Après avoir suivi avec intérêt les développements de {{entreprise}}",
    category: 'introduction'
  },
  {
    id: 'intro3',
    text: "En tant qu'expert reconnu dans le domaine de {{poste}}",
    category: 'introduction'
  },
  {
    id: 'intro4',
    text: "Suite à la lecture de votre profil LinkedIn",
    category: 'introduction'
  },
  {
    id: 'intro5',
    text: "En tant que spécialiste dans votre secteur d'activité",
    category: 'introduction'
  },
  {
    id: 'intro6',
    text: "Dans le cadre de nos recherches sur l'innovation dans le secteur médical",
    category: 'introduction'
  },
  {
    id: 'intro7',
    text: "En tant qu'acteur majeur du développement durable",
    category: 'introduction'
  },
  {
    id: 'intro8',
    text: "Suite à votre intervention lors de la conférence sur l'IA",
    category: 'introduction'
  },
  // Accroche
  {
    id: 'accroche1',
    text: "Votre expertise en {{poste}} m'a particulièrement interpellé",
    category: 'accroche'
  },
  {
    id: 'accroche2',
    text: "J'ai été impressionné par les réalisations de {{entreprise}} dans le domaine",
    category: 'accroche'
  },
  {
    id: 'accroche3',
    text: "Votre approche innovante dans le secteur m'a marqué",
    category: 'accroche'
  },
  {
    id: 'accroche4',
    text: "Les projets récents de {{entreprise}} en matière de développement durable",
    category: 'accroche'
  },
  {
    id: 'accroche5',
    text: "Votre engagement dans la transformation numérique du secteur",
    category: 'accroche'
  },
  {
    id: 'accroche6',
    text: "Vos publications sur l'évolution des pratiques médicales",
    category: 'accroche'
  },
  {
    id: 'accroche7',
    text: "Votre contribution à l'innovation dans l'éducation",
    category: 'accroche'
  },
  {
    id: 'accroche8',
    text: "Votre expertise dans la cybersécurité des infrastructures critiques",
    category: 'accroche'
  },
  // Valorisation
  {
    id: 'val1',
    text: "Au vu de votre expertise en tant que {{poste}}",
    category: 'valorisation'
  },
  {
    id: 'val2',
    text: "Votre parcours impressionnant chez {{entreprise}}",
    category: 'valorisation'
  },
  {
    id: 'val3',
    text: "Vos réalisations dans le secteur sont remarquables",
    category: 'valorisation'
  },
  {
    id: 'val4',
    text: "Votre leadership dans la transformation digitale",
    category: 'valorisation'
  },
  {
    id: 'val5',
    text: "Votre contribution à l'innovation durable",
    category: 'valorisation'
  },
  {
    id: 'val6',
    text: "Votre expertise en intelligence artificielle appliquée",
    category: 'valorisation'
  },
  {
    id: 'val7',
    text: "Votre approche avant-gardiste de la médecine personnalisée",
    category: 'valorisation'
  },
  {
    id: 'val8',
    text: "Votre vision de l'agriculture connectée",
    category: 'valorisation'
  },
  // Transition
  {
    id: 'trans1',
    text: "Dans ce contexte d'innovation",
    category: 'transition'
  },
  {
    id: 'trans2',
    text: "Face aux enjeux actuels du secteur",
    category: 'transition'
  },
  {
    id: 'trans3',
    text: "Pour répondre aux défis de la transformation digitale",
    category: 'transition'
  },
  {
    id: 'trans4',
    text: "Dans cette période de transition écologique",
    category: 'transition'
  },
  {
    id: 'trans5',
    text: "Au regard des évolutions réglementaires",
    category: 'transition'
  },
  // Proposition
  {
    id: 'prop1',
    text: "Notre solution d'IA pourrait optimiser vos processus",
    category: 'proposition'
  },
  {
    id: 'prop2',
    text: "Notre approche de la cybersécurité pourrait renforcer votre infrastructure",
    category: 'proposition'
  },
  {
    id: 'prop3',
    text: "Notre plateforme de télémédecine pourrait étendre votre portée",
    category: 'proposition'
  },
  {
    id: 'prop4',
    text: "Notre solution IoT pourrait révolutionner votre production",
    category: 'proposition'
  },
  {
    id: 'prop5',
    text: "Notre expertise en ESG pourrait valoriser votre démarche RSE",
    category: 'proposition'
  },
  {
    id: 'prop6',
    text: "Notre technologie blockchain pourrait sécuriser vos transactions",
    category: 'proposition'
  },
  // Bénéfices
  {
    id: 'ben1',
    text: "Réduction de 40% de votre empreinte carbone",
    category: 'benefices'
  },
  {
    id: 'ben2',
    text: "Amélioration de 30% de la satisfaction patient",
    category: 'benefices'
  },
  {
    id: 'ben3',
    text: "Optimisation de 50% des processus de production",
    category: 'benefices'
  },
  {
    id: 'ben4',
    text: "Renforcement significatif de votre conformité RGPD",
    category: 'benefices'
  },
  {
    id: 'ben5',
    text: "Augmentation mesurable de l'engagement collaborateur",
    category: 'benefices'
  },
  // Objection
  {
    id: 'obj1',
    text: "Je comprends vos contraintes réglementaires, c'est pourquoi",
    category: 'objection'
  },
  {
    id: 'obj2',
    text: "Concernant la sécurité des données, nous garantissons",
    category: 'objection'
  },
  {
    id: 'obj3',
    text: "Pour l'intégration avec vos systèmes existants",
    category: 'objection'
  },
  {
    id: 'obj4',
    text: "Quant au ROI, nos études de cas montrent",
    category: 'objection'
  },
  {
    id: 'obj5',
    text: "Sur la question de la formation des équipes",
    category: 'objection'
  },
  // Conclusion
  {
    id: 'concl1',
    text: "Un échange de 30 minutes nous permettrait d'approfondir",
    category: 'conclusion'
  },
  {
    id: 'concl2',
    text: "Je propose une démonstration personnalisée",
    category: 'conclusion'
  },
  {
    id: 'concl3',
    text: "Nous pourrions organiser un atelier avec vos équipes",
    category: 'conclusion'
  },
  {
    id: 'concl4',
    text: "Je peux vous présenter des cas concrets dans votre secteur",
    category: 'conclusion'
  },
  {
    id: 'concl5',
    text: "Une étude gratuite de vos besoins pourrait être un premier pas",
    category: 'conclusion'
  }
]

const SAMPLE_PROSPECTS: Prospect[] = [
  {
    id: 1,
    prenom: 'Jean',
    email: 'jean@techsolutions.com',
    notes: 'Intéressé par nos services cloud',
    linkedInData: {
      profileUrl: 'https://linkedin.com/in/jean',
      derniereSynchronisation: new Date(),
      activites: [
        {
          type: 'post',
          date: new Date(),
          contenu: 'Nouvelle stratégie commerciale pour 2024'
        }
      ],
      opportunites: [
        {
          type: 'nouveau_poste',
          date: new Date(),
          description: 'Promotion au poste de Directeur Commercial'
        }
      ]
    }
  },
  {
    id: 2,
    prenom: 'Marie',
    email: 'marie@innovationlabs.com',
    notes: 'À recontacter pour présentation détaillée'
  }
]

const SAMPLE_EMAIL_HISTORY: EmailHistory[] = [
  {
    id: '1',
    recipient: 'jean@techsolutions.com',
    subject: 'Première prise de contact',
    content: 'Bonjour Jean...',
    sentAt: new Date(),
    status: 'sent',
    engagement: {
      opened: true,
      clicked: true,
      replied: false,
      openedAt: new Date(),
      clickedAt: new Date()
    }
  }
]

export default function EmailGeneratorPage() {
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [showScheduler, setShowScheduler] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([])
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [scheduledTime, setScheduledTime] = useState('09:00')
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [customTemplates, setCustomTemplates] = useState<Template[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    category: 'commercial',
    content: ''
  })
  const [selectedSuggestionCategory, setSelectedSuggestionCategory] = useState<string>('all')
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    const shuffled = [...ALL_SUGGESTIONS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 8)
  })
  const [customBlocks, setCustomBlocks] = useState<Array<{ id: string; content: string }>>([])
  const [currentCustomText, setCurrentCustomText] = useState("")
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([])
  const [manualProspect, setManualProspect] = useState<Partial<Prospect>>({
    prenom: '',
    email: '',
    date_proposition: ''
  })
  const [activeTab, setActiveTab] = useState<string>("editor")
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false)

  // Sensors pour le drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fonction pour supprimer un bloc
  const removeBlock = (blockId: string) => {
    setTextBlocks(prev => prev.filter(block => block.id !== blockId))
  }

  // Mise à jour des blocs de texte quand le template ou les blocs personnalisés changent
  useEffect(() => {
    if (!selectedTemplate) {
      setTextBlocks([])
      return
    }

    const blocks: TextBlock[] = []
    
    // Ajout du contenu du template
    const activeProspect = selectedProspect || manualProspect
    const templateContent = selectedTemplate.content
      .replace('{{prenom}}', activeProspect?.prenom || '[Prénom]')
      .replace('{{date_proposition}}', activeProspect?.date_proposition || '[Date]')

    const templateParagraphs = templateContent.split('\n\n').filter(Boolean)
    templateParagraphs.forEach((paragraph, index) => {
      blocks.push({
        id: `template-${index}`,
        content: paragraph,
        type: 'template'
      })
    })

    // Ajout des blocs personnalisés
    customBlocks.forEach((block) => {
      blocks.push({
        id: block.id,
        content: block.content,
        type: 'custom'
      })
    })

    setTextBlocks(blocks)
  }, [selectedTemplate, selectedProspect, manualProspect, customBlocks])

  // Gestion du drag and drop
  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setTextBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id)
        const newIndex = blocks.findIndex((block) => block.id === over.id)
        
        return arrayMove(blocks, oldIndex, newIndex)
      })
    }
  }

  // Génération du contenu final pour l'envoi
  const getFinalContent = () => {
    return textBlocks.map(block => block.content).join('\n\n')
  }

  // Prévisualisation de l'email
  const previewContent = selectedTemplate
    ? selectedTemplate.content
        .replace('{{prenom}}', (selectedProspect || manualProspect)?.prenom || '[Prénom]')
        .replace('{{date_proposition}}', (selectedProspect || manualProspect)?.date_proposition || '[Date]')
    : ''

  // Fonction pour programmer l'envoi
  const handleScheduleEmail = () => {
    if (!scheduledDate || !selectedProspect || !selectedTemplate) return

    const [hours, minutes] = scheduledTime.split(':').map(Number)
    const scheduleDateTime = new Date(scheduledDate)
    scheduleDateTime.setHours(hours, minutes)

    const newScheduledEmail: ScheduledEmail = {
      id: Date.now().toString(),
      content: previewContent,
      recipient: selectedProspect.email,
      scheduledDate: scheduleDateTime,
      status: 'pending'
    }

    setScheduledEmails([...scheduledEmails, newScheduledEmail])
    setShowScheduler(false)
  }

  // Fonction pour sauvegarder un template personnalisé
  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) return

    const template: Template = {
      id: Date.now(),
      name: newTemplate.name,
      category: newTemplate.category as Template['category'],
      content: newTemplate.content,
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setCustomTemplates([...customTemplates, template])
    setShowNewTemplateModal(false)
    setNewTemplate({ name: '', category: 'commercial', content: '' })
  }

  // Statistiques d'engagement
  const engagementStats = {
    totalSent: SAMPLE_EMAIL_HISTORY.length,
    opened: SAMPLE_EMAIL_HISTORY.filter(email => email.engagement?.opened).length,
    clicked: SAMPLE_EMAIL_HISTORY.filter(email => email.engagement?.clicked).length,
    replied: SAMPLE_EMAIL_HISTORY.filter(email => email.engagement?.replied).length
  }

  // Fonction pour générer de nouvelles suggestions
  const generateNewSuggestions = () => {
    const filteredSuggestions = selectedSuggestionCategory === 'all'
      ? ALL_SUGGESTIONS
      : ALL_SUGGESTIONS.filter(s => s.category === selectedSuggestionCategory)
    
    const shuffled = [...filteredSuggestions].sort(() => Math.random() - 0.5)
    setSuggestions(shuffled.slice(0, 8))
  }

  // Fonction pour filtrer les suggestions par catégorie
  const filterSuggestionsByCategory = (category: string) => {
    setSelectedSuggestionCategory(category)
    const filteredSuggestions = category === 'all'
      ? ALL_SUGGESTIONS
      : ALL_SUGGESTIONS.filter(s => s.category === category)
    setSuggestions(filteredSuggestions.slice(0, 8))
  }

  // Fonction pour ajouter un nouveau bloc personnalisé
  const addCustomBlock = () => {
    if (currentCustomText.trim()) {
      const newBlock = {
        id: `custom-${Date.now()}`,
        content: currentCustomText,
        type: 'custom' as const
      }
      setTextBlocks(prev => [...prev, newBlock])
      setCurrentCustomText("")
    }
  }

  // Fonction pour supprimer un bloc personnalisé
  const removeCustomBlock = (blockId: string) => {
    setCustomBlocks(prev => prev.filter(block => block.id !== blockId))
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Générer un email</h1>
      </div>

      <div className={cn(
        "grid gap-6",
        isPreviewFullscreen 
          ? "grid-cols-1" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {!isPreviewFullscreen && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <CardTitle>Configuration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prospect" className="flex items-center gap-2">
                      Sélectionner un prospect
                      {!selectedProspect && !manualProspect && (
                        <Badge variant="destructive" className="text-xs">Requis</Badge>
                      )}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = '/dashboard/prospect/nouveau'}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Nouveau prospect
                    </Button>
                  </div>
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

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prenom" className="flex items-center gap-2">
                      Prénom
                      {!selectedProspect?.prenom && !manualProspect.prenom && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Requis</Badge>
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
                      className={cn(
                        "transition-colors",
                        !selectedProspect?.prenom && !manualProspect.prenom && "border-yellow-500 focus-visible:ring-yellow-500"
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      Email
                      {!selectedProspect?.email && !manualProspect.email && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Requis</Badge>
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
                      className={cn(
                        "transition-colors",
                        !selectedProspect?.email && !manualProspect.email && "border-yellow-500 focus-visible:ring-yellow-500"
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_proposition" className="flex items-center gap-2">
                      Date de proposition
                      {!selectedProspect?.date_proposition && !manualProspect.date_proposition && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Requis</Badge>
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
                      className={cn(
                        "transition-colors",
                        !selectedProspect?.date_proposition && !manualProspect.date_proposition && "border-yellow-500 focus-visible:ring-yellow-500"
                      )}
                    />
                  </div>
                  {selectedProspect && (
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={selectedProspect.notes || ''}
                        onChange={(e) => setSelectedProspect({
                          ...selectedProspect,
                          notes: e.target.value
                        })}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="template" className="flex items-center gap-2">
                      Template d'email
                      {!selectedTemplate && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Requis</Badge>
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
                    <SelectTrigger className={cn(
                      "transition-colors",
                      !selectedTemplate && "border-yellow-500 focus-visible:ring-yellow-500"
                    )}>
                      <SelectValue placeholder="Choisir un template" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...DEFAULT_TEMPLATES, ...customTemplates].map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                          {template.isCustom && (
                            <Badge variant="secondary" className="ml-2">Personnalisé</Badge>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2">
                    Objet de l'email
                    {!emailSubject && !selectedTemplate?.name && (
                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Requis</Badge>
                    )}
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Entrez l'objet de l'email"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className={cn(
                      "transition-colors",
                      !emailSubject && !selectedTemplate?.name && "border-yellow-500 focus-visible:ring-yellow-500"
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Wand2 className="h-4 w-4" />
                  <CardTitle>Personnalisation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Suggestions rapides */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Label>Suggestions rapides</Label>
                        <Badge variant="secondary">IA</Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={generateNewSuggestions}>
                        <Sparkles className="h-4 w-4 mr-1" />
                        Générer
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={selectedSuggestionCategory === 'all' ? "default" : "secondary"}
                        className="cursor-pointer hover:bg-primary/90"
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
                          className="cursor-pointer hover:bg-primary/90"
                          onClick={() => filterSuggestionsByCategory(category.value)}
                        >
                          {category.label}
                        </Badge>
                      ))}
                    </div>

                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {suggestions.map((suggestion) => (
                          <Button
                            key={suggestion.id}
                            variant="outline"
                            className="w-full justify-start text-left whitespace-normal h-auto py-3"
                            onClick={() => {
                              const newBlock = {
                                id: `suggestion-${Date.now()}`,
                                content: suggestion.text,
                                type: 'custom' as const
                              }
                              setTextBlocks(prev => [...prev, newBlock])
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-1 shrink-0" />
                            <span className="line-clamp-2">{suggestion.text}</span>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator />

                  {/* Texte personnalisé */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Texte personnalisé</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addCustomBlock}
                        disabled={!currentCustomText.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter un bloc
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Écrivez votre texte personnalisé ici..."
                      value={currentCustomText}
                      onChange={(e) => setCurrentCustomText(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  {/* Données LinkedIn */}
                  {selectedProspect?.linkedInData && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Données LinkedIn</Label>
                        <Badge variant="secondary">
                          <Linkedin className="mr-1 h-3 w-3" />
                          Connecté
                        </Badge>
                      </div>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          {selectedProspect.linkedInData.activites.map((activite, index) => (
                            <div key={index} className="text-sm p-2 bg-muted rounded-lg">
                              {activite.contenu}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className={cn(isPreviewFullscreen && "col-span-full")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <CardTitle>Prévisualisation</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
              >
                {isPreviewFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <div className="p-4 bg-muted border-b rounded-t-lg">
                <div className="space-y-1">
                  <div className="text-sm font-medium">À: {(selectedProspect || manualProspect)?.email || '[Email]'}</div>
                  <div className="text-sm text-muted-foreground">Objet: {emailSubject || selectedTemplate?.name || '[Objet]'}</div>
                </div>
              </div>
              <div className="p-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={textBlocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {textBlocks.map((block) => (
                        <SortableTextBlock
                          key={block.id}
                          block={block}
                          onRemove={removeBlock}
                          onUpdate={(id, content) => {
                            setTextBlocks(prev =>
                              prev.map(b =>
                                b.id === id ? { ...b, content } : b
                              )
                            )
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowScheduler(true)}>
                  <Clock className="h-4 w-4 mr-1" />
                  Programmer
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-1" />
                  Sauvegarder
                </Button>
              </div>
              <Button>
                <Send className="h-4 w-4 mr-1" />
                Envoyer l'email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Dialog open={showNewTemplateModal} onOpenChange={setShowNewTemplateModal}>
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
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="Ex: Template de relance"
              />
            </div>
            <div>
              <Label>Catégorie</Label>
              <Select
                value={newTemplate.category}
                onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value as Template['category'] })}
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
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                placeholder="Contenu du template..."
                className="h-[200px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewTemplateModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Save className="h-4 w-4 mr-1" />
                Sauvegarder
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <DialogTitle>Historique des emails</DialogTitle>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {SAMPLE_EMAIL_HISTORY.map((email) => (
                <div key={email.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
    <div>
                      <div className="font-medium">{email.recipient}</div>
                      <div className="text-sm text-muted-foreground">{email.subject}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {email.sentAt.toLocaleDateString()}
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

      <Dialog open={showStats} onOpenChange={setShowStats}>
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
                <div className="text-2xl font-bold">{engagementStats.totalSent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Taux d'ouverture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((engagementStats.opened / engagementStats.totalSent) * 100)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Taux de clic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((engagementStats.clicked / engagementStats.totalSent) * 100)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Taux de réponse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((engagementStats.replied / engagementStats.totalSent) * 100)}%
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}