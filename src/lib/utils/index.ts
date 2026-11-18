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

export const formatLKR = formatCurrencyLKR;
export const formatTimeString = formatDisplayTime;
export const calculateEndTime = addMinutesToTime;

export function formatDisplayTime(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
}

export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const totalM = h * 60 + m + minutesToAdd;
  const newH = Math.floor(totalM / 60);
  const newM = totalM % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}
