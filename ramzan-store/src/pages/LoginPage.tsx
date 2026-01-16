import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';
import type { UserRole } from '../services/auth';

export default function LoginPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<UserRole>('user');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;

        try {
            if (isSignUp) {
                // Sign Up Logic
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: activeTab // 'user', 'admin', 'delivery'
                        }
                    }
                });
                if (signUpError) throw signUpError;
                alert('Signup successful! Please check your email for verification.');
                setIsSignUp(false); // Switch to login after signup
            } else {
                // Sign In Logic
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (signInError) throw signInError;

                // Check role and redirect
                if (data.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', data.user.id)
                        .single();

                    const role = profile?.role || 'user';

                    if (role === 'admin') navigate('/admin/dashboard');
                    else if (role === 'delivery') navigate('/delivery');
                    else navigate('/');
                }
            }
        } catch (err: any) {
            console.error('Login Error:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-center text-3xl font-extrabold text-text-main dark:text-white">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-text-muted">
                        Login to access your Ramzan Store account
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-card-dark py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-white/5">

                        {/* Role Tabs - Mobile Optimized */}
                        <div className="mb-8">
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 text-center">Select Login Type</label>
                            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 dark:bg-black/30 rounded-xl">
                                {(['user', 'admin', 'delivery'] as UserRole[]).map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setActiveTab(role)}
                                        className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all capitalize ${activeTab === role
                                            ? 'bg-white dark:bg-gray-800 text-primary shadow-sm ring-1 ring-black/5'
                                            : 'text-text-muted hover:text-text-main dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px] ${activeTab === role ? 'text-primary' : 'text-gray-400'}`}>
                                            {role === 'user' ? 'person' : role === 'admin' ? 'admin_panel_settings' : 'local_shipping'}
                                        </span>
                                        <span className={`${activeTab === role ? 'text-text-main dark:text-white' : ''}`}>{role}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center border border-red-100 dark:border-red-800/50 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {isSignUp && (
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1.5">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-gray-400 text-[20px]">badge</span>
                                            </div>
                                            <input
                                                name="fullName"
                                                type="text"
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-black/20 text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-1.5">Email address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-black/20 text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-1.5">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-gray-400 text-[20px]">lock</span>
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-black/20 text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-black bg-primary hover:bg-[#0fd650] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {isSignUp ? 'Create Account' : `Login as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Only Users can sign up freely */}
                        {activeTab === 'user' && (
                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
                                >
                                    {isSignUp ? (
                                        <>Already have an account? <span className="text-primary font-bold">Sign in</span></>
                                    ) : (
                                        <>Don't have an account? <span className="text-primary font-bold">Sign Up</span></>
                                    )}
                                </button>
                            </div>
                        )}

                        {activeTab !== 'user' && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0">info</span>
                                    <p className="text-xs text-blue-800 dark:text-blue-200">
                                        Note: <strong>{activeTab === 'admin' ? 'Admin' : 'Delivery Staff'}</strong> accounts are managed internally.
                                        {isSignUp && " Public registration is disabled for this role."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
