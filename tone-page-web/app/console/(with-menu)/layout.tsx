'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function ConsoleMenuLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isClientSide = typeof window !== 'undefined';
    const router = useRouter();

    const { data: user, isLoading, error, mutate } = useSWR(
        '/api/user/me',
        async () => UserApi.me(),
        {
            onError: (error) => {
                if (error.statusCode === 401) {
                    if (isClientSide) {
                        localStorage.removeItem('token');
                    }
                    toast.info('登录凭证已失效，请重新登录');
                    router.replace('/console/login');
                }
            },
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    if (!isLoading && !error && !user) {
        router.replace('/console/login');
        localStorage.removeItem('token');
        localStorage.removeItem(UserApi.USER_ME_CACHE_KEY);
        toast.error('账户状态异常，请重新登录');
    }

    return (
        <SidebarProvider>
            <AppSidebar user={user} isUserLoading={isLoading} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="w-[1px] h-4 mr-2 bg-zinc-300"></div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: 'long'
                                        }).format(new Date())}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
