import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    description: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Category>>({
        name: '',
        slug: '',
        description: '',
        image_url: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
        if (!error && data) setCategories(data);
        setLoading(false);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `categories/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images') // Reusing products bucket for now or use specific 'categories' bucket if exists
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Auto-generate slug if empty
        const slug = formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || '';

        const payload = { ...formData, slug };

        if (isEditing && formData.id) {
            const { error } = await supabase.from('categories').update(payload).eq('id', formData.id);
            if (error) alert('Error updating category');
        } else {
            const { error } = await supabase.from('categories').insert([payload]);
            if (error) alert('Error creating category');
        }

        resetForm();
        fetchCategories();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this category?')) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (!error) fetchCategories();
    };

    const resetForm = () => {
        setFormData({ name: '', slug: '', description: '', image_url: '' });
        setIsEditing(false);
    };

    const handleEdit = (category: Category) => {
        setFormData(category);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-text-main dark:text-white">Category Management</h1>

            {/* Form */}
            <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                <h2 className="text-lg font-bold mb-4">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1">Category Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10 dark:text-white"
                                placeholder="e.g. Fresh Fruits"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1">Slug (Optional)</label>
                            <input
                                type="text"
                                value={formData.slug || ''}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10 dark:text-white"
                                placeholder="e.g. fresh-fruits"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-black/20 dark:border-white/10 dark:text-white"
                            rows={2}
                            placeholder="Short description for display..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Category Image</label>
                        <div className="flex items-center gap-4">
                            {formData.image_url && (
                                <img src={formData.image_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover border" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            {uploading && <span className="text-xs text-primary">Uploading...</span>}
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-[#0fd650] transition-colors"
                        >
                            {isEditing ? 'Update Category' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white dark:bg-card-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 relative group">
                        <div className="h-32 w-full bg-gray-100 dark:bg-white/5 rounded-lg mb-3 overflow-hidden">
                            {cat.image_url ? (
                                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-muted">No Image</div>
                            )}
                        </div>
                        <h3 className="font-bold text-lg dark:text-white">{cat.name}</h3>
                        <p className="text-xs text-text-muted font-mono mb-2">{cat.slug}</p>
                        <p className="text-sm text-text-muted line-clamp-2">{cat.description}</p>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                                onClick={() => handleEdit(cat)}
                                className="p-1.5 bg-white dark:bg-card-dark shadow-md rounded-full text-blue-500 hover:text-blue-600"
                            >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="p-1.5 bg-white dark:bg-card-dark shadow-md rounded-full text-red-500 hover:text-red-600"
                            >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
