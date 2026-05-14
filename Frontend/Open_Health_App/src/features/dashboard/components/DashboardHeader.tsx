import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DashboardHeaderProps = {
    userName: string;
    onLogout: () => void;
    onEmergencyPress: () => void;
    onProfilePress: () => void;
};

export function DashboardHeader({ userName, onLogout, onEmergencyPress, onProfilePress }: DashboardHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.userInfoArea}>
                <View style={styles.logoBox}>
                    <Feather name="heart" size={24} color="#FFF" />
                </View>
                <View>
                    <Text style={styles.appName}>OpenHealth Wallet</Text>
                    <Text style={styles.greeting}>Ola, {userName}</Text>
                </View>
            </View>

            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.emergencyButton} onPress={onEmergencyPress}>
                    <Feather name="shield" size={16} color="#EF4444" />
                    <Text style={styles.emergencyText}>Emergencia</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onProfilePress} style={styles.logoutButton}>
                    <Feather name="user" size={20} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                    <Feather name="log-out" size={20} color="#0F172A" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 48,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    userInfoArea: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
    logoBox: {
        backgroundColor: '#0EA5E9',
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
    greeting: { fontSize: 14, color: '#64748B' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    emergencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    emergencyText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
    logoutButton: { padding: 4 },
});
