'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import Input from '@/components/shared/Input';
import styles from './AccountSettings.module.css';

interface AccountSettingsProps {
  user: User | null;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Account Information</h2>
      <p className={styles.sectionDescription}>
        Update your account information and password
      </p>

      <div className={styles.form}>
        <div className={styles.formSection}>
          <h3 className={styles.subsectionTitle}>Personal Information</h3>
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your full name"
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.subsectionTitle}>Change Password</h3>
          <Input
            label="Current Password"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Confirm new password"
          />
          {formData.newPassword &&
            formData.confirmPassword &&
            formData.newPassword !== formData.confirmPassword && (
              <p className={styles.errorMessage}>
                Passwords do not match
              </p>
            )}
        </div>
      </div>
    </div>
  );
}

