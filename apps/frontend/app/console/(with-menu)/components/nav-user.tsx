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
import { Skeleton } from "../../../../components/ui/skeleton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { User } from "@/lib/types/user"
import { AuthAPI } from "@/lib/api/client"
import { useUserStore } from "@/store/useUserStore"
import SetPassword from "./nav-user/SetPassword"

export function NavUser({ user }: { user: User | null }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const userStore = useUserStore();

  async function logout() {
    try {
      await AuthAPI.logout();
      userStore.clearUser();
      toast.success('登出成功');
      router.replace('/console/login');
    } catch {
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
                  user ?
                    <>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar ?? ''} />
                        <AvatarFallback className="rounded-lg">U</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user.nickname}</span>
                        <span className="truncate text-xs">{user.username}</span>
                      </div>
                    </> :
                    <div className="w-full flex items-center gap-2">
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
                  user ?
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar ?? ''} />
                        <AvatarFallback className="rounded-lg">U</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user.nickname}</span>
                        <span className="truncate text-xs">{user.username}</span>
                      </div>
                    </div> :
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 flex flex-col gap-1">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                      </div>
                    </div>
                }
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/console/profile')}>
                <UserRoundCog />
                账户信息
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeout(() => setPasswordOpen(true), 0)}>
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

      {/* <UserProfile open={userProfileOpen} onOpenChange={setUserProfileOpen} /> */}
      <SetPassword open={passwordOpen} onOpenChange={setPasswordOpen} />
    </>
  )
}
