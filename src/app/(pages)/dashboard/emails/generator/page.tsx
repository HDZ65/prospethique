"use client"

import { useState, useEffect, useRef} from "react"
import { Button } from "@/components/ui/button"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Mail, History, BarChart } from "lucide-react"
import { ToolsAccordion } from "./components/tools-accordion"
import { EmailPreview } from "./components/EmailPreview"
import { NewTemplateDialog } from "./components/NewTemplateDialog"
import { HistoryDialog } from "./components/HistoryDialog"
import { StatsDialog } from "./components/StatsDialog"
import { 
  Prospect, 
  Template, 
  Suggestion, 
  ScheduledEmail, 
  EmailHistory, 
  TextBlock 
} from "./types"

// Interface pour les blocs MJML (peut être déplacée dans types/index.ts plus tard)
interface MjmlBlock {
  id: string;
  type: string; // ex: 'mj-section', 'mj-text', 'mj-button'
  attributes?: Record<string, any>;
  content?: string;
  children?: MjmlBlock[];
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
    id: "1",
    prenom: "Marie",
    nom: "Dubois",
    email: "marie.dubois@entreprise.com",
    poste: "Directrice Marketing",
    entreprise: "Entreprise A",
    telephone: "+33 6 12 34 56 78",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    prenom: "Thomas",
    nom: "Martin",
    email: "thomas.martin@societe.fr",
    poste: "Responsable Commercial",
    entreprise: "Société B",
    telephone: "+33 6 98 76 54 32",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16")
  }
]

const SAMPLE_EMAIL_HISTORY: EmailHistory[] = [
  {
    id: '1',
    recipient: 'jean@techsolutions.com',
    subject: 'Première prise de contact',
    content: 'Bonjour Jean...',
    sentDate: new Date(),
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>(ALL_SUGGESTIONS)
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
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [emailBlocks, setEmailBlocks] = useState<TextBlock[]>([])
  const [mjmlBlocks, setMjmlBlocks] = useState<MjmlBlock[]>([])

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handlers
  const removeBlock = (blockId: string) => {
    setTextBlocks(blocks => blocks.filter(block => block.id !== blockId))
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      return;
    }

    const activeData = active.data.current;
    const overId = over.id;

    // Cas 1: Déposer un composant MJML sur la prévisualisation
    if (overId === 'email-preview-content' && activeData?.source === 'mjml-tool') {
      console.log("Dropped MJML tool on Preview:", activeData);
      const newBlock: MjmlBlock = {
        id: `mjml-${Date.now()}`,
        type: activeData.type,
        attributes: { ...activeData.defaultAttributes }, // Utiliser les attributs par défaut si fournis
      };

      // Gérer les colonnes pour les sections
      if (newBlock.type === 'mj-section' && activeData.columns) {
        newBlock.children = Array.from({ length: activeData.columns }).map((_, i) => ({
          id: `mjml-col-${Date.now()}-${i}`,
          type: 'mj-column',
          children: [],
        }));
      } else if (newBlock.type === 'mj-text') {
        newBlock.content = activeData.content || "Texte par défaut"; // Contenu par défaut pour mj-text
      } else if (newBlock.type === 'mj-button') {
        newBlock.content = activeData.content || "Bouton"; // Contenu par défaut pour mj-button
        newBlock.attributes = { ...newBlock.attributes, href: '#' }; // Attribut href par défaut
      }

      // TODO: Logique plus avancée pour insérer à la bonne position si nécessaire
      setMjmlBlocks((prevBlocks) => [...prevBlocks, newBlock]);
      return;
    }

    // Cas 2: Déposer une suggestion sur la prévisualisation
    if (overId === 'email-preview-content' && activeData?.source === 'suggestion') {
      console.log("Dropped suggestion on Preview:", activeData);
      // Crée un nouveau TextBlock à partir de la suggestion
      addTextBlock(activeData.text);
      return;
    }

    // Cas 3: Réorganiser les TextBlock existants dans la prévisualisation (si activé)
    if (active.id !== over.id && activeData?.source === 'sortable-text-block') {
      setTextBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items; // S'assurer que les deux éléments sont des TextBlock
        // S'assurer que le drop se fait bien sur un autre TextBlock et non sur le fond de la preview
        if (over.data.current?.source !== 'sortable-text-block') return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateBlockContent = (id: string, content: string, buttonProps: Record<string, any> = {}) => {
    setTextBlocks(blocks =>
      blocks.map(block =>
        block.id === id
          ? { ...block, content, buttonProps: { ...block.buttonProps, ...buttonProps } }
          : block
      )
    )
  }

  const addTextBlock = (content: string = "", buttonProps: Record<string, any> = {}) => {
    const newBlock: TextBlock = {
      id: `block-${Date.now()}`,
      content,
      type: buttonProps && Object.keys(buttonProps).length > 0 ? 'button' : 'text',
      buttonProps: buttonProps && Object.keys(buttonProps).length > 0 ? buttonProps : undefined
    }
    setTextBlocks(blocks => [...blocks, newBlock])
  }

  const generateNewSuggestions = () => {
    // TODO: Implement AI suggestion generation
    console.log("Generating new suggestions...")
  }

  const filterSuggestionsByCategory = (category: string) => {
    setSelectedSuggestionCategory(category)
    if (category === "all") {
      setSuggestions(ALL_SUGGESTIONS)
    } else {
      setSuggestions(ALL_SUGGESTIONS.filter(s => s.category === category))
    }
  }

  // Effet pour initialiser les blocs de texte quand un template est sélectionné
  useEffect(() => {
    if (selectedTemplate) {
      const activeProspect = selectedProspect || manualProspect
      let templateContent = selectedTemplate.content

      // Remplacement dynamique des variables
      const dataToReplace = { ...activeProspect };
      Object.entries(dataToReplace).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const regex = new RegExp(`{{\s*${key}\s*}}`, 'g'); // Utilise {{variable}}
          templateContent = templateContent.replace(regex, String(value));
        }
      });

      // Nettoyer les variables non remplacées (optionnel)
      templateContent = templateContent.replace(/{{\s*[^}]+\s*}}/g, '[Information manquante]');

      const templateParagraphs = templateContent.split('\n\n').filter(Boolean)
      const blocks: TextBlock[] = templateParagraphs.map((paragraph: string, index: number) => ({
        id: `template-${Date.now()}-${index}`,
        content: paragraph,
        type: 'text'
      }))

      setTextBlocks(blocks)
    } else {
      setTextBlocks([])
    }
  }, [selectedTemplate, selectedProspect, manualProspect])

  // Fonction pour programmer l'envoi
  const handleScheduleEmail = () => {
    if (!scheduledDate || !selectedProspect || !selectedTemplate) return

    const [hours, minutes] = scheduledTime.split(':').map(Number)
    const scheduleDateTime = new Date(scheduledDate)
    scheduleDateTime.setHours(hours, minutes)

    const newScheduledEmail: ScheduledEmail = {
      id: Date.now().toString(),
      content: textBlocks.map(block => block.content).join('\n\n'),
      recipient: selectedProspect.email,
      scheduledDate: scheduleDateTime,
      status: 'pending'
    }

    setScheduledEmails([...scheduledEmails, newScheduledEmail])
    setShowScheduler(false)
  }

  // Statistiques d'engagement
  const engagementStats = {
    totalSent: SAMPLE_EMAIL_HISTORY.length,
    opened: SAMPLE_EMAIL_HISTORY.filter(email => email.engagement?.opened).length,
    clicked: SAMPLE_EMAIL_HISTORY.filter(email => email.engagement?.clicked).length,
    replied: SAMPLE_EMAIL_HISTORY.filter(email => email.engagement?.replied).length
  }

  const handleSaveTemplate = () => {
    // Implementation of handleSaveTemplate
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-neutral-100 dark:bg-neutral-900">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-background backdrop-blur-sm shrink-0">
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

        {/* Main Content - Changé en flex pour 2 colonnes: Outils + Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Colonne Gauche - Outils */}
          <aside className="w-[360px] border-r bg-background flex flex-col shrink-0 h-full overflow-y-auto">
            <ToolsAccordion />
          </aside>

          {/* Colonne Droite - Maintenant éditeur WYSIWYG / Aperçu */}
          <main className="flex-1 flex flex-col bg-neutral-100 dark:bg-neutral-800 overflow-auto relative p-4">
            {/* EmailPreview occupe maintenant la zone principale */}
            {/* Nous allons devoir passer mjmlBlocks ici pour le rendu */}
            <EmailPreview
              ref={previewRef}
              dimensions={previewDimensions}
              position={previewPosition}
              isFullscreen={isPreviewFullscreen}
              isMoving={movingRef.current}
              recipient={(selectedProspect || manualProspect)?.email || '[Email]'}
              subject={emailSubject || selectedTemplate?.name || '[Objet]'}
              onFullscreenToggle={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
              onSchedule={() => setShowScheduler(true)}
              setPreviewDimensions={setPreviewDimensions}
              setPreviewPosition={setPreviewPosition}
              startPositionRef={startPositionRef}
              initialDimensionsRef={initialDimensionsRef}
              initialPositionRef={initialPositionRef}
              resizingRef={resizingRef}
              movingRef={movingRef}
              // Il faudra passer les mjmlBlocks pour les afficher
              // mjmlBlocks={mjmlBlocks} 
            >
              {/* Le contenu sera maintenant le rendu des mjmlBlocks */}
              <div className="p-4 min-h-[300px] text-center text-neutral-400 flex items-center justify-center bg-white border rounded">
                 (Rendu MJML/HTML des blocs à implémenter ici)
              </div>
            </EmailPreview>
          </main>

        </div>
      </div>

      {/* DragOverlay */}
      <DragOverlay>
        {activeId ? (
          (() => {
            // Aperçu pour les TextBlocks (Ancien éditeur) - Peut être supprimé si plus utilisé
            // const activeTextBlock = textBlocks.find((b) => b.id === activeId);
            // if (activeTextBlock) {
            //   return <SortableTextBlock block={activeTextBlock} isDragging />;
            // }
            
            // Aperçu pour les Outils MJML
            if (typeof activeId === 'string' && activeId.startsWith('mj-')) {
               return <div className="p-2 bg-blue-100 border border-blue-300 rounded shadow-lg opacity-80 font-medium">{activeId.replace('mj-', '').replace('-1col','').replace('-2col','').replace('-3col','')}</div>;
            }
            return null;
          })()
        ) : null}
      </DragOverlay>

      {/* Modals */}
      <NewTemplateDialog 
        open={showNewTemplateModal}
        onOpenChange={setShowNewTemplateModal}
        template={newTemplate}
        onTemplateChange={setNewTemplate}
        onSave={handleSaveTemplate}
      />
      <HistoryDialog 
        open={showHistory}
        onOpenChange={setShowHistory}
        emailHistory={SAMPLE_EMAIL_HISTORY}
      />
      <StatsDialog
        open={showStats}
        onOpenChange={setShowStats}
        stats={engagementStats}
      />
      {/* Le bouton flottant pour ajouter un bloc texte était mal placé */}
      {/* <Button 
        variant="outline" 
        size="sm" 
        onClick={() => addTextBlock("Cliquez ici", { backgroundColor: "#1A73E8", textColor: "#FFFFFF" })}
        className="flex items-center gap-1"
      >
        <Box className="h-4 w-4" />
        <span>Bouton</span>
      </Button> */}
    </DndContext>
  )
}