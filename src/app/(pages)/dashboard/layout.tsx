'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@dashboard/components/Header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <SidebarProvider>
            <AppSidebar className="hidden md:flex" />
            <SidebarInset>
                <Header />
                <div className="flex-1 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}   