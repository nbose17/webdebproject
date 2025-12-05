'use client';

import { useState } from 'react';
import { advertisementSubscription } from '@/lib/constants';
import Button from '@/components/shared/Button';
import styles from './SubscriptionSettings.module.css';

export default function SubscriptionSettings() {
  const [subscription] = useState({
    plan: 'Basic',
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    amount: advertisementSubscription.rate,
    autoRenew: true,
  });

  const handleRenew = () => {
    alert('Redirecting to payment page...');
    // In real app, redirect to payment page
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel auto-renewal?')) {
      alert('Auto-renewal cancelled');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const daysRemaining = Math.ceil(
    (new Date(subscription.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Subscription Management</h2>
      <p className={styles.sectionDescription}>
        Manage your subscription and billing information
      </p>

      <div className={styles.subscriptionCard}>
        <div className={styles.subscriptionHeader}>
          <div>
            <h3 className={styles.planName}>{subscription.plan} Plan</h3>
            <span
              className={`${styles.status} ${
                subscription.status === 'Active' ? styles.active : ''
              }`}
            >
              {subscription.status}
            </span>
          </div>
          <div className={styles.planPrice}>
            <span className={styles.priceAmount}>${subscription.amount}</span>
            <span className={styles.pricePeriod}>/month</span>
          </div>
        </div>

        <div className={styles.subscriptionDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Start Date:</span>
            <span className={styles.detailValue}>
              {formatDate(subscription.startDate)}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>End Date:</span>
            <span className={styles.detailValue}>
              {formatDate(subscription.endDate)}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Days Remaining:</span>
            <span className={styles.detailValue}>
              {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Auto-Renewal:</span>
            <span className={styles.detailValue}>
              {subscription.autoRenew ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className={styles.subscriptionActions}>
          <Button variant="primary" onClick={handleRenew}>
            Renew Subscription
          </Button>
          {subscription.autoRenew && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel Auto-Renewal
            </Button>
          )}
        </div>
      </div>

      <div className={styles.billingSection}>
        <h3 className={styles.subsectionTitle}>Billing History</h3>
        <div className={styles.billingTable}>
          <div className={styles.billingHeader}>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Invoice</span>
          </div>
          <div className={styles.billingRow}>
            <span>{formatDate(subscription.startDate)}</span>
            <span>${subscription.amount}</span>
            <span className={styles.paid}>Paid</span>
            <button className={styles.downloadLink}>Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}

