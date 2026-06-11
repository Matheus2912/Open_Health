import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { appointmentService } from '@/features/appointments/api/appointmentService';
import {
    AppointmentNotificationResponse,
    AppointmentResponse,
    AvailableSlotResponse,
    DoctorResponse,
} from '@/features/appointments/types/appointment.type';
import { useAuth } from '@/features/auth/context/AuthContext';
import { SystemStatusBanner } from '@/features/dashboard/components/SystemStatusBanner';

type StatusMessage = {
    type: 'success' | 'error' | 'info';
    text: string;
};

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function formatSlot(slot: AvailableSlotResponse) {
    const date = new Date(slot.inicio);
    const end = new Date(slot.fim);
    const day = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
    }).format(date);
    const startTime = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
    const endTime = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(end);

    return `${day} - ${startTime} as ${endTime}`;
}

export default function AppointmentsScreen() {
    const { token } = useAuth();
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorResponse | null>(null);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlotResponse[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlotResponse | null>(null);
    const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
    const [notifications, setNotifications] = useState<AppointmentNotificationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    useEffect(() => {
        if (!statusMessage) {
            return;
        }

        const timeoutId = setTimeout(() => setStatusMessage(null), 4500);
        return () => clearTimeout(timeoutId);
    }, [statusMessage]);

    const loadAppointmentsAndNotifications = useCallback(async () => {
        if (!token) {
            return;
        }

        const [appointmentsResponse, notificationsResponse] = await Promise.all([
            appointmentService.listAppointments(token),
            appointmentService.listNotifications(token),
        ]);
        setAppointments(appointmentsResponse);
        setNotifications(notificationsResponse);
    }, [token]);

    const loadInitialData = useCallback(async () => {
        if (!token) {
            return;
        }

        setIsLoading(true);
        try {
            const [specialtiesResponse, doctorsResponse] = await Promise.all([
                appointmentService.listSpecialties(token),
                appointmentService.listDoctors(token),
                loadAppointmentsAndNotifications(),
            ]);
            setSpecialties(specialtiesResponse);
            setDoctors(doctorsResponse);
        } catch (error) {
            setStatusMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Nao foi possivel carregar as consultas.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [loadAppointmentsAndNotifications, token]);

    useEffect(() => {
        void loadInitialData();
    }, [loadInitialData]);

    const handleSelectSpecialty = async (specialty: string) => {
        if (!token) {
            return;
        }

        const nextSpecialty = selectedSpecialty === specialty ? '' : specialty;
        setSelectedSpecialty(nextSpecialty);
        setSelectedDoctor(null);
        setSelectedSlot(null);
        setAvailableSlots([]);
        setIsLoading(true);

        try {
            const response = await appointmentService.listDoctors(token, nextSpecialty);
            setDoctors(response);
        } catch (error) {
            setStatusMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Nao foi possivel filtrar medicos.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectDoctor = async (doctor: DoctorResponse) => {
        if (!token) {
            return;
        }

        setSelectedDoctor(doctor);
        setSelectedSlot(null);
        setIsLoadingSlots(true);
        try {
            const response = await appointmentService.listAvailableSlots(token, doctor.id);
            setAvailableSlots(response);
        } catch (error) {
            setStatusMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Nao foi possivel carregar horarios.',
            });
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleSchedule = async () => {
        if (!token || !selectedDoctor || !selectedSlot) {
            return;
        }

        setIsScheduling(true);
        try {
            const scheduled = await appointmentService.schedule(token, {
                medicoId: selectedDoctor.id,
                agendaMedicoId: selectedSlot.id,
            });
            setAppointments((currentAppointments) => [...currentAppointments, scheduled].sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()));
            setAvailableSlots((currentSlots) => currentSlots.filter((slot) => slot.id !== selectedSlot.id));
            setSelectedSlot(null);
            await loadAppointmentsAndNotifications();
            setStatusMessage({ type: 'success', text: 'Consulta agendada com sucesso.' });
        } catch (error) {
            setStatusMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Nao foi possivel agendar a consulta.',
            });
        } finally {
            setIsScheduling(false);
        }
    };

    const upcomingAppointments = useMemo(
        () => appointments.filter((appointment) => new Date(appointment.dataHora).getTime() >= Date.now()),
        [appointments]
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <Feather name="calendar" size={22} color="#FFF" />
                </View>
                <View style={styles.headerTextArea}>
                    <Text style={styles.title}>Consultas</Text>
                    <Text style={styles.subtitle}>Filtre medicos, escolha um horario livre e acompanhe seus agendamentos.</Text>
                </View>
            </View>

            {statusMessage ? <SystemStatusBanner type={statusMessage.type} message={statusMessage.text} onDismiss={() => setStatusMessage(null)} /> : null}

            {notifications.map((notification) => (
                <SystemStatusBanner
                    key={notification.consultaId}
                    type="info"
                    message={`${notification.titulo}: ${notification.mensagem}`}
                />
            ))}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Especialidade</Text>
                {isLoading ? (
                    <View style={styles.loadingLine}>
                        <ActivityIndicator color="#0EA5E9" />
                        <Text style={styles.mutedText}>Carregando...</Text>
                    </View>
                ) : null}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtyList}>
                    {specialties.map((specialty) => {
                        const isSelected = specialty === selectedSpecialty;
                        return (
                            <TouchableOpacity
                                key={specialty}
                                style={[styles.specialtyChip, isSelected ? styles.specialtyChipSelected : null]}
                                onPress={() => void handleSelectSpecialty(specialty)}
                            >
                                <Text style={[styles.specialtyText, isSelected ? styles.specialtyTextSelected : null]}>{specialty}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Medicos disponiveis</Text>
                {doctors.length === 0 && !isLoading ? <Text style={styles.emptyText}>Nenhum medico encontrado para este filtro.</Text> : null}

                {doctors.map((doctor) => {
                    const isSelected = selectedDoctor?.id === doctor.id;
                    return (
                        <TouchableOpacity
                            key={doctor.id}
                            style={[styles.doctorCard, isSelected ? styles.selectedCard : null]}
                            onPress={() => void handleSelectDoctor(doctor)}
                        >
                            <View style={styles.cardTopLine}>
                                <View>
                                    <Text style={styles.doctorName}>{doctor.nome}</Text>
                                    <Text style={styles.doctorSpecialty}>{doctor.especialidade}</Text>
                                </View>
                                <Feather name={isSelected ? 'check-circle' : 'chevron-right'} size={20} color={isSelected ? '#047857' : '#64748B'} />
                            </View>
                            <Text style={styles.cardDetail}>{doctor.crm}</Text>
                            <Text style={styles.cardDetail}>{doctor.unidadeAtendimento}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {selectedDoctor ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Horarios livres</Text>
                    {isLoadingSlots ? (
                        <View style={styles.loadingLine}>
                            <ActivityIndicator color="#0EA5E9" />
                            <Text style={styles.mutedText}>Buscando agenda...</Text>
                        </View>
                    ) : null}
                    {!isLoadingSlots && availableSlots.length === 0 ? <Text style={styles.emptyText}>Nao ha horarios livres para este medico.</Text> : null}

                    <View style={styles.slotGrid}>
                        {availableSlots.map((slot) => {
                            const isSelected = selectedSlot?.id === slot.id;
                            return (
                                <TouchableOpacity
                                    key={slot.id}
                                    style={[styles.slotButton, isSelected ? styles.slotButtonSelected : null]}
                                    onPress={() => setSelectedSlot(slot)}
                                >
                                    <Feather name="clock" size={16} color={isSelected ? '#FFF' : '#0F766E'} />
                                    <Text style={[styles.slotText, isSelected ? styles.slotTextSelected : null]}>{formatSlot(slot)}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        style={[styles.scheduleButton, !selectedSlot || isScheduling ? styles.disabledButton : null]}
                        disabled={!selectedSlot || isScheduling}
                        onPress={() => void handleSchedule()}
                    >
                        {isScheduling ? <ActivityIndicator color="#FFF" /> : <Feather name="check" size={18} color="#FFF" />}
                        <Text style={styles.scheduleButtonText}>{isScheduling ? 'Agendando...' : 'Confirmar consulta'}</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Consultas marcadas</Text>
                {upcomingAppointments.length === 0 ? <Text style={styles.emptyText}>Voce ainda nao tem consultas futuras.</Text> : null}

                {upcomingAppointments.map((appointment) => (
                    <View key={appointment.id} style={styles.appointmentCard}>
                        <View style={styles.appointmentDateBadge}>
                            <Feather name="calendar" size={18} color="#0369A1" />
                            <Text style={styles.appointmentDateText}>{formatDateTime(appointment.dataHora)}</Text>
                        </View>
                        <Text style={styles.doctorName}>{appointment.medicoNome}</Text>
                        <Text style={styles.doctorSpecialty}>{appointment.especialidade}</Text>
                        <Text style={styles.cardDetail}>{appointment.unidadeAtendimento}</Text>
                        <Text style={styles.statusText}>{appointment.status}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F9FF' },
    content: { paddingBottom: 32 },
    header: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerIcon: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: '#0EA5E9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTextArea: { flex: 1 },
    title: { color: '#0F172A', fontSize: 22, fontWeight: '800' },
    subtitle: { color: '#64748B', fontSize: 13, lineHeight: 18, marginTop: 2 },
    section: { paddingHorizontal: 20, paddingTop: 22 },
    sectionTitle: { color: '#0F172A', fontSize: 17, fontWeight: '800', marginBottom: 12 },
    specialtyList: { gap: 8, paddingRight: 20 },
    specialtyChip: {
        borderWidth: 1,
        borderColor: '#BAE6FD',
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 9,
    },
    specialtyChipSelected: { backgroundColor: '#0369A1', borderColor: '#0369A1' },
    specialtyText: { color: '#0369A1', fontSize: 14, fontWeight: '700' },
    specialtyTextSelected: { color: '#FFF' },
    doctorCard: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 14,
        marginBottom: 10,
    },
    selectedCard: { borderColor: '#34D399', backgroundColor: '#F0FDF4' },
    cardTopLine: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
    doctorName: { color: '#0F172A', fontSize: 16, fontWeight: '800' },
    doctorSpecialty: { color: '#0369A1', fontSize: 13, fontWeight: '700', marginTop: 2 },
    cardDetail: { color: '#64748B', fontSize: 13, marginTop: 6 },
    loadingLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    mutedText: { color: '#64748B', fontSize: 14 },
    emptyText: { color: '#64748B', fontSize: 14, backgroundColor: '#FFF', borderRadius: 8, padding: 14 },
    slotGrid: { gap: 10 },
    slotButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#99F6E4',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    slotButtonSelected: { backgroundColor: '#0F766E', borderColor: '#0F766E' },
    slotText: { color: '#0F766E', fontSize: 14, fontWeight: '700', flex: 1 },
    slotTextSelected: { color: '#FFF' },
    scheduleButton: {
        backgroundColor: '#0F766E',
        borderRadius: 8,
        marginTop: 14,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    disabledButton: { opacity: 0.55 },
    scheduleButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
    appointmentCard: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 14,
        marginBottom: 10,
    },
    appointmentDateBadge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#E0F2FE',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginBottom: 10,
    },
    appointmentDateText: { color: '#0369A1', fontSize: 13, fontWeight: '800' },
    statusText: { color: '#047857', fontSize: 13, fontWeight: '800', marginTop: 8 },
});
