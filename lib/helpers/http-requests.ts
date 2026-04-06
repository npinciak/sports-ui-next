export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error('[fetchJson] HTTP error response', {
        url,
        status: response.status,
        statusText: response.statusText,
      });

      return null;
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchJson] Request failed', {
      url,
      error,
    });
    return null;
  }
}
