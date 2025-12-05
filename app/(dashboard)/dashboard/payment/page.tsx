'use client';

import PaymentForm from '@/components/dashboard/PaymentForm';
import styles from './page.module.css';

export default function PaymentPage() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Payment Gateway</h1>
      </div>
      <PaymentForm />
    </div>
  );
}


