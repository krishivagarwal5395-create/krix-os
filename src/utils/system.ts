/**
 * System utility calculations for KRIX Desktop
 */

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function sanitizePath(pathStr: string): string {
  const parts = pathStr.split('/').filter(Boolean);
  return '/' + parts.join('/');
}

export function calculateBatteryRemainingMinutes(chargePercent: number, isPluggedIn: boolean, rapidChargeActive: boolean): number {
  if (isPluggedIn) {
    if (chargePercent >= 100) return 0;
    const remainingToFull = 100 - chargePercent;
    // Rapid charge charges roughly 1.33% per min, normal 0.75% per min
    const rate = rapidChargeActive ? 1.33 : 0.75;
    return Math.round(remainingToFull / rate);
  } else {
    // Discharge rate approximately 0.25% per min on ThinkPad balanced mode (approx 6-7 hours)
    return Math.round(chargePercent / 0.25);
  }
}

export function filterItemsBySearch<T extends { title?: string; name?: string; content?: string }>(
  items: T[],
  query: string
): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase().trim();
  return items.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(q);
    const nameMatch = item.name?.toLowerCase().includes(q);
    const contentMatch = item.content?.toLowerCase().includes(q);
    return Boolean(titleMatch || nameMatch || contentMatch);
  });
}
