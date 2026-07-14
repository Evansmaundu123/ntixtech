import { Product, Service, Repair, Booking, Order, User } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-hp-pavilion',
    name: 'HP Pavilion 15 Laptop',
    price: 85000,
    oldPrice: 92000,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80',
    category: 'Laptops',
    brand: 'HP',
    rating: 4.8,
    reviewsCount: 18,
    inStock: true,
    specs: [
      'Intel Core i5 11th Gen',
      '8GB RAM, 512GB SSD',
      '15.6" FHD Display',
      'Windows 11 Home',
      '1 Year Warranty'
    ],
    description: 'The HP Pavilion 15 is designed for performance and productivity. Powerful processing, fast storage and stunning display make it perfect for work, study and entertainment.'
  },
  {
    id: 'prod-dell-inspiron',
    name: 'Dell Inspiron 15 3000',
    price: 79000,
    oldPrice: 85000,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=80',
    category: 'Laptops',
    brand: 'Dell',
    rating: 4.5,
    reviewsCount: 12,
    inStock: true,
    specs: [
      'Intel Core i3 11th Gen',
      '8GB DDR4 RAM',
      '256GB NVMe SSD',
      '15.6" HD Anti-Glare',
      'Windows 11 Pro'
    ],
    description: 'A stylish and reliable everyday laptop designed to keep you connected. Powered by Intel processors with smart thermal management.'
  },
  {
    id: 'prod-lenovo-ideapad',
    name: 'Lenovo IdeaPad 3',
    price: 72000,
    oldPrice: 78000,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&auto=format&fit=crop&q=80',
    category: 'Laptops',
    brand: 'Lenovo',
    rating: 4.3,
    reviewsCount: 25,
    inStock: true,
    specs: [
      'AMD Ryzen 5 5500U',
      '8GB Soldered RAM',
      '512GB SSD M.2',
      '15.6" FHD Display',
      'Integrated AMD Radeon Graphics'
    ],
    description: 'Lenovo IdeaPad 3 raises the bar on what an everyday laptop can do. Enjoy crystal-clear visuals and immersive audio.'
  },
  {
    id: 'prod-asus-vivobook',
    name: 'Asus VivoBook 15',
    price: 88000,
    oldPrice: 95000,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&auto=format&fit=crop&q=80',
    category: 'Laptops',
    brand: 'Asus',
    rating: 4.6,
    reviewsCount: 15,
    inStock: true,
    specs: [
      'Intel Core i5 12th Gen',
      '16GB DDR4 RAM',
      '512GB PCIe G3 SSD',
      '15.6" Slim-Bezel FHD',
      'Backlit Keyboard'
    ],
    description: 'With its standout colors and color-blocking Enter key, ASUS VivoBook 15 adds flair and dynamism to daily computing.'
  },
  {
    id: 'prod-acer-aspire',
    name: 'Acer Aspire 5',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1525373612132-b3e82467b511?w=400&auto=format&fit=crop&q=80',
    category: 'Laptops',
    brand: 'Acer',
    rating: 4.4,
    reviewsCount: 9,
    inStock: true,
    specs: [
      'Intel Core i5 11th Gen',
      '8GB DDR4 RAM',
      '512GB SSD Storage',
      '15.6" FHD IPS Display',
      'Wi-Fi 6 Support'
    ],
    description: 'The multiple available colors of this fashionable laptop hide a choice of powerful processors and graphics which will help users make the most of the screen.'
  },
  {
    id: 'prod-macbook-air',
    name: 'MacBook Air M1',
    price: 165000,
    oldPrice: 180000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
    category: 'Laptops',
    brand: 'Apple',
    rating: 4.9,
    reviewsCount: 42,
    inStock: true,
    specs: [
      'Apple M1 Chip with 8-Core CPU',
      '8GB Unified Memory',
      '256GB Superfast SSD',
      '13.3-inch Retina display',
      'Up to 18 hours battery life'
    ],
    description: 'Apples thinnest, lightest notebook, completely transformed by the Apple M1 chip. CPU speeds up to 3.5x faster. Graphics speeds up to 5x faster.'
  },
  {
    id: 'prod-logitech-mouse',
    name: 'Logitech Wireless Mouse',
    price: 2500,
    oldPrice: 3200,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80',
    category: 'Accessories',
    brand: 'Logitech',
    rating: 4.7,
    reviewsCount: 54,
    inStock: true,
    specs: [
      '2.4GHz Wireless Connection',
      '12-Month Battery Life',
      'Ambidextrous Design',
      'Optical Tracking 1000 DPI'
    ],
    description: 'Reliable wireless performance with tiny plug-and-forget nano receiver. Offers smooth, responsive tracking.'
  },
  {
    id: 'prod-canon-printer',
    name: 'Canon G3411 Pixma Printer',
    price: 19000,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&auto=format&fit=crop&q=80',
    category: 'Printers',
    brand: 'Canon',
    rating: 4.5,
    reviewsCount: 33,
    inStock: true,
    specs: [
      'Print, Copy, Scan & Wi-Fi',
      'High Yield Refillable Ink Tanks',
      'Borderless Printing Support',
      'Pigment Black & Dye Color Inks'
    ],
    description: 'A highly efficient and versatile multi-function printer with high yield ink bottles, perfect for low cost, high quality document and photo printing at home or office.'
  },
  {
    id: 'prod-ssd-480gb',
    name: 'Kingston 480GB SATA SSD',
    price: 8400,
    oldPrice: 10500,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80',
    category: 'Storage',
    brand: 'Kingston',
    rating: 4.8,
    reviewsCount: 88,
    inStock: true,
    specs: [
      'SATA Rev. 3.0 (6Gb/s)',
      '500MB/s Read, 450MB/s Write',
      '10x faster than traditional HDD',
      'Shock and vibration resistant'
    ],
    description: 'Kingstons A400 solid-state drive dramatically improves the responsiveness of your existing system with incredible boot, loading and transfer times.'
  },
  {
    id: 'prod-laptop-bag',
    name: 'HP 15.6" Laptop Bag',
    price: 1800,
    oldPrice: 2400,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80',
    category: 'Accessories',
    brand: 'HP',
    rating: 4.4,
    reviewsCount: 19,
    inStock: true,
    specs: [
      'Padded Laptop Pocket',
      'Water-Resistant Material',
      'Adjustable Shoulder Strap',
      'Quick-Access Front Pocket'
    ],
    description: 'Keep your laptop safe from bumps and scrapes during commute with this durable, lightweight and stylish water-resistant shoulder bag.'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-internet',
    name: 'Internet Access',
    description: 'High-speed internet & computer access for browsing, research, typing, and printing.',
    icon: 'Wifi',
    priceDetails: 'KSh 1 per min'
  },
  {
    id: 'serv-printing',
    name: 'Printing Services',
    description: 'B&W, Color, Large format & photo printing with professional quality paper.',
    icon: 'Printer',
    priceDetails: 'From KSh 5 / page'
  },
  {
    id: 'serv-photocopy',
    name: 'Photocopying',
    description: 'Bulk black-and-white or high-fidelity color photocopying services.',
    icon: 'Copy',
    priceDetails: 'From KSh 2 / copy'
  },
  {
    id: 'serv-scanning',
    name: 'Scanning Services',
    description: 'Document scan & image digitization to PDF, JPEG directly to email/flash drive.',
    icon: 'FileText',
    priceDetails: 'KSh 10 / document'
  },
  {
    id: 'serv-repair',
    name: 'Laptop & PC Repair',
    description: 'Hardware diagnostics, screen repair, keyboard replacement, chip-level troubleshooting.',
    icon: 'Cpu',
    priceDetails: 'From KSh 1,000'
  },
  {
    id: 'serv-os',
    name: 'OS Installation',
    description: 'Windows 10/11 & Linux setup, system optimization, anti-virus installation.',
    icon: 'MonitorCheck',
    priceDetails: 'KSh 1,500'
  },
  {
    id: 'serv-gaming',
    name: 'Gaming Zone',
    description: 'High-end PC and console gaming lounge with ultra-fast displays and comfortable seating.',
    icon: 'Gamepad2',
    priceDetails: 'KSh 150 / hour'
  },
  {
    id: 'serv-graphic',
    name: 'Graphic Design',
    description: 'Custom logos, posters, flyers, business cards, letterheads, and brand identities.',
    icon: 'Palette',
    priceDetails: 'From KSh 1,000'
  },
  {
    id: 'serv-cctv',
    name: 'CCTV Installation',
    description: 'Expert residential and commercial security camera setup and configuration.',
    icon: 'Video',
    priceDetails: 'From KSh 15,000'
  },
  {
    id: 'serv-networking',
    name: 'Networking',
    description: 'Wi-Fi setups, office LAN wiring, router configurations & network security audits.',
    icon: 'Network',
    priceDetails: 'From KSh 5,000'
  },
  {
    id: 'serv-data',
    name: 'Data Recovery',
    description: 'Professional recovery of lost documents, photos, and files from dead HDDs/flash drives.',
    icon: 'HardDrive',
    priceDetails: 'From KSh 2,500'
  }
];

export const INITIAL_REPAIRS: Repair[] = [
  {
    id: 'RP123456',
    device: 'HP Pavilion 15 Laptop',
    issue: 'Screen Flickering',
    status: 'In Progress',
    receivedOn: '19 May, 2026',
    estimatedDelivery: '24 May, 2026',
    customerName: 'John Doe',
    customerPhone: '0111915606',
    history: [
      { title: 'Request Received', date: '10 May, 2026', time: '11:15 AM', completed: true },
      { title: 'Device Inspection', date: '12 May, 2026', time: '16:30 PM', completed: true },
      { title: 'Repair in Progress', date: '20 May, 2026', time: '11:00 AM', completed: true },
      { title: 'Quality Check', date: 'Pending', time: '', completed: false },
      { title: 'Ready for Pickup/Delivery', date: 'Pending', time: '', completed: false }
    ]
  },
  {
    id: 'RP987654',
    device: 'MacBook Air M1',
    issue: 'Keyboard fluid damage & key replacements',
    status: 'Completed',
    receivedOn: '12 May, 2026',
    estimatedDelivery: '15 May, 2026',
    customerName: 'Sarah Wanjiku',
    customerPhone: '+254 722 000 111',
    history: [
      { title: 'Request Received', date: '12 May, 2026', time: '09:00 AM', completed: true },
      { title: 'Device Inspection', date: '12 May, 2026', time: '11:30 AM', completed: true },
      { title: 'Repair in Progress', date: '13 May, 2026', time: '14:00 PM', completed: true },
      { title: 'Quality Check', date: '14 May, 2026', time: '10:00 AM', completed: true },
      { title: 'Ready for Pickup/Delivery', date: '15 May, 2026', time: '12:00 PM', completed: true }
    ]
  },
  {
    id: 'RP246810',
    device: 'Dell Inspiron 15 3000',
    issue: 'Battery replacement & RAM upgrade',
    status: 'Pending',
    receivedOn: '13 May, 2026',
    estimatedDelivery: '16 May, 2026',
    customerName: 'Michael Mwangi',
    customerPhone: '+254 733 444 555',
    history: [
      { title: 'Request Received', date: '13 May, 2026', time: '15:10 PM', completed: true },
      { title: 'Device Inspection', date: 'Pending', time: '', completed: false },
      { title: 'Repair in Progress', date: 'Pending', time: '', completed: false },
      { title: 'Quality Check', date: 'Pending', time: '', completed: false },
      { title: 'Ready for Pickup/Delivery', date: 'Pending', time: '', completed: false }
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    serviceId: 'serv-printing',
    serviceName: 'Printing Services',
    customerName: 'John Doe',
    customerEmail: 'maunduevans2004@gmail.com',
    customerPhone: '0111915606',
    date: '2026-05-20',
    time: '10:00 AM',
    status: 'Confirmed',
    notes: 'Thesis printing, 150 pages double-sided. Need premium quality paper.'
  },
  {
    id: 'BK-1002',
    serviceId: 'serv-internet',
    serviceName: 'Internet Access',
    customerName: 'John Doe',
    customerEmail: 'maunduevans2004@gmail.com',
    customerPhone: '0111915606',
    date: '2026-05-21',
    time: '11:00 AM',
    status: 'Confirmed'
  },
  {
    id: 'BK-1003',
    serviceId: 'serv-graphic',
    serviceName: 'Graphic Design',
    customerName: 'Alice Muthoni',
    customerEmail: 'alice@domain.com',
    customerPhone: '+254 799 111 222',
    date: '2026-05-22',
    time: '02:00 PM',
    status: 'Pending',
    notes: 'Business card design and printing mockup.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#NT1001',
    customerName: 'John Doe',
    email: 'maunduevans2004@gmail.com',
    phone: '0111915606',
    address: 'Nairobi West, Apartment 4B',
    city: 'Nairobi',
    county: 'Nairobi',
    items: [
      {
        productId: 'prod-hp-pavilion',
        productName: 'HP Pavilion 15 Laptop',
        price: 85000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 85000,
    deliveryFee: 300,
    total: 85300,
    status: 'Delivered',
    paymentMethod: 'M-PESA',
    date: '12 May, 2026'
  },
  {
    id: '#NT1002',
    customerName: 'John Doe',
    email: 'maunduevans2004@gmail.com',
    phone: '0111915606',
    address: 'Nairobi West, Apartment 4B',
    city: 'Nairobi',
    county: 'Nairobi',
    items: [
      {
        productId: 'prod-logitech-mouse',
        productName: 'Logitech Wireless Mouse',
        price: 2500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 2500,
    deliveryFee: 300,
    total: 2800,
    status: 'Delivered',
    paymentMethod: 'M-PESA',
    date: '11 May, 2026'
  },
  {
    id: '#NT1003',
    customerName: 'John Doe',
    email: 'maunduevans2004@gmail.com',
    phone: '0111915606',
    address: 'Nairobi West, Apartment 4B',
    city: 'Nairobi',
    county: 'Nairobi',
    items: [
      {
        productId: 'prod-laptop-bag',
        productName: 'HP 15.6" Laptop Bag',
        price: 1800,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 1800,
    deliveryFee: 300,
    total: 2100,
    status: 'Completed',
    paymentMethod: 'Airtel Money',
    date: '10 May, 2026'
  }
];

// Helper functions for reading and writing to localStorage
export function getDataStore() {
  if (typeof window === 'undefined') {
    return {
      products: INITIAL_PRODUCTS,
      services: INITIAL_SERVICES,
      repairs: INITIAL_REPAIRS,
      bookings: INITIAL_BOOKINGS,
      orders: INITIAL_ORDERS,
      user: null as User | null
    };
  }

  const products = localStorage.getItem('nt_products') 
    ? JSON.parse(localStorage.getItem('nt_products')!) 
    : INITIAL_PRODUCTS;

  const services = localStorage.getItem('nt_services') 
    ? JSON.parse(localStorage.getItem('nt_services')!) 
    : INITIAL_SERVICES;

  const repairs = localStorage.getItem('nt_repairs') 
    ? JSON.parse(localStorage.getItem('nt_repairs')!) 
    : INITIAL_REPAIRS;

  const bookings = localStorage.getItem('nt_bookings') 
    ? JSON.parse(localStorage.getItem('nt_bookings')!) 
    : INITIAL_BOOKINGS;

  const orders = localStorage.getItem('nt_orders') 
    ? JSON.parse(localStorage.getItem('nt_orders')!) 
    : INITIAL_ORDERS;

  const userJson = localStorage.getItem('nt_user');
  let user: User | null = null;
  if (userJson) {
    user = JSON.parse(userJson);
  } else {
    // default logged in user is John Doe as shown in screens
    user = {
      id: 'usr-johndoe',
      fullName: 'John Doe',
      email: 'maunduevans2004@gmail.com',
      phone: '0111915606',
      isAdmin: false
    };
    localStorage.setItem('nt_user', JSON.stringify(user));
  }

  return { products, services, repairs, bookings, orders, user };
}

export function saveDataStore(data: {
  products?: Product[];
  services?: Service[];
  repairs?: Repair[];
  bookings?: Booking[];
  orders?: Order[];
  user?: User | null;
}) {
  if (typeof window === 'undefined') return;

  if (data.products) localStorage.setItem('nt_products', JSON.stringify(data.products));
  if (data.services) localStorage.setItem('nt_services', JSON.stringify(data.services));
  if (data.repairs) localStorage.setItem('nt_repairs', JSON.stringify(data.repairs));
  if (data.bookings) localStorage.setItem('nt_bookings', JSON.stringify(data.bookings));
  if (data.orders) localStorage.setItem('nt_orders', JSON.stringify(data.orders));
  if (data.user !== undefined) {
    if (data.user === null) {
      localStorage.removeItem('nt_user');
    } else {
      localStorage.setItem('nt_user', JSON.stringify(data.user));
    }
  }
}
