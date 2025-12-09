'use client';

import Link from 'next/link';
import Button from '@/components/shared/Button';

export default function Header() {
  return (
    <header className="public-header">
      <div className="public-header-content">
        <div>
          <p className="public-header-branding">FitConnect Ads</p>
        </div>
        <div className="public-header-actions">
          <Link href="/login" className="public-header-login-link">
            Login
          </Link>
          <Button variant="primary" size="md">
            Post Advertisement
          </Button>
        </div>
      </div>
    </header>
  );
}


