import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type PasswordInputProps = {
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
};

export function PasswordInput({ value, onChangeText, placeholder = '********' }: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                secureTextEntry={!isVisible}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity style={styles.visibilityButton} onPress={() => setIsVisible((currentValue) => !currentValue)}>
                <Feather name={isVisible ? 'eye-off' : 'eye'} size={20} color="#64748B" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 16, height: 56 },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, height: '100%', fontSize: 16, color: '#0F172A' },
    visibilityButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: -8 },
});
