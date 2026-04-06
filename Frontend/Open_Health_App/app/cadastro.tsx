import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const bloodTypeOptions = ['Nao selecionado', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const sexOptions = ['Masculino', 'Feminino', 'Outro'] as const;

function formatBirthDate(rawValue: string) {
    const digits = rawValue.replace(/\D/g, '').slice(0, 8);

    if (digits.length <= 2) {
        return digits;
    }
    if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function CadastroScreen() {
    const router = useRouter();
    const [birthDate, setBirthDate] = useState('');
    const [bloodType, setBloodType] = useState<(typeof bloodTypeOptions)[number]>('Nao selecionado');
    const [sex, setSex] = useState<(typeof sexOptions)[number]>('Masculino');

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#0F172A" />
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Criar Conta</Text>
                    <Text style={styles.subtitle}>Comece a gerenciar sua saude</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="Seu nome completo" />
                    </View>

                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="mail" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
                    </View>

                    <Text style={styles.label}>CPF</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="file-text" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="000.000.000-00" keyboardType="numeric" />
                    </View>

                    <View style={styles.medicalBox}>
                        <Text style={styles.medicalBoxTitle}>Dados Medicos</Text>

                        <Text style={styles.label}>Tipo Sanguineo (Opcional)</Text>
                        <View style={styles.selectorWrap}>
                            {bloodTypeOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.optionChip, bloodType === option && styles.optionChipSelected]}
                                    onPress={() => setBloodType(option)}
                                >
                                    <Text style={[styles.optionChipText, bloodType === option && styles.optionChipTextSelected]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Data de Nascimento</Text>
                        <View style={styles.inputContainerWhite}>
                            <Feather name="calendar" size={20} color="#94A3B8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="DD/MM/AAAA"
                                keyboardType="numeric"
                                value={birthDate}
                                onChangeText={(value) => setBirthDate(formatBirthDate(value))}
                                maxLength={10}
                            />
                        </View>

                        <Text style={styles.label}>Sexo</Text>
                        <View style={styles.selectorWrap}>
                            {sexOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.optionChip, sex === option && styles.optionChipSelected]}
                                    onPress={() => setSex(option)}
                                >
                                    <Text style={[styles.optionChipText, sex === option && styles.optionChipTextSelected]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Text style={styles.label}>Senha</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="********" secureTextEntry />
                    </View>

                    <Text style={styles.label}>Confirmar Senha</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="********" secureTextEntry />
                    </View>

                    <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)')}>
                        <Text style={styles.primaryButtonText}>Criar Conta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/login')}>
                        <Text style={styles.linkText}>
                            Ja tem uma conta? <Text style={styles.linkTextBold}>Faca login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollContent: { padding: 24, paddingBottom: 40 },
    backButton: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 24, gap: 8 },
    backText: { fontSize: 16, color: '#0F172A', fontWeight: '500' },
    header: { alignItems: 'center', marginBottom: 32 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#64748B' },
    form: { flex: 1 },
    label: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 8, marginTop: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 16, height: 56 },
    inputContainerWhite: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0' },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, height: '100%', fontSize: 16, color: '#0F172A' },
    medicalBox: { backgroundColor: '#F0F9FF', padding: 16, borderRadius: 16, marginTop: 24, marginBottom: 8, borderWidth: 1, borderColor: '#E0F2FE' },
    medicalBoxTitle: { fontSize: 16, fontWeight: 'bold', color: '#0369A1', marginBottom: 8 },
    selectorWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    optionChip: {
        borderWidth: 1,
        borderColor: '#BFDBFE',
        backgroundColor: '#FFFFFF',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    optionChipSelected: {
        backgroundColor: '#0EA5E9',
        borderColor: '#0EA5E9',
    },
    optionChipText: {
        color: '#0369A1',
        fontSize: 14,
        fontWeight: '600',
    },
    optionChipTextSelected: {
        color: '#FFFFFF',
    },
    primaryButton: { backgroundColor: '#0EA5E9', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    linkButton: { alignItems: 'center', marginTop: 24 },
    linkText: { color: '#64748B', fontSize: 14 },
    linkTextBold: { color: '#0EA5E9', fontWeight: '600' },
});
