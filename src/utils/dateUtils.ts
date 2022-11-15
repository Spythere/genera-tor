export function currentFormattedDate() {
    return new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric' }) + 'r.';
}