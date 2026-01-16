import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface TrackingModalProps {
    orderId: string;
    deliveryBoyId: string;
    onClose: () => void;
}

export default function TrackingModal({ orderId, deliveryBoyId, onClose }: TrackingModalProps) {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        const fetchLocation = async () => {
            const { data } = await supabase
                .from('delivery_locations')
                .select('latitude, longitude')
                .eq('delivery_boy_id', deliveryBoyId)
                .single();

            if (data) {
                setLocation({ lat: data.latitude, lng: data.longitude });
            }
        };

        fetchLocation();

        // Real-time subscription could go here
        const interval = setInterval(fetchLocation, 10000); // Poll every 10s for now
        return () => clearInterval(interval);
    }, [deliveryBoyId]);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-card-dark w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-white/5">
                    <h3 className="font-bold text-lg dark:text-white">Tracking Order #{orderId.slice(0, 6)}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="h-64 bg-gray-100 relative">
                    {/* Simulated Map */}
                    {location ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-4xl text-primary animate-bounce">location_on</span>
                                <p className="text-sm font-bold mt-2">Delivery Partner is here</p>
                                <p className="text-xs text-text-muted">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-text-muted">
                            Fetching location...
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                        </div>
                        <div>
                            <p className="font-medium dark:text-white">Your order is on the way</p>
                            <p className="text-sm text-text-muted">Arriving in approx 15 mins</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
