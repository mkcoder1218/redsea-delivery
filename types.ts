
export interface Location {
  lat: number;
  lng: number;
}

export type OrderState = 'idle' | 'shipping' | 'delivered';

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    price: string;
    product_images: {
      file: {
        path: string;
      }
    }[];
  };
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total: string;
  address: {
    address_line1: string;
    city: string;
    lat: number;
    lng: number;
    distance?: number;
  };
  order_items: OrderItem[];
}

// For compatibility with components expecting "Product" shape
export interface Product extends Order {}

export type RadiusOption = 1 | 3 | 5 | 10 | 20;
