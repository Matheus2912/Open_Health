import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { ExamPdfCard } from '@/features/dashboard/components/ExamPdfCard';
import { HealthRecordFab } from '@/features/dashboard/components/HealthRecordFab';
import { HealthRecordList } from '@/features/dashboard/components/HealthRecordList';
import { healthRecordActions, healthRecordSummaries } from '@/features/dashboard/constants/health-records';
import { DashboardActionType, HealthRecordType } from '@/features/dashboard/types/dashboard.type';
import { getFirstName } from '@/features/dashboard/utils/user-name';
import { useAuth } from '@/features/auth/context/AuthContext';
import { HealthRecordFormModal } from '@/features/health-records/components/HealthRecordFormModal';
import { emptyHealthRecords, healthRecordService } from '@/features/health-records/api/healthRecordService';
import { ExamPdfResponse, HealthRecordListItem, HealthRecordRequestByType, HealthRecordResponseByType, HealthRecordsState } from '@/features/health-records/types/health-record.type';
import { mapRecordsToListItems } from '@/features/health-records/utils/record-formatters';

export default function DashboardScreen() {
    const router = useRouter();
    const { logout, token, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState<DashboardActionType | null>(null);
    const [selectedRecordType, setSelectedRecordType] = useState<HealthRecordType | null>(null);
    const [records, setRecords] = useState<HealthRecordsState>(emptyHealthRecords);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingExam, setIsUploadingExam] = useState(false);
    const [recordsError, setRecordsError] = useState('');
    const [formError, setFormError] = useState('');
    const [editingRecord, setEditingRecord] = useState<HealthRecordResponseByType[HealthRecordType] | null>(null);
    const [examPdfs, setExamPdfs] = useState<ExamPdfResponse[]>([]);

    const loadRecords = useCallback(async () => {
        if (!token) {
            return;
        }

        setIsLoadingRecords(true);
        setRecordsError('');
        try {
            const response = await healthRecordService.listAll(token);
            setRecords(response);
        } catch (error) {
            setRecordsError(error instanceof Error ? error.message : 'Nao foi possivel carregar os registros.');
        } finally {
            setIsLoadingRecords(false);
        }
    }, [token]);

    useEffect(() => {
        void loadRecords();
    }, [loadRecords]);

    const loadExamPdfs = useCallback(async () => {
        if (!token) {
            return;
        }

        try {
            const response = await healthRecordService.listExamPdfs(token);
            setExamPdfs(response);
        } catch (error) {
            setRecordsError(error instanceof Error ? error.message : 'Nao foi possivel carregar os PDFs.');
        }
    }, [token]);

    useEffect(() => {
        void loadExamPdfs();
    }, [loadExamPdfs]);

    const itemsByType = useMemo(
        () => ({
            allergy: mapRecordsToListItems('allergy', records.allergy),
            medication: mapRecordsToListItems('medication', records.medication),
            vaccination: mapRecordsToListItems('vaccination', records.vaccination),
            condition: mapRecordsToListItems('condition', records.condition),
        }),
        [records]
    );

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleToggleSection = (section: DashboardActionType) => {
        setExpandedSection((currentSection) => (currentSection === section ? null : section));
    };

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    const handleSelectAction = (type: DashboardActionType) => {
        setIsMenuOpen(false);

        if (type === 'exam') {
            void handleAddExamPdf();
            return;
        }

        setFormError('');
        setEditingRecord(null);
        setSelectedRecordType(type);
    };

    const handleCloseForm = () => {
        if (!isSubmitting) {
            setSelectedRecordType(null);
            setEditingRecord(null);
            setFormError('');
        }
    };

    const handleEditRecord = (type: HealthRecordType, item: HealthRecordListItem) => {
        setIsMenuOpen(false);
        setFormError('');
        setEditingRecord(item.originalRecord);
        setSelectedRecordType(type);
    };

    const removeRecord = async (type: HealthRecordType, item: HealthRecordListItem) => {
        if (!token) {
            setRecordsError('Sessao expirada. Faca login novamente.');
            return;
        }

        try {
            setRecordsError('');
            await healthRecordService.remove(token, type, item.id);
            setRecords((currentRecords) => ({
                ...currentRecords,
                [type]: currentRecords[type].filter((record) => record.id !== item.id),
            }) as HealthRecordsState);
        } catch (error) {
            setRecordsError(error instanceof Error ? error.message : 'Nao foi possivel excluir o registro.');
        }
    };

    const handleDeleteRecord = (type: HealthRecordType, item: HealthRecordListItem) => {
        if (Platform.OS === 'web' && window.confirm('Deseja excluir esta informacao medica?')) {
            void removeRecord(type, item);
            return;
        }

        if (Platform.OS !== 'web') {
            Alert.alert('Excluir registro', 'Deseja excluir esta informacao medica?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: () => void removeRecord(type, item) },
            ]);
        }
    };

    const handleAddExamPdf = async () => {
        if (!token) {
            setRecordsError('Sessao expirada. Faca login novamente.');
            return;
        }

        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            multiple: false,
            copyToCacheDirectory: true,
        });

        if (result.canceled || !result.assets[0]) {
            return;
        }

        const selectedFile = result.assets[0];
        const fileName = selectedFile.name || 'exame.pdf';

        if (!fileName.toLowerCase().endsWith('.pdf')) {
            Alert.alert('Arquivo invalido', 'Selecione um arquivo PDF.');
            return;
        }

        setIsUploadingExam(true);
        setRecordsError('');
        try {
            const createdExam = await healthRecordService.uploadExamPdf(token, {
                uri: selectedFile.uri,
                name: fileName,
                type: selectedFile.mimeType || 'application/pdf',
                file: selectedFile.file,
            });
            setExamPdfs((currentExams) => [createdExam, ...currentExams]);
            setExpandedSection('exam');
        } catch (error) {
            setRecordsError(error instanceof Error ? error.message : 'Nao foi possivel enviar o PDF.');
        } finally {
            setIsUploadingExam(false);
        }
    };

    const removeExamPdf = async (exam: ExamPdfResponse) => {
        if (!token) {
            setRecordsError('Sessao expirada. Faca login novamente.');
            return;
        }

        try {
            setRecordsError('');
            await healthRecordService.removeExamPdf(token, exam.id);
            setExamPdfs((currentExams) => currentExams.filter((currentExam) => currentExam.id !== exam.id));
        } catch (error) {
            setRecordsError(error instanceof Error ? error.message : 'Nao foi possivel excluir o PDF.');
        }
    };

    const handleDeleteExamPdf = (exam: ExamPdfResponse) => {
        if (Platform.OS === 'web' && window.confirm('Deseja excluir este exame em PDF?')) {
            void removeExamPdf(exam);
            return;
        }

        if (Platform.OS !== 'web') {
            Alert.alert('Excluir PDF', 'Deseja excluir este exame em PDF?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: () => void removeExamPdf(exam) },
            ]);
        }
    };

    const handleSubmitRecord = async <TType extends HealthRecordType>(type: TType, payload: HealthRecordRequestByType[TType]) => {
        if (!token) {
            setFormError('Sessao expirada. Faca login novamente.');
            return;
        }

        setIsSubmitting(true);
        setFormError('');
        try {
            if (editingRecord) {
                const updatedRecord = await healthRecordService.update(token, type, editingRecord.id, payload);
                setRecords((currentRecords) => ({
                    ...currentRecords,
                    [type]: currentRecords[type].map((record) => (record.id === editingRecord.id ? updatedRecord : record)),
                }) as HealthRecordsState);
                setSelectedRecordType(null);
                setEditingRecord(null);
                return;
            }

            const createdRecord = await healthRecordService.create(token, type, payload);
            setRecords((currentRecords) => ({
                ...currentRecords,
                [type]: [createdRecord, ...currentRecords[type]],
            }) as HealthRecordsState);
            setExpandedSection(type);
            setSelectedRecordType(null);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : 'Nao foi possivel salvar o registro.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.container}>
                <DashboardHeader
                    userName={getFirstName(user?.nomeCompleto)}
                    onLogout={handleLogout}
                    onEmergencyPress={() => router.push('/emergencia' as never)}
                    onProfilePress={() => router.push('/perfil' as never)}
                />

                {isLoadingRecords ? (
                    <View style={styles.feedbackArea}>
                        <ActivityIndicator color="#0EA5E9" />
                        <Text style={styles.feedbackText}>Carregando registros...</Text>
                    </View>
                ) : null}

                {recordsError ? <Text style={styles.errorText}>{recordsError}</Text> : null}
                {isUploadingExam ? <Text style={styles.uploadingText}>Enviando exame...</Text> : null}

                <HealthRecordList
                    records={healthRecordSummaries}
                    itemsByType={itemsByType}
                    expandedSection={expandedSection}
                    onToggleSection={handleToggleSection}
                    onEditItem={handleEditRecord}
                    onDeleteItem={handleDeleteRecord}
                    footer={<ExamPdfCard exams={examPdfs} isExpanded={expandedSection === 'exam'} onToggle={() => handleToggleSection('exam')} onDelete={handleDeleteExamPdf} />}
                />

                <HealthRecordFab
                    actions={healthRecordActions}
                    isOpen={isMenuOpen}
                    onToggle={() => setIsMenuOpen((currentValue) => !currentValue)}
                    onSelect={handleSelectAction}
                />

                <HealthRecordFormModal
                    visible={selectedRecordType !== null}
                    type={selectedRecordType}
                    isSubmitting={isSubmitting}
                    error={formError}
                    initialRecord={editingRecord}
                    onClose={handleCloseForm}
                    onSubmit={handleSubmitRecord}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F9FF' },
    feedbackArea: { paddingTop: 20, alignItems: 'center', gap: 8 },
    feedbackText: { color: '#64748B', fontSize: 14 },
    errorText: { color: '#DC2626', fontSize: 14, paddingHorizontal: 20, paddingTop: 16 },
    uploadingText: { color: '#0F766E', fontSize: 14, paddingHorizontal: 20, paddingTop: 12, fontWeight: '700' },
});
