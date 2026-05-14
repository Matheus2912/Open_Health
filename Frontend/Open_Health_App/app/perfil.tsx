import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/features/auth/context/AuthContext';
import { IUsuarioUpdateRequest } from '@/features/auth/types/auth.type';
import { formatBirthDateInput, toIsoDate } from '@/features/health-records/utils/record-formatters';

const bloodTypeOptions = ['Nao selecionado', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const sexOptions = ['Masculino', 'Feminino', 'Outro'] as const;

function formatCpf(rawValue: string) {
    const digits = rawValue.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 3) {
        return digits;
    }
    if (digits.length <= 6) {
        return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    if (digits.length <= 9) {
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatPhone(rawValue: string) {
    const digits = rawValue.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) {
        return digits;
    }
    if (digits.length <= 7) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isoToDisplayDate(value?: string) {
    if (!value) {
        return '';
    }

    const [year, month, day] = value.split('-');
    return day && month && year ? `${day}/${month}/${year}` : '';
}

export default function ProfileScreen() {
    const router = useRouter();
    const { deleteProfile, isLoading, updateProfile, user } = useAuth();
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [bloodType, setBloodType] = useState<(typeof bloodTypeOptions)[number]>('Nao selecionado');
    const [sex, setSex] = useState<(typeof sexOptions)[number]>('Masculino');
    const [telefoneEmergencia, setTelefoneEmergencia] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            return;
        }

        setNomeCompleto(user.nomeCompleto);
        setEmail(user.email);
        setCpf(formatCpf(user.cpf));
        setBirthDate(isoToDisplayDate(user.dataNascimento));
        setBloodType((user.tipoSanguineo || 'Nao selecionado') as (typeof bloodTypeOptions)[number]);
        setSex((user.sexo || 'Masculino') as (typeof sexOptions)[number]);
        setTelefoneEmergencia(formatPhone(user.telefoneEmergencia ?? ''));
    }, [user]);

    const handleSave = async () => {
        const dataNascimento = toIsoDate(birthDate);

        if (!nomeCompleto.trim() || !email.trim() || !cpf.trim() || !dataNascimento) {
            setError('Preencha nome, e-mail, CPF e data de nascimento.');
            return;
        }

        const payload: IUsuarioUpdateRequest = {
            nomeCompleto: nomeCompleto.trim(),
            email: email.trim(),
            cpf,
            tipoSanguineo: bloodType === 'Nao selecionado' ? undefined : bloodType,
            dataNascimento,
            sexo: sex,
            telefoneEmergencia: telefoneEmergencia.trim() || undefined,
        };

        try {
            setError('');
            await updateProfile(payload);
            router.back();
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : 'Nao foi possivel atualizar o perfil.');
        }
    };

    const handleDelete = () => {
        const deleteAccount = async () => {
            try {
                setError('');
                await deleteProfile();
                router.replace('/login');
            } catch (deleteError) {
                setError(deleteError instanceof Error ? deleteError.message : 'Nao foi possivel deletar a conta.');
            }
        };

        if (Platform.OS === 'web' && window.confirm('Essa acao remove sua conta e seus dados vinculados. Deseja continuar?')) {
            void deleteAccount();
            return;
        }

        if (Platform.OS === 'web') {
            return;
        }

        Alert.alert('Deletar conta', 'Essa acao remove sua conta e seus dados vinculados. Deseja continuar?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Deletar',
                style: 'destructive',
                onPress: () => void deleteAccount(),
            },
        ]);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={22} color="#0F172A" />
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Meu Perfil</Text>
                <Text style={styles.subtitle}>Edite seus dados e o contato usado na tela de emergencia</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput style={styles.input} value={nomeCompleto} onChangeText={setNomeCompleto} placeholder="Seu nome completo" />

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />

                    <Text style={styles.label}>CPF</Text>
                    <TextInput style={styles.input} value={cpf} onChangeText={(value) => setCpf(formatCpf(value))} placeholder="000.000.000-00" keyboardType="numeric" maxLength={14} />

                    <Text style={styles.label}>Data de Nascimento</Text>
                    <TextInput style={styles.input} value={birthDate} onChangeText={(value) => setBirthDate(formatBirthDateInput(value))} placeholder="DD/MM/AAAA" keyboardType="numeric" maxLength={10} />

                    <Text style={styles.label}>Tipo Sanguineo</Text>
                    <View style={styles.selectorWrap}>
                        {bloodTypeOptions.map((option) => (
                            <TouchableOpacity key={option} style={[styles.optionChip, bloodType === option && styles.optionChipSelected]} onPress={() => setBloodType(option)}>
                                <Text style={[styles.optionChipText, bloodType === option && styles.optionChipTextSelected]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Sexo</Text>
                    <View style={styles.selectorWrap}>
                        {sexOptions.map((option) => (
                            <TouchableOpacity key={option} style={[styles.optionChip, sex === option && styles.optionChipSelected]} onPress={() => setSex(option)}>
                                <Text style={[styles.optionChipText, sex === option && styles.optionChipTextSelected]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Contato de Emergencia</Text>
                    <TextInput
                        style={styles.input}
                        value={telefoneEmergencia}
                        onChangeText={(value) => setTelefoneEmergencia(formatPhone(value))}
                        placeholder="(11) 98765-4321"
                        keyboardType="phone-pad"
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity style={[styles.primaryButton, isLoading && styles.disabledButton]} onPress={handleSave} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Salvar Alteracoes</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isLoading}>
                        <Feather name="trash-2" size={18} color="#DC2626" />
                        <Text style={styles.deleteButtonText}>Deletar minha conta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { padding: 24, paddingBottom: 44 },
    backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 36, marginBottom: 24 },
    backText: { color: '#0F172A', fontSize: 16, fontWeight: '600' },
    title: { color: '#0F172A', fontSize: 26, fontWeight: '900' },
    subtitle: { color: '#64748B', fontSize: 15, marginTop: 8, marginBottom: 24 },
    form: { gap: 10 },
    label: { color: '#0F172A', fontSize: 14, fontWeight: '700', marginTop: 8 },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: 52,
        paddingHorizontal: 14,
        fontSize: 15,
        color: '#0F172A',
    },
    selectorWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    optionChip: {
        borderWidth: 1,
        borderColor: '#BFDBFE',
        backgroundColor: '#FFFFFF',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    optionChipSelected: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
    optionChipText: { color: '#0369A1', fontSize: 14, fontWeight: '700' },
    optionChipTextSelected: { color: '#FFFFFF' },
    errorText: { color: '#DC2626', fontSize: 14, marginTop: 6 },
    primaryButton: { backgroundColor: '#0EA5E9', borderRadius: 8, paddingVertical: 15, alignItems: 'center', marginTop: 18 },
    disabledButton: { opacity: 0.7 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    deleteButton: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        backgroundColor: '#FEF2F2',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    deleteButtonText: { color: '#DC2626', fontSize: 15, fontWeight: '800' },
});
