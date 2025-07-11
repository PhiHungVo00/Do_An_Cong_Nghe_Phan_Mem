const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('shipper_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const shipperApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
  getAvailableOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/shipper/available`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  getAssignedOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/shipper/assigned`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  getDeliveredOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/shipper/delivered`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  acceptOrder: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/shipper/accept/${orderId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  rejectOrder: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/shipper/reject/${orderId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  deliveredOrder: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/shipper/delivered/${orderId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/shipper/status/${orderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
  confirmDelivery: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/shipper/delivered/${orderId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
}; 