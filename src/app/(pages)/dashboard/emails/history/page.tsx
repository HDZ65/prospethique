import { EmailHistoryList } from './components/email-history-list';
import { getEmailHistory } from '@actions/prospects/email.action';
import { CompleteSendEmail } from '@/lib/schemas/email-template-schema';

export default async function EmailHistoryPage() {
    const { data: emails } = await getEmailHistory();

    return (
        <div className="container max-w-7xl mx-auto p-4">
            <EmailHistoryList initialEmails={emails as CompleteSendEmail[]} />
        </div>
    );
} 