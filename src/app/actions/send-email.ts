'use server';

import nodemailer from 'nodemailer';
import { emailConfig } from '@/config/email';

export async function sendEmail(data: {
    to: string;
    site: string;
    subject?: string;
    emailContent: string;
    images?: string[];
    contact: string;
}) {
    try {
        const transporter = nodemailer.createTransport(emailConfig);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.to,
            subject: data.subject || `Information pour le site ${data.site}`,
            html: `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="x-apple-disable-message-reformatting">
                    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
                    <meta name="color-scheme" content="light dark">
                    <meta name="supported-color-schemes" content="light dark">
                    <title>${data.subject || 'Optimisation Web Personnalisée'}</title>
                </head>
                <body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#17181a;">
                    <!-- Conteneur principal -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:0 auto;background:#ffffff;">
                        <tr>
                            <td style="padding:20px;">
                                <!-- En-tête -->
                                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#f8fafc;margin-bottom:32px;border-bottom:1px solid #e5e7eb;">
                                    <tr>
                                        <td style="padding:28px 32px;">
                                            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                                                <tr>
                                                    <td style="width:70px;vertical-align:top;">
                                                        <img src="https://media.licdn.com/dms/image/v2/D560BAQEtRb3RuW1DHw/company-logo_100_100/company-logo_100_100/0/1732536634692/devethique_logo?e=1741219200&v=beta&t=kwWmY6Q_lqwYJlz4unj3fdLYGgQ6EzpSbT8xKzBhIlU"
                                                            alt="DevÉthique Logo" width="70" height="70" style="display:block;width:70px;height:auto;">
                                                    </td>
                                                    <td style="padding-left:24px;vertical-align:middle;">
                                                        <h1 style="font-size:28px;font-weight:700;color:#1a4480;margin:0;line-height:1.2;">Devethique</h1>
                                                        <p style="font-size:16px;color:#17181a;margin:8px 0 0;font-weight:500;line-height:1.5;">
                                                            On vous accompagne pour un web d'avenir : sécurisé, performant et durable
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                
                                <!-- Corps du message -->
                                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                                    <tr>
                                        <td style="padding:8px 0 32px 0;border-bottom:1px solid #e5e7eb;">
                                            <p style="margin:0;font-size:18px;line-height:1.6;color:#17181a;font-weight:600;">Bonjour ${data.contact},</p>
                                            <p style="font-size:18px;line-height:1.6;color:#17181a;margin-bottom:20px;">
                                                ${data.emailContent}
                                            </p>
                                            
                                            <div style="margin-top: 20px;">
                                                ${data.images?.map((_, index) => 
                                                    `<img src="cid:image${index + 1}" alt="Image ${index + 1}" style="max-width: 100%; margin: 10px 0; border-radius: 8px;">`
                                                ).join('') || ''}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                
                                <!-- Signature -->
                                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:30px;">
                                    <tr>
                                        <td style="width:70px;vertical-align:top;">
                                            <img src="https://media.licdn.com/dms/image/v2/D4D03AQG92_bz47vFjA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715482178261?e=1738800000&v=beta&t=U5ncm__98BE2BWYb_sFzZ8bP8fiQ68nMqvT3RHI45KI" 
                                                alt="Alexandre Hernandez" 
                                                style="width:70px;height:70px;border-radius:50%;object-fit:cover;">
                                        </td>
                                        <td style="padding-left:15px;vertical-align:top;">
                                            <p style="margin:0;font-weight:bold;">Alexandre Hernandez</p>
                                            <p style="margin:5px 0;color:#1a4480;">Développeur Web chez Devethique</p>
                                            <table role="presentation" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="font-size:14px;color:#4b5563;">
                                                        <a href="https://www.devethique.fr" style="color:#1a4480;text-decoration:none;">
                                                            <span style="margin-right:5px;color:#1a4480;">&#127760;</span>
                                                            www.devethique.fr
                                                        </a>
                                                    </td>
                                                    <td style="padding-left:10px;font-size:14px;color:#4b5563;">
                                                        <span><span style="color:#1a4480;">&#128187;</span> Spécialisation Web</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                </body>
                </html>
              `,
            text: `${data.emailContent}\n\nPour ne plus recevoir nos emails, répondez à ce message avec "Désabonnement" comme objet.`,
        };

        // Vérification de la configuration avant l'envoi
        await transporter.verify();
        
        const result = await transporter.sendMail(mailOptions);
        return { success: true, result };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return { success: false, error: 'Erreur lors de l\'envoi de l\'email' };
    }
} 