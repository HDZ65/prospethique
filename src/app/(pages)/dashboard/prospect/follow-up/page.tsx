import { Suspense } from 'react';
import { getProspectsToFollowUp } from '@actions/prospects/email.action';
import { FollowUpList } from './components/follow-up-list';
import { Progress } from '@/components/ui/progress';
import { ProspectWithId } from '@/lib/schemas/prospect-schema';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function FollowUpListServer() {
    const { data: prospects } = await getProspectsToFollowUp() || { data: [] };
    console.log('prospects', prospects);
    return <FollowUpList prospects={prospects as ProspectWithId[]} />;
}

export default function FollowUpPage() {
    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Prospects à relancer</h1>
            <Suspense fallback={<Progress value={73} />}>
                <FollowUpListServer />
            </Suspense>
        </div>
    );
} 