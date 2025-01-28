import * as React from 'react';
import { CompleteSendEmail } from '@/lib/schemas/email-template-schema';


export const EmailTemplate = (email: CompleteSendEmail) => (
  <div style={{
    margin: 0,
    padding: 0,
    backgroundColor: '#ffffff',
    fontFamily: 'Arial,sans-serif',
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#17181a'
  }}>
    <table role="presentation" cellPadding="0" cellSpacing="0" style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      background: '#ffffff'
    }}>
      <tbody>
        <tr>
          <td style={{ padding: '20px' }}>
            <table role="presentation" cellPadding="0" cellSpacing="0"
              style={{
                width: '100%',
                backgroundColor: '#fff',
                marginBottom: 32,
                borderBottom: '1px solid #e5e7eb'
              }}>
              <tbody>
                <tr>
                  <td style={{ padding: '28px 32px' }}>
                    <table role="presentation" cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '70px', verticalAlign: 'top' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://www.devethique.fr/logo.png" alt="Devethique Logo" width="70" height="70"
                              style={{ display: 'block', width: '70px', height: 'auto' }} />
                          </td>
                          <td style={{ paddingLeft: '24px', verticalAlign: 'middle' }}>
                            <h1
                              style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: '#1a4480',
                                margin: 0,
                                lineHeight: 1.2
                              }}
                            >
                              Devethique</h1>
                            <p
                              style={{
                                fontSize: 16,
                                color: '#17181a',
                                margin: '8px 0 0',
                                fontWeight: 500,
                                lineHeight: 1.5
                              }}
                            >
                              On vous accompagne pour un web d&apos;avenir : sécurisé, performant et durable
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <table role="presentation" cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px 0 32px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <div className="prospection-message">
                      <p className="introduction">
                        <b>Bonjour, {email.contact}</b>
                      </p>
                      <p>
                        Je suis Alexandre Hernandez, développeur web chez <b>Devethique</b>, une agence spécialisée
                        dans la création de sites web.
                      </p>

                      <p>
                        Lors de recherches sur {email.recherche}, j&apos;ai eu l&apos;occasion de visiter
                        votre site <a href={email.site} style={{ color: '#1a4480', textDecoration: 'none', }}>{email.site}</a> et j&apos;ai remarqué qu&apos;il possède un bon potentiel pour mieux refléter votre expertise et
                        attirer davantage de clients.
                      </p>

                      <p>
                        Voici quelques pistes d&apos;amélioration que nous pourrions envisager ensemble :
                      </p>

                      <ul>
                        {email.ameliorationList.split(',').map((amelioration) => (
                          <li key={amelioration}>{amelioration}</li>
                        ))}
                      </ul>

                      <p className="personal-touch">
                        En parallèle, le mot-clé &quot;{email.motCle}&quot; est un mot clé très recherché sur
                        Google, <b>mais votre site apparaît actuellement en {email.numeroPage}ème page</b>. Avec une stratégie
                        ciblée d&apos;optimisation SEO, il serait possible de gagner en visibilité et d&apos;attirer
                        davantage de prospects.
                      </p>

                      <p className="call-to-action">
                        Accepteriez-vous un échange de <b>20 minutes</b> pour que je puisse vous présenter nos
                        solutions ?
                      </p>

                      <p className="signature">
                        À très bientôt j&apos;espère,<br />
                        Alexandre
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table role="presentation" cellPadding="0" cellSpacing="0" style={{ width: '100%', marginTop: 30 }}>
              <tbody>
                <tr>
                  <td style={{ width: '70px', verticalAlign: 'top' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/tête_de_alex.jpg" alt="Alexandre Hernandez"
                      style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} />
                  </td>
                  <td style={{ paddingLeft: '15px', verticalAlign: 'top' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Alexandre Hernandez</p>
                    <p style={{ margin: '5px 0', color: '#1a4480' }}>Développeur Web chez Devethique</p>
                    <table role="presentation" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ fontSize: 14, color: '#4b5563' }}>
                            <a href="https://www.devethique.fr" style={{ color: '#1a4480', textDecoration: 'none' }}>
                              <span style={{ marginRight: 5, color: '#1a4480' }}>&#127760;</span>
                              www.devethique.fr
                            </a>
                          </td>
                          <td style={{ paddingLeft: 10, fontSize: 14, color: '#4b5563' }}>
                            <span><span style={{ color: '#1a4480' }}>&#128187;</span> Spécialisation Web</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
