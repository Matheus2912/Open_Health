import axios, { isAxiosError } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PRODUCTION_API_URL = 'https://open-health-api.onrender.com';

export function getApiBaseUrl() {
    const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
    if (envUrl) {
        return envUrl.replace(/\/$/, '');
    }

    if (!__DEV__) {
        return PRODUCTION_API_URL;
    }

    const hostUri =
        (Constants.expoConfig as { hostUri?: string } | null)?.hostUri ??
        ((Constants as unknown as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } }).manifest2?.extra?.expoClient?.hostUri ?? '');

    if (hostUri) {
        const host = hostUri.split(':')[0];
        return `http://${host}:8080`;
    }

    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8080';
    }

    return 'http://localhost:8080';
}

export function extractErrorMessage(error: unknown) {
    if (isAxiosError<{ erro?: string }>(error)) {
        return error.response?.data?.erro ?? 'Erro ao conectar com o servidor';
    }

    return 'Erro ao conectar com o servidor';
}

export const api = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});
