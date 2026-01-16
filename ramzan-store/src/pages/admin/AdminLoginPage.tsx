import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/Layout';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout hideFooter>
            <div className="flex-grow flex items-center justify-center px-4 py-20 bg-gray-50 dark:bg-background-dark">
                <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex size-12 rounded-xl bg-primary/10 items-center justify-center text-primary mb-4">
                            <span className="material-symbols-outlined text-2xl">shield_person</span>
                        </div>
                        <h1 className="text-2xl font-bold text-text-main dark:text-white">Admin Access</h1>
                        <p className="text-text-muted text-sm mt-2">Sign in to manage your store</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-primary hover:bg-[#0fd650] text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-text-muted">
                        Only authorized personnel permitted.
                    </div>
                </div>
            </div>
        </Layout>
    );
}
