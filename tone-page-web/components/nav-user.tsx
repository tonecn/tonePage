"use client"

import {
  ChevronsUpDown,
  KeyRound,
  LogOut,
  UserRoundCog,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import useSWR from "swr"
import { authApi, UserApi } from "@/lib/api"
import { Skeleton } from "./ui/skeleton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ApiError } from "next/dist/server/api-utils"
import SetPassword from "./nav-user/SetPassword"
import { useState } from "react"

export function NavUser({ }: {}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const { data: user, isLoading, error } = useSWR(
    '/api/user/me',
    () => UserApi.me(),
    {
      onError: (error) => {
        if (error.statusCode === 401) {
          localStorage.removeItem('token');
          toast.info('登录凭证已失效，请重新登录');
          router.replace('/console/login');
        }
      }
    }
  );

  if (!isLoading && !error && !user) {
    router.replace('/console/login');
    localStorage.removeItem('token');
    toast.error('账户状态异常，请重新登录');
  }

  async function logout() {
    try {
      await authApi.logout();
      localStorage.removeItem('token');
      toast.success('登出成功');
      router.replace('/console/login');
    } catch (error) {
      toast.error('登出失败，请稍后再试');
    }
  }

  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {
                  user && <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="rounded-lg">U</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.nickname}</span>
                      <span className="truncate text-xs">{user.username}</span>
                    </div>
                  </>
                }
                {
                  isLoading && <div className="w-full flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 flex flex-col gap-1">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                    </div>
                  </div>
                }
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                {
                  user &&
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="rounded-lg">U</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.nickname}</span>
                      <span className="truncate text-xs">{user.username}</span>
                    </div>
                  </div>
                }
                {
                  isLoading && <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 flex flex-col gap-1">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                    </div>
                  </div>
                }
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserRoundCog />
                账户信息
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeout(() => { setPasswordOpen(true) }, 0)}>
                <KeyRound />
                修改密码
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut />
                登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu >

      <SetPassword open={passwordOpen} onOpenChange={setPasswordOpen} />
    </>
  )
}
