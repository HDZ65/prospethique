"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { navigationConfig } from "@/data/dashboard-navigation"
import { usePathname } from "next/navigation"

export function Header() {
    const pathname = usePathname()
    const pageTitle = navigationConfig.breadcrumbs[pathname] || 'Dashboard'

    // Trouve la section parent dans la navigation
    const getParentSection = () => {
        const section = navigationConfig.navMain.find(item =>
            item.items?.some(subItem => subItem.url === pathname)
        )
        return section ? {
            title: section.title,
            url: section.url
        } : null
    }

    const parentSection = getParentSection()

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
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
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}