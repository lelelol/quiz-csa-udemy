import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './components/ThemeProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CSA Exam Simulation',
  description:
    'Simulado completo para o exame ServiceNow Certified System Administrator (CSA). Pratique com questões reais e prepare-se para a certificação.',
  keywords: [
    'ServiceNow',
    'CSA',
    'Certified System Administrator',
    'exam simulation',
    'practice test',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
