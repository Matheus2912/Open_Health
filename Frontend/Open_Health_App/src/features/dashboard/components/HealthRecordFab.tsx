import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HealthRecordAction, HealthRecordType } from '@/features/dashboard/types/dashboard.type';

type HealthRecordFabProps = {
    actions: HealthRecordAction[];
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (type: HealthRecordType) => void;
};

export function HealthRecordFab({ actions, isOpen, onToggle, onSelect }: HealthRecordFabProps) {
    return (
        <>
            {isOpen && (
                <View style={styles.fabMenu}>
                    {actions.map((action) => (
                        <TouchableOpacity key={action.type} style={styles.fabMenuItem} onPress={() => onSelect(action.type)}>
                            <Feather name={action.icon} size={20} color={action.iconColor} />
                            <Text style={styles.fabMenuText}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <TouchableOpacity style={[styles.fab, isOpen && styles.fabOpen]} onPress={onToggle}>
                <Feather name={isOpen ? 'x' : 'plus'} size={28} color="#FFF" />
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#0EA5E9',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    fabOpen: {
        backgroundColor: '#0284C7',
    },
    fabMenu: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        minWidth: 200,
        gap: 16,
    },
    fabMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    fabMenuText: {
        fontSize: 16,
        color: '#0F172A',
        fontWeight: '500',
    },
});
