"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
import { ToolsAccordion } from "../components/tools-accordion"

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
  const [previewDimensions, setPreviewDimensions] = useState({ width: '100%', height: '100%' })
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const resizingRef = useRef(false)
  const movingRef = useRef(false)
  const startPositionRef = useRef({ x: 0, y: 0 })
  const previewRef = useRef<HTMLDivElement>(null)
  const initialDimensionsRef = useRef({ width: 0, height: 0 })
  const initialPositionRef = useRef({ x: 0, y: 0 })

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

  // Effet pour initialiser les blocs de texte quand un template est sélectionné
  useEffect(() => {
    if (selectedTemplate) {
      const activeProspect = selectedProspect || manualProspect
      const templateContent = selectedTemplate.content
        .replace('{{prenom}}', activeProspect?.prenom || '[Prénom]')
        .replace('{{date_proposition}}', activeProspect?.date_proposition || '[Date]')
        .replace('{{poste}}', '[Poste]')
        .replace('{{entreprise}}', '[Entreprise]')

      const templateParagraphs = templateContent.split('\n\n').filter(Boolean)
      const blocks: TextBlock[] = templateParagraphs.map((paragraph, index) => ({
        id: `template-${index}`,
        content: paragraph,
        type: 'template'
      }))

      setTextBlocks(blocks)
    } else {
      setTextBlocks([])
    }
  }, [selectedTemplate, selectedProspect, manualProspect])

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

  // Fonction pour gérer le redimensionnement
  const handleResize = useCallback((e: MouseEvent, direction: string) => {
    if (!resizingRef.current) return
    
    const deltaX = e.clientX - startPositionRef.current.x
    const deltaY = e.clientY - startPositionRef.current.y
    
    const newPreviewPosition = { ...previewPosition }
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
  }, [previewPosition])
  
  // Fonction pour gérer le début du redimensionnement
  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault()
    resizingRef.current = true
    startPositionRef.current = { x: e.clientX, y: e.clientY }
    
    // Sauvegarder les dimensions et positions initiales
    if (previewRef.current) {
      initialDimensionsRef.current = {
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight
      }
    }
    initialPositionRef.current = { x: previewPosition.x, y: previewPosition.y }
    
    // Ajouter les gestionnaires d'événements pour le redimensionnement
    document.addEventListener('mousemove', (e) => handleResize(e, direction), false)
    document.addEventListener('mouseup', handleResizeEnd, false)
  }, [previewPosition, handleResize])
  
  // Fonction pour gérer la fin du redimensionnement
  const handleResizeEnd = useCallback(() => {
    resizingRef.current = false
    document.removeEventListener('mousemove', handleResize as any, false)
    document.removeEventListener('mouseup', handleResizeEnd, false)
  }, [handleResize])

  // Fonction pour gérer le début du déplacement
  const handleMoveStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    movingRef.current = true
    startPositionRef.current = { x: e.clientX, y: e.clientY }
    initialPositionRef.current = { x: previewPosition.x, y: previewPosition.y }
    
    // Ajouter les gestionnaires d'événements pour le déplacement
    document.addEventListener('mousemove', handleMove, false)
    document.addEventListener('mouseup', handleMoveEnd, false)
  }, [previewPosition])
  
  // Fonction pour gérer le déplacement
  const handleMove = useCallback((e: MouseEvent) => {
    if (!movingRef.current) return
    
    const deltaX = e.clientX - startPositionRef.current.x
    const deltaY = e.clientY - startPositionRef.current.y
    
    setPreviewPosition({
      x: initialPositionRef.current.x + deltaX,
      y: initialPositionRef.current.y + deltaY
    })
  }, [])
  
  // Fonction pour gérer la fin du déplacement
  const handleMoveEnd = useCallback(() => {
    movingRef.current = false
    document.removeEventListener('mousemove', handleMove, false)
    document.removeEventListener('mouseup', handleMoveEnd, false)
  }, [handleMove])

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-neutral-100 dark:bg-neutral-900">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-background backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
              <Mail className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-semibold">
              Générer un email
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHistory(true)} className="hover:bg-primary/5">
              <History className="h-4 w-4 mr-1 text-primary/70" />
              Historique
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowStats(true)} className="hover:bg-primary/5">
              <BarChart className="h-4 w-4 mr-1 text-primary/70" />
              Statistiques
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column - Tools Accordion */}
        <div className="col-span-3 h-full">
          <ToolsAccordion />
        </div>

        {/* Right Column - Preview */}
        <div className="col-span-9 h-full flex items-center justify-center overflow-auto relative">
          {/* Arrière-plan avec motif de points */}
          <div 
            className="absolute inset-0 z-0"
            style={{ 
              backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0',
              opacity: 0.5
            }}
          />
          <div 
            ref={previewRef}
            className="absolute"
            style={{ 
              width: previewDimensions.width, 
              height: previewDimensions.height,
              maxWidth: '100%', 
              maxHeight: '100%',
              minWidth: '400px',
              minHeight: '500px',
              transform: `translate(${previewPosition.x}px, ${previewPosition.y}px)`,
              zIndex: movingRef.current ? 20 : 10,
              boxShadow: movingRef.current ? '0 8px 30px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.05)'
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
                            onClick={() => setShowScheduler(true)}
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
                            onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                          >
                            {isPreviewFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isPreviewFullscreen ? "Réduire" : "Agrandir"} la prévisualisation</p>
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
                      <div className="text-sm font-medium text-neutral-800">À: {(selectedProspect || manualProspect)?.email || '[Email]'}</div>
                      <div className="text-xs text-neutral-500">Objet: {emailSubject || selectedTemplate?.name || '[Objet]'}</div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={textBlocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
                        <div 
                          className="space-y-3 min-h-[250px] relative border-2 border-dashed border-transparent hover:border-blue-200 transition-colors rounded-md p-2"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('border-blue-300', 'bg-blue-50/30');
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('border-blue-300', 'bg-blue-50/30');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-blue-300', 'bg-blue-50/30');
                            const text = e.dataTransfer.getData("text/plain");
                            if (text) {
                              const newBlock = {
                                id: `custom-${Date.now()}`,
                                content: text,
                                type: 'custom' as const
                              };
                              setTextBlocks(prev => [...prev, newBlock]);
                            }
                          }}
                        >
                          {textBlocks.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-neutral-400">
                                <Mail className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs">Glissez du contenu ici ou sélectionnez un template</p>
                              </div>
                            </div>
                          )}
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

          {/* Indicateur de position et dimensions */}
          <div className="absolute bottom-3 right-3 bg-white dark:bg-neutral-800 px-2 py-1 rounded text-xs opacity-70 z-30">
            {Math.round(parseFloat(previewDimensions.width.toString()))}px × 
            {Math.round(parseFloat(previewDimensions.height.toString()))}px
          </div>
        </div>
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