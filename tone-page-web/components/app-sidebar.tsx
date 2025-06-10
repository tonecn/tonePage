"use client"

import * as React from "react"
import {
  CloudUpload,
  Inbox,
  Mail,
  Server,
  SquareTerminal,
  Undo2,
  UsersRound,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "网站管理",
      url: "/console/web",
      icon: SquareTerminal,
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
          url: "/console/mail/manage"
        }
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
      title: "前往首页",
      url: "/",
      icon: Undo2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
