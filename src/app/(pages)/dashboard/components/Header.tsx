"use client"

import { usePathname } from "next/navigation"
import { navigationConfig } from "@/data/dashboard-navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Header() {
    const pathname = usePathname()
    const parentSection = navigationConfig.navMain.find(section =>
        section.items?.some(item => item.url === pathname)
    )
    const pageTitle = navigationConfig.breadcrumbs[pathname] || parentSection?.items?.find(item => item.url === pathname)?.title || 'Dashboard'
    const isRootDashboard = pathname === '/dashboard'

    return (
        <header className="sticky top-0 z-50 flex h-14 items-center border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {isRootDashboard ? (
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        ) : (
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                {parentSection && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={parentSection.url}>
                                                {parentSection.title}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                )}
                                {pageTitle !== 'Dashboard' && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}