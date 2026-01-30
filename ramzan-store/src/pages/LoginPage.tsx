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
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLoginSuccess = async (userId: string) => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        const role = profile?.role || 'user';

        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'delivery') navigate('/delivery');
        else navigate('/');
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            console.error('Google Login Error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const verifyOtpLogic = async (token: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup'
            });

            if (error) {
                // Try 'magiclink' type as fallback if signup type fails, 
                // though for OTP it's usually 'signup' or 'email' depending on flow
                const { data: retryData, error: retryError } = await supabase.auth.verifyOtp({
                    email,
                    token,
                    type: 'email'
                });

                if (retryError) throw error;
                if (retryData.session) {
                    await handleLoginSuccess(retryData.user!.id);
                    return;
                }
            }

            if (data.session) {
                await handleLoginSuccess(data.user!.id);
            }
        } catch (err: any) {
            console.error('OTP Verification Error:', err);
            setError(err.message || 'Invalid code');
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false
                }
            });
            if (error) throw error;
            alert('Code resent successfully!');
        } catch (err: any) {
            console.error('Resend Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const formEmail = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;

        try {
            if (isSignUp) {
                // Sign Up Logic (Auto-Confirm assumes Supabase "Confirm Email" is OFF)
                const { error: signUpError, data } = await supabase.auth.signUp({
                    email: formEmail,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: activeTab // 'user', 'admin', 'delivery'
                        }
                    }
                });
                if (signUpError) throw signUpError;

                // If "Confirm Email" is OFF, user is usually logged in immediately.
                // If data.session is null, it means verification is still ON.
                if (data.session) {
                    await handleLoginSuccess(data.user!.id);
                } else {
                    setEmail(formEmail);
                    setShowOtpInput(true);
                }
            } else {
                // Sign In Logic
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email: formEmail,
                    password
                });
                if (signInError) throw signInError;

                if (data.user) {
                    await handleLoginSuccess(data.user.id);
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
                    <div className="bg-white dark:bg-card-dark py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-white/5 relative overflow-hidden rounded-2xl">

                        {/* Decorative background gradients */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-50"></div>

                        {/* Role Selection */}
                        <div className="mb-8">
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 text-center">
                                Select Account Type
                            </label>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setActiveTab(role.id)}
                                        className={`relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 ${activeTab === role.id
                                            ? 'border-primary bg-primary/5 shadow-sm scale-[1.02]'
                                            : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        <role.icon
                                            className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2 ${activeTab === role.id ? 'text-primary' : 'text-gray-400'}`}
                                            strokeWidth={activeTab === role.id ? 2.5 : 2}
                                        />
                                        <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wide ${activeTab === role.id ? 'text-primary' : 'text-gray-500'
                                            }`}>
                                            {role.label}
                                        </span>

                                        {activeTab === role.id && (
                                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full border-2 border-white dark:border-card-dark"></div>
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

                        {/* Google Login for Users */}
                        {activeTab === 'user' && (
                            <div className="mb-6">
                                <button
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-black/20 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                                >
                                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                        <path
                                            d="M12.0003 20.45c4.6667 0 8.0834-3.2083 8.0834-8.0833 0-0.6667-0.0834-1.3333-0.2084-1.9583h-7.875v3.6666h4.5417c-0.2084 1.25-0.9584 2.5-2.0417 3.25l-0.0195 0.1292 2.9782 2.3087 0.2064 0.0205c1.8333-1.6667 2.875-4.1667 2.875-7.375 0-0.7917-0.0833-1.5417-0.25-2.2917H12.0003v-4.5h9.125c0.6667 1.25 1.0417 2.6667 1.0417 4.1667 0 5.25-3.5 9.4167-8.5417 9.4167-2.625 0-4.9167-1.125-6.5-2.9167-0.6667-0.7917-1.1667-1.7083-1.4583-2.7083l-0.1287 0.0108-3.1118 2.4087-0.043 0.1213c1.6667 3.3333 5.0833 5.5833 9.0417 5.5833z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M5.4169 13.9583c-0.2917-0.8333-0.4584-1.75-0.4584-2.7083 0-0.9583 0.1667-1.875 0.4584-2.7083l-0.0142-0.1466-3.1491-2.4468-0.1064 0.0505C1.4169 7.375 1.0003 8.75 1.0003 10.25c0 1.5 0.4166 2.875 1.1458 4.0833l3.2708-2.375z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12.0003 4.75c2.3333 0 4.4167 0.8333 6.0417 2.2083l3.2083-3.2083C19.3336 2.0417 15.9169 1.0001 12.0003 1.0001 8.0419 1.0001 4.6253 3.25 2.9586 6.5833l3.2709 2.5417C7.3544 6.7083 9.5003 4.75 12.0003 4.75z"
                                            fill="#EA4335"
                                        />
                                        <path
                                            d="M12.0003 20.45c-2.5 0-4.6667-1.5833-5.7917-3.875l-3.2709 2.5417c1.6667 3.3333 5.0833 5.5833 9.0417 5.5833 2.5417 0 4.8333-0.875 6.5417-2.3333 0.5417-0.4583 1.0417-1 1.4583-1.5833l-2.9583-2.3334c-1.25 0.9583-2.9167 1.5417-4.9167 1.5417z"
                                            fill="#34A853"
                                        />
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-card-dark text-text-muted">Or continue with email</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showOtpInput ? (
                            <form className="space-y-4 sm:space-y-5" onSubmit={(e) => { e.preventDefault(); verifyOtpLogic(otp); }}>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-text-main dark:text-white ml-1">
                                        Verification Code
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => {
                                                const val = e.target.value.slice(0, 8);
                                                setOtp(val);
                                                // Auto-verify when 6 digits are entered (standard Supabase length)
                                                if (val.length === 6) {
                                                    // We can't call handleVerifyOtp directly because it takes an event
                                                    // So we create a synthetic event or extract the logic.
                                                    // For cleaner code, we'll just trigger the submit button programmatically or separate the logic.
                                                    // Let's separate the logic first.
                                                    verifyOtpLogic(val);
                                                }
                                            }}
                                            required
                                            maxLength={8}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-black/20 text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base tracking-widest"
                                            placeholder="123456"
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
                                            <span>Verifying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Verify Email</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <div className="flex flex-col gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="w-full text-center text-sm font-semibold text-primary hover:text-primary/80"
                                    >
                                        Resend Code
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowOtpInput(false)}
                                        className="w-full text-center text-sm text-text-muted hover:text-text-main"
                                    >
                                        Back to Sign Up
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
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
                                            defaultValue={email}
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
                        )}

                        {/* Footer toggles */}
                        {!showOtpInput && (
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
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
