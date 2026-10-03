import { Metadata } from 'next';
import React from 'react';

import '../styles/globals.css';
import { websiteConfig } from '@/website.config';
import { ThemeProvider } from '@atoms/ThemeProvider';
import Footer from '@molecules/Footer';
import Header from '@organisms/Header';

export const metadata: Metadata = {
  title: websiteConfig.title,
  description: websiteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={websiteConfig.font_variables.join(' ') + ' jemore-theme-light'}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          themes={websiteConfig.color_themes}
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
