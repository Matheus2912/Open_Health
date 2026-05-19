import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HelpModalProps = {
    visible: boolean;
    onClose: () => void;
};

const helpItems = [
    {
        title: 'Cadastro de informações',
        text: 'Use o botão + para cadastrar alergias, medicamentos, vacinas, condições de saúde e exames em PDF.',
    },
    {
        title: 'Edição e exclusão',
        text: 'Abra uma seção para editar ou excluir um registro já cadastrado.',
    },
    {
        title: 'Feedback do sistema',
        text: 'Mensagens no topo da tela confirmam cadastros, alterações, exclusões e erros.',
    },
];

export function HelpModal({ visible, onClose }: HelpModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <View style={styles.titleArea}>
                            <Feather name="help-circle" size={22} color="#0EA5E9" />
                            <Text style={styles.title}>Ajuda</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Feather name="x" size={20} color="#0F172A" />
                        </TouchableOpacity>
                    </View>

                    {helpItems.map((item) => (
                        <View key={item.title} style={styles.helpItem}>
                            <Text style={styles.helpTitle}>{item.title}</Text>
                            <Text style={styles.helpText}>{item.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
    },
    modal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 22,
        gap: 16,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
    titleArea: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    title: { color: '#0F172A', fontSize: 20, fontWeight: 'bold' },
    closeButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    helpItem: { gap: 4 },
    helpTitle: { color: '#0F172A', fontSize: 15, fontWeight: '700' },
    helpText: { color: '#475569', fontSize: 14, lineHeight: 20 },
});
