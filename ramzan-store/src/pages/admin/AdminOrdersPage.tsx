import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { sendDeliveryAssignmentEmail } from '../../utils/emailService';
import { ArrowLeft } from 'lucide-react';

interface Order {
    id: string;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
    delivery_boy_id?: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [deliveryBoys, setDeliveryBoys] = useState<any[]>([]);

    useEffect(() => {
        fetchOrders();
        fetchDeliveryBoys();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setOrders(data);
        setLoading(false);
    };

    const fetchDeliveryBoys = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'delivery');
        if (data) setDeliveryBoys(data);
    };

    const assignDelivery = async (orderId: string, deliveryBoyId: string) => {
        const { error } = await supabase
            .from('orders')
            .update({
                delivery_boy_id: deliveryBoyId,
                status: 'Processing'
            })
            .eq('id', orderId);

        if (error) {
            alert('Error assigning delivery boy');
        } else {
            // Find delivery boy details and send email
            const deliveryBoy = deliveryBoys.find(b => b.id === deliveryBoyId);
            if (deliveryBoy && deliveryBoy.email) {
                await sendDeliveryAssignmentEmail({
                    deliveryBoyEmail: deliveryBoy.email,
                    deliveryBoyName: deliveryBoy.full_name || 'Delivery Partner',
                    orderId: orderId
                });
            }
            fetchOrders(); // Refresh
        }
    };

    if (loading) return <div className="p-6">Loading orders...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6 text-text-main dark:text-white">Order Management</h1>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                        <tr>
                            <th className="p-4 font-medium text-text-muted">Order ID</th>
                            <th className="p-4 font-medium text-text-muted">Customer</th>
                            <th className="p-4 font-medium text-text-muted">Total</th>
                            <th className="p-4 font-medium text-text-muted">Status</th>
                            <th className="p-4 font-medium text-text-muted">Assign Delivery</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                <td className="p-4 font-mono text-sm dark:text-gray-300">#{order.id.slice(0, 8)}</td>
                                <td className="p-4 dark:text-white">{order.customer_name}</td>
                                <td className="p-4 font-bold dark:text-white">₹{order.total_amount}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select
                                        className="p-2 border rounded-lg text-sm dark:bg-black/20 dark:border-white/10 dark:text-white"
                                        value={order.delivery_boy_id || ''}
                                        onChange={(e) => assignDelivery(order.id, e.target.value)}
                                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                    >
                                        <option value="">Select Delivery Boy</option>
                                        {deliveryBoys.map(boy => (
                                            <option key={boy.id} value={boy.id}>{boy.full_name || boy.email}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid gap-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-mono text-text-muted block mb-1">#{order.id.slice(0, 8)}</span>
                                <h3 className="font-bold text-text-main dark:text-white text-lg">{order.customer_name}</h3>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-t border-b border-gray-100 dark:border-white/5 py-3">
                            <span className="text-sm text-text-muted">Total Amount</span>
                            <span className="font-bold text-xl text-text-main dark:text-white">₹{order.total_amount}</span>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-2 uppercase">Assign Delivery Boy</label>
                            <select
                                className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 dark:bg-black/20 dark:border-white/10 dark:text-white"
                                value={order.delivery_boy_id || ''}
                                onChange={(e) => assignDelivery(order.id, e.target.value)}
                                disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                            >
                                <option value="">Select Delivery Boy</option>
                                {deliveryBoys.map(boy => (
                                    <option key={boy.id} value={boy.id}>{boy.full_name || boy.email}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {orders.length === 0 && (
                <div className="p-8 text-center text-text-muted">No orders found.</div>
            )}
        </div>
    );
}
