import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function DeliveryProfilePage() {
    const { user, signOut } = useAuth();

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/delivery" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-bold text-text-main dark:text-white">Delivery Profile</h1>
            </div>

            <div className="bg-white dark:bg-card-dark p-8 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                <div className="flex flex-col items-center pb-6 border-b border-gray-100 dark:border-white/5">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <span className="material-symbols-outlined text-5xl">person</span>
                    </div>
                    <h2 className="text-xl font-bold text-text-main dark:text-white">{user?.email?.split('@')[0] || 'Delivery Partner'}</h2>
                    <p className="text-text-muted">{user?.email}</p>
                    <span className="mt-2 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        {user?.role}
                    </span>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg dark:text-white">Account Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                            <p className="text-xs text-text-muted uppercase mb-1">User ID</p>
                            <p className="font-mono text-sm dark:text-gray-300 truncate">{user?.id}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                            <p className="text-xs text-text-muted uppercase mb-1">Status</p>
                            <p className="font-bold text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Active
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={() => signOut()}
                        className="w-full py-3 border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
