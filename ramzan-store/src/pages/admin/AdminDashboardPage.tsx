import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
}

interface Order {
    id: string;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, totalProducts: 0 });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);

        // Parallel fetching
        const [ordersRes, productsRes] = await Promise.all([
            supabase.from('orders').select('id, total_amount, status, created_at, customer_name').order('created_at', { ascending: false }),
            supabase.from('products').select('id', { count: 'exact' })
        ]);

        if (ordersRes.data) {
            const orders = ordersRes.data;
            const revenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
            const pending = orders.filter(o => o.status === 'Pending').length;

            setStats({
                totalRevenue: revenue,
                totalOrders: orders.length,
                pendingOrders: pending,
                totalProducts: productsRes.count || 0
            });
            setRecentOrders(orders.slice(0, 5)); // Top 5
        }

        setLoading(false);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Processing': 'bg-blue-100 text-blue-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
    };

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text-main dark:text-white">Admin Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon="payments" color="text-green-600" />
                <StatCard title="Total Orders" value={stats.totalOrders} icon="shopping_cart" color="text-blue-600" />
                <StatCard title="Pending Orders" value={stats.pendingOrders} icon="pending" color="text-yellow-600" />
                <StatCard title="Active Products" value={stats.totalProducts} icon="inventory_2" color="text-purple-600" />
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5 p-6">
                <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5 text-sm text-text-muted">
                                <th className="py-3">Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {recentOrders.map(order => (
                                <tr key={order.id} className="text-sm">
                                    <td className="py-3 font-mono text-xs">#{order.id.slice(0, 6)}</td>
                                    <td>{order.customer_name}</td>
                                    <td className="font-bold">₹{order.total_amount}</td>
                                    <td><StatusBadge status={order.status} /></td>
                                    <td className="text-text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) => (
    <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div>
            <p className="text-sm text-text-muted mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('text', 'bg')} ${color}`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
    </div>
);
