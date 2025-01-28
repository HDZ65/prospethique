import { Suspense } from 'react';
import { EmailTemplate } from '../components/email-form';
import { Skeleton } from "@/components/ui/skeleton";
import { getProspectById } from "@actions/prospects/prospects.action";
import { notFound } from 'next/navigation';
import { ProspectWithId } from '@/lib/schemas/prospect-schema';
import { getLastEmailForProspect } from '@actions/prospects/email.action';

interface SendEmailPageProps {
    params: { id: string };
    searchParams: { resend?: string };
}

async function SendEmailPageServer({ params, searchParams }: SendEmailPageProps) {
    const { id } = await Promise.resolve(params);
    const { resend } = await Promise.resolve(searchParams);

    const prospect = await getProspectById(id);
    if (!prospect) {
        notFound();
    }

    let lastEmail = null;
    if (resend === 'true') {
        const lastEmailData = await getLastEmailForProspect(id);
        lastEmail = lastEmailData;
        console.log('lastEmail', lastEmail);
    }

    return (
        <EmailTemplate
            initialProspect={prospect as ProspectWithId}
            lastEmail={lastEmail}
        />
    );
}

export default async function SendEmailPage(props: SendEmailPageProps) {
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <SendEmailPageServer {...props} />
        </Suspense>
    );
}
