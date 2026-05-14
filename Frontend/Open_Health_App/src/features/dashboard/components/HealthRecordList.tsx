import { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { HealthRecordCard } from '@/features/dashboard/components/HealthRecordCard';
import { DashboardActionType, HealthRecordSummary, HealthRecordType } from '@/features/dashboard/types/dashboard.type';
import { HealthRecordListItem } from '@/features/health-records/types/health-record.type';

type HealthRecordListProps = {
    records: HealthRecordSummary[];
    itemsByType: Record<HealthRecordType, HealthRecordListItem[]>;
    expandedSection: DashboardActionType | null;
    onToggleSection: (section: DashboardActionType) => void;
    onEditItem: (type: HealthRecordType, item: HealthRecordListItem) => void;
    onDeleteItem: (type: HealthRecordType, item: HealthRecordListItem) => void;
    footer?: ReactNode;
};

export function HealthRecordList({ records, itemsByType, expandedSection, onToggleSection, onEditItem, onDeleteItem, footer }: HealthRecordListProps) {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {records.map((record) => (
                <HealthRecordCard
                    key={record.type}
                    record={record}
                    items={itemsByType[record.type]}
                    isExpanded={expandedSection === record.type}
                    onToggle={() => onToggleSection(record.type)}
                    onEdit={(item) => onEditItem(record.type, item)}
                    onDelete={(item) => onDeleteItem(record.type, item)}
                />
            ))}
            {footer}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: 20, gap: 16, paddingBottom: 100 },
});
