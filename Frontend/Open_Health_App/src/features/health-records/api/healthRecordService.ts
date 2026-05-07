import { HealthRecordType } from '@/features/dashboard/types/dashboard.type';
import {
    HealthRecordRequestByType,
    HealthRecordResponseByType,
    HealthRecordsState,
} from '@/features/health-records/types/health-record.type';
import { api, extractErrorMessage } from '@/lib/api';

const endpointByType: Record<HealthRecordType, string> = {
    allergy: '/alergias',
    medication: '/medicamentos',
    vaccination: '/vacinacoes',
    condition: '/condicoes-saude',
};

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

export const emptyHealthRecords: HealthRecordsState = {
    allergy: [],
    medication: [],
    vaccination: [],
    condition: [],
};

export const healthRecordService = {
    listAll: async (token: string): Promise<HealthRecordsState> => {
        const headers = getAuthHeader(token);
        const [allergy, medication, vaccination, condition] = await Promise.all([
            requestWithErrorHandling(() => api.get<HealthRecordResponseByType['allergy'][]>(endpointByType.allergy, { headers })),
            requestWithErrorHandling(() => api.get<HealthRecordResponseByType['medication'][]>(endpointByType.medication, { headers })),
            requestWithErrorHandling(() => api.get<HealthRecordResponseByType['vaccination'][]>(endpointByType.vaccination, { headers })),
            requestWithErrorHandling(() => api.get<HealthRecordResponseByType['condition'][]>(endpointByType.condition, { headers })),
        ]);

        return {
            allergy,
            medication,
            vaccination,
            condition,
        };
    },

    create: async <TType extends HealthRecordType>(
        token: string,
        type: TType,
        payload: HealthRecordRequestByType[TType]
    ): Promise<HealthRecordResponseByType[TType]> => {
        return requestWithErrorHandling(() =>
            api.post<HealthRecordResponseByType[TType]>(endpointByType[type], payload, {
                headers: getAuthHeader(token),
            })
        );
    },
};
