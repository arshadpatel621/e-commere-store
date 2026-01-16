import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Product {
    id: string;
    name: string;
    price: number;
    unit: string;
    category: string;
    stock_quantity: number;
    image: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data) setProducts(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Failed to delete product');
        } else {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-main dark:text-white">Products</h1>
                    <p className="text-text-muted">Manage your inventory</p>
                </div>
                <Link to="/admin/products/new" className="bg-primary hover:bg-[#0fd650] text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined">add</span>
                    Add Product
                </Link>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-sm text-text-muted">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-text-muted">Loading products...</td></tr>
                        ) : products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40?text=IMG')}
                                        />
                                    </div>
                                    <span className="font-medium text-text-main dark:text-white">{product.name}</span>
                                </td>
                                <td className="p-4 text-sm text-text-muted capitalize">{product.category}</td>
                                <td className="p-4 font-bold text-text-main dark:text-white">₹{product.price}/{product.unit}</td>
                                <td className="p-4 text-sm text-text-main dark:text-white">{product.stock_quantity || 0}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <Link to={`/admin/products/edit/${product.id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-blue-500">
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-red-500"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
