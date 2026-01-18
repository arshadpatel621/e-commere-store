import { supabase } from '../lib/supabase';

export type UserRole = 'user' | 'admin' | 'delivery';

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
    avatar_url?: string;
    phone?: string;
    address?: string;
    city?: string;
}

export const authService = {
    // Get current user profile
    async getCurrentProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data as UserProfile;
    },

    // Sign out
    async signOut() {
        return await supabase.auth.signOut();
    }
};
