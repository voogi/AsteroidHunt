import type { Metadata } from 'next';

import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Asteroid Hunt',
  description: 'Asteroid Hunt game developed by KápiFiveSome Kft.',
};

export default function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
