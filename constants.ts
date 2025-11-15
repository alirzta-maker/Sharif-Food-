import React from 'react';
// FIX: Import new types that were missing, including MenuItem.
import { MenuCategory, Restaurant, RestaurantOrder, OrderStatus, Delivery, DeliveryStatus, MenuItem } from './types';
import { RESTAURANTS } from './data'; // Import RESTAURANTS from data.ts

// FIX: Helper component for logos to satisfy React.FC type for logo properties and fix JSX-related errors.
const Logo: React.FC<{char: string}> = ({char}) => React.createElement("span", {className: "text-5xl"}, char);

// FIX: `restaurants` array is now imported from `data.ts`
export const restaurants: Restaurant[] = RESTAURANTS;


export const CATEGORY_ICONS: { [key: string]: string } = {
  'Iranian': '🍛',
  'Pizza': '🍕',
  'Fast Food': '🍔',
  'Desserts': '🍰',
  'Drinks': '🥤',
  'Pasta': '🍝',
  'Burgers': '🍔',
  'Sandwiches': '🥪',
  'Appetizers': '🍟',
  'Cafe': '☕',
  'Salad': '🥗', // Changed from 'Salad Bar' to 'Salad' for consistency
  'Breakfast': '🍳',
  'Snacks': '🥨',
  'Healthy': '🥦',
  'Add-ons': '➕',
  'Delivery': '🛵',
  'Earnings': '💳',
  'Active Orders': '⚡',
  'Delivered': '✅',
};

export const MOCK_RESTAURANT_ORDERS: RestaurantOrder[] = [
    { id: '101', customerName: 'Ali', items: [{name: 'پیتزا مخصوص', quantity: 2}, {name: 'سیب زمینی', quantity: 1}], total: 495000, status: OrderStatus.PENDING },
    { id: '102', customerName: 'Sara', items: [{name: 'چیز برگر', quantity: 1}], total: 190000, status: OrderStatus.PENDING },
    { id: '103', customerName: 'Mina', items: [{name: 'پاستا چیکن آلفردو', quantity: 1}, {name: 'نان سیر', quantity: 1}], total: 300000, status: OrderStatus.ACCEPTED },
    { id: '104', customerName: 'Reza', items: [{name: 'پیتزا پپرونی', quantity: 3}], total: 570000, status: OrderStatus.PREPARING },
];

export const MOCK_DELIVERIES: Delivery[] = [
    { id: 'D01', restaurantName: 'شریف فست فود', customerAddress: 'No. 123, Azadi St.', status: DeliveryStatus.ASSIGNED, earnings: 15000 },
    { id: 'D02', restaurantName: 'شریف پلاس', customerAddress: 'No. 456, Enghelab Ave.', status: DeliveryStatus.PICKED_UP, earnings: 20000 },
    { id: 'D03', restaurantName: 'شریف فست فود', customerAddress: 'No. 789, Valiasr St.', status: DeliveryStatus.ON_THE_WAY, earnings: 18000 },
    { id: 'D04', restaurantName: 'شریف پلاس', customerAddress: 'No. 101, Pasdaran Blvd.', status: DeliveryStatus.DELIVERED, earnings: 22000 },
];