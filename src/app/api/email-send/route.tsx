import { EmailTemplate } from '@/components/templates-email/primary-email-template';
import { type NextRequest } from 'next/server'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);



export async function POST(request: Request): Promise<Response> {
    try {
        const data = await request.json();

        const { email, ...emailData } = data;

        const { data: resendId, error } = await resend.emails.send({
            from: '"Agence Devethique" <contact@devethique.fr>',
            to: [email],
            subject: `Optimisation Web Personnalisée pour ${data.contact}`,
            react: <EmailTemplate {...emailData} />,
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        const resendData = await resend.emails.get(resendId?.id as string);
        return Response.json(resendData);

    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id');


    if (!id) {
        return Response.json({ error: 'ID requis' }, { status: 400 });
    }

    try {
        const { data: resendData } = await resend.emails.get(id);
        return Response.json(resendData);
    } catch (error) {
        console.error('Erreur lors de la récupération du statut:', error);
        return Response.json({
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }, { status: 500 });
    }
}