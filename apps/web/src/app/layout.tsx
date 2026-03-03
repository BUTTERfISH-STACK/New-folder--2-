import type { Metadata, Viewport } from 'next';
import { Outfit, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { cn } from '@cvredo/ui/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CVRedo - AI-Powered CV Builder',
  description: 'Create stunning, ATS-optimized resumes with AI assistance. Build your future with premium career tools.',
  keywords: ['CV builder', 'Resume maker', 'AI resume', 'Career tools', 'Job search'],
  authors: [{ name: 'CVRedo Team' }],
  openGraph: {
    title: 'CVRedo - Redesign Your Future',
    description: 'Premium AI-powered CV builder with 3D previews',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          outfit.variable,
          spaceGrotesk.variable,
          jetbrainsMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
