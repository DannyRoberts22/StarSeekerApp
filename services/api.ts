const API_BASE_URL = 'https://hstc-api.testing.keyholding.com';
const API_KEY = '94962B9A-966C-43FC-8E1A-145DEAA5970C';

export interface Gate {
  code: string;
  name: string;
  location: string;
  status: string;
  // Add more fields as we discover them from the API
}

export interface Route {
  start: string;
  destination: string;
  cost: number;
  distance: number;
  // Add more fields as needed
}

export interface TransportOption {
  vehicle: string;
  cost: number;
  passengers: number;
  parkingDays: number;
}

class StarSeekerAPI {
  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getGates(): Promise<Gate[]> {
    return this.request<Gate[]>('/gates');
  }

  async getGate(gateCode: string): Promise<Gate> {
    return this.request<Gate>(`/gates/${gateCode}`);
  }

  async getRoute(fromGate: string, toGate: string): Promise<Route> {
    return this.request<Route>(`/gates/${fromGate}/to/${toGate}`);
  }

  async getTransportCost(
    distance: number,
    passengers: number = 1,
    parkingDays: number = 0
  ): Promise<TransportOption> {
    return this.request<TransportOption>(
      `/transport/${distance}?passengers=${passengers}&parking=${parkingDays}`
    );
  }

  async getStatus(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/status');
  }
}

export const starSeekerAPI = new StarSeekerAPI();
