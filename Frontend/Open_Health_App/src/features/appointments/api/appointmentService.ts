import {
    AppointmentNotificationResponse,
    AppointmentRequest,
    AppointmentResponse,
    AvailableSlotResponse,
    DoctorResponse,
} from '@/features/appointments/types/appointment.type';
import { api, extractErrorMessage } from '@/lib/api';

function getAuthHeader(token: string) {
    return {
        Authorization: `Bearer ${token}`,
    };
}

async function requestWithErrorHandling<T>(request: () => Promise<{ data: T }>) {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export const appointmentService = {
    listSpecialties: async (token: string): Promise<string[]> => {
        return requestWithErrorHandling(() =>
            api.get<string[]>('/medicos/especialidades', {
                headers: getAuthHeader(token),
            })
        );
    },

    listDoctors: async (token: string, specialty?: string): Promise<DoctorResponse[]> => {
        return requestWithErrorHandling(() =>
            api.get<DoctorResponse[]>('/medicos', {
                headers: getAuthHeader(token),
                params: specialty ? { especialidade: specialty } : undefined,
            })
        );
    },

    listAvailableSlots: async (token: string, doctorId: string): Promise<AvailableSlotResponse[]> => {
        return requestWithErrorHandling(() =>
            api.get<AvailableSlotResponse[]>(`/medicos/${doctorId}/horarios-disponiveis`, {
                headers: getAuthHeader(token),
            })
        );
    },

    schedule: async (token: string, payload: AppointmentRequest): Promise<AppointmentResponse> => {
        return requestWithErrorHandling(() =>
            api.post<AppointmentResponse>('/consultas', payload, {
                headers: getAuthHeader(token),
            })
        );
    },

    listAppointments: async (token: string): Promise<AppointmentResponse[]> => {
        return requestWithErrorHandling(() =>
            api.get<AppointmentResponse[]>('/consultas', {
                headers: getAuthHeader(token),
            })
        );
    },

    listNotifications: async (token: string): Promise<AppointmentNotificationResponse[]> => {
        return requestWithErrorHandling(() =>
            api.get<AppointmentNotificationResponse[]>('/consultas/notificacoes', {
                headers: getAuthHeader(token),
            })
        );
    },
};
