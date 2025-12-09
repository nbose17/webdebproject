import type { Metadata } from 'next';
import '../styles/style.css';
import 'antd/dist/reset.css';

export const metadata: Metadata = {
  title: 'FitConnect Ads',
  description: 'Fitness platform for gym listings and management',
};

// Root layout - Next.js REQUIRES html/body tags here
// Only the root layout can have html/body tags
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

