"use client"

import * as React from "react"
import { navigationConfig } from "@/data/dashboard-navigation"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navigationConfig.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationConfig.navMain} />
        <NavProjects projects={navigationConfig.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigationConfig.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
