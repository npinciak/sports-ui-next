import { Header } from '@/components/layout/header';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StoreProvider from './StoreProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sports UI Next',
  description: 'Just another sports project',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <Header />
<<<<<<< HEAD
          <main className="container mx-auto ">{children}</main>
=======
          <main className="container mx-auto px-4 py-6 md:px-6 lg:px-8">{children}</main>
>>>>>>> 13586e7 (Add better mobile view handling)
        </StoreProvider>
      </body>
    </html>
  );
}
