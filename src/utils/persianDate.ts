/**
 * Persian Date and Number Utilities for BarberShop
 */

import { Barber, Service, Appointment, DayOff } from '../types';

export const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return '';
  return n.toString().replace(/\d/g, (x) => persianNumbers[parseInt(x, 10)]);
}

export function formatToman(amount: number): string {
  if (amount === undefined || amount === null) return '۰ تومان';
  const formatted = amount.toLocaleString('en-US');
  return `${toPersianDigits(formatted)} تومان`;
}

export interface DayOption {
  dateStr: string;        // "1403/07/15" or standard YYYY-MM-DD
  dayOfWeek: number;      // 0 to 6
  dayName: string;        // "شنبه", "یکشنبه", ...
  displayLabel: string;   // "دوشنبه ۱۵ مهر"
  relativeName?: string;  // "امروز", "فردا"
}

export const PERSIAN_WEEKDAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه'
];

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

/**
 * Generate next 14 booking days starting from today in solar Persian format
 */
export function getUpcomingBookingDays(count: number = 14): DayOption[] {
  const days: DayOption[] = [];
  const baseDate = new Date();

  // Simple, deterministic Jalali approximation for UI consistency
  for (let i = 0; i < count; i++) {
    const cur = new Date(baseDate);
    cur.setDate(baseDate.getDate() + i);

    // JavaScript Sunday is 0, so convert to Saturday as 0
    // Sat: 6 -> 0, Sun: 0 -> 1, Mon: 1 -> 2, Tue: 2 -> 3, Wed: 3 -> 4, Thu: 4 -> 5, Fri: 5 -> 6
    const jsDay = cur.getDay();
    const persianDayIndex = (jsDay + 1) % 7;
    const dayName = PERSIAN_WEEKDAYS[persianDayIndex];

    // Format ISO date for stable keys: YYYY-MM-DD
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    let relativeName: string | undefined;
    if (i === 0) relativeName = 'امروز';
    else if (i === 1) relativeName = 'فردا';

    // Persian label
    const dayNumPersian = toPersianDigits(cur.getDate());
    const displayLabel = `${dayName} ${dayNumPersian} ${PERSIAN_MONTHS[(cur.getMonth() + 2) % 12]}`;

    days.push({
      dateStr,
      dayOfWeek: persianDayIndex,
      dayName,
      displayLabel,
      relativeName
    });
  }

  return days;
}

/**
 * Convert "HH:mm" to total minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert minutes from midnight to "HH:mm"
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Calculate available slots dynamically for a specific barber, service, and date.
 * Excludes:
 * 1. Barber days off / holidays
 * 2. Closed working hours
 * 3. Break times (e.g. lunch/prayer 13:30 - 15:00)
 * 4. Existing booked appointments that collide with (start -> start + duration)
 * 5. Past times if booking for today
 */
export function calculateAvailableSlots(
  barber: Barber,
  service: Service,
  dateStr: string,
  dayOfWeek: number,
  allAppointments: Appointment[],
  holidays: DayOff[] = []
): { startTime: string; endTime: string; isAvailable: boolean; conflictReason?: string }[] {
  // Check if this date is a day off for this barber
  const isOffDay = holidays.some(
    (h) => (h.barberId === barber.id || h.barberId === 'ALL') && h.date === dateStr
  );
  if (isOffDay) {
    return [];
  }

  // Find barber's working hour config for this day of week
  const workConfig = barber.workingHours.find((w) => w.dayOfWeek === dayOfWeek);
  if (!workConfig || !workConfig.isOpen) {
    return [];
  }

  const shiftStart = timeToMinutes(workConfig.startTime || '10:00');
  const shiftEnd = timeToMinutes(workConfig.endTime || '21:00');
  const breakStart = workConfig.breakStartTime ? timeToMinutes(workConfig.breakStartTime) : null;
  const breakEnd = workConfig.breakEndTime ? timeToMinutes(workConfig.breakEndTime) : null;

  const duration = service.durationMinutes || 45;
  const interval = 30; // 30-minute stepping grid

  // Get active existing bookings for this barber on this date
  const barberAppointments = allAppointments.filter(
    (app) => app.barberId === barber.id && app.date === dateStr && app.status !== 'cancelled'
  );

  const slots: { startTime: string; endTime: string; isAvailable: boolean; conflictReason?: string }[] = [];

  // Current time check if date is today
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${d}`;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = dateStr === todayStr;

  for (let slotStart = shiftStart; slotStart + duration <= shiftEnd; slotStart += interval) {
    const slotEnd = slotStart + duration;
    let isAvailable = true;
    let conflictReason: string | undefined;

    // Check if slot is already in past today (with 15 min buffer)
    if (isToday && slotStart <= currentMinutes + 15) {
      isAvailable = false;
      conflictReason = 'زمان گذشته است';
    }

    // Check collision with break time
    if (isAvailable && breakStart !== null && breakEnd !== null) {
      // Overlap condition: slotStart < breakEnd && slotEnd > breakStart
      if (slotStart < breakEnd && slotEnd > breakStart) {
        isAvailable = false;
        conflictReason = 'زمان استراحت آرایشگر';
      }
    }

    // Check collision with existing appointments
    if (isAvailable) {
      for (const app of barberAppointments) {
        const appStart = timeToMinutes(app.startTime);
        const appEnd = timeToMinutes(app.endTime);

        // Standard interval intersection
        if (slotStart < appEnd && slotEnd > appStart) {
          isAvailable = false;
          conflictReason = 'قبلاً رزرو شده';
          break;
        }
      }
    }

    slots.push({
      startTime: minutesToTime(slotStart),
      endTime: minutesToTime(slotEnd),
      isAvailable,
      conflictReason
    });
  }

  return slots;
}
