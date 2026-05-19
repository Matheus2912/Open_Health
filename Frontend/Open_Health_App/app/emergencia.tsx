import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/context/AuthContext';
import { emptyHealthRecords, healthRecordService } from '@/features/health-records/api/healthRecordService';
import { HealthRecordsState } from '@/features/health-records/types/health-record.type';
import { formatDisplayText } from '@/features/health-records/utils/record-formatters';

const fixedEmergencyContacts = [
    { name: 'SAMU', phone: '192' },
    { name: 'Bombeiros', phone: '193' },
];

function calculateAge(birthDate?: string) {
    if (!birthDate) {
        return 'Não informado';
    }

    const parsedDate = new Date(birthDate);
    if (Number.isNaN(parsedDate.getTime())) {
        return 'Não informado';
    }

    const today = new Date();
    let age = today.getFullYear() - parsedDate.getFullYear();
    const monthDifference = today.getMonth() - parsedDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < parsedDate.getDate())) {
        age -= 1;
    }

    return `${age} anos`;
}

function formatList(values: string[]) {
    const filledValues = values.filter(Boolean);
    return filledValues.length ? filledValues.join(', ') : 'Nenhum registro';
}

function callPhone(phone: string) {
    const dialablePhone = phone.replace(/[^\d+]/g, '');
    void Linking.openURL(`tel:${dialablePhone}`);
}

export default function EmergencyScreen() {
    const router = useRouter();
    const { token, user } = useAuth();
    const [records, setRecords] = useState<HealthRecordsState>(emptyHealthRecords);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const loadEmergencyData = useCallback(async () => {
        if (!token) {
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const response = await healthRecordService.listAll(token);
            setRecords(response);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar as informações médicas.');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        void loadEmergencyData();
    }, [loadEmergencyData]);

    const criticalInfo = useMemo(
        () => [
            {
                label: 'Alergias',
                value: formatList(records.allergy.map((allergy) => `${allergy.nome}${allergy.gravidadeDescricao ? ` (${formatDisplayText(allergy.gravidadeDescricao)})` : ''}`)),
            },
            {
                label: 'Medicamentos',
                value: formatList(records.medication.map((medication) => medication.medicamentoPosologia)),
            },
            {
                label: 'Condições',
                value: formatList(records.condition.map((condition) => formatDisplayText(condition.tipoProblemaDescricao) || condition.descricao)),
            },
        ],
        [records]
    );

    const emergencyContacts = useMemo(
        () => [
            ...fixedEmergencyContacts,
            {
                name: 'Contato de Emergência',
                phone: user?.telefoneEmergencia || 'Não cadastrado',
            },
        ],
        [user?.telefoneEmergencia]
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={18} color="#FFFFFF" />
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <View style={styles.alertCard}>
                    <View style={styles.alertIcon}>
                        <Feather name="alert-triangle" size={26} color="#EF4444" />
                    </View>
                    <View style={styles.alertTextArea}>
                        <Text style={styles.alertTitle}>MODO DE EMERGÊNCIA</Text>
                        <Text style={styles.alertSubtitle}>Informações Críticas de Saúde</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionTitleArea}>
                        <Feather name="heart" size={18} color="#EF4444" />
                        <Text style={styles.sectionTitle}>Informações Básicas</Text>
                    </View>

                    <View style={styles.basicGrid}>
                        <View style={styles.basicItem}>
                            <Text style={styles.basicLabel}>Tipo Sanguíneo</Text>
                            <Text style={styles.basicValue}>{user?.tipoSanguineo || 'Não informado'}</Text>
                        </View>
                        <View style={styles.basicItem}>
                            <Text style={styles.basicLabel}>Idade</Text>
                            <Text style={styles.basicValue}>{calculateAge(user?.dataNascimento)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionTitleArea}>
                        <Feather name="file-text" size={18} color="#2563EB" />
                        <Text style={styles.sectionTitle}>Dados Médicos</Text>
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingArea}>
                            <ActivityIndicator color="#2563EB" />
                            <Text style={styles.loadingText}>Carregando informações...</Text>
                        </View>
                    ) : null}

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {criticalInfo.map((item) => (
                        <View key={item.label} style={styles.medicalRow}>
                            <Text style={styles.medicalLabel}>{item.label}</Text>
                            <Text style={styles.medicalValue}>{item.value}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionTitleArea}>
                        <Feather name="phone" size={18} color="#2563EB" />
                        <Text style={styles.sectionTitle}>Contatos de Emergência</Text>
                    </View>

                    {emergencyContacts.map((contact) => {
                        const canCall = contact.phone !== 'Não cadastrado';

                        return (
                        <TouchableOpacity key={contact.name} style={[styles.contactButton, !canCall && styles.contactButtonDisabled]} onPress={() => canCall && callPhone(contact.phone)}>
                            <View>
                                <Text style={styles.contactName}>{contact.name}</Text>
                                <Text style={styles.contactPhone}>{contact.phone}</Text>
                            </View>
                            <Feather name="phone" size={20} color={canCall ? '#2563EB' : '#94A3B8'} />
                        </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.instructionsCard}>
                    <View style={styles.instructionsTitleArea}>
                        <Feather name="alert-triangle" size={16} color="#B45309" />
                        <Text style={styles.instructionsTitle}>Instruções para Socorristas</Text>
                    </View>
                    <Text style={styles.instructionText}>- Verifique as alergias antes de administrar medicamentos</Text>
                    <Text style={styles.instructionText}>- Contate os números de emergência acima</Text>
                    <Text style={styles.instructionText}>- Mantenha o paciente calmo e confortavel</Text>
                    <Text style={styles.instructionText}>- Não mova o paciente sem necessidade</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#EF0000' },
    content: { paddingHorizontal: 16, paddingBottom: 28 },
    backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 12 },
    backText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    alertCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 18,
    },
    alertIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertTextArea: { flex: 1 },
    alertTitle: { color: '#DC2626', fontSize: 18, fontWeight: '900' },
    alertSubtitle: { color: '#0F172A', fontSize: 12, marginTop: 2 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 18, marginBottom: 18 },
    sectionTitleArea: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
    sectionTitle: { color: '#0F172A', fontSize: 17, fontWeight: '800' },
    basicGrid: { flexDirection: 'row', gap: 24 },
    basicItem: { flex: 1 },
    basicLabel: { color: '#334155', fontSize: 12, marginBottom: 4 },
    basicValue: { color: '#0F172A', fontSize: 17, fontWeight: '900' },
    loadingArea: { alignItems: 'center', gap: 8, paddingVertical: 12 },
    loadingText: { color: '#475569', fontSize: 13 },
    errorText: { color: '#DC2626', fontSize: 13, marginBottom: 12 },
    medicalRow: {
        borderWidth: 1,
        borderColor: '#BFDBFE',
        backgroundColor: '#EFF6FF',
        borderRadius: 6,
        padding: 12,
        marginBottom: 8,
    },
    medicalLabel: { color: '#0F172A', fontSize: 13, fontWeight: '800', marginBottom: 4 },
    medicalValue: { color: '#2563EB', fontSize: 13, lineHeight: 18 },
    contactButton: {
        borderWidth: 1,
        borderColor: '#93C5FD',
        backgroundColor: '#EFF6FF',
        borderRadius: 6,
        padding: 14,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    contactButtonDisabled: { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' },
    contactName: { color: '#0F172A', fontSize: 14, fontWeight: '800', marginBottom: 3 },
    contactPhone: { color: '#2563EB', fontSize: 14 },
    instructionsCard: {
        backgroundColor: '#FEFCE8',
        borderColor: '#FDE047',
        borderWidth: 1,
        borderRadius: 8,
        padding: 18,
    },
    instructionsTitleArea: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
    instructionsTitle: { color: '#92400E', fontSize: 14, fontWeight: '800' },
    instructionText: { color: '#92400E', fontSize: 12, lineHeight: 20 },
});
