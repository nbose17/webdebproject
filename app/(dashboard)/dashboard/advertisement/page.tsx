'use client';

import QRCodeDisplay from '@/components/dashboard/QRCodeDisplay';
import styles from './page.module.css';

export default function AdvertisementPage() {
  return (
    <div>
      <h1 className={styles.title}>Pay subscription and Publish</h1>
      <QRCodeDisplay />
    </div>
  );
}

