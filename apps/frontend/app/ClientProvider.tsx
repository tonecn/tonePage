'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { User } from '@/lib/types/user';

export function ClientProvider({
    initialUser,
    children,
}: {
    initialUser: User | null;
    children: React.ReactNode;
}) {
    const setUser = useUserStore((state) => state.setUser);
    const setInitialized = useUserStore((state) => state.setInitialized);

    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
        }
        setInitialized();
    }, [initialUser, setUser, setInitialized]);

    return <>{children}</>;
}