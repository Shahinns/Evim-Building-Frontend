export const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export function getAuthHeaders(includeJson = false) {
  const h = {};
  if (includeJson) h['Content-Type'] = 'application/json';
  return h;
}

export function apiFetch(url, options = {}) {
  return fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      ...getAuthHeaders(options.includeJson),
      ...(options.headers || {}),
    },
  });
}

export async function fetchCurrentUser() {
  try {
    const res = await apiFetch(`${API_BASE}/api/auth/me`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      email: data.email || '',
      fullName: data.fullName || '',
      phone: data.phone || '',
      id: data.id || null,
      role: data.role || 'USER',
      balance: data.balance ?? 0,
      listingLimit: data.listingLimit ?? 10,
      packageType: data.packageType || '',
    };
  } catch {
    return null;
  }
}

export async function logoutUser() {
  try {
    await apiFetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
  } catch {
    /* ignore */
  }
  sessionStorage.removeItem('emlak_user');
}
