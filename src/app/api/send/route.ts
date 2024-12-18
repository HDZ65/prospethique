import { EmailTemplate } from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, contact, website, ameliorationList, recherche, motCle, numeroPage } = await request.json();

  try {
    console.log('email', email);
    console.log('contact', contact);
    console.log('website', website);
    console.log('ameliorationList', ameliorationList);
    const { data, error } = await resend.emails.send({
      from: 'Acme <contact@devethique.fr>',
      to: [email],
      subject: 'Hello world',
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
