'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Modal from '@/components/shared/Modal';
import styles from './DangerZone.module.css';

export default function DangerZone() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    // Simulate account deletion
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      logout();
      router.push('/');
      alert('Your account has been deleted');
    }, 2000);
  };

  const handleExportData = () => {
    alert('Data export initiated. You will receive an email with your data shortly.');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Danger Zone</h2>
      <p className={styles.sectionDescription}>
        Irreversible and destructive actions. Please proceed with caution.
      </p>

      <div className={styles.dangerActions}>
        <div className={styles.dangerItem}>
          <div className={styles.dangerInfo}>
            <h3 className={styles.dangerTitle}>Export Account Data</h3>
            <p className={styles.dangerDescription}>
              Download all your account data, including gym information, plans, classes, and trainers.
            </p>
          </div>
          <Button variant="outline" onClick={handleExportData}>
            Export Data
          </Button>
        </div>

        <div className={styles.dangerItem}>
          <div className={styles.dangerInfo}>
            <h3 className={styles.dangerTitle}>Delete Account</h3>
            <p className={styles.dangerDescription}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsDeleteModalOpen(true)}
            className={styles.deleteButton}
          >
            Delete Account
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
      >
        <div className={styles.deleteModal}>
          <div className={styles.warningBox}>
            <p className={styles.warningText}>
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete
              your account and remove all of your data from our servers.
            </p>
          </div>

          <p className={styles.confirmInstruction}>
            To confirm, please type <strong>DELETE</strong> in the box below:
          </p>

          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
          />

          <div className={styles.modalActions}>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setConfirmText('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteAccount}
              disabled={confirmText !== 'DELETE' || isDeleting}
              className={styles.confirmDeleteButton}
            >
              {isDeleting ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

