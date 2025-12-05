'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaUser, FaBell, FaLock, FaCreditCard, FaExclamationTriangle } from 'react-icons/fa';
import AccountSettings from '@/components/dashboard/AccountSettings';
import NotificationSettings from '@/components/dashboard/NotificationSettings';
import PrivacySettings from '@/components/dashboard/PrivacySettings';
import SubscriptionSettings from '@/components/dashboard/SubscriptionSettings';
import DangerZone from '@/components/dashboard/DangerZone';
import Button from '@/components/shared/Button';
import styles from './page.module.css';

type SettingsTab = 'account' | 'notifications' | 'privacy' | 'subscription' | 'danger';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'account' as SettingsTab, label: 'Account', icon: FaUser },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: FaBell },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: FaLock },
    { id: 'subscription' as SettingsTab, label: 'Subscription', icon: FaCreditCard },
    { id: 'danger' as SettingsTab, label: 'Danger Zone', icon: FaExclamationTriangle },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account settings and preferences</p>
      </div>

      <div className={styles.tabsContainer}>
        <nav className={styles.tabs}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tab} ${
                  activeTab === tab.id ? styles.active : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent className={styles.tabIcon} />
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          {activeTab === 'account' && <AccountSettings user={user} />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'privacy' && <PrivacySettings />}
          {activeTab === 'subscription' && <SubscriptionSettings />}
          {activeTab === 'danger' && <DangerZone />}
        </div>

        {activeTab !== 'danger' && (
          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
