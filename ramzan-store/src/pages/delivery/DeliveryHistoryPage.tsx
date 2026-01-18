import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

interface Order {
    id: string;
    customer_name: string;
    address_details: any;
    total_amount: number;
    created_at: string;
    status: string;
}

export default function DeliveryHistoryPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('delivery_boy_id', user?.id)
            .eq('status', 'Delivered')
            .order('created_at', { ascending: false });

        if (!error && data) setOrders(data);
        setLoading(false);
    };

    if (loading) return <div className="p-6 text-center">Loading history...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/delivery" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-bold text-text-main dark:text-white">Delivery History</h1>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">history</span>
                    <p className="text-text-muted">No completed deliveries yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-text-muted">#{order.id.slice(0, 8)}</span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Delivered</span>
                                </div>
                                <h3 className="font-bold text-lg text-text-main dark:text-white mb-1">{order.customer_name}</h3>
                                <p className="text-sm text-text-muted mb-2">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                                <p className="text-sm text-text-muted flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                    {order.address_details?.fullAddress}, {order.address_details?.city}
                                </p>
                            </div>
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-white/5">
                                <span className="text-xs text-text-muted uppercase">Total Amount</span>
                                <span className="text-lg font-bold text-primary">₹{order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
