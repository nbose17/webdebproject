'use client';

import { useState, useEffect } from 'react';
import { CMSItem } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import styles from './CMSForm.module.css';

interface CMSFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: CMSItem) => void;
  item?: CMSItem | null;
}

export default function CMSForm({
  isOpen,
  onClose,
  onSubmit,
  item,
}: CMSFormProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (item) {
      setContent(item.content);
    } else {
      setContent('');
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      onSubmit({ ...item, content });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${item?.name || 'CMS Item'}`}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          multiline={item?.type === 'text' || item?.type === 'banner'}
        />
        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
}

