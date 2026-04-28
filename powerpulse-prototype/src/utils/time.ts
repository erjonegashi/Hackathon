export function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function minutesSinceMidnight(d: Date) {
  return d.getHours() * 60 + d.getMinutes();
}

