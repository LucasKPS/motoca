export type Delivery = {
  id: string;
  customerName: string;
  address: string;
  restaurant: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  deadline: string;
  photo?: string;
  earnings: number;
  deliveryTime?: string;
};

export type Order = {
    id: string;
    restaurant: string;
    date: string;
    status: 'in_transit' | 'delivered' | 'cancelled';
    total: number;
    rating?: number;
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
