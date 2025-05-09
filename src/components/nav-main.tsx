"use client"

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3">
        <SidebarMenu>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  asChild
                >
                  <Link 
                    href={item.url}
                    className={`
                      group relative flex items-center gap-3 rounded-lg px-3 py-5 transition-all duration-200 sidebar-item-hover
                      ${isActive 
                        ? 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-text))] font-medium' 
                        : 'text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-fg))]'
                      }
                    `}
                  >
                    {item.icon && (
                      <item.icon 
                        className={`h-5 w-5 shrink-0
                          ${isActive 
                            ? 'text-[hsl(var(--sidebar-highlight))]' 
                            : 'text-[hsl(var(--sidebar-muted))]'
                          }
                        `}
                      />
                    )}
                    <span className="font-medium">{item.title}</span>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[hsl(var(--sidebar-highlight))]" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
