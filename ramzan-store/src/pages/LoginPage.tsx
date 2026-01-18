import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';
import type { UserRole } from '../services/auth';
import { User, ShieldCheck, Truck, Mail, Lock, Badge, ArrowRight, Info, AlertCircle, Loader2 } from 'lucide-react';

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
                setIsSignUp(false);
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

    const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
        { id: 'user', label: 'Customer', icon: User, color: 'text-blue-500' },
        { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'text-purple-500' },
        { id: 'delivery', label: 'Delivery', icon: Truck, color: 'text-orange-500' },
    ];

    return (
        <Layout>
            <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-black/10">
                <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                    <h2 className="text-center text-3xl font-extrabold text-text-main dark:text-white tracking-tight">
                        {isSignUp ? 'Join Ramzan Store' : 'Welcome Back'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-text-muted">
                        {isSignUp ? 'Create your account to start shopping' : 'Please sign in to continue'}
                    </p>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-card-dark py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-white/5 relative overflow-hidden">

                        {/* Decorative background gradients */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-50"></div>

                        {/* Role Selection */}
                        <div className="mb-8">
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 text-center">
                                Select Account Type
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setActiveTab(role.id)}
                                        className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${activeTab === role.id
                                                ? 'border-primary bg-primary/5 shadow-sm scale-[1.02]'
                                                : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        <role.icon
                                            className={`w-6 h-6 mb-2 ${activeTab === role.id ? 'text-primary' : 'text-gray-400'}`}
                                            strokeWidth={activeTab === role.id ? 2.5 : 2}
                                        />
                                        <span className={`text-[10px] uppercase font-bold tracking-wide ${activeTab === role.id ? 'text-primary' : 'text-gray-500'
                                            }`}>
                                            {role.label}
                                        </span>

                                        {activeTab === role.id && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-card-dark"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    {error}
                                </span>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {isSignUp && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <label className="block text-sm font-medium text-text-main dark:text-white ml-1">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Badge className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            name="fullName"
                                            type="text"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-black/20 text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-text-main dark:text-white ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-black/20 text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-text-main dark:text-white ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-black/20 text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-base font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] mt-6"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer toggles */}
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                            {activeTab === 'user' ? (
                                <div className="text-center">
                                    <p className="text-sm text-text-muted mb-2">
                                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUp(!isSignUp)}
                                        className="text-primary font-bold hover:text-primary/80 transition-colors text-sm"
                                    >
                                        {isSignUp ? 'Sign In to existing account' : 'Create a new account'}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                                    <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                                        <strong>{activeTab === 'admin' ? 'Admin' : 'Delivery Staff'} Access:</strong>
                                        <br />
                                        These accounts are internal. Please contact your system administrator if you cannot log in.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
