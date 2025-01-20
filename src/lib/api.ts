const BASE_URL = 'https://urlshortener.smef.io';
const AUTH = btoa('abat:5hWDEcFK4FUW');

const headers = {
  'Authorization': `Basic ${AUTH}`,
  'Content-Type': 'application/json',
};

export const api = {
  async getAllUrls() {
    const response = await fetch(`${BASE_URL}/urls`, {
      headers,
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch URLs');
    return response.json();
  },

  async createUrl(data: { url: string; ttlInSeconds: number | null }, customId?: string) {
    const url = customId ? `${BASE_URL}/urls/${customId}` : `${BASE_URL}/urls`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create URL');
    return response.json();
  },

  async updateUrl(id: string, data: { url: string; ttlInSeconds: number | null }) {
    const response = await fetch(`${BASE_URL}/urls/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update URL');
    return response.json();
  },

  async deleteUrl(id: string) {
    const response = await fetch(`${BASE_URL}/urls/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete URL');
  }
}; 