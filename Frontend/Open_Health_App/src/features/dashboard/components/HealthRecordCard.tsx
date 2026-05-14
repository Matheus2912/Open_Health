import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HealthRecordSummary } from '@/features/dashboard/types/dashboard.type';
import { HealthRecordListItem } from '@/features/health-records/types/health-record.type';

type HealthRecordCardProps = {
    record: HealthRecordSummary;
    items: HealthRecordListItem[];
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: (item: HealthRecordListItem) => void;
    onDelete: (item: HealthRecordListItem) => void;
};

export function HealthRecordCard({ record, items, isExpanded, onToggle, onEdit, onDelete }: HealthRecordCardProps) {
    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.cardHeader} onPress={onToggle}>
                <View style={styles.titleArea}>
                    <Feather name={record.icon} size={20} color={record.iconColor} />
                    <View style={styles.titleTextArea}>
                        <Text style={styles.cardTitle}>{record.title}</Text>
                        <Text style={styles.cardSummary}>{items.length} cadastrado{items.length === 1 ? '' : 's'}</Text>
                    </View>
                </View>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#64748B" />
            </TouchableOpacity>
            {isExpanded && items.length === 0 ? (
                <Text style={styles.cardContent}>{record.emptyText}</Text>
            ) : (
                isExpanded ? <View style={styles.recordList}>
                    {items.map((item) => (
                        <View key={item.id} style={styles.recordItem}>
                            <View style={styles.recordTextArea}>
                                <Text style={styles.recordPrimary}>{item.primaryText}</Text>
                                {item.secondaryText ? <Text style={styles.recordSecondary}>{item.secondaryText}</Text> : null}
                            </View>
                            <View style={styles.recordActions}>
                                <TouchableOpacity style={styles.iconButton} onPress={() => onEdit(item)}>
                                    <Feather name="edit-2" size={16} color="#2563EB" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={() => onDelete(item)}>
                                    <Feather name="trash-2" size={16} color="#DC2626" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View> : null
            )}
        </View>
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
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    titleArea: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    titleTextArea: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
    cardSummary: { fontSize: 13, color: '#64748B', marginTop: 3 },
    cardContent: { fontSize: 14, color: '#64748B', marginTop: 18 },
    recordList: { gap: 12, marginTop: 18 },
    recordItem: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
    recordTextArea: { flex: 1 },
    recordPrimary: { fontSize: 14, color: '#0F172A', fontWeight: '600' },
    recordSecondary: { fontSize: 13, color: '#64748B', marginTop: 4 },
    recordActions: { flexDirection: 'row', gap: 8 },
    iconButton: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
});
