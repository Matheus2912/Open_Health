import { HealthRecordAction, HealthRecordSummary } from '@/features/dashboard/types/dashboard.type';

export const healthRecordSummaries: HealthRecordSummary[] = [
    {
        type: 'allergy',
        title: 'Alergias',
        icon: 'alert-circle',
        iconColor: '#EF4444',
        emptyText: 'Nenhuma alergia cadastrada',
    },
    {
        type: 'medication',
        title: 'Medicamentos de Uso Continuo',
        icon: 'paperclip',
        iconColor: '#3B82F6',
        emptyText: 'Nenhum medicamento cadastrado',
    },
    {
        type: 'vaccination',
        title: 'Vacinacao',
        icon: 'edit-2',
        iconColor: '#10B981',
        emptyText: 'Nenhuma vacina cadastrada',
    },
    {
        type: 'condition',
        title: 'Condicoes de Saude',
        icon: 'activity',
        iconColor: '#8B5CF6',
        emptyText: 'Nenhuma condicao cadastrada',
    },
];

export const healthRecordActions: HealthRecordAction[] = [
    {
        type: 'condition',
        label: 'Condicao de Saude',
        icon: 'activity',
        iconColor: '#8B5CF6',
    },
    {
        type: 'medication',
        label: 'Medicamento',
        icon: 'paperclip',
        iconColor: '#3B82F6',
    },
    {
        type: 'allergy',
        label: 'Alergia',
        icon: 'alert-circle',
        iconColor: '#EF4444',
    },
    {
        type: 'vaccination',
        label: 'Vacinacao',
        icon: 'edit-2',
        iconColor: '#10B981',
    },
    {
        type: 'exam',
        label: 'Exame',
        icon: 'file-text',
        iconColor: '#0F766E',
    },
];
