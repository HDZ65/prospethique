import DashboardQuickActions from "./components/dashboard-quick-actions";
import QuickActionsBar from "./components/quick-actions-bar";

export default function DashboardPage() {
    return (
        <>
            <DashboardQuickActions />   
            <QuickActionsBar />
            <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-10">   
            </div>
        </>
    );
}