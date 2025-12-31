
const BASE_URL = 'https://api.redseamart.et';

/**
 * Handles user login and returns the full response object.
 */
export const login = async (phone_number: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone_number, password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    let errorMessage = errorData.message || 'Login failed';

    // Check for nested error messages
    if (errorData.error?.errors?.[0]) {
      errorMessage = errorData.error.errors[0];
    }

    const error: any = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

/**
 * Fetches products nearby based on coordinates and radius.
 * Throws an error object containing the status code for auth validation.
 */
export const searchByCoordinates = async (lat: number, lng: number, radius: number, token: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/orders/search/by-coordinates?latitude=${lat}&longitude=${lng}&radius=${radius}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || 'Search failed';

    // Check for nested error messages
    if (errorData.error?.errors?.[0]) {
      errorMessage = errorData.error.errors[0];
    }

    const error: any = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

/**
 * Updates the status of an order.
 */
export const updateOrderStatus = async (id: string, status: string, token: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ id, status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || 'Failed to update order status';

    // Check for nested error messages
    if (errorData.error?.errors?.[0]) {
      errorMessage = errorData.error.errors[0];
    }

    const error: any = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return response.json();
};
