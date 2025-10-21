export interface Delivery {
  id: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  restaurant: string;
  dish: string;
  address: string;
  customerName: string;
  courier: string;
  createdAt: string;
  earnings: number;
};

export type Order = {
    id: string;
    restaurant: string;
    date: string;
    total: number;
    status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
    items: { id: number, name: string, price: number, quantity: number }[];
    rating: number;
    createdAt: number; 
    deliveryAddress: string;
}

export type MerchantOrder = {
  id: string;
  customerName: string;
  status: 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
  time: string;
  total: number;
  items: number;
  courier?: {
    name: string;
    rating: number;
  }
}

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
}
