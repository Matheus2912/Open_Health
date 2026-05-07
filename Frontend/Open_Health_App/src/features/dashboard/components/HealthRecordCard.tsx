import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HealthRecordSummary } from '@/features/dashboard/types/dashboard.type';
import { HealthRecordListItem } from '@/features/health-records/types/health-record.type';

type HealthRecordCardProps = {
    record: HealthRecordSummary;
    items: HealthRecordListItem[];
};

export function HealthRecordCard({ record, items }: HealthRecordCardProps) {
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
                <Feather name={record.icon} size={20} color={record.iconColor} />
                <Text style={styles.cardTitle}>{record.title}</Text>
            </View>
            {items.length === 0 ? (
                <Text style={styles.cardContent}>{record.emptyText}</Text>
            ) : (
                <View style={styles.recordList}>
                    {items.map((item) => (
                        <View key={item.id} style={styles.recordItem}>
                            <Text style={styles.recordPrimary}>{item.primaryText}</Text>
                            {item.secondaryText ? <Text style={styles.recordSecondary}>{item.secondaryText}</Text> : null}
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
    cardContent: { fontSize: 14, color: '#64748B' },
    recordList: { gap: 12 },
    recordItem: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12 },
    recordPrimary: { fontSize: 14, color: '#0F172A', fontWeight: '600' },
    recordSecondary: { fontSize: 13, color: '#64748B', marginTop: 4 },
});
