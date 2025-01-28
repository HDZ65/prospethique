'use client';

import { EmailTemplate } from '@/components/templates-email/primary-email-template';
import { CompleteSendEmail, SendEmail } from '@/lib/schemas/email-template-schema';


export function Preview(props: SendEmail) {
    return (
        <div className="border rounded-lg p-4 bg-white">
            <div className="prose max-w-none">
                <EmailTemplate {...props as CompleteSendEmail} />
            </div>
        </div>
    );
} 