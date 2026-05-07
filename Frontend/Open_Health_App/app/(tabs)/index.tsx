import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { HealthRecordFab } from '@/features/dashboard/components/HealthRecordFab';
import { HealthRecordList } from '@/features/dashboard/components/HealthRecordList';
import { healthRecordActions, healthRecordSummaries } from '@/features/dashboard/constants/health-records';
import { HealthRecordType } from '@/features/dashboard/types/dashboard.type';
import { getFirstName } from '@/features/dashboard/utils/user-name';
import { useAuth } from '@/features/auth/context/AuthContext';
import { HealthRecordFormModal } from '@/features/health-records/components/HealthRecordFormModal';
import { emptyHealthRecords, healthRecordService } from '@/features/health-records/api/healthRecordService';
import { HealthRecordRequestByType, HealthRecordsState } from '@/features/health-records/types/health-record.type';
import { mapRecordsToListItems } from '@/features/health-records/utils/record-formatters';

export default function DashboardScreen() {
    const router = useRouter();
    const { logout, token, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedRecordType, setSelectedRecordType] = useState<HealthRecordType | null>(null);
    const [records, setRecords] = useState<HealthRecordsState>(emptyHealthRecords);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recordsError, setRecordsError] = useState('');
    const [formError, setFormError] = useState('');

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

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    const handleSelectRecordType = (type: HealthRecordType) => {
        setIsMenuOpen(false);
        setFormError('');
        setSelectedRecordType(type);
    };

    const handleCloseForm = () => {
        if (!isSubmitting) {
            setSelectedRecordType(null);
            setFormError('');
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
            const createdRecord = await healthRecordService.create(token, type, payload);
            setRecords((currentRecords) => ({
                ...currentRecords,
                [type]: [createdRecord, ...currentRecords[type]],
            }) as HealthRecordsState);
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
                <DashboardHeader userName={getFirstName(user?.nomeCompleto)} onLogout={handleLogout} />

                {isLoadingRecords ? (
                    <View style={styles.feedbackArea}>
                        <ActivityIndicator color="#0EA5E9" />
                        <Text style={styles.feedbackText}>Carregando registros...</Text>
                    </View>
                ) : null}

                {recordsError ? <Text style={styles.errorText}>{recordsError}</Text> : null}

                <HealthRecordList records={healthRecordSummaries} itemsByType={itemsByType} />

                <HealthRecordFab
                    actions={healthRecordActions}
                    isOpen={isMenuOpen}
                    onToggle={() => setIsMenuOpen((currentValue) => !currentValue)}
                    onSelect={handleSelectRecordType}
                />

                <HealthRecordFormModal
                    visible={selectedRecordType !== null}
                    type={selectedRecordType}
                    isSubmitting={isSubmitting}
                    error={formError}
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
});
