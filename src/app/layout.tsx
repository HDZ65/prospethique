import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} antialiased h-full bg-gradient-to-b from-gray-900 to-gray-800`}>
        <Header />
        <main className="h-full pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
