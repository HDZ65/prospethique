import { useState, useEffect } from 'react'
import { TextBlock, Prospect, Template, Suggestion, ScheduledEmail } from '../../types'
import { ALL_SUGGESTIONS } from '../../data/suggestions'
import { DEFAULT_TEMPLATES } from '../../data/templates'

export function useEmailGenerator() {
  // États principaux
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([])
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [manualProspect, setManualProspect] = useState<Partial<Prospect>>({
    prenom: '',
    email: '',
    date_proposition: ''
  })

  // États pour les suggestions
  const [selectedSuggestionCategory, setSelectedSuggestionCategory] = useState("all")
  const [suggestions, setSuggestions] = useState(ALL_SUGGESTIONS)

  // États pour les templates
  const [customTemplates, setCustomTemplates] = useState<Template[]>([])
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    category: 'commercial',
    content: ''
  })

  // États pour la programmation
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([])
  const [showScheduler, setShowScheduler] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [scheduledTime, setScheduledTime] = useState('09:00')

  // Handlers pour les blocs de texte
  const addTextBlock = (content: string = "", buttonProps: Record<string, any> = {}) => {
    const newBlock: TextBlock = {
      id: `block-${Date.now()}`,
      content,
      type: 'text',
      buttonProps
    }
    setTextBlocks(blocks => [...blocks, newBlock])
  }

  const removeBlock = (blockId: string) => {
    setTextBlocks(blocks => blocks.filter(block => block.id !== blockId))
  }

  const updateBlockContent = (id: string, content: string, buttonProps: Record<string, any> = {}) => {
    setTextBlocks(blocks =>
      blocks.map(block =>
        block.id === id
          ? { ...block, content, buttonProps: { ...block.buttonProps, ...buttonProps } }
          : block
      )
    )
  }

  const reorderBlocks = (oldIndex: number, newIndex: number) => {
    setTextBlocks(blocks => {
      const result = Array.from(blocks)
      const [removed] = result.splice(oldIndex, 1)
      result.splice(newIndex, 0, removed)
      return result
    })
  }

  // Handlers pour les suggestions
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

  // Handlers pour les templates
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

    setCustomTemplates(prev => [...prev, template])
    setShowNewTemplateModal(false)
    setNewTemplate({ name: '', category: 'commercial', content: '' })
  }

  // Handlers pour la programmation
  const handleScheduleEmail = () => {
    if (!scheduledDate || !selectedProspect) return

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

    setScheduledEmails(prev => [...prev, newScheduledEmail])
    setShowScheduler(false)
  }

  // Effet pour initialiser les blocs de texte quand un template est sélectionné
  useEffect(() => {
    if (selectedTemplate) {
      const activeProspect = selectedProspect || manualProspect
      const templateContent = selectedTemplate.content
        .replace('{{prenom}}', activeProspect?.prenom || '[Prénom]')
        .replace('{{date_proposition}}', activeProspect?.date_proposition || '[Date]')
        .replace('{{poste}}', activeProspect?.poste || '[Poste]')
        .replace('{{entreprise}}', activeProspect?.entreprise || '[Entreprise]')

      const templateParagraphs = templateContent.split('\n\n').filter(Boolean)
      const blocks: TextBlock[] = templateParagraphs.map((paragraph: string, index: number) => ({
        id: `template-${index}`,
        content: paragraph,
        type: 'text'
      }))

      setTextBlocks(blocks)
    }
  }, [selectedTemplate, selectedProspect, manualProspect])

  return {
    // États
    textBlocks,
    selectedProspect,
    selectedTemplate,
    emailSubject,
    manualProspect,
    selectedSuggestionCategory,
    suggestions,
    customTemplates,
    showNewTemplateModal,
    newTemplate,
    scheduledEmails,
    showScheduler,
    scheduledDate,
    scheduledTime,

    // Setters
    setSelectedProspect,
    setSelectedTemplate,
    setEmailSubject,
    setManualProspect,
    setShowNewTemplateModal,
    setNewTemplate,
    setShowScheduler,
    setScheduledDate,
    setScheduledTime,

    // Handlers
    addTextBlock,
    removeBlock,
    updateBlockContent,
    reorderBlocks,
    generateNewSuggestions,
    filterSuggestionsByCategory,
    handleSaveTemplate,
    handleScheduleEmail
  }
} 