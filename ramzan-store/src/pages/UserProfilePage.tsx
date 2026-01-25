import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import { LogOut, User, Camera, Loader2, ArrowLeft } from 'lucide-react';

interface ProfileData {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    avatar_url: string;
}

export default function UserProfilePage() {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<ProfileData>({
        full_name: '',
        phone: '',
        address: '',
        city: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    city: data.city || '',
                    avatar_url: data.avatar_url || ''
                });
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update local state immediately
            setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));

            // Auto-save the avatar URL to profile
            await supabase
                .from('profiles')
                .update({ avatar_url: data.publicUrl })
                .eq('id', user?.id);

        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user?.id);

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error: any) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl w-full mx-auto px-4 py-8 md:py-12">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-8 text-text-main dark:text-white text-center md:text-left">My Profile</h1>

                <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="h-24 md:h-32 bg-gradient-to-r from-primary/20 to-primary/5 relative">
                        <button
                            onClick={() => signOut()}
                            className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm hover:bg-red-50 text-red-600 hover:text-red-700 font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm transition-colors border border-white/20 shadow-sm flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>

                    <div className="px-4 md:px-8 pb-8">
                        <div className="relative -mt-12 md:-mt-16 mb-6 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                            <div className="relative group shrink-0">
                                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white dark:border-card-dark bg-gray-100 dark:bg-white/5 overflow-hidden flex items-center justify-center">
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-[#0fd650] transition-colors shadow-lg">
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 md:w-5 md:h-5" />}
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            <div className="text-center md:text-left mb-2 flex-1 min-w-0">
                                <h2 className="text-xl md:text-2xl font-bold text-text-main dark:text-white truncate">{formData.full_name || 'User'}</h2>
                                <p className="text-sm text-text-muted truncate">{user?.email}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-text-main dark:text-gray-300">Full Name</label>
                                    <input
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-text-main dark:text-gray-300">Phone Number</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="+91..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-text-main dark:text-gray-300">City</label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="Mumbai, Delhi..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-text-main dark:text-gray-300">Address</label>
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="House/Flat No, Area..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-[#0fd650] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
