import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Product {
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    category: string;
    badge?: string;
    // originalPrice? - add if in db later
}

export default function ShopPage() {
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let query = supabase.from('products').select('*');

                if (categoryFilter) {
                    query = query.eq('category', categoryFilter);
                }

                const { data, error } = await query;

                if (error) throw error;
                setProducts(data || []);
            } catch (err: any) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryFilter]);

    const getCategoryTitle = () => {
        if (!categoryFilter) return "Fresh Fruits";
        if (categoryFilter === 'dates') return "Dates (Khajoor)";
        if (categoryFilter === 'watermelons') return "Watermelons";
        if (categoryFilter === 'mangoes') return "Mangoes";
        return "Products";
    };

    return (
        <Layout>
            {/* Breadcrumbs */}
            <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-b border-gray-100 dark:border-white/5 w-full">
                <div className="max-w-7xl mx-auto px-4 lg:px-10 py-3 flex items-center gap-4">
                    <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors" title="Back">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Link to="/" className="text-text-muted hover:text-primary transition-colors">Home</Link>
                        <span className="text-text-muted">/</span>
                        <Link to="/shop" className="text-text-muted hover:text-primary transition-colors">Shop</Link>
                        <span className="text-text-muted">/</span>
                        <span className="text-text-main dark:text-white font-medium">{getCategoryTitle()}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 lg:px-10 py-8 flex-1">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 shrink-0 hidden lg:block space-y-8">
                        <div className="bg-white dark:bg-card-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                            <h3 className="font-bold text-lg mb-4 text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">category</span>
                                Categories
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/shop" className={`flex items-center justify-between p-2 rounded-lg ${!categoryFilter ? 'bg-primary/10 text-primary font-bold' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                        <span className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[20px]">nutrition</span>
                                            All Fruits
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shop?category=dates" className={`flex items-center justify-between p-2 rounded-lg ${categoryFilter === 'dates' ? 'bg-primary/10 text-primary font-bold' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                        <span className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                            Dates (Khajoor)
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shop?category=watermelons" className={`flex items-center justify-between p-2 rounded-lg ${categoryFilter === 'watermelons' ? 'bg-primary/10 text-primary font-bold' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                        <span className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[20px]">water_drop</span>
                                            Watermelons
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shop?category=mangoes" className={`flex items-center justify-between p-2 rounded-lg ${categoryFilter === 'mangoes' ? 'bg-primary/10 text-primary font-bold' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                        <span className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[20px]">emoji_nature</span>
                                            Mangoes
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        {/* Hero Banner */}
                        <div className="relative w-full rounded-2xl overflow-hidden mb-8 group bg-gray-900">
                            <div className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfg9LspIhCdSs596gZXSFqmbNCLv4H15R2s_hOJ-t7ZCDZp8scWtPYhfML5Sclm1iFQjKE4WGMjGVRWCUVTtQulko62_418NX1Yj1i-N3vvgkz3AuCvW6lkarvsqCXb9aXheck2VhDJmnES2AVA5GsSIkfL-fTsttBb8SMr5RMueJ8PnjlBpLpYYgqt1jYNU4GV9RuQuJxgiQ7bTr-x14s1CtPn1NA_fFXSNtrPvMSLk3bMHC7cOcsRD1c-xmprbr8gU-lOiM5lqvM')` }}>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                            <div className="relative z-10 p-6 md:p-10 flex flex-col items-start justify-center min-h-[240px]">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary text-black text-xs font-bold uppercase tracking-wider mb-3">Ramzan Special</span>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 leading-tight">
                                    {categoryFilter ? getCategoryTitle() : 'Fresh Fruits for\nYour Iftar Table'}
                                </h1>
                                <p className="text-gray-200 text-sm md:text-base max-w-md mb-6">Premium quality dates, juicy melons, and seasonal favorites delivered same-day to your doorstep.</p>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 text-red-500">
                                <p className="text-lg">{error}</p>
                                <button onClick={() => window.location.reload()} className="mt-4 text-primary hover:underline">Try Again</button>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                <p className="text-lg">No products found in this category.</p>
                                <Link to="/shop" className="text-primary hover:underline mt-2">View all products</Link>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </Layout>
    );
}
