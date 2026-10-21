// Read-only call to the Django service catalogue API (see services/api.py).
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchServices({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/services/`, { signal });
  if (!response.ok) {
    throw new Error(`Services request failed (${response.status})`);
  }
  return response.json();
}
