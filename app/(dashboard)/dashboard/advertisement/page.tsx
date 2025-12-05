'use client';

import QRCodeDisplay from '@/components/dashboard/QRCodeDisplay';
import styles from './page.module.css';

export default function AdvertisementPage() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Advertisement</h1>
        <p className={styles.subtitle}>Share your gym's QR code and manage your subscription</p>
      </div>
      <QRCodeDisplay />
    </div>
  );
}


