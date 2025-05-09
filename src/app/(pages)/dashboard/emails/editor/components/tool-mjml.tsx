// prospethique/src/components/templates-email/mjml-email-template.tsx
import { render } from 'mjml-react'
import {
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlImage,
  MjmlText,
  MjmlButton,
  MjmlStyle,
  MjmlAttributes,
  MjmlAll,
  MjmlTable,
  MjmlSocial,
  MjmlSocialElement
} from 'mjml-react'
import { CompleteSendEmail } from '@/lib/schemas/email-template-schema'

export const MjmlEmailTemplate = (email: CompleteSendEmail) => {
  const mjmlTemplate = (
    <Mjml>
      <MjmlHead>
        <MjmlTitle>Devethique</MjmlTitle>
        <MjmlPreview>On vous accompagne pour un web d'avenir</MjmlPreview>
        <MjmlStyle>{`
          .header { padding: 28px 32px; }
          .logo { width: 70px; height: auto; }
          .company-name { color: #1a4480; font-size: 28px; font-weight: 700; }
          .company-tagline { color: #17181a; font-size: 16px; margin-top: 8px; }
          .content { padding: 8px 0 32px 0; }
          ul { margin: 16px 0; padding-left: 20px; }
        `}</MjmlStyle>
        <MjmlAttributes>
          <MjmlAll font-family="Arial, sans-serif" font-size="16px" line-height="1.6" color="#17181a" />
        </MjmlAttributes>
      </MjmlHead>
      <MjmlBody width={600}>
        {/* Header */}
        <MjmlSection cssClass="header" backgroundColor="#ffffff">
          <MjmlColumn>
            <MjmlImage 
              cssClass="logo"
              src="https://www.devethique.fr/logo.png"
              alt="Devethique Logo"
              width="70px"
            />
          </MjmlColumn>
          <MjmlColumn>
            <MjmlText cssClass="company-name">
              Devethique
            </MjmlText>
            <MjmlText cssClass="company-tagline">
              On vous accompagne pour un web d'avenir : sécurisé, performant et durable
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>

        {/* Content */}
        <MjmlSection cssClass="content">
          <MjmlColumn>
            <MjmlText>
              <b>Bonjour, {email.contact}</b>
            </MjmlText>
            <MjmlText>
              Je suis Alexandre Hernandez, développeur web chez <b>Devethique</b>, une agence spécialisée
              dans la création de sites web.
            </MjmlText>
            <MjmlText>
              Lors de recherches sur {email.recherche}, j'ai eu l'occasion de visiter
              votre site <a href={email.site} style={{ color: '#1a4480', textDecoration: 'none' }}>{email.site}</a> et j'ai remarqué qu'il possède un bon potentiel pour mieux refléter votre expertise et
              attirer davantage de clients.
            </MjmlText>
            <MjmlText>
              Voici quelques pistes d'amélioration que nous pourrions envisager ensemble :
            </MjmlText>
            <MjmlText>
              <ul>
                {email.ameliorationList.split(',').map((amelioration) => (
                  <li key={amelioration}>{amelioration}</li>
                ))}
              </ul>
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  )

  const { html } = render(mjmlTemplate)
  return html
}

// Composant Texte
export const MjmlTextBlock = ({ content }: { content: string }) => (
  <MjmlSection padding="10px 0">
    <MjmlColumn>
      <MjmlText font-size="16px" color="#000000" line-height="1.5">
        {content}
      </MjmlText>
    </MjmlColumn>
  </MjmlSection>
)

// Composant Bouton
export const MjmlButtonBlock = ({ 
  content, 
  url = "#",
  backgroundColor = "#1A73E8",
  textColor = "#FFFFFF",
  borderRadius = "4px"
}: {
  content: string
  url?: string
  backgroundColor?: string
  textColor?: string
  borderRadius?: string
}) => (
  <MjmlSection padding="10px 0">
    <MjmlColumn>
      <MjmlButton
        href={url}
        background-color={backgroundColor}
        color={textColor}
        border-radius={borderRadius}
        padding="12px 24px"
        align="center"
        font-size="16px"
      >
        {content}
      </MjmlButton>
    </MjmlColumn>
  </MjmlSection>
)

// Composant Liste
export const MjmlListBlock = ({ items }: { items: string[] }) => (
  <MjmlSection padding="10px 0">
    <MjmlColumn>
      <MjmlText font-size="16px" color="#000000">
        <ul style={{ paddingLeft: '20px', margin: '0' }}>
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
          ))}
        </ul>
      </MjmlText>
    </MjmlColumn>
  </MjmlSection>
)

// Composant Lien
export const MjmlLinkBlock = ({ 
  text, 
  url,
  color = "#1A73E8"
}: { 
  text: string
  url: string
  color?: string
}) => (
  <MjmlSection padding="10px 0">
    <MjmlColumn>
      <MjmlText>
        <a 
          href={url} 
          style={{ 
            color: color,
            textDecoration: 'none',
            borderBottom: `1px solid ${color}`,
            paddingBottom: '2px'
          }}
        >
          {text}
        </a>
      </MjmlText>
    </MjmlColumn>
  </MjmlSection>
)

// Composant Tableau
export const MjmlTableBlock = ({ 
  headers, 
  rows 
}: { 
  headers: string[]
  rows: string[][]
}) => (
  <MjmlSection padding="10px 0">
    <MjmlColumn>
      <MjmlTable>
        <tr style={{ backgroundColor: '#f3f4f6' }}>
          {headers.map((header, index) => (
            <th
              key={index}
              style={{
                padding: '12px',
                borderBottom: '2px solid #e5e7eb',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {header}
            </th>
          ))}
        </tr>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px'
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </MjmlTable>
    </MjmlColumn>
  </MjmlSection>
)

// Composant Social
export const MjmlSocialBlock = ({ 
  links 
}: { 
  links: Array<{
    name: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'github'
    url: string
  }>
}) => (
  <MjmlSection padding="10px 0">
    <MjmlColumn>
      <MjmlSocial
        font-size="15px"
        icon-size="30px"
        mode="horizontal"
        align="center"
        padding="10px 0"
      >
        {links.map((link, index) => (
          <MjmlSocialElement
            key={index}
            name={link.name}
            href={link.url}
            background-color="#1A73E8"
          />
        ))}
      </MjmlSocial>
    </MjmlColumn>
  </MjmlSection>
)

// Composant Image
export const MjmlImageBlock = ({ 
  src,
  alt = "",
  width = "100%",
  height = "auto",
  align = "center",
  borderRadius = "0px"
}: { 
  src: string
  alt?: string
  width?: string
  height?: string
  align?: "left" | "center" | "right"
  borderRadius?: string
}) => (
  <MjmlSection padding="10px 0">
    <MjmlColumn>
      <MjmlImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        align={align}
        border-radius={borderRadius}
      />
    </MjmlColumn>
  </MjmlSection>
)

// Composant Vidéo (en utilisant une image cliquable car MJML ne supporte pas directement les vidéos)
export const MjmlVideoBlock = ({ 
  thumbnailUrl,
  videoUrl,
  width = "100%",
  height = "auto",
  align = "center",
  playButtonColor = "#1A73E8"
}: { 
  thumbnailUrl: string
  videoUrl: string
  width?: string
  height?: string
  align?: "left" | "center" | "right"
  playButtonColor?: string
}) => (
  <MjmlSection padding="10px 0">
    <MjmlColumn>
      <MjmlImage
        src={thumbnailUrl}
        width={width}
        height={height}
        align={align}
        href={videoUrl}
        css-class="video-thumbnail"
      />
      <MjmlText align={align} padding="0">
        <a 
          href={videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: playButtonColor,
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ▶ Regarder la vidéo
        </a>
      </MjmlText>
    </MjmlColumn>
  </MjmlSection>
)

// Composant Une Colonne
export const MjmlOneColumnBlock = ({ 
  children,
  backgroundColor = "transparent",
  padding = "10px"
}: { 
  children: React.ReactNode
  backgroundColor?: string
  padding?: string
}) => (
  <MjmlSection padding={padding} background-color={backgroundColor}>
    <MjmlColumn>
      {children}
    </MjmlColumn>
  </MjmlSection>
)

// Composant Deux Colonnes
export const MjmlTwoColumnsBlock = ({ 
  leftContent,
  rightContent,
  backgroundColor = "transparent",
  padding = "10px",
  spacing = "20px"
}: { 
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  backgroundColor?: string
  padding?: string
  spacing?: string
}) => (
  <MjmlSection padding={padding} background-color={backgroundColor}>
    <MjmlColumn padding={`0 ${spacing} 0 0`}>
      {leftContent}
    </MjmlColumn>
    <MjmlColumn padding={`0 0 0 ${spacing}`}>
      {rightContent}
    </MjmlColumn>
  </MjmlSection>
)

// Composant Trois Colonnes
export const MjmlThreeColumnsBlock = ({ 
  leftContent,
  middleContent,
  rightContent,
  backgroundColor = "transparent",
  padding = "10px",
  spacing = "10px"
}: { 
  leftContent: React.ReactNode
  middleContent: React.ReactNode
  rightContent: React.ReactNode
  backgroundColor?: string
  padding?: string
  spacing?: string
}) => (
  <MjmlSection padding={padding} background-color={backgroundColor}>
    <MjmlColumn padding={`0 ${spacing} 0 0`}>
      {leftContent}
    </MjmlColumn>
    <MjmlColumn padding={`0 ${spacing}`}>
      {middleContent}
    </MjmlColumn>
    <MjmlColumn padding={`0 0 0 ${spacing}`}>
      {rightContent}
    </MjmlColumn>
  </MjmlSection>
)

// Composant Sidebar (25-75 ou 75-25)
export const MjmlSidebarBlock = ({ 
  sideContent,
  mainContent,
  sidebarPosition = "left",
  backgroundColor = "transparent",
  padding = "10px",
  spacing = "20px"
}: { 
  sideContent: React.ReactNode
  mainContent: React.ReactNode
  sidebarPosition?: "left" | "right"
  backgroundColor?: string
  padding?: string
  spacing?: string
}) => (
  <MjmlSection padding={padding} background-color={backgroundColor}>
    {sidebarPosition === "left" ? (
      <>
        <MjmlColumn width="25%" padding={`0 ${spacing} 0 0`}>
          {sideContent}
        </MjmlColumn>
        <MjmlColumn width="75%" padding={`0 0 0 ${spacing}`}>
          {mainContent}
        </MjmlColumn>
      </>
    ) : (
      <>
        <MjmlColumn width="75%" padding={`0 ${spacing} 0 0`}>
          {mainContent}
        </MjmlColumn>
        <MjmlColumn width="25%" padding={`0 0 0 ${spacing}`}>
          {sideContent}
        </MjmlColumn>
      </>
    )}
  </MjmlSection>
)

// Composant pour la structure de l'image: Barre + Deux Colonnes (66/34)
export const MjmlTopBarTwoColumnsBlock = ({
  topContent,
  leftContent,
  rightContent,
  backgroundColor = "transparent",
  padding = "10px",
  topPadding = "10px",
  bottomPadding = "10px",
  spacing = "10px"
}: {
  topContent: React.ReactNode
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  backgroundColor?: string
  padding?: string // General padding for sections if specific ones aren't set
  topPadding?: string // Padding for the top section
  bottomPadding?: string // Padding for the bottom section
  spacing?: string // Horizontal space between bottom columns
}) => (
  <>
    {/* Section supérieure */}
    <MjmlSection padding={topPadding ?? padding} background-color={backgroundColor}>
      <MjmlColumn>
        {topContent}
      </MjmlColumn>
    </MjmlSection>
    {/* Section inférieure */}
    <MjmlSection padding={bottomPadding ?? padding} background-color={backgroundColor}>
      <MjmlColumn width="66%" padding={`0 ${spacing} 0 0`}>
        {leftContent}
      </MjmlColumn>
      <MjmlColumn width="34%" padding={`0 0 0 ${spacing}`}>
        {rightContent}
      </MjmlColumn>
    </MjmlSection>
  </>
)

// Mettre à jour le type MjmlBlockType pour inclure les layouts
export type MjmlBlockType = 
  | { type: 'text'; content: string }
  | { type: 'button'; content: string; url?: string; backgroundColor?: string; textColor?: string }
  | { type: 'list'; items: string[] }
  | { type: 'link'; text: string; url: string; color?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'social'; links: Array<{ name: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'github'; url: string }> }
  | { type: 'image'; src: string; alt?: string; width?: string; height?: string; align?: "left" | "center" | "right"; borderRadius?: string }
  | { type: 'video'; thumbnailUrl: string; videoUrl: string; width?: string; height?: string; align?: "left" | "center" | "right"; playButtonColor?: string }
  | { type: 'oneColumn'; children: React.ReactNode; backgroundColor?: string; padding?: string }
  | { type: 'twoColumns'; leftContent: React.ReactNode; rightContent: React.ReactNode; backgroundColor?: string; padding?: string; spacing?: string }
  | { type: 'threeColumns'; leftContent: React.ReactNode; middleContent: React.ReactNode; rightContent: React.ReactNode; backgroundColor?: string; padding?: string; spacing?: string }
  | { type: 'sidebar'; sideContent: React.ReactNode; mainContent: React.ReactNode; sidebarPosition?: "left" | "right"; backgroundColor?: string; padding?: string; spacing?: string }
  | { type: 'topBarTwoColumns'; topContent: React.ReactNode; leftContent: React.ReactNode; rightContent: React.ReactNode; backgroundColor?: string; padding?: string; topPadding?: string; bottomPadding?: string; spacing?: string }

// Mettre à jour le MjmlBlockFactory
export const MjmlBlockFactory = (block: MjmlBlockType) => {
  switch (block.type) {
    case 'text':
      return <MjmlTextBlock content={block.content} />
    case 'button':
      return <MjmlButtonBlock {...block} />
    case 'list':
      return <MjmlListBlock items={block.items} />
    case 'link':
      return <MjmlLinkBlock {...block} />
    case 'table':
      return <MjmlTableBlock headers={block.headers} rows={block.rows} />
    case 'social':
      return <MjmlSocialBlock links={block.links} />
    case 'image':
      return <MjmlImageBlock {...block} />
    case 'video':
      return <MjmlVideoBlock {...block} />
    case 'oneColumn':
      return <MjmlOneColumnBlock {...block} />
    case 'twoColumns':
      return <MjmlTwoColumnsBlock {...block} />
    case 'threeColumns':
      return <MjmlThreeColumnsBlock {...block} />
    case 'sidebar':
      return <MjmlSidebarBlock {...block} />
    case 'topBarTwoColumns':
      return <MjmlTopBarTwoColumnsBlock {...block} />
    default:
      return null
  }
}