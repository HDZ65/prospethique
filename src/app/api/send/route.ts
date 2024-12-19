import { EmailTemplate } from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, contact, website, ameliorationList, recherche, motCle, numeroPage } = await request.json();

  try {

    const { data, error } = await resend.emails.send({
      from: '"Agence Devethique" <contact@devethique.fr>',
      to: [email],
      subject: `Optimisation Web Personnalisée pour ${contact}`,
      react: EmailTemplate({ contact, website, ameliorationList, recherche, motCle, numeroPage }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
