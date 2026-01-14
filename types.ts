
export interface Location {
  lat: number;
  lng: number;
}

export type OrderState = 'idle' | 'shipping' | 'delivered';

export interface User {
  id: string;
  social_login: string | null;
  social_login_id: string | null;
  email: string | null;
  phone_number: string;
  first_name: string;
  last_name: string;
  status: string;
  type: string;
  pref_language: string;
  pref_currency: string;
  pref_unit: string;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role_id: string;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  lat: number;
  lng: number;
  is_default: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  distance?: number;
  user?: User;
}

export interface ProductImage {
  id: string;
  product_id: string;
  file_id: string;
  is_primary: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  file: {
    id: string;
    path: string;
  };
}

export interface Product {
  isFavorited: boolean;
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  rating: string;
  review_count: number;
  featured: boolean;
  trending: boolean;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product_images: ProductImage[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product: Product | null;
}

export interface PaymentMethod {
  id: string;
  name: string;
  // Add other payment method fields as needed
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  payment_status: string;
  status: string;
  address_id: string;
  payment_method_id: string | null;
  subtotal: string;
  shipping_fee: string;
  tax: string;
  total: string;
  estimated_delivery: string | null;
  promo_code_id: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address: Address;
  items: OrderItem[];
  payment_method: PaymentMethod | null;
}

export interface OrdersResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: Order[];
  };
}

export type RadiusOption = 1 | 3 | 5 | 10 | 20;
