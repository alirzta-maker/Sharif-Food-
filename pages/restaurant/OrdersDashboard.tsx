
import React, { useState } from 'react';
import { MOCK_RESTAURANT_ORDERS } from '../../constants';
import { RestaurantOrder, OrderStatus } from '../../types';

interface OrderStatusCardProps {
    order: RestaurantOrder;
    onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ order, onStatusChange }) => {
    const isPending = order.status === OrderStatus.PENDING;
    const bgColor = isPending ? 'bg-yellow-300' : 'bg-white';

    return (
        <div className={`${bgColor} border-3 border-black rounded-4xl p-6 mb-4 shadow-lg`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold">Order #{order.id}</h3>
                    <p className="text-gray-700">Customer: {order.customerName}</p>
                </div>
                <span className="font-bold text-lg bg-black text-white px-3 py-1 rounded-full">{order.status}</span>
            </div>
            <ul className="list-disc pl-5 mb-4">
                {order.items.map(item => (
                    <li key={item.name}>{item.name} x {item.quantity}</li>
                ))}
            </ul>
             <p className="font-bold text-right mb-4">Total: {order.total.toLocaleString()} Toman</p>
            {isPending && (
                 <div className="flex justify-end gap-3">
                    <button onClick={() => {}} className="bg-neo-red text-white font-bold py-2 px-6 rounded-3xl border-2 border-black transform hover:scale-105 active:scale-95 transition-transform">Reject</button>
                    <button onClick={() => onStatusChange(order.id, OrderStatus.ACCEPTED)} className="bg-neo-green text-white font-bold py-2 px-6 rounded-3xl border-2 border-black transform hover:scale-105 active:scale-95 transition-transform">Accept</button>
                </div>
            )}
        </div>
    );
};


const OrdersDashboard: React.FC = () => {
    const [orders, setOrders] = useState<RestaurantOrder[]>(MOCK_RESTAURANT_ORDERS);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        setOrders(currentOrders => currentOrders.map(o => o.id === orderId ? {...o, status: newStatus} : o));
    };
    
    const filterOrders = (status: OrderStatus) => orders.filter(o => o.status === status);

    return (
        <div className="p-4">
            <h1 className="text-4xl font-extrabold mb-6">Orders Dashboard</h1>

            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-3">Pending</h2>
                    {filterOrders(OrderStatus.PENDING).map(order => 
                        <OrderStatusCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-3">Accepted</h2>
                    {filterOrders(OrderStatus.ACCEPTED).map(order => 
                        <OrderStatusCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-3">Preparing</h2>
                    {filterOrders(OrderStatus.PREPARING).map(order => 
                        <OrderStatusCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersDashboard;
