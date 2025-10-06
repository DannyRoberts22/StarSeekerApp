import Constants from 'expo-constants';

const { API_URL, API_KEY } = (Constants.expoConfig?.extra || {}) as {
  API_URL: string;
  API_KEY: string;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(
  path: string,
  method: HttpMethod = 'GET',
  signal?: AbortSignal
) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    signal,
  });
  console.log('🚀 ~ request ~ res:', res);
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  get: request,
};
