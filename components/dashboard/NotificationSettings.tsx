'use client';

import { useState } from 'react';
import styles from './NotificationSettings.module.css';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    subscriptionReminders: true,
    newFeatures: true,
    securityAlerts: true,
    weeklyReports: false,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const notificationOptions = [
    {
      key: 'emailNotifications' as const,
      label: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      key: 'smsNotifications' as const,
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS',
    },
    {
      key: 'marketingEmails' as const,
      label: 'Marketing Emails',
      description: 'Receive promotional emails and updates',
    },
    {
      key: 'subscriptionReminders' as const,
      label: 'Subscription Reminders',
      description: 'Get reminders before subscription expires',
    },
    {
      key: 'newFeatures' as const,
      label: 'New Features',
      description: 'Notifications about new platform features',
    },
    {
      key: 'securityAlerts' as const,
      label: 'Security Alerts',
      description: 'Important security-related notifications',
    },
    {
      key: 'weeklyReports' as const,
      label: 'Weekly Reports',
      description: 'Receive weekly performance reports',
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Notification Preferences</h2>
      <p className={styles.sectionDescription}>
        Choose how you want to receive notifications
      </p>

      <div className={styles.notificationsList}>
        {notificationOptions.map((option) => (
          <div key={option.key} className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <h3 className={styles.notificationLabel}>{option.label}</h3>
              <p className={styles.notificationDescription}>
                {option.description}
              </p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notifications[option.key]}
                onChange={() => handleToggle(option.key)}
                className={styles.toggleInput}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

