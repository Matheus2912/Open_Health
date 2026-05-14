import { HealthRecordType } from '@/features/dashboard/types/dashboard.type';
import {
    ExamPdfResponse,
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

    update: async <TType extends HealthRecordType>(
        token: string,
        type: TType,
        id: string,
        payload: HealthRecordRequestByType[TType]
    ): Promise<HealthRecordResponseByType[TType]> => {
        return requestWithErrorHandling(() =>
            api.put<HealthRecordResponseByType[TType]>(`${endpointByType[type]}/${id}`, payload, {
                headers: getAuthHeader(token),
            })
        );
    },

    remove: async (token: string, type: HealthRecordType, id: string): Promise<void> => {
        await requestWithErrorHandling(() =>
            api.delete<void>(`${endpointByType[type]}/${id}`, {
                headers: getAuthHeader(token),
            })
        );
    },

    listExamPdfs: async (token: string): Promise<ExamPdfResponse[]> => {
        return requestWithErrorHandling(() =>
            api.get<ExamPdfResponse[]>('/exames-pdf', {
                headers: getAuthHeader(token),
            })
        );
    },

    uploadExamPdf: async (token: string, file: { uri: string; name: string; type: string; file?: File }): Promise<ExamPdfResponse> => {
        const formData = new FormData();

        if (file.file) {
            formData.append('arquivo', file.file);
        } else {
            formData.append('arquivo', {
                uri: file.uri,
                name: file.name,
                type: file.type,
            } as unknown as Blob);
        }

        return requestWithErrorHandling(() =>
            api.post<ExamPdfResponse>('/exames-pdf', formData, {
                headers: {
                    ...getAuthHeader(token),
                    'Content-Type': 'multipart/form-data',
                },
            })
        );
    },

    removeExamPdf: async (token: string, id: string): Promise<void> => {
        await requestWithErrorHandling(() =>
            api.delete<void>(`/exames-pdf/${id}`, {
                headers: getAuthHeader(token),
            })
        );
    },
};
