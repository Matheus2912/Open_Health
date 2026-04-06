import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#0F172A" />
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Entrar</Text>
                    <Text style={styles.subtitle}>Acesse sua conta OpenHealth</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="mail" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="seu@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>Senha</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#94A3B8" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="********" secureTextEntry />
                    </View>

                    <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)')}>
                        <Text style={styles.primaryButtonText}>Entrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/cadastro')}>
                        <Text style={styles.linkText}>
                            Nao tem conta? <Text style={styles.linkTextBold}>Criar conta</Text>
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
    inputIcon: { marginRight: 12 },
    input: { flex: 1, height: '100%', fontSize: 16, color: '#0F172A' },
    primaryButton: { backgroundColor: '#0EA5E9', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    linkButton: { alignItems: 'center', marginTop: 24 },
    linkText: { color: '#64748B', fontSize: 14 },
    linkTextBold: { color: '#0EA5E9', fontWeight: '600' }
});
