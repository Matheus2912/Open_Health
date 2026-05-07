import { HealthRecordType } from '@/features/dashboard/types/dashboard.type';

export type ConditionRequest = {
    tipoProblema: string;
    descricao: string;
};

export type MedicationRequest = {
    medicamentoPosologia: string;
};

export type AllergyRequest = {
    nome: string;
    gravidade: string;
};

export type VaccinationRequest = {
    nomeVacina: string;
    data: string;
    status: string;
};

export type HealthRecordRequestByType = {
    condition: ConditionRequest;
    medication: MedicationRequest;
    allergy: AllergyRequest;
    vaccination: VaccinationRequest;
};

export type ConditionResponse = {
    id: string;
    tipoProblema: string;
    tipoProblemaDescricao: string;
    descricao: string;
    criadoEm: string;
    atualizadoEm: string;
};

export type MedicationResponse = {
    id: string;
    medicamentoPosologia: string;
    criadoEm: string;
    atualizadoEm: string;
};

export type AllergyResponse = {
    id: string;
    nome: string;
    gravidade: string;
    gravidadeDescricao: string;
    criadoEm: string;
    atualizadoEm: string;
};

export type VaccinationResponse = {
    id: string;
    nomeVacina: string;
    data: string;
    status: string;
    statusDescricao: string;
    criadoEm: string;
    atualizadoEm: string;
};

export type HealthRecordResponseByType = {
    condition: ConditionResponse;
    medication: MedicationResponse;
    allergy: AllergyResponse;
    vaccination: VaccinationResponse;
};

export type HealthRecordsState = {
    [K in HealthRecordType]: HealthRecordResponseByType[K][];
};

export type HealthRecordListItem = {
    id: string;
    primaryText: string;
    secondaryText?: string;
};
