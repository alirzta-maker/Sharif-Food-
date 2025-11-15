// FIX: Import MenuItem, RequestDeliveryJob, and DeliveryLocation types
import { Order, RequestDeliveryJob, Role, OrderFlowStatus, CartItem, Bilingual, CourierProfile, DeliveryJob, ActiveDelivery, MenuItem, DeliveryLocation } from './types';
import { MOCK_RIDER_JOBS, RESTAURANTS, ALL_ITEMS, DELIVERY_LOCATIONS_DATA } from './data';

// --- MOCK DATABASE & STATE ---
let mockOrders: Order[] = [];
let mockAvailableJobs: DeliveryJob[] = [];
let mockActiveDeliveries: ActiveDelivery[] = [];
const MOCK_COURIER_PROFILE: CourierProfile = {
  id: 'rider-007',
  fullName: 'Ali Ahmadi',
  profilePictureUrl: 'https://i.pravatar.cc/150?u=ali.ahmadi',
  bankCardNumber: '6037-9911-2233-4455', // Full bank card number for manual payment
  phone: '+989123456789',
  vehicle: 'Motorcycle',
  rating: 4.8,
};

// --- API STUBS ---
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  // Customer-facing API
  // FIX: Update createOrder to accept optional diningHall, customer notes, phone, delivery location, promo code, and discount amount
  async createOrder(payload: {
    userId: string;
    items: CartItem[];
    deliveryFee: number;
    total: number;
    restaurantName: Bilingual;
    diningHall?: Bilingual;
    customerNotes?: string;
    customerPhone?: string;
    deliveryLocation?: DeliveryLocation;
    promoCodeApplied?: string;
    discountAmount?: number;
  }): Promise<Order> {
    await networkDelay(1000);
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      code: `SHF-${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
      userId: payload.userId,
      items: payload.items,
      deliveryFee: payload.deliveryFee,
      total: payload.total,
      restaurantName: payload.restaurantName,
      status: OrderFlowStatus.SEARCHING_FOR_COURIER,
      timestamp: Date.now(),
      diningHall: payload.diningHall,
      isPaymentConfirmedByCustomer: false, // New: Customer hasn't confirmed payment yet
      customerNotes: payload.customerNotes,
      customerPhone: payload.customerPhone,
      deliveryLocation: payload.deliveryLocation,
      promoCodeApplied: payload.promoCodeApplied,
      discountAmount: payload.discountAmount,
    };
    mockOrders.push(newOrder);

    // Create a corresponding job for couriers, only if it's not a self-service order
    if (!payload.diningHall) {
        const newJob: DeliveryJob = {
          id: newOrder.id,
          restaurantName: payload.restaurantName,
          pickupPoint: payload.restaurantName.en, // Simplified
          deliveryPoint: payload.deliveryLocation?.name.en || 'Unknown Location', // Use selected delivery location
          itemsSummary: payload.items.map(i => `${i.quantity}x ${i.name.en}`).join(', '),
          earnings: Math.round(payload.deliveryFee * 0.8), // Courier gets 80% of the fee
          expiresAt: Date.now() + 60000, // Expires in 60 seconds
          customerNotes: payload.customerNotes,
          customerPhone: payload.customerPhone,
          deliveryLocation: payload.deliveryLocation,
          promoCodeApplied: payload.promoCodeApplied,
          discountAmount: payload.discountAmount,
        };
        mockAvailableJobs.push(newJob);
    }

    return newOrder;
  },

  async getOrderStatus(orderId: string): Promise<Order | undefined> {
    await networkDelay(200);
    return mockOrders.find(o => o.id === orderId);
  },

  async customerConfirmPayment(orderId: string): Promise<{ success: boolean }> {
      await networkDelay(1000); // Simulate network delay for payment processing
      const order = mockOrders.find(o => o.id === orderId);
      const delivery = mockActiveDeliveries.find(d => d.id === orderId);
      
      if (order && delivery) {
          order.isPaymentConfirmedByCustomer = true; // Customer has marked as paid
          delivery.isPaymentConfirmedByCustomer = true; // Reflect for courier's view
          // Status for courier remains AWAITING_PAYMENT until courier confirms
          return { success: true };
      }
      return { success: false };
  },

  async cancelOrder(orderId: string, reason?: string): Promise<{ success: boolean }> {
      await networkDelay(400);
      const order = mockOrders.find(o => o.id === orderId);
      if (order) {
          order.status = OrderFlowStatus.CANCELLED_BY_USER;
          order.cancellationReason = reason;
          // Also cancel the job if it exists
          mockAvailableJobs = mockAvailableJobs.filter(j => j.id !== orderId);
          mockActiveDeliveries = mockActiveDeliveries.filter(d => d.id !== orderId);
          return { success: true };
      }
      return { success: false };
  },

  async customerConfirmDelivery(orderId: string): Promise<{ success: boolean }> {
      await networkDelay(800);
      const order = mockOrders.find(o => o.id === orderId);
      // The delivery should ideally be removed from mockActiveDeliveries once the courier marks it as DELIVERED
      // However, for customer confirmation, we still need to reference the order.
      
      if (order && order.status === OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION) {
          order.status = OrderFlowStatus.DELIVERED;
          // Remove from active deliveries for courier if it was still there
          mockActiveDeliveries = mockActiveDeliveries.filter(d => d.id !== orderId);
          return { success: true };
      }
      return { success: false };
  },

  async applyPromoCode(code: string, subtotal: number): Promise<{ success: boolean; discountAmount: number; message?: string }> {
      await networkDelay(500); // Simulate network delay
      if (code === 'SHARIF30') {
          const discount = Math.round(subtotal * 0.30); // 30% discount
          return { success: true, discountAmount: discount, message: '30% discount applied!' };
      } else if (code === 'TEST20') {
          const discount = Math.round(subtotal * 0.20); // 20% discount
          return { success: true, discountAmount: discount, message: '20% discount applied!' };
      } else if (code === 'FREEDELIVERY') {
          // This promo code might change the delivery fee, handled differently
          return { success: true, discountAmount: 0, message: 'Free delivery applied!' };
      }
      return { success: false, discountAmount: 0, message: 'Invalid promo code.' };
  },


  // Courier-facing API
  async getAvailableJobs(courierId: string): Promise<DeliveryJob[]> {
    await networkDelay(500);
    // Filter out expired jobs
    mockAvailableJobs = mockAvailableJobs.filter(job => job.expiresAt > Date.now());
    return mockAvailableJobs;
  },

  async acceptJob(jobId: string, courierId: string): Promise<{ success: boolean; message: string }> {
      await networkDelay(300);
      const jobIndex = mockAvailableJobs.findIndex(j => j.id === jobId);
      if (jobIndex !== -1) {
          const job = mockAvailableJobs[jobIndex];
          // SIMULATE LOCKING: Remove job immediately so others can't take it
          mockAvailableJobs.splice(jobIndex, 1);

          // Update the main order status
          const order = mockOrders.find(o => o.id === jobId);
          if (order) {
              order.status = OrderFlowStatus.AWAITING_PAYMENT;
              order.courier = MOCK_COURIER_PROFILE; // Assign mock courier profile

              // Add to courier's active deliveries
              mockActiveDeliveries.push({
                  ...job,
                  customerName: 'Test User', // Mocked, ideally from user data
                  customerPhone: order.customerPhone || '+989121112233', // Use actual customer phone
                  status: 'AWAITING_PAYMENT',
                  isPaymentConfirmedByCustomer: false, // Initial state for courier
              });

              return { success: true, message: 'Job accepted!' };
          }
      }
      return { success: false, message: 'Job already taken or expired.' };
  },

  async courierConfirmPayment(orderId: string): Promise<{ success: boolean }> {
      await networkDelay(1000); // Simulate network delay for courier confirmation
      const order = mockOrders.find(o => o.id === orderId);
      const delivery = mockActiveDeliveries.find(d => d.id === orderId);

      if (order && delivery && order.isPaymentConfirmedByCustomer) { // Only if customer marked paid
          order.status = OrderFlowStatus.PAYMENT_CONFIRMED;
          delivery.status = 'AT_RESTAURANT'; // Now ready for pickup
          order.estimatedDeliveryTime = 25; // Simulate ETA generation (e.g., 25 minutes)
          return { success: true };
      }
      return { success: false };
  },
  
  async getActiveDeliveries(courierId: string): Promise<ActiveDelivery[]> {
      await networkDelay(400);
      return mockActiveDeliveries;
  },

  async updateDeliveryStatus(deliveryId: string, status: 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED'): Promise<{ success: boolean }> {
      await networkDelay(300);
      const delivery = mockActiveDeliveries.find(d => d.id === deliveryId);
      const order = mockOrders.find(o => o.id === deliveryId);

      if (delivery && order) {
          if (status === 'DELIVERED') {
              // Courier marks delivered, but order goes into AWAITING_CUSTOMER_CONFIRMATION
              delivery.status = 'AWAITING_CUSTOMER_CONFIRMATION';
              order.status = OrderFlowStatus.AWAITING_CUSTOMER_CONFIRMATION;
              // Do NOT remove from mockActiveDeliveries yet, as courier still tracks it until customer confirms
          } else {
              delivery.status = status;
              order.status = OrderFlowStatus.DELIVERY_IN_PROGRESS;
          }
          return { success: true };
      }
      return { success: false };
  },

  async getCourierProfile(courierId: string): Promise<CourierProfile> {
      await networkDelay(200);
      return { ...MOCK_COURIER_PROFILE, id: courierId }; // Return the mock profile
  },

  async updateCourierProfile(courierId: string, profile: Partial<CourierProfile>): Promise<{ success: boolean }> {
      await networkDelay(500);
      Object.assign(MOCK_COURIER_PROFILE, profile); // Update mock profile
      return { success: true };
  },


  // Generic APIs
  async switchRole(userId: string, targetRole: Role): Promise<{ success: boolean; role: Role }> {
    await networkDelay(250);
    return { success: true, role: targetRole };
  },

  // FIX: Implement missing listItems API
  async listItems(options: { query?: string; category?: string }): Promise<MenuItem[]> {
    await networkDelay(300);
    let items = [...ALL_ITEMS];
    if (options.query) {
      const q = options.query.toLowerCase();
      items = items.filter(i => i.name.en.toLowerCase().includes(q) || i.name.fa.toLowerCase().includes(q));
    }
    if (options.category && options.category !== 'All' && options.category !== 'همه') {
      items = items.filter(i => i.category.en === options.category || i.category.fa === options.category);
    }
    return items;
  },

  // FIX: Implement missing createRequestDelivery API
  async createRequestDelivery(payload: RequestDeliveryJob): Promise<{ success: boolean }> {
    await networkDelay(700);
    const newJob: DeliveryJob = {
      id: `job_req_${Date.now()}`,
      restaurantName: RESTAURANTS.find(r => r.id === payload.sourceRestaurantId)?.name || { en: 'External', fa: 'خارجی' },
      pickupPoint: payload.pickupPoint,
      deliveryPoint: payload.deliveryPoint,
      itemsSummary: `${payload.foodName}`,
      earnings: Math.round(payload.price * 0.1), // e.g. 10% earnings
      expiresAt: Date.now() + 120000, // Expires in 2 minutes
    };
    mockAvailableJobs.push(newJob);
    console.log("New delivery request created:", newJob);
    return { success: true };
  },
};