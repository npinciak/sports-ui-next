export function normalizeName(name: string | null): string | null {
  if (!name) return null;

  return name
    .split(' ')
    .join('')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toLowerCase();
}
