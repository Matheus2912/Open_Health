import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/features/auth/context/AuthContext';

export default function DashboardScreen() {
    const router = useRouter();
    const { logout, user } = useAuth();

    function handleLogout() {
        logout();
        router.replace('/login');
    }

    return (
        <View style={styles.container}>
            <Feather name="check-circle" size={64} color="#0EA5E9" style={styles.icon} />
            <Text style={styles.title}>Login realizado</Text>
            <Text style={styles.subtitle}>
                {user ? `Bem-vindo, ${user.nomeCompleto}.` : 'Esta e a area autenticada do OpenHealth.'}
            </Text>
            {user ? (
                <View style={styles.profileCard}>
                    <Text style={styles.profileText}>Email: {user.email}</Text>
                    <Text style={styles.profileText}>CPF: {user.cpf}</Text>
                    <Text style={styles.profileText}>Sexo: {user.sexo}</Text>
                    <Text style={styles.profileText}>Nascimento: {user.dataNascimento}</Text>
                    <Text style={styles.profileText}>Tipo sanguineo: {user.tipoSanguineo || 'Nao informado'}</Text>
                </View>
            ) : null}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', padding: 24 },
    icon: { marginBottom: 24 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center' },
    profileCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginTop: 24, gap: 8, borderWidth: 1, borderColor: '#E2E8F0' },
    profileText: { fontSize: 14, color: '#0F172A' },
    logoutButton: { marginTop: 24, backgroundColor: '#0F172A', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14 },
    logoutButtonText: { color: '#FFFFFF', fontWeight: '600' },
});
