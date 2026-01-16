import { useCart } from '../context/CartContext';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    unit?: string;
    image: string;
    rating?: number;
    badge?: string;
    variant?: 'featured' | 'standard';
}

export default function ProductCard({
    id,
    name,
    price,
    originalPrice,
    unit,
    image,
    rating, // For the stars
    badge,
    variant = 'standard'
}: ProductCardProps) {
    const { addItem } = useCart();

    const handleAdd = () => {
        addItem({ id, name, price, unit: unit || 'unit', image });
    };

    if (variant === 'featured') {
        return (
            <div className="min-w-[280px] snap-start bg-background-light dark:bg-neutral-800 rounded-xl overflow-hidden hover:shadow-lg transition-all border border-transparent hover:border-primary/20 group">
                <div className="relative h-[220px]">
                    {badge && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">{badge}</span>
                    )}
                    <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${image}")` }}></div>
                    <button
                        onClick={handleAdd}
                        className="absolute bottom-3 right-3 size-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 pointer-events-auto"
                    >
                        <span className="material-symbols-outlined text-text-main text-[20px]">add_shopping_cart</span>
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex gap-1 text-yellow-500 mb-1">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`material-symbols-outlined text-[16px] ${(rating && i < rating) ? 'fill-current' : ''}`}>star</span>
                        ))}
                    </div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">{name}</h3>
                    <p className="text-text-muted text-sm mb-3">{unit}</p>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">₹{price.toFixed(2)}</span>
                            {originalPrice && <span className="text-sm text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>}
                        </div>
                        <button onClick={handleAdd} className="text-primary font-bold text-sm hover:underline">Add</button>
                    </div>
                </div>
            </div>
        );
    }

    // Standard variant (for Shop page) typically has quantity controls, but for now we'll keep it simple or expand later.
    // Using the featured structure for now as a base if they are similar enough.
    return (
        <div className="bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-[#f0f4f2] dark:border-white/5 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group flex flex-col h-full">
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-white/5">
                {badge && (
                    <span className="absolute top-3 left-3 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">{badge}</span>
                )}
                <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <button className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 dark:bg-black/50 rounded-full text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight mb-1">{name}</h3>
                        <p className="text-xs text-text-muted">{unit}</p>
                    </div>
                </div>
                <div className="flex items-end gap-1 mb-4">
                    <span className="text-xl font-bold text-primary">₹{price.toFixed(2)}</span>
                    <span className="text-xs text-text-muted mb-1">{unit && unit.startsWith('/') ? unit : `/ ${unit}`}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-dashed border-gray-100 dark:border-white/10 flex items-center justify-between gap-3">
                    {/* Simplified Add Button for now */}
                    <button onClick={handleAdd} className="flex-1 h-9 bg-primary hover:bg-green-400 text-black text-sm font-bold rounded-lg transition-colors shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
