export function getFirstName(fullName?: string | null) {
    return fullName?.trim().split(/\s+/)[0] || 'usuario';
}
