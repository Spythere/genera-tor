export function currentFormattedDate() {
  return new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric' }) + 'r.';
}

export function currentFormattedMinutes() {
  const date = new Date();
  return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
}

export function currentFormattedHours() {
  return new Date().toLocaleTimeString('pl-PL', { hour: '2-digit' });
}

