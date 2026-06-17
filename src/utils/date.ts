export function toInputDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function parseInputDateTime(value: string): Date | null {
  const normalized = value.trim().replace(/\//g, "-").replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

export function formatDeadline(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "时间待补充";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getMonth() + 1}月${date.getDate()}日 ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

export function getRemainingText(value: string) {
  const deadline = new Date(value).getTime();
  if (Number.isNaN(deadline)) {
    return "待补充";
  }
  const diff = deadline - Date.now();
  if (diff < 0) {
    const overdueHours = Math.ceil(Math.abs(diff) / 36e5);
    return `已逾期 ${overdueHours} 小时`;
  }
  const hours = Math.ceil(diff / 36e5);
  if (hours < 24) {
    return `剩余 ${hours} 小时`;
  }
  return `剩余 ${Math.ceil(hours / 24)} 天`;
}

export function isToday(value: string) {
  const date = new Date(value);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}
