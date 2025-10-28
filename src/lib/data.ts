import type { Delivery, MerchantOrder, MenuItem } from './types';

export const deliveries: Delivery[] = [
  {
    id: 'DEL-001',
    customerName: 'Ana Silva',
    address: 'Av. Independência, 123, Taubaté, SP',
    restaurant: 'Pizzaria do Vale',
    status: 'in_transit',
    deadline: '2024-08-15T20:30:00Z',
    earnings: 7.50,
  },
  {
    id: 'DEL-002',
    customerName: 'Bruno Costa',
    address: 'Rua Visconde do Rio Branco, 456, Taubaté, SP',
    restaurant: 'Burgerama',
    status: 'pending',
    deadline: '2024-08-15T20:45:00Z',
    earnings: 6.00,
  },
  {
    id: 'DEL-003',
    customerName: 'Carlos Pereira',
    address: 'Praça Santa Terezinha, 789, Taubaté, SP',
    restaurant: 'Sushi Garden',
    status: 'pending',
    deadline: '2024-08-15T21:00:00Z',
    earnings: 8.25,
  },
  {
    id: 'DEL-004',
    customerName: 'Daniela Martins',
    address: 'Av. Itália, 101, Taubaté, SP',
    restaurant: 'Trattoria da Nonna',
    status: 'delivered',
    deadline: '2024-08-15T19:00:00Z',
    earnings: 5.50,
    deliveryTime: '2024-08-15T18:55:00Z',
    photo: 'https://picsum.photos/seed/p1/200/200'
  },
  {
    id: 'DEL-005',
    customerName: 'Eduardo Almeida',
    address: 'Rua Dr. Pedro Costa, 202, Taubaté, SP',
    restaurant: 'Padaria Pão de Ouro',
    status: 'delivered',
    deadline: '2024-08-15T19:30:00Z',
    earnings: 4.75,
    deliveryTime: '2024-08-15T19:20:00Z',
    photo: 'https://picsum.photos/seed/p2/200/200'
  },
  {
    id: 'DEL-006',
    customerName: 'Fernanda Lima',
    address: 'Rua Jacques Felix, 303, Taubaté, SP',
    restaurant: 'Açaí Mania',
    status: 'cancelled',
    deadline: '2024-08-15T19:45:00Z',
    earnings: 0,
  },
  {
    id: 'DEL-007',
    customerName: 'Gabriel Ribeiro',
    address: 'Estrada do Pinhão, 404, Taubaté, SP',
    restaurant: 'Restaurante Sabor da Roça',
    status: 'delivered',
    deadline: '2024-08-14T21:00:00Z',
    earnings: 9.00,
    deliveryTime: '2024-08-14T20:50:00Z',
    photo: 'https://picsum.photos/seed/p3/200/200'
  },
  {
    id: 'DEL-008',
    customerName: 'Helena Santos',
    address: 'Av. Charles Schnneider, 505, Taubaté, SP',
    restaurant: 'Esfiha Express',
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

export const initialMenuItems: MenuItem[] = [
    { id: 'item-1', name: 'Pizza Margherita', description: 'Molho de tomate, mussarela e manjericão fresco.', price: 45.00, category: 'Pizzas Salgadas', imageUrl: 'https://images.unsplash.com/photo-1595854337175-7420a42875af?q=80&w=1974&auto=format&fit=crop' },
    { id: 'item-2', name: 'Pizza Calabresa', description: 'Molho de tomate, mussarela, calabresa e cebola.', price: 48.50, category: 'Pizzas Salgadas', imageUrl: 'https://images.unsplash.com/photo-1593560704563-f176a2eb61db?q=80&w=2070&auto=format&fit=crop' },
    { id: 'item-3', name: 'Pizza Romeu e Julieta', description: 'Mussarela, goiabada e um toque de canela.', price: 52.00, category: 'Pizzas Doces', imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1974&auto=format&fit=crop' },
    { id: 'item-4', name: 'Coca-Cola 2L', description: 'Refrigerante Coca-Cola, garrafa de 2 litros.', price: 12.00, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=1964&auto=format&fit=crop' },
    { id: 'item-5', name: 'Água Mineral 500ml', description: 'Água sem gás.', price: 5.00, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1588253685165-17a864789574?q=80&w=1974&auto=format&fit=crop' },
];
