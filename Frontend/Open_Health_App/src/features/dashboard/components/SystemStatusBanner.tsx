import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SystemStatusBannerProps = {
    message: string;
    type: 'success' | 'error' | 'info';
    onDismiss?: () => void;
};

const iconByType = {
    success: 'check-circle',
    error: 'alert-circle',
    info: 'info',
} as const;

const colorByType = {
    success: '#047857',
    error: '#DC2626',
    info: '#0369A1',
};

const backgroundByType = {
    success: '#ECFDF5',
    error: '#FEF2F2',
    info: '#EFF6FF',
};

const borderByType = {
    success: '#A7F3D0',
    error: '#FECACA',
    info: '#BFDBFE',
};

export function SystemStatusBanner({ message, type, onDismiss }: SystemStatusBannerProps) {
    return (
        <View style={[styles.banner, { backgroundColor: backgroundByType[type], borderColor: borderByType[type] }]}>
            <Feather name={iconByType[type]} size={18} color={colorByType[type]} />
            <Text style={[styles.message, { color: colorByType[type] }]}>{message}</Text>
            {onDismiss ? (
                <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
                    <Feather name="x" size={16} color={colorByType[type]} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        marginHorizontal: 20,
        marginTop: 14,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    message: { flex: 1, fontSize: 14, fontWeight: '600' },
    dismissButton: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
});
