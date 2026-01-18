import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminEditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, [id]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name, slug');
        if (data) setCategories(data);
    };

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        unit: 'kg',
        category: 'fruits',
        image: '',
        stock_quantity: '',
        badge: '',
        is_ramzan_special: false
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        if (!id) return;
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) {
            alert('Error fetching product');
            navigate('/admin/products');
        } else if (data) {
            setFormData({
                name: data.name,
                price: data.price.toString(),
                unit: data.unit,
                category: data.category,
                image: data.image,
                stock_quantity: data.stock_quantity.toString(),
                badge: data.badge || '',
                is_ramzan_special: data.is_ramzan_special
            });
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let val: string | boolean = value;
        if (type === 'checkbox') {
            val = (e.target as HTMLInputElement).checked;
        }
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase.from('products').update({
                name: formData.name,
                price: parseFloat(formData.price),
                unit: formData.unit,
                category: formData.category,
                image: formData.image,
                stock_quantity: parseInt(formData.stock_quantity),
                badge: formData.badge || null,
                is_ramzan_special: formData.is_ramzan_special
            }).eq('id', id);

            if (error) throw error;
            navigate('/admin/products');
        } catch (error: any) {
            alert('Error updating product: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading product details...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-text-main dark:text-white">Edit Product</h1>

            <div className="bg-white dark:bg-card-dark p-8 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Product Name</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10 dark:text-white capitalize">
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Price (INR)</label>
                            <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Unit</label>
                            <input required name="unit" value={formData.unit} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Stock</label>
                            <input required type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Image URL</label>
                        <input required name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                        {formData.image && (
                            <div className="mt-2">
                                <p className="text-xs text-text-muted mb-1">Preview:</p>
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="h-32 w-32 object-cover rounded-lg border dark:border-white/10"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+Image')}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Badge (Optional)</label>
                            <input name="badge" value={formData.badge} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                        </div>
                        <div className="flex items-center pt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="is_ramzan_special" checked={formData.is_ramzan_special} onChange={handleChange} className="w-5 h-5 accent-primary" />
                                <span className="font-medium dark:text-white">Is Ramzan Special?</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-white/5 dark:text-white transition-colors">Cancel</button>
                        <button disabled={saving} type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-[#0fd650] transition-colors disabled:opacity-50">
                            {saving ? 'Saving...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
