import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: 'user' | 'admin' | 'delivery';
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setUsers(data as Profile[]);
        setLoading(false);
    };

    const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'delivery') => {
        const confirmUpdate = window.confirm(`Are you sure you want to change this user's role to ${newRole}?`);
        if (!confirmUpdate) return;

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            alert('Error updating role: ' + error.message);
        } else {
            fetchUsers();
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User & Staff Management</h1>

            <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-text-muted">User Info</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-muted">Current Role</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-muted">Actions (Promote/Demote)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-text-muted">Loading users...</td></tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-text-main dark:text-white">{user.full_name || 'No Name'}</p>
                                        <p className="text-sm text-text-muted">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'delivery' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => updateUserRole(user.id, 'admin')}
                                                    className="px-3 py-1 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                            {user.role !== 'delivery' && (
                                                <button
                                                    onClick={() => updateUserRole(user.id, 'delivery')}
                                                    className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                >
                                                    Make Delivery
                                                </button>
                                            )}
                                            {user.role !== 'user' && (
                                                <button
                                                    onClick={() => updateUserRole(user.id, 'user')}
                                                    className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    Remove Staff Access
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
