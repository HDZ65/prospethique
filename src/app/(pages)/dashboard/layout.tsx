import { getFollowUpCount } from "@/_actions/prospects/email.action"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@dashboard/components/Header"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    const count = await getFollowUpCount()
    return (
        <SidebarProvider>
            <AppSidebar className="hidden md:flex" count={count.data?.count} />
            <SidebarInset>
                <Header />
                <div className="flex-1 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}   