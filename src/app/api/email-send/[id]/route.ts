import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!params.id) {
        return Response.json({ error: 'ID requis' }, { status: 400 });
    }

    try {
        const { data } = await resend.emails.get(params.id);
        return Response.json(data);
    } catch (error) {
        console.error('Erreur lors de la récupération du statut:', error);
        return Response.json({ 
            error: error instanceof Error ? error.message : 'Erreur inconnue' 
        }, { status: 500 });
    }
} 