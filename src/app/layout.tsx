import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Helpdesk - Soumettre un ticket',
  description: 'Portail de demande de support informatique',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {children}
      </body>
    </html>
  );
}
