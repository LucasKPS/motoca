import type { Delivery, MerchantOrder } from './types';

export const deliveries: Delivery[] = [
  {
    id: 'DEL-001',
    customerName: 'Ana Silva',
    address: 'Rua das Flores, 123, São Paulo, SP',
    restaurant: 'Pizzaria Delícia',
    status: 'in_transit',
    deadline: '2024-08-15T20:30:00Z',
    earnings: 7.50,
  },
  {
    id: 'DEL-002',
    customerName: 'Bruno Costa',
    address: 'Avenida Paulista, 1500, São Paulo, SP',
    restaurant: 'Burger Queen',
    status: 'pending',
    deadline: '2024-08-15T20:45:00Z',
    earnings: 6.00,
  },
  {
    id: 'DEL-003',
    customerName: 'Carlos Pereira',
    address: 'Rua Augusta, 900, São Paulo, SP',
    restaurant: 'Sushi House',
    status: 'pending',
    deadline: '2024-08-15T21:00:00Z',
    earnings: 8.25,
  },
  {
    id: 'DEL-004',
    customerName: 'Daniela Martins',
    address: 'Praça da Sé, 1, São Paulo, SP',
    restaurant: 'Cantina Italiana',
    status: 'delivered',
    deadline: '2024-08-15T19:00:00Z',
    earnings: 5.50,
    deliveryTime: '2024-08-15T18:55:00Z',
    photo: 'https://picsum.photos/seed/p1/200/200'
  },
  {
    id: 'DEL-005',
    customerName: 'Eduardo Almeida',
    address: 'Rua Oscar Freire, 500, São Paulo, SP',
    restaurant: 'Padaria Pão Quente',
    status: 'delivered',
    deadline: '2024-08-15T19:30:00Z',
    earnings: 4.75,
    deliveryTime: '2024-08-15T19:20:00Z',
    photo: 'https://picsum.photos/seed/p2/200/200'
  },
  {
    id: 'DEL-006',
    customerName: 'Fernanda Lima',
    address: 'Avenida Faria Lima, 2232, São Paulo, SP',
    restaurant: 'Açaí Power',
    status: 'cancelled',
    deadline: '2024-08-15T19:45:00Z',
    earnings: 0,
  },
  {
    id: 'DEL-007',
    customerName: 'Gabriel Ribeiro',
    address: 'Av. Ibirapuera, 3103, São Paulo, SP',
    restaurant: 'Comida Mineira',
    status: 'delivered',
    deadline: '2024-08-14T21:00:00Z',
    earnings: 9.00,
    deliveryTime: '2024-08-14T20:50:00Z',
    photo: 'https://picsum.photos/seed/p3/200/200'
  },
  {
    id: 'DEL-008',
    customerName: 'Helena Santos',
    address: 'Rua 25 de Março, 1000, São Paulo, SP',
    restaurant: 'Esfiha Dourada',
    status: 'delivered',
    deadline: '2024-08-14T20:00:00Z',
    earnings: 6.80,
    deliveryTime: '2024-08-14T19:45:00Z',
    photo: 'https://picsum.photos/seed/p4/200/200'
  }
];

export const initialMerchantOrders: MerchantOrder[] = [
    { id: '#1138', customerName: 'Ana Silva', status: 'preparing', time: 'Há 2 min', total: 58.50, items: 2 },
    { id: '#1137', customerName: 'Bruno Costa', status: 'ready', time: 'Há 5 min', total: 35.00, items: 1 },
    { id: '#1136', customerName: 'Carlos Pereira', status: 'out_for_delivery', time: 'Há 12 min', total: 90.00, items: 4, courier: { name: 'João D.', rating: 4.8 } },
    { id: '#1135', customerName: 'Daniela Martins', status: 'delivered', time: 'Há 30 min', total: 25.00, items: 1, courier: { name: 'Maria S.', rating: 4.9 } },
    { id: '#1134', customerName: 'Eduardo Almeida', status: 'delivered', time: 'Há 45 min', total: 42.00, items: 3, courier: { name: 'João D.', rating: 4.8 } },
];
