import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { HealthRecordType } from '@/features/dashboard/types/dashboard.type';
import { OptionSelect } from '@/features/health-records/components/OptionSelect';
import {
    AllergyResponse,
    ConditionResponse,
    HealthRecordRequestByType,
    HealthRecordResponseByType,
    MedicationResponse,
    VaccinationResponse,
} from '@/features/health-records/types/health-record.type';
import { formatBirthDateInput, toIsoDate } from '@/features/health-records/utils/record-formatters';

type HealthRecordFormModalProps = {
    visible: boolean;
    type: HealthRecordType | null;
    isSubmitting: boolean;
    error: string;
    initialRecord?: HealthRecordResponseByType[HealthRecordType] | null;
    onClose: () => void;
    onSubmit: <TType extends HealthRecordType>(type: TType, payload: HealthRecordRequestByType[TType]) => Promise<void>;
};

const problemTypeOptions = ['Cardiaco', 'Pulmonar', 'Diabetes', 'Neurologico', 'Ortopedico', 'Dermatologico', 'Outro'];
const allergySeverityOptions = ['Baixa', 'Media', 'Alta'];
const vaccinationStatusOptions = ['Completo', 'Pendente', 'Reforco Necessario'];

const titleByType: Record<HealthRecordType, string> = {
    condition: 'Adicionar Registro de Saude',
    medication: 'Adicionar Medicamento',
    allergy: 'Adicionar Alergia',
    vaccination: 'Adicionar Vacinacao',
};

const editTitleByType: Record<HealthRecordType, string> = {
    condition: 'Editar Registro de Saude',
    medication: 'Editar Medicamento',
    allergy: 'Editar Alergia',
    vaccination: 'Editar Vacinacao',
};

function isoToDisplayDate(value?: string) {
    if (!value) {
        return '';
    }

    const [year, month, day] = value.split('-');
    return day && month && year ? `${day}/${month}/${year}` : value;
}

export function HealthRecordFormModal({ visible, type, isSubmitting, error, initialRecord, onClose, onSubmit }: HealthRecordFormModalProps) {
    const [tipoProblema, setTipoProblema] = useState(problemTypeOptions[0]);
    const [descricao, setDescricao] = useState('');
    const [medicamentoPosologia, setMedicamentoPosologia] = useState('');
    const [nomeAlergia, setNomeAlergia] = useState('');
    const [gravidade, setGravidade] = useState(allergySeverityOptions[0]);
    const [nomeVacina, setNomeVacina] = useState('');
    const [dataVacina, setDataVacina] = useState('');
    const [statusVacinacao, setStatusVacinacao] = useState(vaccinationStatusOptions[0]);
    const [validationError, setValidationError] = useState('');

    const title = useMemo(() => (type ? (initialRecord ? editTitleByType[type] : titleByType[type]) : ''), [initialRecord, type]);

    useEffect(() => {
        if (!visible) {
            setTipoProblema(problemTypeOptions[0]);
            setDescricao('');
            setMedicamentoPosologia('');
            setNomeAlergia('');
            setGravidade(allergySeverityOptions[0]);
            setNomeVacina('');
            setDataVacina('');
            setStatusVacinacao(vaccinationStatusOptions[0]);
            setValidationError('');
            return;
        }

        if (!type || !initialRecord) {
            return;
        }

        if (type === 'condition') {
            const condition = initialRecord as ConditionResponse;
            setTipoProblema(condition.tipoProblemaDescricao || problemTypeOptions[0]);
            setDescricao(condition.descricao);
        }

        if (type === 'medication') {
            setMedicamentoPosologia((initialRecord as MedicationResponse).medicamentoPosologia);
        }

        if (type === 'allergy') {
            const allergy = initialRecord as AllergyResponse;
            setNomeAlergia(allergy.nome);
            setGravidade(allergy.gravidadeDescricao || allergySeverityOptions[0]);
        }

        if (type === 'vaccination') {
            const vaccination = initialRecord as VaccinationResponse;
            setNomeVacina(vaccination.nomeVacina);
            setDataVacina(isoToDisplayDate(vaccination.data));
            setStatusVacinacao(vaccination.statusDescricao || vaccinationStatusOptions[0]);
        }
    }, [initialRecord, type, visible]);

    const handleSubmit = async () => {
        if (!type) {
            return;
        }

        setValidationError('');

        if (type === 'condition') {
            if (!descricao.trim()) {
                setValidationError('Informe a descricao.');
                return;
            }
            await onSubmit(type, { tipoProblema, descricao: descricao.trim() });
            return;
        }

        if (type === 'medication') {
            if (!medicamentoPosologia.trim()) {
                setValidationError('Informe o medicamento e a posologia.');
                return;
            }
            await onSubmit(type, { medicamentoPosologia: medicamentoPosologia.trim() });
            return;
        }

        if (type === 'allergy') {
            if (!nomeAlergia.trim()) {
                setValidationError('Informe o nome da alergia.');
                return;
            }
            await onSubmit(type, { nome: nomeAlergia.trim(), gravidade });
            return;
        }

        const data = toIsoDate(dataVacina);
        if (!nomeVacina.trim() || !data) {
            setValidationError('Informe o nome da vacina e a data em DD/MM/AAAA.');
            return;
        }

        await onSubmit(type, { nomeVacina: nomeVacina.trim(), data, status: statusVacinacao });
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>x</Text>
                        </TouchableOpacity>
                    </View>

                    {type === 'condition' ? (
                        <View style={styles.form}>
                            <OptionSelect label="Tipo de Problema" options={problemTypeOptions} value={tipoProblema} onChange={setTipoProblema} />
                            <Text style={styles.label}>Descricao</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Descreva o problema de saude..."
                                value={descricao}
                                onChangeText={setDescricao}
                                multiline
                            />
                        </View>
                    ) : null}

                    {type === 'medication' ? (
                        <View style={styles.form}>
                            <Text style={styles.label}>Medicamento e Posologia</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Losartana 50mg - 1x ao dia"
                                value={medicamentoPosologia}
                                onChangeText={setMedicamentoPosologia}
                            />
                        </View>
                    ) : null}

                    {type === 'allergy' ? (
                        <View style={styles.form}>
                            <Text style={styles.label}>Nome da Alergia</Text>
                            <TextInput style={styles.input} placeholder="Ex: Penicilina" value={nomeAlergia} onChangeText={setNomeAlergia} />
                            <OptionSelect label="Gravidade" options={allergySeverityOptions} value={gravidade} onChange={setGravidade} />
                        </View>
                    ) : null}

                    {type === 'vaccination' ? (
                        <View style={styles.form}>
                            <Text style={styles.label}>Nome da Vacina</Text>
                            <TextInput style={styles.input} placeholder="Ex: COVID-19" value={nomeVacina} onChangeText={setNomeVacina} />
                            <Text style={styles.label}>Data</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="DD/MM/AAAA"
                                keyboardType="numeric"
                                value={dataVacina}
                                maxLength={10}
                                onChangeText={(value) => setDataVacina(formatBirthDateInput(value))}
                            />
                            <OptionSelect label="Status" options={vaccinationStatusOptions} value={statusVacinacao} onChange={setStatusVacinacao} />
                        </View>
                    ) : null}

                    {validationError || error ? <Text style={styles.errorText}>{validationError || error}</Text> : null}

                    <TouchableOpacity style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>{initialRecord ? 'Salvar Alteracoes' : 'Salvar Registro'}</Text>}
                    </TouchableOpacity>
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
        padding: 24,
        gap: 18,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
    title: { color: '#0F172A', fontSize: 20, fontWeight: 'bold', flex: 1 },
    closeButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    closeText: { color: '#0F172A', fontSize: 22 },
    form: { gap: 14 },
    label: { fontSize: 15, color: '#0F172A', fontWeight: '600' },
    input: {
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        minHeight: 48,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#0F172A',
    },
    textArea: { minHeight: 96, textAlignVertical: 'top' },
    errorText: { color: '#DC2626', fontSize: 14 },
    submitButton: {
        backgroundColor: '#0EA5E9',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitButtonDisabled: { opacity: 0.7 },
    submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
