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
