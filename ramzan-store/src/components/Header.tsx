import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import {
    Menu, X, Search, ShoppingCart, User, LogOut,
    Home, Store, ShoppingBag, LayoutDashboard, LogIn,
    Leaf, Bell
} from 'lucide-react';

export default function Header() {
    const { itemCount } = useCart();
    const { user, profile, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Fetch and subscribe to pending orders for Admin
    useEffect(() => {
        if (profile?.role === 'admin') {
            fetchPendingOrders();

            const channel = supabase
                .channel('header-notifications')
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

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e9e7] bg-white/95 backdrop-blur-md px-4 py-3 lg:px-10 dark:bg-background-dark/95 dark:border-b-neutral-800 transition-colors">
            <div className="flex items-center gap-4 lg:gap-8 w-full max-w-[1440px] mx-auto">
                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="xl:hidden p-2 -ml-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 lg:gap-3 text-text-main dark:text-white shrink-0">
                    <div className="size-8 text-primary flex items-center justify-center">
                        <Leaf className="size-8 fill-current" />
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">ZestMart</h2>
                </Link>

                {/* Search Bar - Hidden on small screens */}
                <div className="flex-1 max-w-[600px] hidden md:block">
                    <label className="flex flex-col w-full h-11">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full ring-1 ring-[#e5e9e7] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 transition-all">
                            <div className="text-text-muted flex bg-background-light dark:bg-neutral-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <Search className="size-5" />
                            </div>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none text-text-main dark:text-white focus:outline-0 focus:ring-0 border-none bg-background-light dark:bg-neutral-800 h-full placeholder:text-text-muted px-4 text-base font-normal leading-normal"
                                placeholder="Search for dates, melons, mangoes..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const query = (e.target as HTMLInputElement).value;
                                        if (query.trim()) {
                                            window.location.href = `/shop?search=${encodeURIComponent(query)}`;
                                        }
                                    }
                                }}
                            />
                        </div>
                    </label>
                </div>

                {/* Nav Links & Actions */}
                <div className="flex flex-1 justify-end gap-3 lg:gap-6 items-center">
                    <div className="hidden xl:flex items-center gap-8">
                        <Link to="/" className="text-text-main dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors">Home</Link>
                        <Link to="/shop" className="text-text-main dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors">Shop</Link>
                        {user && profile?.role === 'user' && (
                            <>
                                <Link to="/my-orders" className="text-text-main dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors">My Orders</Link>
                                <Link to="/profile" className="text-text-main dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors">My Profile</Link>
                            </>
                        )}
                        {(profile?.role === 'admin' || profile?.role === 'delivery') && (
                            <Link to={profile.role === 'admin' ? "/admin" : "/delivery"} className="text-text-main dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors">
                                {profile.role === 'admin' ? 'Admin Dashboard' : 'Delivery Hub'}
                            </Link>
                        )}
                    </div>
                    <div className="flex gap-2 items-center">
                        {/* Admin Notification Bell */}
                        {profile?.role === 'admin' && (
                            <Link to="/admin/orders" className="relative p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors mr-1">
                                <Bell className="size-6" />
                                {pendingOrdersCount > 0 && (
                                    <span className="absolute top-1 right-1 size-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white dark:border-background-dark">
                                        {pendingOrdersCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {!user ? (
                            <>
                                <Link to="/login" className="hidden lg:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-background-light dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-text-main dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                                    <span className="truncate">Login</span>
                                </Link>
                                <Link to="/login" className="flex relative cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 bg-background-light dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-text-main dark:text-white transition-colors">
                                    <User className="size-6" />
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 lg:gap-3">
                                <span className="hidden sm:inline text-sm font-medium text-text-main dark:text-white">
                                    Hi, {profile?.full_name?.split(' ')[0] || 'User'}
                                </span>
                                <Link to={profile?.role === 'user' ? "/profile" : (profile?.role === 'admin' ? "/admin" : "/delivery")} className="flex relative cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                                    <User className="size-6" />
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    title="Sign Out"
                                    className="hidden sm:flex relative cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <LogOut className="size-5" />
                                </button>
                            </div>
                        )}

                        <Link to="/cart" className="flex relative cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-3 lg:px-4 bg-primary hover:bg-[#0fd650] text-[#111813] gap-2 text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm shadow-primary/20">
                            <ShoppingCart className="size-5" />
                            <span className="hidden sm:inline">Cart</span>
                            {itemCount > 0 && (
                                <span className="absolute top-1 right-1 size-2.5 bg-red-500 rounded-full border border-white dark:border-neutral-900 sm:hidden"></span>
                            )}
                            {itemCount > 0 && (
                                <span className="hidden sm:flex bg-red-500 text-white text-[10px] items-center justify-center h-4 w-4 rounded-full ml-1">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 xl:hidden" onClick={() => setIsMenuOpen(false)}>
                    {/* ENFORCED Background Color and Z-Index */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-[280px] bg-white h-full shadow-2xl p-6 flex flex-col gap-6"
                        onClick={e => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', zIndex: 101, height: '100vh' }}
                    >
                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-xl font-bold text-black">Menu</h3>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100">
                                <X className="size-6" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2 overflow-y-auto">
                            {/* Mobile Search */}
                            <div className="relative mb-4 md:hidden">
                                <span className="absolute left-3 top-2.5 text-gray-400 flex items-center">
                                    <Search className="size-5" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-gray-100 rounded-lg py-2.5 pl-10 pr-4 text-sm text-black outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const query = (e.target as HTMLInputElement).value;
                                            if (query.trim()) {
                                                window.location.href = `/shop?search=${encodeURIComponent(query)}`;
                                                setIsMenuOpen(false);
                                            }
                                        }
                                    }}
                                />
                            </div>

                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-black font-medium transition-colors">
                                <Home className="size-5 text-gray-600" />
                                Home
                            </Link>
                            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-black font-medium transition-colors">
                                <Store className="size-5 text-gray-600" />
                                Shop
                            </Link>

                            {user ? (
                                <>
                                    {profile?.role === 'user' && (
                                        <>
                                            <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-black font-medium transition-colors">
                                                <ShoppingBag className="size-5 text-gray-600" />
                                                My Orders
                                            </Link>
                                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-black font-medium transition-colors">
                                                <User className="size-5 text-gray-600" />
                                                My Profile
                                            </Link>
                                        </>
                                    )}
                                    {(profile?.role === 'admin' || profile?.role === 'delivery') && (
                                        <Link to={profile.role === 'admin' ? "/admin" : "/delivery"} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-black font-medium transition-colors">
                                            <LayoutDashboard className="size-5 text-gray-600" />
                                            {profile.role === 'admin' ? 'Admin Dashboard' : 'Delivery Hub'}
                                        </Link>
                                    )}

                                    <div className="h-px bg-gray-200 my-2"></div>

                                    <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="flex w-full items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 font-medium text-left transition-colors">
                                        <LogOut className="size-5" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-black font-medium transition-colors">
                                    <LogIn className="size-5 text-gray-600" />
                                    Log In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
