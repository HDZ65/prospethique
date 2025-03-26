import { getFollowUpCount } from "@/_actions/prospects/email.action"
import { DashboardLayout } from "./components/DashboardLayout"

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const count = await getFollowUpCount()
    
    return (
        <DashboardLayout count={count.data?.count}>
            {children}
        </DashboardLayout>
    )
}   