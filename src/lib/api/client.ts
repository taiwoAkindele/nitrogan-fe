const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add auth token when available (e.g. from cookie/localStorage)
  // const token = getStoredToken();
  // if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

export async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
