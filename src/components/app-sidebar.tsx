"use client"
import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  Calendar,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  Linkedin,
  ListIcon,
  Mail,
  SearchIcon,
  SettingsIcon,
  Users,
  UsersIcon,
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Prospects",
      url: "/dashboard/prospects",
      icon: Users,
    },
    {
      title: "Templates",
      url: "/dashboard/emails/generator",
      icon: FileTextIcon,
    },
    {
      title: "Campagnes",
      url: "/dashboard/campaigns",
      icon: Mail,
    },
    {
      title: "Statistiques",
      url: "/dashboard/stats",
      icon: BarChartIcon,
    },
    {
      title: "Linkedin",
      url: "/dashboard/linkedin",
      icon: Linkedin,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      collapsible="offcanvas" 
      className="bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]"
      {...props}
    >
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-[hsl(var(--sidebar-accent))] transition-all duration-200 rounded-lg p-3 sidebar-item-hover"
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <ArrowUpCircleIcon className="h-6 w-6 text-[hsl(var(--sidebar-highlight))]" />
                <span className="text-lg font-semibold text-[hsl(var(--sidebar-fg))]">
                  Prospethique
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-[hsl(var(--sidebar-border))] p-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}