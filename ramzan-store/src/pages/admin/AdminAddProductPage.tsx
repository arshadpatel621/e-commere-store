import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminAddProductPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name, slug');
        if (data && data.length > 0) {
            setCategories(data);
            // specific fix: only set default if category is not already set (e.g. if we add edit functionality later)
            // For add page, it's always empty initially
            setFormData(prev => ({ ...prev, category: data[0].slug }));
        }
    };

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        unit: 'kg',
        category: '', // Dynamic default
        image: '',
        stock_quantity: '100',
        badge: '',
        is_ramzan_special: false
    });

    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image: data.publicUrl }));
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
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
        setLoading(true);

        try {
            const { error } = await supabase.from('products').insert([{
                name: formData.name,
                price: parseFloat(formData.price),
                unit: formData.unit,
                category: formData.category,
                image: formData.image,
                stock_quantity: parseInt(formData.stock_quantity),
                badge: formData.badge || null,
                is_ramzan_special: formData.is_ramzan_special
            }]);

            if (error) throw error;
            navigate('/admin/products');
        } catch (error: any) {
            alert('Error adding product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-text-main dark:text-white">Add New Product</h1>

            <div className="bg-white dark:bg-card-dark p-8 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Product Name</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" placeholder="e.g. Ajwa Dates" />
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
                            <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Unit</label>
                            <input required name="unit" value={formData.unit} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" placeholder="kg, dozen, box" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Stock</label>
                            <input required type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Product Image</label>

                        <div className="flex flex-col gap-4">
                            {/* File Upload Option */}
                            <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-4xl text-text-muted">cloud_upload</span>
                                    <span className="text-sm font-medium text-text-main dark:text-gray-300">
                                        {uploading ? 'Uploading...' : 'Click to upload photo'}
                                    </span>
                                    <span className="text-xs text-text-muted">PNG, JPG, GIF up to 5MB</span>
                                </label>
                            </div>

                            {/* Manual URL Input (Fallback) */}
                            <div>
                                <p className="text-xs text-text-muted mb-1">Or paste a direct URL:</p>
                                <input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10 text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {formData.image && (
                            <div className="mt-4 p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 inline-block">
                                <p className="text-xs text-text-muted mb-2">Preview:</p>
                                <img src={formData.image} alt="Preview" className="h-32 w-32 object-cover rounded-lg border dark:border-white/10" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Badge (Optional)</label>
                            <input name="badge" value={formData.badge} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10" placeholder="e.g. Best Seller" />
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
                        <button disabled={loading || uploading} type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-[#0fd650] transition-colors disabled:opacity-50">
                            {loading ? 'Saving...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
