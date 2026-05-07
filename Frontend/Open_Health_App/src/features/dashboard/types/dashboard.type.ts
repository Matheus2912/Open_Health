import { Feather } from '@expo/vector-icons';

export type HealthRecordType = 'allergy' | 'medication' | 'vaccination' | 'condition';

export type HealthRecordSummary = {
    type: HealthRecordType;
    title: string;
    icon: keyof typeof Feather.glyphMap;
    iconColor: string;
    emptyText: string;
};

export type HealthRecordAction = {
    type: HealthRecordType;
    label: string;
    icon: keyof typeof Feather.glyphMap;
    iconColor: string;
};
