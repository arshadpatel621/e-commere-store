import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalAmount, itemCount } = useCart();
    const tax = totalAmount * 0.05;
    const delivery = 0; // Free for now
    const finalTotal = totalAmount + tax + delivery;

    return (
        <Layout>
            <div className="flex-grow w-full max-w-7xl mx-auto px-4 lg:px-10 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Cart Items */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="flex flex-col gap-1 pb-4 border-b border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2 mb-2 text-sm">
                                <Link to="/shop" className="p-1 -ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors" title="Back to Shop">
                                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                                </Link>
                                <Link to="/shop" className="text-text-muted hover:text-primary transition-colors">Shop</Link>
                                <span className="text-text-muted">/</span>
                                <span className="text-text-main dark:text-white font-medium">Cart</span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Your Shopping Cart</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">{itemCount} items in your cart ready for Iftar delivery</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {items.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    <p className="text-xl">Your cart is empty.</p>
                                    <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">Start Shopping</Link>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="group bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-transparent hover:border-primary/30 transition-all">
                                        <div className="flex flex-col sm:flex-row gap-5">
                                            <div className="shrink-0">
                                                <div className="bg-gray-100 dark:bg-white/5 rounded-lg w-full h-48 sm:size-28 bg-center bg-cover" style={{ backgroundImage: `url("${item.image}")` }}></div>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.name}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Unit: {item.unit}</p>
                                                    </div>
                                                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                                                    <div className="flex items-center bg-background-light dark:bg-background-dark rounded-lg p-1 border border-gray-200 dark:border-white/10">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="size-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors">
                                                            <span className="material-symbols-outlined text-sm">remove</span>
                                                        </button>
                                                        <span className="w-10 text-center text-sm font-bold dark:text-white">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="size-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors">
                                                            <span className="material-symbols-outlined text-sm">add</span>
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">₹{item.price.toFixed(2)} / unit</p>
                                                        <p className="text-lg font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors mt-2">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Right Column: Order Summary */}
                    {items.length > 0 && (
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 flex flex-col gap-6">
                                <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
                                    <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Order Summary</h2>
                                    <div className="flex flex-col gap-4 mb-6 border-b border-gray-100 dark:border-white/10 pb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                            <span className="font-bold text-slate-900 dark:text-white">₹{totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Delivery</span>
                                            <span className="text-primary font-bold">Free</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Tax (5%)</span>
                                            <span className="font-bold text-slate-900 dark:text-white">₹{tax.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">₹{finalTotal.toFixed(2)}</span>
                                    </div>

                                    <Link to="/checkout" className="w-full bg-primary text-background-dark text-center font-bold text-base py-4 rounded-lg hover:bg-[#0fd651] transition-all shadow-[0_4px_14px_0_rgba(19,236,91,0.39)] flex justify-center items-center gap-2 group">
                                        <span>Proceed to Checkout</span>
                                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
