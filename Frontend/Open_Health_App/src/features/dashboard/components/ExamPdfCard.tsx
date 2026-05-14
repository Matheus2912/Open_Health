import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ExamPdfResponse } from '@/features/health-records/types/health-record.type';

type ExamPdfCardProps = {
    exams: ExamPdfResponse[];
    isExpanded: boolean;
    onToggle: () => void;
    onDelete: (exam: ExamPdfResponse) => void;
};

function formatFileSize(size: number) {
    if (size >= 1024 * 1024) {
        return `${(size / 1024 / 1024).toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(size / 1024))} KB`;
}

export function ExamPdfCard({ exams, isExpanded, onToggle, onDelete }: ExamPdfCardProps) {
    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.header} onPress={onToggle}>
                <View style={styles.titleArea}>
                    <Feather name="file-text" size={20} color="#0F766E" />
                    <View style={styles.titleTextArea}>
                        <Text style={styles.title}>Exames</Text>
                        <Text style={styles.summary}>{exams.length} cadastrado{exams.length === 1 ? '' : 's'}</Text>
                    </View>
                </View>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#64748B" />
            </TouchableOpacity>

            {isExpanded && exams.length === 0 ? <Text style={styles.emptyText}>Nenhum exame cadastrado</Text> : null}

            {isExpanded ? (
                exams.map((exam) => (
                    <View key={exam.id} style={styles.examRow}>
                        <View style={styles.examTextArea}>
                            <Text style={styles.examName} numberOfLines={1}>
                                {exam.nomeArquivo}
                            </Text>
                            <Text style={styles.examMeta}>{formatFileSize(exam.tamanhoBytes)}</Text>
                        </View>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(exam)}>
                            <Feather name="trash-2" size={16} color="#DC2626" />
                        </TouchableOpacity>
                    </View>
                ))
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#CCFBF1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    titleArea: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    titleTextArea: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
    summary: { fontSize: 13, color: '#64748B', marginTop: 3 },
    emptyText: { fontSize: 14, color: '#64748B', marginTop: 18 },
    examRow: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
    examTextArea: { flex: 1 },
    examName: { fontSize: 14, color: '#0F172A', fontWeight: '600' },
    examMeta: { fontSize: 13, color: '#64748B', marginTop: 4 },
    deleteButton: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
});
