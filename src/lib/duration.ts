/**
 * "2 Nights · 3 Days", and "1 Night · 2 Days" — the one duration label the
 * hero badge, Quick Facts and the corporate list share. Taj and Agra (round 5)
 * is the catalogue's first one-night trip, and its printed PDF read "1 Nights".
 */
export function durationLabel(nights: number, days: number): string {
  return `${nights} ${nights === 1 ? 'Night' : 'Nights'} · ${days} ${days === 1 ? 'Day' : 'Days'}`;
}
