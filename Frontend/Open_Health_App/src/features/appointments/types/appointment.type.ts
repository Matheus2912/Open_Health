export interface DoctorResponse {
    id: string;
    nome: string;
    especialidade: string;
    crm: string;
    unidadeAtendimento: string;
}

export interface AvailableSlotResponse {
    id: string;
    inicio: string;
    fim: string;
}

export interface AppointmentRequest {
    medicoId: string;
    agendaMedicoId: string;
}

export interface AppointmentResponse {
    id: string;
    medicoId: string;
    medicoNome: string;
    especialidade: string;
    crm: string;
    unidadeAtendimento: string;
    dataHora: string;
    fim: string;
    status: string;
    criadoEm: string;
}

export interface AppointmentNotificationResponse {
    consultaId: string;
    titulo: string;
    mensagem: string;
    dataHora: string;
}
