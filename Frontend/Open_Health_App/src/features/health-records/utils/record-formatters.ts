import { HealthRecordType } from '@/features/dashboard/types/dashboard.type';
import {
    AllergyResponse,
    ConditionResponse,
    HealthRecordListItem,
    HealthRecordResponseByType,
    HealthRecordsState,
    MedicationResponse,
    VaccinationResponse,
} from '@/features/health-records/types/health-record.type';

export function formatBirthDateInput(rawValue: string) {
    const digits = rawValue.replace(/\D/g, '').slice(0, 8);

    if (digits.length <= 2) {
        return digits;
    }
    if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function toIsoDate(value: string) {
    const [day, month, year] = value.split('/');
    if (!day || !month || !year || year.length !== 4) {
        return null;
    }

    return `${year}-${month}-${day}`;
}

export function mapRecordsToListItems<TType extends HealthRecordType>(
    type: TType,
    records: HealthRecordsState[TType]
): HealthRecordListItem[] {
    return records.map((record) => mapRecordToListItem(type, record));
}

function mapRecordToListItem<TType extends HealthRecordType>(
    type: TType,
    record: HealthRecordResponseByType[TType]
): HealthRecordListItem {
    if (type === 'allergy') {
        const allergy = record as AllergyResponse;
        return {
            id: allergy.id,
            primaryText: allergy.nome,
            secondaryText: allergy.gravidadeDescricao,
            originalRecord: allergy,
        };
    }

    if (type === 'medication') {
        const medication = record as MedicationResponse;
        return {
            id: medication.id,
            primaryText: medication.medicamentoPosologia,
            originalRecord: medication,
        };
    }

    if (type === 'vaccination') {
        const vaccination = record as VaccinationResponse;
        return {
            id: vaccination.id,
            primaryText: vaccination.nomeVacina,
            secondaryText: `${vaccination.data} - ${vaccination.statusDescricao}`,
            originalRecord: vaccination,
        };
    }

    const condition = record as ConditionResponse;
    return {
        id: condition.id,
        primaryText: condition.tipoProblemaDescricao,
        secondaryText: condition.descricao,
        originalRecord: condition,
    };
}
