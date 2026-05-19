import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DashboardHeaderProps = {
    userName: string;
    onLogout: () => void;
    onEmergencyPress: () => void;
    onProfilePress: () => void;
    onHelpPress: () => void;
};

export function DashboardHeader({ userName, onLogout, onEmergencyPress, onProfilePress, onHelpPress }: DashboardHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.userInfoArea}>
                <View style={styles.logoBox}>
                    <Feather name="heart" size={22} color="#FFF" />
                </View>
                <View style={styles.userTextArea}>
                    <Text style={styles.appName} numberOfLines={1}>
                        OpenHealth
                    </Text>
                    <Text style={styles.greeting} numberOfLines={1}>
                        Olá, {userName}
                    </Text>
                </View>
            </View>

            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.emergencyButton} onPress={onEmergencyPress}>
                    <Feather name="shield" size={16} color="#EF4444" />
                    <Text style={styles.emergencyText}>Emergência</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onHelpPress} style={styles.iconButton}>
                    <Feather name="help-circle" size={20} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
                    <Feather name="user" size={20} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity onPress={onLogout} style={styles.iconButton}>
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
        gap: 6,
        paddingHorizontal: 12,
        paddingTop: 48,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    userInfoArea: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0, minWidth: 132 },
    userTextArea: { width: 90 },
    logoBox: {
        backgroundColor: '#0EA5E9',
        width: 36,
        height: 36,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
    greeting: { fontSize: 13, color: '#64748B' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
    emergencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
    },
    emergencyText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
    iconButton: { width: 28, height: 32, alignItems: 'center', justifyContent: 'center' },
});
