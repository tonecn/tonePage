"use client"

import * as React from "react"
import {
  CloudUpload,
  Inbox,
  LucideIcon,
  Mail,
  Server,
  SquareTerminal,
  Undo2,
  UserPen,
  UsersRound,
} from "lucide-react"

import { NavMain } from "@/app/console/(with-menu)/components/nav-main"
import { NavUser } from "@/app/console/(with-menu)/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: User | null }) {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: null as null | {
      title: string
      url: string
      icon?: LucideIcon
      isActive?: boolean
      isHidden?: boolean
      items?: {
        title: string
        url: string
        isHidden?: boolean
      }[]
    }[],
  }

  data.navMain = [
    {
      title: "网站管理",
      url: "/console/web",
      icon: SquareTerminal,
      isHidden: !user?.roles.includes(Role.Admin),
      items: [
        {
          title: "资源",
          url: "/console/web/resource",
        },
        {
          title: "博客",
          url: "/console/web/blog",
        },
      ],
    },
    {
      title: "用户管理",
      url: "/console/user/list",
      icon: UsersRound,
      isHidden: !user?.roles.includes(Role.Admin),
    },
    {
      title: "邮件系统",
      url: "/console/mail",
      icon: Mail,
      items: [
        {
          title: "收件箱",
          url: "/console/mail/inbox",
        },
        {
          title: "已发送",
          url: "/console/mail/sent",
        },
        {
          title: "发送邮件",
          url: "/console/mail/send",
        },
        {
          title: "邮件管理",
          url: "/console/mail/manage",
          isHidden: !user?.roles.includes(Role.Admin),
        },
      ],
    },
    {
      title: "文件存储",
      url: "/console/storage",
      icon: CloudUpload,
    },
    {
      title: "虚拟云空间",
      url: "/console/vspace",
      icon: Inbox,
    },
    {
      title: "虚拟主机",
      url: "/console/vserver",
      icon: Server,
    },
    {
      title: "账户信息",
      url: "/console/profile",
      icon: UserPen
    },
    {
      title: "前往首页",
      url: "/",
      icon: Undo2,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/console">
              <SidebarMenuButton size="lg" asChild>
                <div className="cursor-pointer">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <SquareTerminal className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">特恩的日志 - 控制台</span>
                    <span className="">v1.0.0</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
