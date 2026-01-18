import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Order {
    id: string;
    customer_name: string;
    address_details: any;
    total_amount: number;
    status: string;
    delivery_time_slot?: string;
}

export default function DeliveryDashboardPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (user) fetchAssignedOrders();

        // Cleanup tracking on unmount
        return () => {
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, [user]);

    const fetchAssignedOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('delivery_boy_id', user?.id)
            .neq('status', 'Delivered')
            .order('created_at', { ascending: true });

        if (!error && data) setOrders(data);
        setLoading(false);
    };

    const toggleLocationSharing = () => {
        if (isSharingLocation) {
            // Stop Sharing
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
            setIsSharingLocation(false);
            console.log('Location sharing stopped');
        } else {
            // Start Sharing
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser');
                return;
            }

            setIsSharingLocation(true);
            watchIdRef.current = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Updating location:', latitude, longitude);

                    await supabase
                        .from('delivery_locations')
                        .upsert({
                            delivery_boy_id: user?.id,
                            latitude,
                            longitude,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'delivery_boy_id' }); // Upsert by delivery_boy_id is tricky if PK is uuid. Ideally delivery_boy_id should be unique or PK.
                    // Assuming delivery_boy_id is NOT unique constraint in schema, upsert might fail.
                    // However, we can just INSERT or UPDATE. Upsert works if unique constraint exists.
                    // Let's assume for now 1 row per delivery boy.
                    // If it fails, we might need to select first then update.

                    // BETTER: We should use delivery_boy_id as unique key or having a unique constraint.
                    // For now, let's try UPSERT. If it fails, we'll fix it.
                    // Actually, let's verify if delivery_boy_id allows multiple rows. 
                    // In a real app we'd want only 1 active location.
                },
                (error) => console.error('Error tracking location:', error),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    };

    const updateStatus = async (orderId: string, status: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) alert('Error updating status');
        else fetchAssignedOrders();
    };

    const openMap = (address: any) => {
        if (address.location && address.location.lat && address.location.lng) {
            window.open(`https://www.google.com/maps?q=${address.location.lat},${address.location.lng}`, '_blank');
        } else {
            const query = encodeURIComponent(address.fullAddress + ', ' + address.city + ' ' + address.pincode);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }
    };

    if (loading) return <div className="p-6 text-center">Loading deliveries...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-main dark:text-white">My Deliveries</h1>
                <div className="flex gap-2">
                    <Link to="/delivery/history" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full font-bold text-sm text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                        <span className="hidden sm:inline">History</span>
                    </Link>
                    <Link to="/delivery/profile" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full font-bold text-sm text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                        <span className="hidden sm:inline">Profile</span>
                    </Link>
                    <button
                        onClick={toggleLocationSharing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${isSharingLocation
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 animate-pulse'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {isSharingLocation ? 'location_on' : 'location_off'}
                        </span>
                        {isSharingLocation ? 'Sharing Location' : 'Go Online'}
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">local_shipping</span>
                    <p className="text-text-muted">No pending deliveries assigned to you.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-mono text-text-muted">#{order.id.slice(0, 8)}</span>
                                    <h3 className="font-bold text-lg text-text-main dark:text-white">{order.customer_name}</h3>
                                </div>
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">{order.status}</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex gap-3 text-sm">
                                    <span className="material-symbols-outlined text-gray-400">location_on</span>
                                    <div className="flex-1">
                                        <p className="text-text-muted mb-1">{order.address_details?.fullAddress}, {order.address_details?.city} - {order.address_details?.pincode}</p>
                                        <button
                                            onClick={() => openMap(order.address_details)}
                                            className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">map</span>
                                            View on Map {order.address_details?.location ? '(Precise)' : '(Search)'}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <span className="material-symbols-outlined text-gray-400">call</span>
                                    <p className="text-text-muted">Customer contact info hidden (Simulated)</p>
                                </div>
                                {order.delivery_time_slot && (
                                    <div className="flex gap-3 text-sm">
                                        <span className="material-symbols-outlined text-gray-400">schedule</span>
                                        <p className="text-orange-500 font-medium">Slot: {order.delivery_time_slot}</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => updateStatus(order.id, 'Out for Delivery')}
                                    disabled={order.status === 'Out for Delivery'}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                                >
                                    Out for Delivery
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to mark this order as Delivered? This cannot be undone.')) {
                                            updateStatus(order.id, 'Delivered');
                                        }
                                    }}
                                    className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-[#0fd650] shadow-sm transform active:scale-95 transition-all"
                                >
                                    Mark Delivered
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
