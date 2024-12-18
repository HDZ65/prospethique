'use client';

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Chart } from 'chart.js/auto';

// Types
interface Question {
  id: string;
  category: string;
  question: string;
  description?: string;
  impact: 'high' | 'medium' | 'low';
  recommendations?: string[];
  autoCheck?: boolean;
  checkMethod?: () => Promise<boolean>;
}

// Constantes
const CATEGORIES = {
  PERFORMANCE: 'Performance',
  SEO: 'SEO',
  ACCESSIBILITY: 'Accessibilité',
  SECURITY: 'Sécurité',
  CONTENT: 'Contenu',
  TECHNICAL: 'Technique',
  UX: 'Expérience Utilisateur',
  MOBILE: 'Mobile',
  ANALYTICS: 'Analytique',
  SOCIAL: 'Réseaux Sociaux',
} as const;
 
// Questions détaillées
const QUESTIONS: Question[] = [
  // Performance
  {
    id: 'perf1',
    category: CATEGORIES.PERFORMANCE,
    question: 'Temps de chargement initial (FCP)',
    description: 'First Contentful Paint devrait être < 2.5s',
    impact: 'high',
    recommendations: [
      'Optimiser les images avec next/image',
      'Utiliser la mise en cache avec next/cache',
      'Minimiser les fichiers CSS/JS',
      'Utiliser la compression Gzip/Brotli'
    ],
    autoCheck: true
  },
  {
    id: 'perf2',
    category: CATEGORIES.PERFORMANCE,
    question: 'Score Core Web Vitals',
    description: 'LCP, FID, et CLS conformes aux recommandations',
    impact: 'high',
    recommendations: [
      'Optimiser le LCP en préchargeant les ressources critiques',
      'Réduire le FID en minimisant le JavaScript',
      'Améliorer le CLS en réservant l\'espace pour les images'
    ]
  },
  
  // SEO Technique
  {
    id: 'seo1',
    category: CATEGORIES.SEO,
    question: 'Structure des données (Schema.org)',
    description: 'Implémentation des données structurées',
    impact: 'high',
    recommendations: [
      'Ajouter les schemas Organization',
      'Implémenter BreadcrumbList',
      'Utiliser Article pour le contenu'
    ]
  },
  
  // Accessibilité
  {
    id: 'a11y3',
    category: CATEGORIES.ACCESSIBILITY,
    question: 'Support ARIA',
    description: 'Utilisation appropriée des attributs ARIA',
    impact: 'high',
    recommendations: [
      'Vérifier les landmarks ARIA',
      'Utiliser aria-label pour les éléments sans texte',
      'Implémenter aria-expanded pour les menus'
    ]
  },

  // Nouvelles questions SEO
  {
    id: 'seo2',
    category: CATEGORIES.SEO,
    question: 'Optimisation mobile',
    description: 'Le site est-il optimisé pour mobile ?',
    impact: 'high',
    recommendations: [
      'Utiliser un design responsive',
      'Optimiser les images pour mobile',
      'Améliorer la vitesse de chargement mobile'
    ],
    autoCheck: true,
    checkMethod: async () => {
      // Implémentation de la vérification
      return true;
    }
  },

  // Nouvelles questions Performance
  {
    id: 'perf3',
    category: CATEGORIES.PERFORMANCE,
    question: 'Optimisation des images',
    description: 'Les images sont-elles optimisées ?',
    impact: 'medium',
    recommendations: [
      'Utiliser des formats modernes (WebP)',
      'Implémenter le lazy loading',
      'Utiliser des dimensions appropriées'
    ]
  },

  // ... Ajoutez d'autres questions pour chaque catégorie
];

// Types étendus
interface AuditMetrics {
  performance: number;
  accessibility: number;
  seo: number;
  security: number;
}

interface AuditHistory {
  date: Date;
  metrics: AuditMetrics;
  url: string;
}

// Questions enrichies avec des vérifications automatiques
const AUTOMATED_CHECKS = {
  performance: async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/lighthouse?url=${url}`);
      const data = await response.json();
      return data.performance > 0.9;
    } catch {
      return false;
    }
  },
  security: async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/security-check?url=${url}`);
      const data = await response.json();
      return data.secure;
    } catch {
      return false;
    }
  }
};

// Ajout d'un type pour le statut de validation
interface ValidationStatus {
  isValid: boolean;
  message?: string;
}

// Ajout d'un type pour les étapes
interface AuditStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

// Configuration des étapes
const AUDIT_STEPS: AuditStep[] = [
  {
    id: 1,
    title: 'Information',
    description: 'Informations du client et du site',
    icon: '📋'
  },
  {
    id: 2,
    title: 'Analyse',
    description: 'Analyse technique du site',
    icon: '🔍'
  },
  {
    id: 3,
    title: 'Évaluation',
    description: 'Notation et commentaires',
    icon: '✍️'
  },
  {
    id: 4,
    title: 'Rapport',
    description: 'Génération du rapport final',
    icon: '📊'
  }
];

const ErrorMessage = ({ message }: { message: string | null }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg mb-8">
      <p className="text-red-500">{message}</p>
    </div>
  );
};

// Type pour le formulaire
interface FormData {
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  websiteUrl: string;
  auditDate: string;
}

const WebsiteAuditForm = () => {
  // États existants optimisés
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoResults, setAutoResults] = useState<Record<string, boolean>>({});

  // États pour la navigation et le statut
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<Record<string, ValidationStatus>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [auditHistory, setAuditHistory] = useState<AuditHistory[]>([]);

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    websiteUrl: '',
    auditDate: new Date().toISOString().split('T')[0]
  });

  // Gestionnaire de changement de champ
  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Composant FormField modifié
  const FormField = ({ 
    id, 
    label, 
    type, 
    value, 
    onChange, 
    error 
  }: { 
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
  }) => (
    <div className="space-y-2 ">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-2 rounded-lg
          bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'}
          text-white placeholder-gray-400
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          focus:outline-none
        `}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  // Mise à jour du rendu du formulaire
  const renderFormStep = () => (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-white">Informations du client</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="client-name"
          label="Nom du client"
          type="text"
          value={formData.clientName}
          onChange={handleInputChange('clientName')}
          error={validationStatus.name?.message}
        />
        <FormField
          id="client-email"
          label="Email"
          type="email"
          value={formData.clientEmail}
          onChange={handleInputChange('clientEmail')}
          error={validationStatus.email?.message}
        />
        <FormField
          id="client-company"
          label="Entreprise"
          type="text"
          value={formData.clientCompany}
          onChange={handleInputChange('clientCompany')}
        />
        <FormField
          id="website-url"
          label="URL du site"
          type="url"
          value={formData.websiteUrl}
          onChange={handleInputChange('websiteUrl')}
          error={validationStatus.url?.message}
        />
      </div>
      <FormField
        id="audit-date"
        label="Date de l'audit"
        type="date"
        value={formData.auditDate}
        onChange={handleInputChange('auditDate')}
      />
    </div>
  );

  // Mise à jour du renderStepContent
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderFormStep();
      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white">Analyse technique</h2>
            <CategoryFilters />
            {renderCategories()}
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white">Résumé et métriques</h2>
            <MetricsSection />
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white">Rapport final</h2>
            <div className="flex gap-4">
              <button
                onClick={generatePDF}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl
                         hover:bg-blue-500 transition-colors"
              >
                Télécharger le rapport PDF
              </button>
              <button
                onClick={saveAudit}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl
                         hover:bg-green-500 transition-colors"
              >
                Sauvegarder l&apos;audit
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Mise à jour de la validation
  const validateFields = (step: number): boolean => {
    const newValidationStatus: Record<string, ValidationStatus> = {};
    
    if (step === 1) {
      if (!formData.clientName.trim()) {
        newValidationStatus.name = { isValid: false, message: 'Le nom est requis' };
      }
      if (!formData.clientEmail.trim()) {
        newValidationStatus.email = { isValid: false, message: 'L\'email est requis' };
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
        newValidationStatus.email = { isValid: false, message: 'Email invalide' };
      }
      if (!formData.websiteUrl.trim()) {
        newValidationStatus.url = { isValid: false, message: 'L\'URL est requise' };
      }
    }

    setValidationStatus(newValidationStatus);
    return Object.keys(newValidationStatus).length === 0;
  };

  // Fonction pour les vérifications automatiques
  const runAutomaticChecks = async () => {
    const results: Record<string, boolean> = {};
    
    try {
      for (const [key, check] of Object.entries(AUTOMATED_CHECKS)) {
        results[key] = await check(formData.websiteUrl);
      }
      setAutoResults(results);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors des vérifications automatiques';
      setError(errorMessage);
    }
  };

  // Fonction pour calculer les métriques
  const calculateMetrics = (): AuditMetrics => {
    const getAverageScore = (category: string): number => {
      const categoryQuestions = QUESTIONS.filter(q => q.category === category);
      const categoryScores = categoryQuestions.map(q => scores[q.id] || 0);
      return categoryScores.length ? 
        categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length : 0;
    };

    return {
      performance: getAverageScore(CATEGORIES.PERFORMANCE),
      accessibility: getAverageScore(CATEGORIES.ACCESSIBILITY),
      seo: getAverageScore(CATEGORIES.SEO),
      security: getAverageScore(CATEGORIES.SECURITY)
    };
  };

  // Ajouter après calculateMetrics
  const MetricsChart = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
      if (!chartRef.current) return;

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const metrics = calculateMetrics();
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      chartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: Object.keys(metrics),
          datasets: [{
            label: 'Scores',
            data: Object.values(metrics),
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 5,
              ticks: { stepSize: 1 }
            }
          }
        }
      });

      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, [scores]);

    return <canvas ref={chartRef} />;
  };

  // Composant pour l'indicateur d'étapes
  const StepsIndicator = () => (
    <div className="flex justify-between mb-8">
      {AUDIT_STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`
            flex flex-col items-center
            ${currentStep >= step.id ? 'text-blue-500' : 'text-gray-400'}
          `}>
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-lg
              ${currentStep >= step.id ? 'bg-blue-500 text-white' : 'bg-gray-700'}
            `}>
              {step.icon}
            </div>
            <span className="mt-2 text-sm font-medium">{step.title}</span>
          </div>
          {index < AUDIT_STEPS.length - 1 && (
            <div className={`
              w-full h-0.5 mx-4
              ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-700'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  // Fonction pour sauvegarder l'audit
  const saveAudit = async () => {
    try {
      const metrics = calculateMetrics();
      const auditData = {
        url: formData.websiteUrl,
        clientInfo: {
          name: formData.clientName,
          email: formData.clientEmail,
          company: formData.clientCompany
        },
        date: new Date(formData.auditDate),
        scores,
        notes,
        autoResults,
        metrics
      };

      // Simuler une sauvegarde API
      console.log('Sauvegarde de l\'audit:', auditData);
      
      // Ajouter à l'historique
      setAuditHistory(prev => [...prev, {
        date: new Date(formData.auditDate),
        metrics,
        url: formData.websiteUrl
      }]);

      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(errorMessage);
    }
  };

  // Fonction pour générer le PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('Rapport d\'audit web', 20, 20);
    
    // Informations générales
    doc.setFontSize(12);
    doc.text(`URL: ${formData.websiteUrl}`, 20, 40);
    doc.text(`Date: ${new Date(formData.auditDate).toLocaleDateString()}`, 20, 50);
    
    // Métriques
    const metrics = calculateMetrics();
    Object.entries(metrics).forEach(([key, value], index) => {
      doc.text(`${key}: ${value.toFixed(1)}/5`, 20, 70 + index * 10);
    });
    
    doc.save('audit-web.pdf');
  };

  // Amélioration de la navigation entre les étapes
  const handleNextStep = async () => {
    if (currentStep === 1 && !validateFields(1)) {
      return;
    }

    if (currentStep === 2) {
      setIsAnalyzing(true);
      try {
        await runAutomaticChecks();
      } finally {
        setIsAnalyzing(false);
      }
    }

    setCurrentStep(prev => Math.min(4, prev + 1));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Amélioration du filtrage des catégories
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      const categoryQuestions = QUESTIONS.filter(q => q.category === category);
      if (categoryQuestions.length > 0) {
        document.getElementById(categoryQuestions[0].id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Composant pour le filtrage des catégories
  const CategoryFilters = () => (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
      <button
        onClick={() => handleCategoryChange(null)}
        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors
          ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
      >
        Toutes les catégories
      </button>
      {Object.values(CATEGORIES).map(category => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors
            ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {category}
        </button>
      ))}
    </div>
  );

  // Composant pour la carte de question
  const QuestionCard = ({ question }: { question: Question }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <h3 className="text-lg font-medium text-white">{question.question}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                question.impact === 'high' ? 'bg-red-500' :
                question.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}>
                {question.impact}
              </span>
            </div>
            {question.description && (
              <p className="mt-1 text-sm text-gray-400">{question.description}</p>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={isExpanded ? 'Réduire' : 'Développer'}
          >
            <svg className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className={`mt-4 space-y-4 ${isExpanded ? 'block' : 'hidden'}`}>
          {/* Notation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Note</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  onClick={() => setScores(prev => ({ ...prev, [question.id]: score }))}
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    transition-all duration-200
                    ${scores[question.id] === score 
                      ? 'bg-blue-600 text-white scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20'}
                  `}
                  aria-label={`Note de ${score}`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Observations</label>
            <textarea
              value={notes[question.id] || ''}
              onChange={(e) => setNotes(prev => ({ ...prev, [question.id]: e.target.value }))}
              className="w-full h-24 px-4 py-2 rounded-lg bg-white/5 border border-white/10
                       text-white placeholder-gray-400 resize-none
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ajoutez vos observations..."
            />
          </div>

          {/* Recommandations */}
          {question.recommendations && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Recommandations</h4>
              <ul className="space-y-2">
                {question.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" 
                         viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" 
                            strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Résultat automatique */}
          {question.autoCheck && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Vérification automatique :</span>
              {autoResults[question.id] !== undefined ? (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  autoResults[question.id] ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {autoResults[question.id] ? 'Succès' : 'Échec'}
                </span>
              ) : (
                <span className="text-sm text-gray-400">En attente...</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Composant pour la section des métriques
  const MetricsSection = () => {
    const metrics = calculateMetrics();
    
    return (
      <div className="space-y-8">
        {/* Scores par catégorie */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(metrics).map(([category, score]) => (
            <div key={category} className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{score.toFixed(1)}</span>
                <span className="text-sm text-gray-400">/5</span>
              </div>
              <div className="mt-2 bg-white/10 rounded-full h-2">
                <div
                  className={`h-full rounded-full ${
                    score >= 4 ? 'bg-green-500' :
                    score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Graphique */}
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Vue d&apos;ensemble</h3>
          <div className="h-64">
            <MetricsChart />
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Historique des audits</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
            {auditHistory.map((audit, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{audit.url}</p>
                    <p className="text-sm text-gray-400">
                      {audit.date.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Score moyen</p>
                    <p className="text-lg font-semibold text-white">
                      {(Object.values(audit.metrics).reduce((a, b) => a + b, 0) / 
                       Object.values(audit.metrics).length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Ajouter après la définition de QuestionCard
  const renderCategories = () => (
    <div className="grid grid-cols-1 gap-6">
      {Object.entries(CATEGORIES).map(([categoryKey, category]) => {
        const categoryQuestions = QUESTIONS.filter(q => q.category === category);
        if (selectedCategory && category !== selectedCategory) return null;
        if (categoryQuestions.length === 0) return null;

        return (
          <div key={categoryKey} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">{category}</h2>
            {categoryQuestions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 container ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Audit détaillé de site web</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          >
            {isPreviewMode ? 'Éditer' : 'Aperçu'}
          </button>
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              Retour
            </button>
          )}
        </div>
      </div>

      <StepsIndicator />

      <ErrorMessage message={error} />

      <div className="bg-white/5 rounded-xl p-6 mb-8">
        {renderStepContent()}
      </div>

      <div className="flex justify-end gap-4">
        {currentStep < 4 && (
          <button
            onClick={handleNextStep}
            disabled={isAnalyzing}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Suivant'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WebsiteAuditForm;