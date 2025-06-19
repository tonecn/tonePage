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
import { useUserMe } from "@/hooks/user/use-user-me";
import { UserApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ConsoleMenuLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();

    const { user, isLoading, error } = useUserMe({
        onError: (e) => {
            if (e.statusCode === 401) {
                toast.info('登录凭证已失效，请重新登录');
                router.replace('/console/login');
            }
        }
    });

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
