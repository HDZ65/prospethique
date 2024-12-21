import './globals.css';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Audit de Site Web',
  description: 'Outil professionnel d\'audit de site web',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
            <Providers>
            <Header />
            <main className="bg-gray-900 min-h-screen">{children}</main>
          </Providers>
      </body>
    </html>
  );
}
