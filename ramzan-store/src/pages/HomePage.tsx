import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function HomePage() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*').limit(6);
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    const featuredProducts = [
        {
            id: "101",
            name: "Premium Medjool Dates",
            price: 1200.00,
            originalPrice: 1500.00,
            unit: "1 kg Box • Saudi Arabia",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjXECKsWNetp7osGjp7RQXLjpiSfFjoJgTasRBpweLOkMnIFdblRwG436WxMu3xXbHop691KTx0FSdNkuGbJeGkg0XYaFkf_954KQ0hs6dMETwvwEqP8XJN1dRMcX6w5jfa_HJyMRHqJcw5dKu4KAclwTl3m0hvQ0urLFZNl7mKGEavzptGSzYm6nQorfNx1W9-gyyw3vHQ5A3YjI8AuVDgLBmJ962xoC9ljmiV8MhVidLyxh96llP9TbTufkbaya6mU35MbluFZrB",
            rating: 4.5,
            badge: "-20%"
        },
        {
            id: "102",
            name: "Honey Dew Melon",
            price: 80.00,
            unit: "Approx 2.5 kg • Fresh Cut",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCGq-2Odv3Q50PEltfn-PHbciz0DJ_cM8v5SY2RtYMoA3WHvQ1fLGPKkJu1u_TrELR-ims8QrRw4oAneuD7dI5T-009O-ZS9OIy9tMkv24xjpSh1VY5vDxxgiUdvuIbRhg6NjUEVV6HJKXmiE6YVajqMe1QZboNRVdUTfVmpk4twi0OuSGPeuYUy-bt8PvN-leTUuwLOJ7jHFP71_qF88GmB6z19VoKugSIJBZTRgNDRc3jd_0kPIEKqqTpFT5TNH1-xS7dMRi2rPd",
            rating: 5
        },
        {
            id: "103",
            name: "Royal Gala Apples",
            price: 240.00,
            unit: "Pack of 6 • Organic",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgz0knb0VZwxX1m76NqC4PIgXg91xagUWcZ9TkGCtaqvQEjzRagCoL209fwC6bijW-E7LwcffkbtI048-yiJnIVEUY2iqHuUXom68cGgCrGm-Pwc1-pr7PamsMXPRUUr7kNTk9xhaGssSn_uXIfgwtLP6jHjt6V_IS7TgFSNjf3tS3Y7HiRZer9R2W45QjBMin9jnBi_6pZujZTxxASu-63PclTEsmw71zAp5dj43Oo-FtM1OpaTAeGGu8mJ1qbpWYupfodv49NODR",
            rating: 5,
            badge: "Best Seller"
        },
        {
            id: "104",
            name: "Red Pomegranates",
            price: 180.00,
            unit: "2 Large Pieces • Sweet",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcorq1Ojnec0WL_9HUY9tL3nMTshkbPnb_-X9wf3zmpnnAMOmQc3I54RndF_X75tQAt2SkFdTvuxuLFeHW3DPivB_go__5OwiYRjLCFMUhtbLH5GRF8eNoZNX3SZpaoRqobCkz8TfIEukgMvf_Kk8rhSvSdemQ-gSyN7zYrdvh2gjbPhAQLGtCUoH4znp7FhT01aWWwhVBVJg-kUuSBCnEu-wzqCzeQxDQTRyZ2LVax1ivtVhC9ZtemDEagSsBGFY9jALSgmGJv4Oo",
            rating: 4
        }
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <div className="w-full max-w-[1440px] px-4 md:px-10 py-6">
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[480px] flex flex-col justify-center items-start p-8 md:p-16 gap-6 bg-cover bg-center shadow-lg"
                    style={{ backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.1) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDCsawsdSOEoVS57mdl2NSyYpXCe-6lpiH_qZplgLAkdzbfwMkc0p0vM2kxDhw3zBkWlKpEL3Y7zWBqwAtX3j1WOvoDqBj0spq8aqkRivaQ4-5FDY70R9iIgUhfy3zHgmLhhpQwRIyHkGWFhJST6eA-YTcnEtdp3u6-ZEykA0VFkXZJK9JlpswjUjlfVCj0DhsiJ_ocGsOm8vhRYREHyBNuaIl2VcPMIM8AVNPJEqw55wGL2nz-G1SAe7ECzXcsiLUkEc1M3SMQjj7i")` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-60"></div>
                    <div className="relative z-10 flex flex-col gap-4 max-w-2xl text-left animate-fade-in-up">
                        <span className="inline-flex items-center self-start rounded-full bg-primary/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-text-main backdrop-blur-sm">
                            Ramzan Special
                        </span>
                        <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-sm">
                            Fresh Fruits for a <br /><span className="text-primary">Blessed Iftar</span>
                        </h1>
                        <h2 className="text-neutral-100 text-lg md:text-xl font-medium leading-relaxed max-w-lg drop-shadow-sm">
                            Premium dates, sweet melons, and seasonal baskets delivered straight to your door. Order before 4 PM for same-day delivery.
                        </h2>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/shop" className="flex items-center gap-2 h-12 px-8 bg-primary hover:bg-[#0fd650] text-[#111813] text-base font-bold rounded-lg transition-transform hover:scale-105 shadow-lg shadow-primary/25">
                                <span>Shop Deals</span>
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </Link>
                            <Link to="/shop" className="flex items-center gap-2 h-12 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 text-base font-bold rounded-lg transition-colors">
                                <span>View Categories</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Banner */}
            <div className="w-full bg-white dark:bg-background-dark border-b border-neutral-100 dark:border-neutral-800">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-background-light dark:bg-neutral-800/50">
                        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[28px]">local_shipping</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-text-main dark:text-white">Fast Delivery</h3>
                            <p className="text-sm text-text-muted">Guaranteed before Iftar time</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-background-light dark:bg-neutral-800/50">
                        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[28px]">verified</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-text-main dark:text-white">Premium Quality</h3>
                            <p className="text-sm text-text-muted">Hand-picked fresh fruits</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-background-light dark:bg-neutral-800/50">
                        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[28px]">redeem</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-text-main dark:text-white">Halal Certified</h3>
                            <p className="text-sm text-text-muted">Trusted sourcing & handling</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="w-full max-w-[1440px] px-4 md:px-10 py-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white tracking-tight">Shop by Category</h2>
                        <p className="text-text-muted mt-2">Find your favorites quickly</p>
                    </div>
                    <Link to="/shop" className="hidden sm:flex items-center gap-1 text-primary font-bold hover:underline">
                        See All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {/* Category Items */}
                    {categories.map((cat, idx) => (
                        <Link key={idx} to={`/shop?category=${cat.slug}`} className="group flex flex-col gap-4 text-center items-center">
                            <div className="w-full aspect-square rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all ring-2 ring-transparent group-hover:ring-primary/50 relative">
                                {cat.image_url ? (
                                    <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url("${cat.image_url}")` }}></div>
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-primary">image</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-text-main dark:text-white text-base font-bold group-hover:text-primary transition-colors capitalize">{cat.name}</p>
                                <p className="text-text-muted text-xs font-medium line-clamp-1">{cat.description || 'Shop Now'}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Products (Horizontal Scroll) */}
            <div className="w-full bg-white dark:bg-neutral-900 py-16">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white tracking-tight">Iftar Essentials</h2>
                            <p className="text-text-muted mt-2">Top picks for your daily Iftar table</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="size-10 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="size-10 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} {...product} variant="featured" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Promotion Banner / Build a Box */}
            <div className="w-full max-w-[1440px] px-4 md:px-10 py-16">
                <div className="rounded-3xl bg-neutral-900 dark:bg-neutral-800 overflow-hidden relative">
                    <div className="absolute inset-0 z-0">
                        <div className="w-full h-full bg-cover bg-center opacity-40" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkWYeY89OM0lInMaLR8-Xo7JO5wKoOU_LgEzbTjBxhfH6TGQAtnaVX4qhySqC_aiK4A0ZtZKalF7Ljd53oQZWXnHVrGRBpScCjCsSkeUo9HfAcCpVY5le1LUcqGZh5ifsORjcxLCiCDo5HfTE7Qs-rDXxuD1XJ4nYUyCLAoIvhJqmKg1LRFi5Btu_9brVrzqzPjwPcvIhtsTFi70El8yIcjj9YsjO4fYhH6AiofiSmmqP-GUFxSAsu9bEVBi4QfZL-KT3IqQsfObNM")` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent"></div>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-8">
                        <div className="max-w-xl">
                            <span className="text-primary font-bold uppercase tracking-wider text-sm mb-2 block">Custom Gifting</span>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">Build Your Own <br /><span className="text-primary">Iftar Fruit Box</span></h2>
                            <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
                                Customize a healthy gift hamper for your loved ones. Choose from our premium selection of dates, dried fruits, and fresh harvest. Perfect for community Iftars.
                            </p>
                            <button className="bg-primary hover:bg-[#0fd650] text-[#111813] font-bold py-3 px-8 rounded-lg transition-transform hover:-translate-y-1 shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span>Start Building</span>
                                <span className="material-symbols-outlined">construction</span>
                            </button>
                        </div>
                        {/* Visual representation of a box */}
                        <div className="hidden md:block relative w-[300px] h-[300px] shrink-0">
                            <div className="absolute inset-0 bg-contain bg-no-repeat bg-center transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                                style={{
                                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbPn-tsAXdf8EKawRbY184gtwZV8fiQgddbxrvT769wGKIpSrdML4_h3HydPYMfzDC8t3MFiMb0lXdcPsy_aWqRy5-1PHUZFm7tJQrcVqLoyh0_A-H_438VGIhRSznCdxcRVkoQjg_r4qa1sAOVTkKpsQs_TdBMYfc3r20QRc2q3mw5iYKTTpclL7ovfd4qku5nTN5041GbxlA99WKVNUv2WvGVIw_9F81b16I_GlATA6PKADBtbOsIIFHfepYuewSxgUrF1h5Qnln")`,
                                    maskImage: 'radial-gradient(circle, black 60%, transparent 70%)',
                                    WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 70%)'
                                }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter */}
            <div className="w-full bg-primary/10 dark:bg-neutral-800/30 py-16">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <span className="material-symbols-outlined text-4xl text-primary mb-4">mail</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-4">Get Daily Iftar Deals</h2>
                    <p className="text-text-muted mb-8">Subscribe to our newsletter and get notified about flash sales on dates and fruits during Ramzan.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input className="flex-1 px-5 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-900 dark:text-white" placeholder="Enter your email address" type="email" />
                        <button className="bg-primary hover:bg-[#0fd650] text-[#111813] font-bold py-3 px-8 rounded-lg transition-colors">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-xs text-text-muted mt-4">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>
        </Layout>
    );
}
