import type { ReactNode } from 'react';

export const metadata = { title: 'Todo — CICD level 1' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '40px auto', padding: '0 16px' }}>
        {children}
      </body>
    </html>
  );
}
