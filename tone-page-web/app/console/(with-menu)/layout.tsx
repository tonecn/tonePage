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
import { toast } from "sonner";
import useSWR from "swr";

export default function ConsoleMenuLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const router = useRouter();


    const getInitialData = () => {
        if (!window || !window.localStorage) return null;
        const cache = localStorage.getItem(UserApi.USER_ME_CACHE_KEY);
        if (!cache) return;
        try {
            const user = JSON.parse(cache);
            if (!user || !user.userId) throw new Error();
            return user;
        } catch (error) {
            localStorage.removeItem(UserApi.USER_ME_CACHE_KEY);
        }
        return undefined;
    }

    const { data: user, isLoading, error } = useSWR(
        '/api/user/me',
        async () => {
            const data = await UserApi.me();
            localStorage.setItem(UserApi.USER_ME_CACHE_KEY, JSON.stringify(data));
            return data;
        },
        {
            onError: (error) => {
                if (error.statusCode === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem(UserApi.USER_ME_CACHE_KEY);
                    toast.info('登录凭证已失效，请重新登录');
                    router.replace('/console/login');
                }
            },
            fallbackData: getInitialData(),
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
