'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';
import styles from './PrivacySettings.module.css';

export default function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: true,
    allowDirectMessages: true,
    dataSharing: false,
    analyticsTracking: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setPrivacy({ ...privacy, [field]: value });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Privacy Settings</h2>
      <p className={styles.sectionDescription}>
        Control your privacy and data sharing preferences
      </p>

      <div className={styles.form}>
        <div className={styles.formSection}>
          <h3 className={styles.subsectionTitle}>Profile Visibility</h3>
          <div className={styles.radioGroup}>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={privacy.profileVisibility === 'public'}
                onChange={(e) => handleChange('profileVisibility', e.target.value)}
              />
              <div className={styles.radioContent}>
                <span className={styles.radioLabel}>Public</span>
                <span className={styles.radioDescription}>
                  Your profile is visible to everyone
                </span>
              </div>
            </label>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={privacy.profileVisibility === 'private'}
                onChange={(e) => handleChange('profileVisibility', e.target.value)}
              />
              <div className={styles.radioContent}>
                <span className={styles.radioLabel}>Private</span>
                <span className={styles.radioDescription}>
                  Only you can see your profile
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.subsectionTitle}>Contact Information</h3>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={privacy.showEmail}
                onChange={(e) => handleChange('showEmail', e.target.checked)}
              />
              <span>Show email address on public profile</span>
            </label>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={privacy.showPhone}
                onChange={(e) => handleChange('showPhone', e.target.checked)}
              />
              <span>Show phone number on public profile</span>
            </label>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={privacy.allowDirectMessages}
                onChange={(e) => handleChange('allowDirectMessages', e.target.checked)}
              />
              <span>Allow direct messages from users</span>
            </label>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.subsectionTitle}>Data & Analytics</h3>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={privacy.dataSharing}
                onChange={(e) => handleChange('dataSharing', e.target.checked)}
              />
              <span>Allow data sharing with partners</span>
            </label>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={privacy.analyticsTracking}
                onChange={(e) => handleChange('analyticsTracking', e.target.checked)}
              />
              <span>Enable analytics tracking</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

