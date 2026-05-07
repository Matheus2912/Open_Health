import { ScrollView, StyleSheet } from 'react-native';

import { HealthRecordCard } from '@/features/dashboard/components/HealthRecordCard';
import { HealthRecordSummary, HealthRecordType } from '@/features/dashboard/types/dashboard.type';
import { HealthRecordListItem } from '@/features/health-records/types/health-record.type';

type HealthRecordListProps = {
    records: HealthRecordSummary[];
    itemsByType: Record<HealthRecordType, HealthRecordListItem[]>;
};

export function HealthRecordList({ records, itemsByType }: HealthRecordListProps) {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {records.map((record) => (
                <HealthRecordCard key={record.type} record={record} items={itemsByType[record.type]} />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: 20, gap: 16, paddingBottom: 100 },
});
