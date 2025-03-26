"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@dashboard/components/Header"

export function DashboardLayout({
    children,
    count,
}: {
    children: React.ReactNode
    count?: number
}) {
    return (
        <SidebarProvider>
            <div className="group peer hidden md:block text-sidebar-foreground">
                <AppSidebar className="hidden border-r border-border/40 bg-sidebar md:flex" count={count} />
            </div>
            <main className="relative flex min-h-screen w-full flex-col peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]">
                <Header />
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
} 