// Opening hours, services and the "taking orders" status. Pure functions with no imports, so they
// are unit tested directly and the browser only supplies the current time in the pizzeria's zone.

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export type ServiceLabel = 'Lunch' | 'Dinner' | 'All day';

export const SERVICE_LABELS: readonly ServiceLabel[] = ['Lunch', 'Dinner', 'All day'];

export interface Service {
  /** Shown beside the times, e.g. "Lunch". */
  label: ServiceLabel;
  /** 24-hour "HH:MM" local time, e.g. "12:00". */
  opens: string;
  /** 24-hour "HH:MM" local time, e.g. "22:00". Must be later than `opens` on the same day. */
  closes: string;
}

export interface DayHours {
  day: Day;
  /** Zero or more services, earliest first. An empty list means closed all day. */
  services: Service[];
}

/** Minutes after midnight for "HH:MM". */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** Minutes after midnight → "HH:MM". */
export function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** "07:30" → "7:30am", "18:00" → "6pm". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/** "12pm – 2:30pm". */
export function formatService(service: Service): string {
  return `${formatTime(service.opens)} – ${formatTime(service.closes)}`;
}

export interface HoursGroup {
  /** "Tue – Thu" or "Monday". */
  label: string;
  /** Services for these days; empty when closed. */
  services: { label: ServiceLabel; hours: string }[];
}

/** Consecutive days with identical services, e.g. Tue – Thu: Lunch 12pm – 2:30pm, Dinner 5pm – 10pm. */
export function groupedHours(hours: readonly DayHours[]): HoursGroup[] {
  const key = (entry: DayHours) => entry.services.map(s => `${s.label} ${s.opens}-${s.closes}`).join('|');
  const groups: { days: Day[]; key: string; entry: DayHours }[] = [];
  for (const entry of hours) {
    const last = groups.at(-1);
    if (last && last.key === key(entry)) last.days.push(entry.day);
    else groups.push({ days: [entry.day], key: key(entry), entry });
  }
  const short = (day: Day) => day.slice(0, 3);
  return groups.map(group => ({
    label: group.days.length === 1 ? group.days[0] : `${short(group.days[0])} – ${short(group.days.at(-1)!)}`,
    services: group.entry.services.map(service => ({ label: service.label, hours: formatService(service) })),
  }));
}

/** When the phones stop taking orders for a service: `lastOrdersMinutes` before it closes. */
export function lastOrdersAt(service: Service, lastOrdersMinutes: number): string {
  return fromMinutes(toMinutes(service.closes) - lastOrdersMinutes);
}

export interface NextService {
  day: Day;
  service: Service;
  /** 0 = later today, 1 = tomorrow, and so on. */
  daysAhead: number;
}

export type OrderingState =
  /** Inside a service and before last orders. `minutesLeft` counts down to last orders. */
  | { status: 'taking'; service: Service; lastOrders: string; minutesLeft: number }
  /** A service has run today and another starts later today. */
  | { status: 'between'; next: NextService; afterLastOrders: boolean }
  /** Nothing has been served yet today, the day is over, or the whole day is closed. */
  | { status: 'closed'; next?: NextService; afterLastOrders: boolean };

/** Minutes before last orders when the status switches to "Last orders in N minutes". */
export const LAST_CALL_MINUTES = 15;

/**
 * Whether the kitchen is taking orders at a given local day/time. `minutes` is minutes after midnight
 * in the pizzeria's own time zone. Orders stop `lastOrdersMinutes` before each service closes.
 */
export function orderingState(day: Day, minutes: number, hours: readonly DayHours[], lastOrdersMinutes: number): OrderingState {
  const today = hours.find(entry => entry.day === day)?.services ?? [];
  let afterLastOrders = false;
  for (const service of today) {
    const opens = toMinutes(service.opens);
    const closes = toMinutes(service.closes);
    const last = closes - lastOrdersMinutes;
    if (minutes >= opens && minutes < last) {
      return { status: 'taking', service, lastOrders: fromMinutes(last), minutesLeft: last - minutes };
    }
    if (minutes >= last && minutes < closes) afterLastOrders = true;
  }
  const next = nextService(day, minutes, hours);
  const servedToday = today.some(service => toMinutes(service.opens) <= minutes);
  if (next && next.daysAhead === 0 && servedToday) return { status: 'between', next, afterLastOrders };
  return { status: 'closed', next, afterLastOrders };
}

/** The next service that opens after `minutes` today, or on a following day (up to a week ahead). */
export function nextService(day: Day, minutes: number, hours: readonly DayHours[]): NextService | undefined {
  const start = DAYS.indexOf(day);
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const candidate = DAYS[(start + daysAhead) % 7];
    const services = hours.find(entry => entry.day === candidate)?.services ?? [];
    for (const service of services) {
      if (daysAhead === 0 && toMinutes(service.opens) <= minutes) continue;
      return { day: candidate, service, daysAhead };
    }
  }
  return undefined;
}

export type OrderingTone = 'open' | 'soon' | 'closed';

/** Words for the status pill, e.g. "Taking orders · last orders 9:30pm". */
export function describeOrdering(state: OrderingState): { text: string; tone: OrderingTone } {
  if (state.status === 'taking') {
    if (state.minutesLeft <= LAST_CALL_MINUTES) {
      return { text: `Last orders in ${state.minutesLeft} minute${state.minutesLeft === 1 ? '' : 's'}`, tone: 'soon' };
    }
    return { text: `Taking orders · last orders ${formatTime(state.lastOrders)}`, tone: 'open' };
  }
  if (state.status === 'between') {
    const service = state.next.service.label === 'All day' ? 'back' : state.next.service.label.toLowerCase();
    const lead = state.afterLastOrders ? 'Last orders taken' : 'Between services';
    return { text: `${lead} · ${service} from ${formatTime(state.next.service.opens)}`, tone: 'closed' };
  }
  const lead = state.afterLastOrders ? 'Last orders taken' : 'Closed';
  if (!state.next) return { text: lead, tone: 'closed' };
  const when = state.next.daysAhead === 0 ? 'today' : state.next.daysAhead === 1 ? 'tomorrow' : state.next.day;
  return { text: `${lead} · opens ${when} at ${formatTime(state.next.service.opens)}`, tone: 'closed' };
}

/** Current weekday and minutes after midnight in an IANA time zone. */
export function zonedNow(timeZone: string, date = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(date);
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  const day = part('weekday') as Day;
  return { day: DAYS.includes(day) ? day : 'Monday', minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}
