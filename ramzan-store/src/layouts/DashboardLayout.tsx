import { useAuth } from '../hooks/useAuth';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Bell, User } from 'lucide-react';

export default function DashboardLayout() {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

    // Fetch and subscribe to pending orders for Admin
    useEffect(() => {
        if (profile?.role === 'admin') {
            fetchPendingOrders();

            const channel = supabase
                .channel('dashboard-notifications')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'orders' },
                    () => {
                        fetchPendingOrders();
                    }
                )
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'orders' },
                    () => {
                        fetchPendingOrders();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [profile?.role]);

    const fetchPendingOrders = async () => {
        const { count, error } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Pending');

        if (!error) {
            setPendingOrdersCount(count || 0);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = profile?.role === 'admin' ? [
        { label: 'Overview', icon: 'dashboard', path: '/admin' },
        { label: 'Products', icon: 'inventory_2', path: '/admin/products' },
        { label: 'Categories', icon: 'category', path: '/admin/categories' },
        { label: 'Orders', icon: 'shopping_bag', path: '/admin/orders' },
        { label: 'Manage Users', icon: 'group', path: '/admin/users' },
        { label: 'My Profile', icon: 'person', path: '/profile' },
    ] : [
        { label: 'My Deliveries', icon: 'local_shipping', path: '/delivery' },
        { label: 'History', icon: 'history', path: '/delivery/history' },
        { label: 'My Profile', icon: 'person', path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black/80 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static z-30 w-64 bg-white dark:bg-card-dark border-r border-gray-200 dark:border-white/5 transition-transform duration-200 ease-in-out`}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-white/5">
                        <span className="text-xl font-bold text-primary">
                            {profile?.role === 'admin' ? 'Admin Panel' : 'Delivery Hub'}
                        </span>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary rounded-lg transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100 dark:border-white/5">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white dark:bg-card-dark border-b border-gray-200 dark:border-white/5 flex items-center px-4 justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-text-muted">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <span className="font-bold text-lg text-text-main dark:text-white">
                            {profile?.role === 'admin' ? 'Admin' : 'Delivery'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Admin Bell Icon for Mobile Header */}
                        {profile?.role === 'admin' && (
                            <Link to="/admin/orders" className="relative p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                <Bell className="size-6" />
                                {pendingOrdersCount > 0 && (
                                    <span className="absolute top-1 right-1 size-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white dark:border-background-dark">
                                        {pendingOrdersCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Profile Icon for Mobile Header */}
                        <Link to="/profile" className="p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <User className="size-6" />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
