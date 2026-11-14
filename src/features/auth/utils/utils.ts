
export function splitFullName(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return { lastName: '', firstName: parts[0] };
    return {
        lastName: parts.slice(0, -1).join(' '),
        firstName: parts[parts.length - 1]
    };
}

export const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export const isBlank = (value: string) => value.trim() === '';