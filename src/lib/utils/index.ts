import { formatInTimeZone } from 'date-fns-tz';

export const TIMEZONE = 'Asia/Colombo';

export function formatAcademyDate(date: Date | string, formatStr: string = 'yyyy-MM-dd HH:mm'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(d, TIMEZONE, formatStr);
}

export function formatCurrencyLKR(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(amount);
}
