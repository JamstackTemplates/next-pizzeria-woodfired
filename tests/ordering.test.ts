// The "taking orders" status: pure logic, so every case runs without a browser or a clock.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { describeOrdering, orderingState, toMinutes, zonedNow, type DayHours } from '../lib/hours.ts';

const lunch = { label: 'Lunch', opens: '12:00', closes: '14:30' } as const;
const dinner = { label: 'Dinner', opens: '17:00', closes: '22:00' } as const;
const week: DayHours[] = [
  { day: 'Monday', services: [] },
  { day: 'Tuesday', services: [lunch, dinner] },
  { day: 'Wednesday', services: [lunch, dinner] },
  { day: 'Thursday', services: [lunch, dinner] },
  { day: 'Friday', services: [lunch, { label: 'Dinner', opens: '17:00', closes: '23:00' }] },
  { day: 'Saturday', services: [{ label: 'All day', opens: '12:00', closes: '23:00' }] },
  { day: 'Sunday', services: [{ label: 'All day', opens: '12:00', closes: '21:00' }] },
];
const status = (day: DayHours['day'], time: string, hours = week) => describeOrdering(orderingState(day, toMinutes(time), hours, 30));

test('before the first service of the day', () => {
  assert.deepEqual(status('Tuesday', '09:15'), { text: 'Closed · opens today at 12pm', tone: 'closed' });
  assert.deepEqual(status('Tuesday', '11:59'), { text: 'Closed · opens today at 12pm', tone: 'closed' });
});

test('during a service, until last orders', () => {
  assert.deepEqual(status('Tuesday', '12:00'), { text: 'Taking orders · last orders 2pm', tone: 'open' });
  assert.deepEqual(status('Wednesday', '19:30'), { text: 'Taking orders · last orders 9:30pm', tone: 'open' });
  assert.deepEqual(status('Saturday', '15:00'), { text: 'Taking orders · last orders 10:30pm', tone: 'open' });
  const state = orderingState('Wednesday', toMinutes('19:30'), week, 30);
  assert.equal(state.status, 'taking');
  assert.equal(state.status === 'taking' && state.minutesLeft, 120);
});

test('inside the last-orders window', () => {
  assert.deepEqual(status('Wednesday', '21:15'), { text: 'Last orders in 15 minutes', tone: 'soon' });
  assert.deepEqual(status('Wednesday', '21:29'), { text: 'Last orders in 1 minute', tone: 'soon' });
  assert.deepEqual(status('Wednesday', '21:14'), { text: 'Taking orders · last orders 9:30pm', tone: 'open' });
});

test('the gap between lunch and dinner', () => {
  assert.deepEqual(status('Thursday', '14:00'), { text: 'Last orders taken · dinner from 5pm', tone: 'closed' });
  assert.deepEqual(status('Thursday', '14:30'), { text: 'Between services · dinner from 5pm', tone: 'closed' });
  assert.deepEqual(status('Thursday', '16:59'), { text: 'Between services · dinner from 5pm', tone: 'closed' });
  assert.deepEqual(status('Thursday', '17:00'), { text: 'Taking orders · last orders 9:30pm', tone: 'open' });
});

test('after last orders and after closing', () => {
  assert.deepEqual(status('Thursday', '21:45'), { text: 'Last orders taken · opens tomorrow at 12pm', tone: 'closed' });
  assert.deepEqual(status('Thursday', '22:00'), { text: 'Closed · opens tomorrow at 12pm', tone: 'closed' });
  assert.deepEqual(status('Friday', '22:45'), { text: 'Last orders taken · opens tomorrow at 12pm', tone: 'closed' });
});

test('closed days and the next opening across them', () => {
  // Sunday night → Monday is closed → Tuesday lunch.
  assert.deepEqual(status('Sunday', '21:30'), { text: 'Closed · opens Tuesday at 12pm', tone: 'closed' });
  assert.deepEqual(status('Monday', '12:30'), { text: 'Closed · opens tomorrow at 12pm', tone: 'closed' });
  // Several closed days in a row, wrapping round the end of the week.
  const short: DayHours[] = week.map(entry => ({ ...entry, services: entry.day === 'Thursday' ? [dinner] : [] }));
  assert.deepEqual(status('Thursday', '23:00', short), { text: 'Closed · opens Thursday at 5pm', tone: 'closed' });
  assert.deepEqual(status('Saturday', '13:00', short), { text: 'Closed · opens Thursday at 5pm', tone: 'closed' });
  assert.deepEqual(status('Monday', '13:00', short), { text: 'Closed · opens Thursday at 5pm', tone: 'closed' });
  assert.deepEqual(status('Wednesday', '13:00', short), { text: 'Closed · opens tomorrow at 5pm', tone: 'closed' });
  // No services at all never claims an opening.
  assert.deepEqual(status('Monday', '13:00', week.map(entry => ({ ...entry, services: [] }))), { text: 'Closed', tone: 'closed' });
});

test('the browser clock is read in the pizzeria’s time zone', () => {
  // 2026-01-14 is a Wednesday. 01:30 UTC is 8:30pm on Tuesday in New York (UTC−5).
  assert.deepEqual(zonedNow('America/New_York', new Date('2026-01-14T01:30:00Z')), { day: 'Tuesday', minutes: 20 * 60 + 30 });
  // Daylight saving: 2026-07-15 16:05 UTC is 12:05pm in New York (UTC−4).
  assert.deepEqual(zonedNow('America/New_York', new Date('2026-07-15T16:05:00Z')), { day: 'Wednesday', minutes: 12 * 60 + 5 });
});
