import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type OptionSelectProps = {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
};

export function OptionSelect({ label, options, value, onChange }: OptionSelectProps) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.options}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.option, value === option && styles.optionSelected]}
                        onPress={() => onChange(option)}
                    >
                        <Text style={[styles.optionText, value === option && styles.optionTextSelected]}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    field: { gap: 8 },
    label: { fontSize: 15, color: '#0F172A', fontWeight: '600' },
    options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    option: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    optionSelected: {
        borderColor: '#0EA5E9',
        backgroundColor: '#E0F2FE',
    },
    optionText: { color: '#334155', fontSize: 14, fontWeight: '600' },
    optionTextSelected: { color: '#0369A1' },
});
