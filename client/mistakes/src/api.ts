const API_BASE = '/api/mistakes';

let activeRequests = 0;
let activityCycle = 0;
let activitySnapshot = { pending: 0, cycle: 0 };
const activityListeners = new Set<() => void>();

export function subscribeToApiActivity(listener: () => void): () => void {
  activityListeners.add(listener);
  return () => { activityListeners.delete(listener); };
}

export function getActiveApiRequestCount(): number {
  return activeRequests;
}

export function getApiActivitySnapshot(): { pending: number; cycle: number } {
  return activitySnapshot;
}

function updateApiActivity(change: number): void {
  if (change > 0 && activeRequests === 0) activityCycle += 1;
  activeRequests += change;
  activitySnapshot = { pending: activeRequests, cycle: activityCycle };
  activityListeners.forEach((listener) => listener());
}

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function api<T>(path: string, options: RequestInit = {}, activity: { background?: boolean } = {}): Promise<T> {
  if (!activity.background) updateApiActivity(1);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'same-origin',
      headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...options.headers },
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      throw new ApiError(result?.message || '请求失败，请稍后重试。', response.status);
    }
    if (options.method && options.method !== 'GET') window.dispatchEvent(new Event('mistakes:updated'));
    return result.data as T;
  } finally {
    if (!activity.background) updateApiActivity(-1);
  }
}

export const json = (body: unknown, method = 'POST'): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export function formatDate(value: string, full = false): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('zh-CN', full
    ? { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function navigate(path: string): void {
  window.location.hash = path;
}
