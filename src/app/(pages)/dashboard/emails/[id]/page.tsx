import { getEmailById } from '@actions/prospects/email.action';
import { notFound } from 'next/navigation';
import { EmailTemplate } from '@/components/templates-email/primary-email-template';
import { CompleteSendEmail } from '@/lib/schemas/email-template-schema';

export default async function EmailDetailPage({ params }: { params: { id: string } }) {
    const { id } = await Promise.resolve(params);

    const { data: email, failure } = await getEmailById(id);

    if (failure || !email) {
        notFound();
    }

    return (
        <div className="container max-w-7xl mx-auto p-4">
            <EmailTemplate {...email as CompleteSendEmail} />
        </div>
    );
} 