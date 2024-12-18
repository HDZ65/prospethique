import Papa from 'papaparse';
import { Prospect } from '@/hooks/useGetProspects';

export const exporterProspects = (prospects: Prospect[]) => {
  const csvContent = prospects.map(p => ({
    Entreprise: p.entreprise,
    Email: p.email,
    Statut: p.statut,
    'Étape Pipeline': p.etapePipeline,
    'Valeur Potentielle': p.valeurPotentielle,
    'Budget Estimé': p.budgetEstime || 'Non défini',
    'Taille Société': p.tailleSociete,
    'Secteur Activité': p.secteurActivite,
    'Source': p.sourceProspect,
    'Dernier Contact': p.dernierContact,
    'Nombre Interactions': p.interactions?.length || 0,
    'Tags': p.tags?.join(', '),
    'Notes': p.notes
  }));

  const csv = Papa.unparse(csvContent);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `prospects_export_${new Date().toISOString()}.csv`;
  link.click();
}; 