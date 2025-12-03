'use client';

import Link from 'next/link';
import Button from '@/components/shared/Button';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div>
          <h1 className={styles.title}>Public Gym Listing Page</h1>
          <p className={styles.branding}>FitConnect Ads</p>
        </div>
        <div className={styles.actions}>
          <Link href="/login" className={styles.loginLink}>
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

