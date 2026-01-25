import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { sendOrderEmail } from '../utils/emailService';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tax = totalAmount * 0.05;
    const delivery = 40.00; // Fixed delivery in INR
    const finalTotal = totalAmount + tax + delivery;

    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleShareLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLocationStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationStatus('success');
            },
            (error) => {
                console.error('Error getting location:', error);
                setLocationStatus('error');
                alert('Unable to retrieve your location. Please enter address manually.');
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        const customerName = `${formData.get('firstName')} ${formData.get('lastName')}`;
        const customerEmail = formData.get('email') as string;

        const address = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            fullAddress: formData.get('fullAddress'),
            city: formData.get('city'),
            pincode: formData.get('pincode'),
            location: location // Add captured location here
        };

        try {
            const { data: orderData, error: insertError } = await supabase.from('orders').insert({
                customer_name: customerName,
                customer_email: customerEmail,
                address_details: address,
                items: items,
                total_amount: finalTotal,
                status: 'Pending',
                user_id: user?.id
            }).select().single();

            if (insertError) throw insertError;

            // Send Email Notification (Wait for it to ensure delivery)
            await sendOrderEmail({
                order_id: orderData.id,
                customer_name: customerName,
                total_amount: finalTotal,
                items: items
            });

            // Success
            clearCart();
            navigate('/order-confirmed', { state: { orderId: orderData.id } });
        } catch (err: any) {
            console.error('Order submission error:', err);
            setError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout hideFooter>
            <div className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 lg:px-40 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        {/* Breadcrumbs & Heading */}
                        <div>
                            <nav className="flex flex-wrap gap-2 mb-4 text-sm font-medium">
                                <Link to="/cart" className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Back to Cart
                                </Link>
                                <span className="text-text-muted">/</span>
                                <span className="text-text-main dark:text-white">Checkout</span>
                                <span className="text-text-muted">/</span>
                                <span className="text-text-muted">Payment</span>
                            </nav>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-text-main dark:text-white">Delivery Details</h1>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                            {/* Contact Information */}
                            <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-text-main dark:text-white">Contact Information</h3>
                                    <a href="#" className="text-sm font-semibold text-primary hover:underline">Log in</a>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="block">
                                        <span className="text-text-main dark:text-gray-300 font-medium text-sm mb-1.5 block">Email Address</span>
                                        <input name="email" required className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-main dark:text-white placeholder:text-gray-400" placeholder="you@example.com" type="email" />
                                    </label>
                                    <label className="block">
                                        <span className="text-text-main dark:text-gray-300 font-medium text-sm mb-1.5 block">Phone Number</span>
                                        <input name="phone" required className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-main dark:text-white placeholder:text-gray-400" placeholder="+91 98765 43210" type="tel" pattern="[0-9+\-\s]{10,15}" />
                                    </label>
                                </div>
                            </section>

                            {/* Share Location Feature */}
                            <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-text-main dark:text-white">Delivery Location</h3>
                                        <p className="text-sm text-text-muted">Help our delivery partners find you easily</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="mb-6">
                                        <button
                                            type="button"
                                            onClick={handleShareLocation}
                                            disabled={locationStatus === 'loading' || locationStatus === 'success'}
                                            className={`w-full py-3 px-4 border-2 border-dashed font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${locationStatus === 'success'
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 text-primary'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">
                                                {locationStatus === 'loading' ? 'hourglass_empty' : locationStatus === 'success' ? 'check_circle' : 'my_location'}
                                            </span>
                                            {locationStatus === 'loading' ? 'Fetching Location...' : locationStatus === 'success' ? 'Location Captured!' : 'Share My Current Location'}
                                        </button>
                                    </div>
                                </div>

                                {/* Mock Map Placeholder */}
                                <div className="w-full h-48 bg-neutral-100 dark:bg-black/40 rounded-xl mb-6 relative overflow-hidden border border-gray-200 dark:border-gray-700">
                                    {location ? (
                                        <div className="absolute inset-0 flex items-center justify-center text-green-600 flex-col gap-2 bg-green-50/50">
                                            <span className="material-symbols-outlined text-4xl">location_on</span>
                                            <span className="text-sm font-bold">Location Locked</span>
                                            <span className="text-xs font-mono">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-text-muted flex-col gap-2">
                                            <span className="material-symbols-outlined text-4xl opacity-50">map</span>
                                            <span className="text-sm">Map View Placeholder</span>
                                        </div>
                                    )}
                                    {/* Mock overlay for address execution assistance */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-black/80 backdrop-blur-sm p-3 text-xs text-center border-t border-gray-100 dark:border-gray-700">
                                        We use this to pinpoint your exact address.
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-surface-light dark:bg-surface-dark text-text-muted">Or enter manually</span>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-text-main dark:text-white mb-6">Address Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="block">
                                        <span className="text-text-main dark:text-gray-300 font-medium text-sm mb-1.5 block">First Name</span>
                                        <input name="firstName" required className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-main dark:text-white" placeholder="Omar" type="text" />
                                    </label>
                                    <label className="block">
                                        <span className="text-text-main dark:text-gray-300 font-medium text-sm mb-1.5 block">Last Name</span>
                                        <input name="lastName" required className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-main dark:text-white" placeholder="Ali" type="text" />
                                    </label>
                                    <label className="block md:col-span-2">
                                        <span className="text-text-main dark:text-gray-300 font-medium text-sm mb-1.5 block">Full Address</span>
                                        <input name="fullAddress" required className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-main dark:text-white" placeholder="Flat No, Building Name, Street" type="text" />
                                    </label>
                                    <label className="block">
                                        <span className="text-text-main dark:text-gray-300 font-medium text-sm mb-1.5 block">City</span>
                                        <input name="city" required className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-main dark:text-white" placeholder="Hyderabad" type="text" />
                                    </label>
                                    <label className="block">
                                        <span className="text-text-main dark:text-gray-300 font-medium text-sm mb-1.5 block">Pincode</span>
                                        <input name="pincode" required className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-main dark:text-white" placeholder="500001" type="text" />
                                    </label>
                                </div>
                            </section>

                            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-4">
                                <Link to="/cart" className="flex items-center gap-2 text-text-muted hover:text-text-main dark:hover:text-white transition-colors font-medium">
                                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                                    Return to Cart
                                </Link>
                                <button disabled={loading} type="submit" className="w-full sm:w-auto bg-primary hover:bg-[#0fd650] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-4 px-10 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <>
                                            <span>Place Order</span>
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="bg-[#f0f4f2] dark:bg-black/30 p-6 border-b border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xl font-bold text-text-main dark:text-white">Order Summary</h3>
                                    <p className="text-sm text-text-muted mt-1">{items.length} items in your cart</p>
                                </div>

                                <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4 mb-6">
                                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 dark:border-gray-700">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white shadow-md">{item.quantity}</span>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-center">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-text-main dark:text-white">{item.name}</h4>
                                                    <span className="font-bold text-text-main dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                                <p className="text-sm text-text-muted">Unit: {item.unit}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Calculations */}
                                <div className="border-t border-gray-100 dark:border-gray-800 p-6 bg-[#fafafa] dark:bg-black/20 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">Subtotal</span>
                                        <span className="font-bold text-text-main dark:text-white">₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">Delivery</span>
                                        <span className="font-bold text-text-main dark:text-white">₹{delivery.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">Tax (5%)</span>
                                        <span className="font-bold text-text-main dark:text-white">₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-3 flex justify-between items-center">
                                        <span className="text-lg font-bold text-text-main dark:text-white">Total</span>
                                        <div className="flex items-end flex-col">
                                            <span className="text-2xl font-extrabold text-primary">₹{finalTotal.toFixed(2)}</span>
                                            <span className="text-xs text-text-muted">Including VAT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
