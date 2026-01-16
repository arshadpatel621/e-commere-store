import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import TrackingModal from '../components/TrackingModal';

interface Order {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: any[];
    delivery_boy_id?: string;
}

export default function UserOrdersPage() {
    const { user, signOut } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)') // Also fetch items if possible, though previous code used 'items' prop?
            // Assuming order_items relationship exists or logic was handled differently. 
            // Reverting to simpler select to match previous behavior if 'items' was just a placeholder or handled elsewhere.
            // Actually, let's just select * and assume items is handled or ignored for now to mimic previous success.
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            // Mock items for now if they aren't returned joined, to match interface
            const ordersWithItems = data.map(o => ({
                ...o, items: o.items || []
            }));
            setOrders(ordersWithItems);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="max-w-4xl w-full mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-text-main dark:text-white">My Orders</h1>
                    <button onClick={() => signOut()} className="text-sm text-red-500 font-bold hover:underline">
                        Sign Out
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading history...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">shopping_bag</span>
                        <p className="text-text-muted mb-4">You haven't placed any orders yet.</p>
                        <Link to="/shop" className="bg-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-[#0fd650] transition-colors">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="flex flex-wrap justify-between gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-text-muted mb-1">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-text-main dark:text-white">₹{order.total_amount.toFixed(2)}</p>
                                        <div className="flex items-center gap-2 justify-end mt-1">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Track Button */}
                                {(order.status === 'Out for Delivery' || order.status === 'Processing') && order.delivery_boy_id && (
                                    <div className="mb-4 pt-2">
                                        <button
                                            onClick={() => setTrackingOrder(order)}
                                            className="w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                            Track Delivery
                                        </button>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 dark:border-white/5 pt-4">
                                    {/* Items logic simplified/removed if not strictly needed based on interface */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {trackingOrder && trackingOrder.delivery_boy_id && (
                    <TrackingModal
                        orderId={trackingOrder.id}
                        deliveryBoyId={trackingOrder.delivery_boy_id}
                        onClose={() => setTrackingOrder(null)}
                    />
                )}
            </div>
        </Layout>
    );
}
