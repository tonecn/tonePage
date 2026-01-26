'use client';

import { AppSidebar } from "@/app/console/(with-menu)/components/app-sidebar"
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
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConsoleMenuLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const userStore = useUserStore();

    useEffect(() => {
        if (userStore.initialized && !userStore.user) {
            router.replace('/console/login')
        }
    }, [userStore, router])

    return (
        <SidebarProvider>
            <AppSidebar user={userStore.user} />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="w-px h-4 mr-2 bg-zinc-300"></div>
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
                <div className="flex flex-1 flex-col gap-4 px-4 py-2 min-h-0 overflow-hidden">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
