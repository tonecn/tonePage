// store/useUserStore.ts
import { User } from '@/lib/types/user';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserState {
    user: User | null;
    isLoading: boolean;
    initialized: boolean;

    // Actions
    setInitialized: () => void;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>()(
    devtools((set, get) => ({
        user: null,
        isLoading: false,
        initialized: false,

        setInitialized: () => set({ initialized: true }),
        setUser: (user) => set({ user, isLoading: false }),
        clearUser: () => set({ user: null }),
    }))
);