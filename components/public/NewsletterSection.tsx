'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import styles from './NewsletterSection.module.css';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>GET CONNECTED WITH US</h2>
        <p className={styles.subHeading}>Join our community for motivation</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <Button type="submit" variant="primary" size="lg">
            Join Now
          </Button>
        </form>
      </div>
    </section>
  );
}

