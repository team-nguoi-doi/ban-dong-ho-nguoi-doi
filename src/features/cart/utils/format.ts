export const formatPrice = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
        return '0đ';
    }
    return `${value.toLocaleString('vi-VN')}đ`;
};