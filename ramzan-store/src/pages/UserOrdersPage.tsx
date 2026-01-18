import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import TrackingModal from '../components/TrackingModal';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    unit: string;
}

interface Order {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: OrderItem[];
    delivery_boy_id?: string;
}

export default function UserOrdersPage() {
    const { user, signOut } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data as Order[]);
        }
        setLoading(false);
    };

    const activeOrders = orders.filter(o => ['Pending', 'Processing', 'Out for Delivery'].includes(o.status));
    const historyOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));

    const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

    return (
        <Layout>
            <div className="max-w-4xl w-full mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-text-main dark:text-white">My Orders</h1>
                    <div className="md:hidden">
                        <button onClick={() => signOut()} className="text-sm text-red-500 font-bold hover:underline">Sign Out</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-white/10">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`pb-2 px-4 font-medium transition-all relative ${activeTab === 'active'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-text-muted hover:text-text-main dark:hover:text-white'
                            }`}
                    >
                        Active Orders ({activeOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-2 px-4 font-medium transition-all relative ${activeTab === 'history'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-text-muted hover:text-text-main dark:hover:text-white'
                            }`}
                    >
                        Order History ({historyOrders.length})
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-40 bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl"></div>)}
                    </div>
                ) : displayedOrders.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">
                            {activeTab === 'active' ? 'local_shipping' : 'history'}
                        </span>
                        <p className="text-text-muted mb-4">
                            {activeTab === 'active' ? "Result: No active orders." : "No past orders found."}
                        </p>
                        <Link to="/shop" className="bg-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-[#0fd650] transition-colors">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {displayedOrders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 dark:bg-white/5 p-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white dark:bg-black/20 rounded-full flex items-center justify-center text-primary border border-gray-200 dark:border-white/10">
                                            <span className="material-symbols-outlined">receipt_long</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-main dark:text-white">Order #{order.id.slice(0, 8)}</p>
                                            <p className="text-xs text-text-muted">{new Date(order.created_at).toLocaleDateString()} • {new Date(order.created_at).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200'
                                            : order.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200'
                                                : order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800 border-blue-200'
                                                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items with Images */}
                                <div className="p-4">
                                    <div className="space-y-4">
                                        {order.items && order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-center">
                                                <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 dark:border-white/5 flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=?')}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-text-main dark:text-white text-sm">{item.name}</p>
                                                    <p className="text-xs text-text-muted">{item.quantity} x {item.unit}</p>
                                                </div>
                                                <p className="font-bold text-text-main dark:text-white text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer & Actions */}
                                <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-text-muted">Total Amount</p>
                                        <p className="text-lg font-bold text-primary">₹{order.total_amount.toFixed(2)}</p>
                                    </div>

                                    {(order.status === 'Out for Delivery' || order.status === 'Processing') && order.delivery_boy_id && (
                                        <button
                                            onClick={() => setTrackingOrder(order)}
                                            className="px-4 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-primary text-primary hover:bg-primary/5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                            Track
                                        </button>
                                    )}
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
