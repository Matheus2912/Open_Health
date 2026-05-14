import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';

function AppNavigator() {
    const router = useRouter();
    const segments = useSegments();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const firstSegment = segments[0] as string | undefined;
        const inProtectedArea = firstSegment === '(tabs)' || firstSegment === 'emergencia' || firstSegment === 'perfil';
        const inPublicArea = firstSegment === undefined || firstSegment === 'login' || firstSegment === 'cadastro';

        if (!isAuthenticated && inProtectedArea) {
            router.replace('/login');
            return;
        }

        if (isAuthenticated && inPublicArea) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, router, segments]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="cadastro" />
            <Stack.Screen name="emergencia" />
            <Stack.Screen name="perfil" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}
