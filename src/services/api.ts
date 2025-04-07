
// API service that would connect to the Python backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// General request handler to reduce repetition
async function handleRequest<T>(
  url: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'An error occurred' };
    }
    
    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    return { error: 'Network error' };
  }
}

// 1. Placement Recommendations API
export async function getPlacementRecommendations(payload: {
  type?: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  priority?: 'high' | 'medium' | 'low';
}) {
  return handleRequest<any>('/api/placement', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 2. Item Search and Retrieval API
export async function searchItems(params: { 
  itemId?: string; 
  itemName?: string; 
  userId?: string;
}) {
  const searchParams = new URLSearchParams();
  
  if (params.itemId) searchParams.append('itemId', params.itemId);
  if (params.itemName) searchParams.append('itemName', params.itemName);
  if (params.userId) searchParams.append('userId', params.userId);
  
  return handleRequest<any>(`/api/search?${searchParams.toString()}`, {
    method: 'GET',
  });
}

export async function retrieveItem(payload: {
  itemId: string;
  userId?: string;
}) {
  return handleRequest<any>('/api/retrieve', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function placeItem(payload: {
  itemId: string;
  location: {
    module: string;
    section: string;
    position: string;
  };
  userId?: string;
}) {
  return handleRequest<any>('/api/place', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 3. Waste Management API
export async function identifyWaste() {
  return handleRequest<any>('/api/waste/identify', {
    method: 'GET',
  });
}

export async function createWasteReturnPlan(payload: {
  wasteItems: Array<{
    id: string;
    type: string;
    weight: number;
  }>;
}) {
  return handleRequest<any>('/api/waste/return-plan', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function completeWasteUndocking(payload: {
  missionId: string;
  userId?: string;
}) {
  return handleRequest<any>('/api/waste/complete-undocking', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 4. Time Simulation API
export async function simulateDay(payload?: {
  userId?: string;
  days?: number;
}) {
  return handleRequest<any>('/api/simulate/day', {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

// 5. Import/Export API
export async function importItems(csvFile: File) {
  const formData = new FormData();
  formData.append('file', csvFile);
  
  return handleRequest<any>('/api/import/items', {
    method: 'POST',
    body: formData,
    headers: {} // Let the browser set the content type with boundary
  });
}

export async function importContainers(csvFile: File) {
  const formData = new FormData();
  formData.append('file', csvFile);
  
  return handleRequest<any>('/api/import/containers', {
    method: 'POST',
    body: formData,
    headers: {} // Let the browser set the content type with boundary
  });
}

export async function exportArrangement(params: {
  module?: string;
  format?: 'csv' | 'json';
}) {
  const searchParams = new URLSearchParams();
  
  if (params.module) searchParams.append('module', params.module);
  if (params.format) searchParams.append('format', params.format);
  
  return handleRequest<any>(`/api/export/arrangement?${searchParams.toString()}`, {
    method: 'GET',
  });
}

// 6. Logging API
export async function getLogs(params: {
  startDate: string;
  endDate: string;
  itemId?: string;
  userId?: string;
  actionType?: string;
}) {
  const searchParams = new URLSearchParams();
  
  searchParams.append('startDate', params.startDate);
  searchParams.append('endDate', params.endDate);
  
  if (params.itemId) searchParams.append('itemId', params.itemId);
  if (params.userId) searchParams.append('userId', params.userId);
  if (params.actionType) searchParams.append('actionType', params.actionType);
  
  return handleRequest<any>(`/api/logs?${searchParams.toString()}`, {
    method: 'GET',
  });
}

// Mock data functions for development
export const getMockIssOccupancy = () => {
  return {
    modules: [
      { name: 'Unity', id: 'unity', occupancy: 75, warning: false },
      { name: 'Destiny', id: 'destiny', occupancy: 88, warning: true },
      { name: 'Harmony', id: 'harmony', occupancy: 62, warning: false },
      { name: 'Columbus', id: 'columbus', occupancy: 45, warning: false },
      { name: 'Kibo', id: 'kibo', occupancy: 91, warning: true },
      { name: 'Zvezda', id: 'zvezda', occupancy: 79, warning: false },
      { name: 'Zarya', id: 'zarya', occupancy: 82, warning: true },
      { name: 'Rassvet', id: 'rassvet', occupancy: 54, warning: false }
    ],
    overall: {
      occupancy: 72,
      efficiency: 68,
      warnings: 3
    }
  };
};

export const getMockWasteData = () => {
  return {
    categories: [
      { type: 'Biological', amount: 25, trend: 'increasing' },
      { type: 'Packaging', amount: 42, trend: 'stable' },
      { type: 'Technical', amount: 18, trend: 'decreasing' },
      { type: 'Food', amount: 30, trend: 'stable' },
      { type: 'Medical', amount: 8, trend: 'increasing' }
    ],
    total: 123,
    nextPickup: '2025-04-15'
  };
};

export const getMockStorageEfficiency = () => {
  return {
    overall: 68,
    byModule: [
      { name: 'Unity', efficiency: 65 },
      { name: 'Destiny', efficiency: 72 },
      { name: 'Harmony', efficiency: 81 },
      { name: 'Columbus', efficiency: 59 },
      { name: 'Kibo', efficiency: 43 },
      { name: 'Zvezda', efficiency: 75 },
      { name: 'Zarya', efficiency: 66 },
      { name: 'Rassvet', efficiency: 77 }
    ],
    suggestions: [
      'Reorganize Unity compartments 3-7 to improve access to frequently used items',
      'Consolidate packaging materials in Destiny to free up 15% additional space',
      'Move low-priority equipment from Kibo to Rassvet to balance load distribution'
    ]
  };
};
