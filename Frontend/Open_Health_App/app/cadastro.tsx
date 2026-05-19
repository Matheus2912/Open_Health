import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { useAuth } from '@/features/auth/context/AuthContext';

const bloodTypeOptions = ['Não selecionado', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
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

function normalizeCpf(value: string) {
    return value.replace(/\D/g, '');
}

function isValidCpf(value: string) {
    const cpf = normalizeCpf(value);

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let sum = 0;
    for (let index = 0; index < 9; index += 1) {
        sum += Number(cpf[index]) * (10 - index);
    }

    let verifier = (sum * 10) % 11;
    if (verifier === 10) {
        verifier = 0;
    }

    if (verifier !== Number(cpf[9])) {
        return false;
    }

    sum = 0;
    for (let index = 0; index < 10; index += 1) {
        sum += Number(cpf[index]) * (11 - index);
    }

    verifier = (sum * 10) % 11;
    if (verifier === 10) {
        verifier = 0;
    }

    return verifier === Number(cpf[10]);
}

function toIsoDate(value: string) {
    const [day, month, year] = value.split('/');
    if (!day || !month || !year || year.length !== 4) {
        return null;
    }

    const normalizedDay = Number(day);
    const normalizedMonth = Number(month);
    const normalizedYear = Number(year);

    const parsedDate = new Date(normalizedYear, normalizedMonth - 1, normalizedDay);
    const isValidDate =
        parsedDate.getFullYear() === normalizedYear &&
        parsedDate.getMonth() === normalizedMonth - 1 &&
        parsedDate.getDate() === normalizedDay;

    if (!isValidDate) {
        return null;
    }

    return `${year}-${month}-${day}`;
}

export default function CadastroScreen() {
    const router = useRouter();
    const { isLoading, register } = useAuth();
    const [birthDate, setBirthDate] = useState('');
    const [bloodType, setBloodType] = useState<(typeof bloodTypeOptions)[number]>('Não selecionado');
    const [sex, setSex] = useState<(typeof sexOptions)[number]>('Masculino');
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefoneEmergencia, setTelefoneEmergencia] = useState('');
    const [erro, setErro] = useState('');

    async function handleRegister() {
        const dataNascimento = toIsoDate(birthDate);

        if (!nomeCompleto.trim() || !email.trim() || !cpf.trim() || !birthDate.trim() || !senha || !confirmarSenha) {
            setErro('Preencha todos os campos obrigatórios.');
            return;
        }

        if (!dataNascimento) {
            setErro('Digite a data no formato DD/MM/AAAA.');
            return;
        }

        if (!isValidCpf(cpf)) {
            setErro('Digite um CPF válido.');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        try {
            setErro('');
            await register({
                nomeCompleto: nomeCompleto.trim(),
                email: email.trim(),
                cpf: normalizeCpf(cpf),
                tipoSanguineo: bloodType === 'Não selecionado' ? undefined : bloodType,
                dataNascimento,
                sexo: sex,
                telefoneEmergencia: telefoneEmergencia.trim() || undefined,
                senha,
                confirmarSenha,
            });
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Não foi possível criar a conta.');
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#0F172A" />
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Criar Conta</Text>
                    <Text style={styles.subtitle}>Comece a gerenciar sua saúde</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="Seu nome completo" value={nomeCompleto} onChangeText={setNomeCompleto} />
                    </View>

                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="mail" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={email} onChangeText={setEmail} />
                    </View>

                    <Text style={styles.label}>CPF</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="file-text" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="000.000.000-00" keyboardType="numeric" value={cpf} onChangeText={(value) => setCpf(formatCpf(value))} maxLength={14} />
                    </View>

                    <View style={styles.medicalBox}>
                        <Text style={styles.medicalBoxTitle}>Dados Médicos</Text>

                        <Text style={styles.label}>Tipo Sanguíneo (Opcional)</Text>
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

                        <Text style={styles.label}>Contato de Emergência (Opcional)</Text>
                        <View style={styles.inputContainerWhite}>
                            <Feather name="phone" size={20} color="#94A3B8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="(11) 98765-4321"
                                keyboardType="phone-pad"
                                value={telefoneEmergencia}
                                onChangeText={(value) => setTelefoneEmergencia(formatPhone(value))}
                                maxLength={15}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Senha</Text>
                    <PasswordInput value={senha} onChangeText={setSenha} />

                    <Text style={styles.label}>Confirmar Senha</Text>
                    <PasswordInput value={confirmarSenha} onChangeText={setConfirmarSenha} />

                    {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

                    <TouchableOpacity style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} onPress={handleRegister} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Criar Conta</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/login')}>
                        <Text style={styles.linkText}>
                            Já tem uma conta? <Text style={styles.linkTextBold}>Faça login</Text>
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
    primaryButtonDisabled: { opacity: 0.7 },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    linkButton: { alignItems: 'center', marginTop: 24 },
    linkText: { color: '#64748B', fontSize: 14 },
    linkTextBold: { color: '#0EA5E9', fontWeight: '600' },
    errorText: { color: '#DC2626', marginTop: 16, fontSize: 14 },
});
