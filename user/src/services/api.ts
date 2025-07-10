const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Product API
export const productAPI = {
  // Get all products (public)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/products/public?${searchParams}`);
    return handleResponse(response);
  },

  // Get single product (public)
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/public/${id}`);
    return handleResponse(response);
  },

  // Get featured products (public)
  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/products/public/featured`);
    return handleResponse(response);
  },

  // Get categories (public)
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/products/public/categories/all`);
    return handleResponse(response);
  },

  // Get brands (public)
  getBrands: async () => {
    const response = await fetch(`${API_BASE_URL}/products/public/brands/all`);
    return handleResponse(response);
  },
};

// Auth API
export const authAPI = {
  // Login
  login: async (payload: { email?: string; username?: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  // Register
  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Gửi OTP về email
  sendOtp: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // Xác thực OTP
  verifyOtp: async (email: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    return handleResponse(response);
  },
};

// Order API
export const orderAPI = {
  // Create order
  create: async (orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: string;
    paymentMethod: string;
    totalAmount: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/orders/user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/user`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get order by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/user/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Customer API
export const customerAPI = {
  // Update profile
  updateProfile: async (profileData: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/customers/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Get profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/customers/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Review API
export const reviewAPI = {
  // Create review
  create: async (reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  // Get product reviews
  getProductReviews: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
    return handleResponse(response);
  },

  // Create shop review
  createShop: async (reviewData: { rating: number; content: string }) => {
    const response = await fetch(`${API_BASE_URL}/reviews/shop`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  // Get shop reviews
  getShopReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews/shop`);
    return handleResponse(response);
  },
};

// Sales Event API
export const salesEventAPI = {
  // Get all events
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/sales-events/public`);
    return handleResponse(response);
  },

  // Get event by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/sales-events/public/${id}`);
    return handleResponse(response);
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};

// Message API
export const messageAPI = {
  // Lấy lịch sử chat với 1 user (admin)
  getMessages: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  // Gửi tin nhắn
  sendMessage: async (to: string, content: string) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ to, content }),
    });
    return handleResponse(response);
  },
};

// Challenge API
export const challengeAPI = {
  // Get all challenges
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/challenges/public`);
    return handleResponse(response);
  },
};

// Address API
export const addressAPI = {
  // Get provinces
  getProvinces: async () => {
    const response = await fetch(`${API_BASE_URL}/addresses/provinces`);
    return handleResponse(response);
  },

  // Get districts by province
  getDistricts: async (provinceCode: string) => {
    const response = await fetch(`${API_BASE_URL}/addresses/districts/${provinceCode}`);
    return handleResponse(response);
  },

  // Get wards by district
  getWards: async (districtCode: string) => {
    const response = await fetch(`${API_BASE_URL}/addresses/wards/${districtCode}`);
    return handleResponse(response);
  },

  // Search addresses
  search: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/addresses/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },

  // Get address by code
  getByCode: async (code: string) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${code}`);
    return handleResponse(response);
  },
}; 