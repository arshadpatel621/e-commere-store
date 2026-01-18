import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
    const { itemCount } = useCart();
    const { user, profile, signOut } = useAuth();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e9e7] bg-white/95 backdrop-blur-md px-6 py-3 lg:px-10 dark:bg-background-dark/95 dark:border-b-neutral-800 transition-colors">
            <div className="flex items-center gap-8 w-full max-w-[1440px] mx-auto">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 text-text-main dark:text-white shrink-0">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined !text-[32px]">nutrition</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">ZestMart</h2>
                </Link>

                {/* Search Bar - Hidden on small screens */}
                <div className="flex-1 max-w-[600px] hidden md:block">
                    <label className="flex flex-col w-full h-11">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full ring-1 ring-[#e5e9e7] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 transition-all">
                            <div className="text-text-muted flex bg-background-light dark:bg-neutral-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <span className="material-symbols-outlined text-[20px]">search</span>
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
                <div className="flex flex-1 justify-end gap-6 items-center">
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
                        {!user ? (
                            <>
                                <Link to="/login" className="hidden lg:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-background-light dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-text-main dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                                    <span className="truncate">Login</span>
                                </Link>
                                <Link to="/login" className="flex relative cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 bg-background-light dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-text-main dark:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">account_circle</span>
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="hidden sm:inline text-sm font-medium text-text-main dark:text-white">
                                    Hi, {profile?.full_name?.split(' ')[0] || 'User'}
                                </span>
                                <Link to={profile?.role === 'user' ? "/my-orders" : (profile?.role === 'admin' ? "/admin" : "/delivery")} className="flex relative cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">person</span>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    title="Sign Out"
                                    className="flex relative cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">logout</span>
                                </button>
                            </div>
                        )}

                        <Link to="/cart" className="flex relative cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-[#0fd650] text-[#111813] gap-2 text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm shadow-primary/20">
                            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
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
        </header>
    );
}
