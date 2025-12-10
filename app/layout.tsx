import type { Metadata } from 'next';
import '../styles/style.css';
import 'antd/dist/reset.css';

export const metadata: Metadata = {
  title: 'FitConnect Ads',
  description: 'Fitness platform for gym listings and management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}


