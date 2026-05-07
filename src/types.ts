export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  price: number;
  description: string;
  dosageInfo: string;
  manufacturer: string;
  stock: number;
  image: string;
  prescriptionRequired: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CartItem extends Medicine {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: {
    street: string;
    city: string;
    phone: string;
  };
  paymentMethod: 'COD';
  prescriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  userId: string;
  imageUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  createdAt: string;
}
