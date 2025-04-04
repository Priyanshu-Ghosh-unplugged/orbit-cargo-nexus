
// API service that would connect to the Python backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
    // For demo purposes, we'll return mock data instead of making actual API calls
    return getMockData(url);
  } catch (error) {
    console.error('API request failed:', error);
    return { error: 'Network error' };
  }
}

// Helper function to return appropriate mock data based on the endpoint
function getMockData<T>(url: string): ApiResponse<T> {
  // Simulate API delay
  // In a real implementation, this would be replaced with actual fetch calls
  
  if (url.includes('/api/placement')) {
    return {
      data: {
        module: "Columbus", 
        section: "C4", 
        location: "Shelf-3", 
        confidence: 92,
        alternatives: [
          {module: "Destiny", section: "D2", location: "Cabinet-1", confidence: 87},
          {module: "Harmony", section: "H5", location: "Drawer-9", confidence: 73}
        ]
      } as unknown as T
    };
  }
  
  if (url.includes('/api/search')) {
    return {
      data: [
        {itemId: "ISS-00123", name: "Medical Kit", module: "Columbus", section: "C2", location: "Drawer-5"},
        {itemId: "ISS-00456", name: "Food Container", module: "Unity", section: "U3", location: "Cabinet-2"}
      ] as unknown as T
    };
  }
  
  if (url.includes('/api/waste/identify')) {
    return {
      data: getMockWasteData() as unknown as T
    };
  }
  
  if (url.includes('/api/logs')) {
    return {
      data: [
        {timestamp: "2025-04-03T14:32:00Z", userId: "user1", actionType: "placement", itemId: "ISS-00123", itemName: "Medical Kit", location: "Columbus/C2/Drawer-5"},
        {timestamp: "2025-04-02T10:15:00Z", userId: "user2", actionType: "retrieval", itemId: "ISS-00456", itemName: "Food Container", location: "Unity/U3/Cabinet-2"}
      ] as unknown as T
    };
  }
  
  // Default response
  return {
    data: {success: true} as unknown as T
  };
}

// Placement Recommendations API
export async function getPlacementRecommendations(payload: any) {
  return handleRequest<any>('/api/placement', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Item Search and Retrieval API
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

// Waste Management API
export async function identifyWaste() {
  return handleRequest<any>('/api/waste/identify', {
    method: 'GET',
  });
}

// Time Simulation API
export async function simulateDay() {
  return handleRequest<any>('/api/simulate/day', {
    method: 'POST',
  });
}

// Import/Export API
export async function importItems(csvFile: File) {
  // Mock implementation
  console.log('Importing file:', csvFile.name);
  
  // Simulate API delay
  return new Promise<ApiResponse<any>>(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          itemsProcessed: 24,
          itemsAdded: 18,
          itemsUpdated: 6
        }
      });
    }, 1500);
  });
}

// Logging API
export async function getLogs(params: {
  startDate: string;
  endDate: string;
  itemId?: string;
  userId?: string;
  actionType?: 'placement' | 'retrieval' | 'rearrangement' | 'disposal';
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
