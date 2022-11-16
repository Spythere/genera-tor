export function currentFormattedDate() {
  return new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric' }) + 'r.';
}

export function currentFormattedMinutes() {
  return new Date().toLocaleTimeString('pl-PL', { minute: '2-digit' });
}

export function currentFormattedHours() {
  return new Date().toLocaleTimeString('pl-PL', { hour: '2-digit' });
}
