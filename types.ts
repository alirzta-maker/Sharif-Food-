import React from 'react';

export enum Role {
  GIR = 'GIR', // Customer - Red
  BAR = 'BAR', // Rider - Blue
  NONE = 'NONE',
}

export type Language = 'en' | 'fa';

export interface Bilingual {
  en: string;
  fa: string;
}

export interface MenuItem {
  id: string;
  name: Bilingual;
  price: number;
  restaurantId: string;
  category: { en: string, fa: string };
  thumbnailUrl?: string;
  popularity?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface MenuCategory {
  title: Bilingual;
  items: MenuItem[];
}

export type RestaurantType = 'menu' | 'self-service' | 'external';

export interface Restaurant {
  id: string;
  name: Bilingual;
  type: RestaurantType;
  logo: React.FC;
  categories: { en: string[]; fa: string[] };
  menu?: MenuCategory[];
  url?: string;
  popularity: number;
}

// Represents the courier's public profile
export interface CourierProfile {
  id: string; // Same as user ID
  fullName: string;
  profilePictureUrl: string;
  bankCardNumber: string; // Full bank card number for manual payment
  phone: string;
  vehicle: string;
  rating: number;
}

// Detailed Order Status for State Machine
export enum OrderFlowStatus {
  SEARCHING_FOR_COURIER = 'SEARCHING_FOR_COURIER',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  DELIVERY_IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  CANCELLED_BY_COURIER = 'CANCELLED_BY_COURIER',
  EXPIRED_NO_COURIER = 'EXPIRED_NO_COURIER',
  AWAITING_CUSTOMER_CONFIRMATION = 'AWAITING_CUSTOMER_CONFIRMATION', // New state for two-way delivery confirm
}

// FIX: Add missing enums and interfaces
export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
}

export interface RestaurantOrder {
  id: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: OrderStatus;
}

export enum DeliveryStatus {
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
}

export interface Delivery {
  id: string;
  restaurantName: string;
  customerAddress: string;
  status: DeliveryStatus;
  earnings: number;
}

export enum UserRole {
  CUSTOMER,
  RESTAURANT,
  RIDER,
}

export interface RiderJob {
  id: string;
  orderId?: string;
  requestId?: string;
  status: 'pending' | 'accepted' | 'completed';
  riderId?: string;
  restaurantName: Bilingual;
  pickup: string;
  destination: string;
  items: string;
  timestamps: {
    accepted?: number;
    pickedUp?: number;
    delivered?: number;
  };
  isRequest: boolean;
}

export interface DeliveryOrder {
  restaurantName: Bilingual;
  userName: string;
  orderCode?: string;
  items: string;
  pickup: string;
  destination: string;
  price: number;
}

export interface RequestDeliveryJob {
  sourceRestaurantId: string;
  requestedByUserId: string;
  foodName: string;
  price: number;
  pickupPoint: string;
  deliveryPoint: string;
}

export interface DeliveryLocation {
  id: string;
  name: Bilingual;
  fee: number;
}

export interface Order {
    id: string;
    code: string;
    userId: string;
    items: CartItem[];
    deliveryFee: number;
    total: number;
    status: OrderFlowStatus;
    timestamp: number;
    restaurantName: Bilingual;
    courier?: CourierProfile; // Assigned courier info
    estimatedDeliveryTime?: number; // ETA in minutes
    cancellationReason?: string;
    // FIX: Add optional diningHall for self-service orders
    diningHall?: Bilingual;
    isPaymentConfirmedByCustomer?: boolean; // New: To track if customer marked payment
    customerNotes?: string; // New: Special instructions from customer
    customerPhone?: string; // New: Customer contact phone for delivery
    deliveryLocation?: DeliveryLocation; // New: Selected delivery location with its fee
    promoCodeApplied?: string; // New: The promo code applied
    discountAmount?: number; // New: The amount of discount applied
}

// Represents an available job for a courier
export interface DeliveryJob {
  id: string; // Corresponds to the Order ID
  restaurantName: Bilingual;
  pickupPoint: string;
  deliveryPoint: string;
  itemsSummary: string;
  earnings: number;
  expiresAt: number; // Timestamp when the request expires
  customerNotes?: string; // New: Special instructions from customer
  customerPhone?: string; // New: Customer contact phone for delivery
  deliveryLocation?: DeliveryLocation; // New: Selected delivery location with its fee
  promoCodeApplied?: string; // New: The promo code applied
  discountAmount?: number; // New: The amount of discount applied
}

export interface ActiveDelivery extends DeliveryJob {
    customerName: string;
    customerPhone: string;
    status: 'AWAITING_PAYMENT' | 'AT_RESTAURANT' | 'PICKED_UP' | 'ON_THE_WAY' | 'AWAITING_CUSTOMER_CONFIRMATION';
    isPaymentConfirmedByCustomer?: boolean; // New: To track if customer marked payment
}


export type Translations = {
  [key: string]: Bilingual;
};

export interface User {
  id: string;
  fullName: string;
  studentId: string;
  emailOrPhone: string;
  role: Role;
  referralCode?: string;
}

export interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  activeOrder: Order | null;
  setActiveOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}