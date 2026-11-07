const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
export const formatPrice = (value: number): string => `CHF ${formatter.format(value)}`;
