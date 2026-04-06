import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Ícone / Logo */}
                <View style={styles.logoContainer}>
                    <Feather name="heart" size={48} color="#FFF" />
                </View>

                <Text style={styles.title}>OpenHealth Wallet</Text>
                <Text style={styles.subtitle}>Seus dados de saúde seguros e acessíveis</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push('/login')}
                >
                    <Text style={styles.primaryButtonText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push('/cadastro')}
                >
                    <Text style={styles.secondaryButtonText}>Criar Conta</Text>
                </TouchableOpacity>

                <View style={styles.securityNote}>
                    <Feather name="shield" size={14} color="#666" />
                    <Text style={styles.securityText}>Seus dados são protegidos e criptografados</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'space-between', padding: 24 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logoContainer: { width: 80, height: 80, backgroundColor: '#0EA5E9', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center' },
    footer: { paddingBottom: 24 },
    primaryButton: { backgroundColor: '#0EA5E9', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    secondaryButton: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
    secondaryButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '600' },
    securityNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, gap: 8 },
    securityText: { color: '#64748B', fontSize: 12 }
});