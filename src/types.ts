export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  specs: string[];
  description: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  priceDetails: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Repair {
  id: string;
  device: string;
  issue: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  receivedOn: string;
  estimatedDelivery: string;
  customerName: string;
  customerPhone: string;
  history: {
    title: string;
    date: string;
    time: string;
    completed: boolean;
  }[];
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  files?: string[]; // uploaded file names
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled' | 'Delivered';
  paymentMethod: 'M-PESA' | 'Card Payment' | 'Airtel Money';
  date: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}
