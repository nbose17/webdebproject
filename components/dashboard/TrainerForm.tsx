'use client';

import { useState, useEffect } from 'react';
import { Trainer } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import styles from './TrainerForm.module.css';

interface TrainerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trainer: Omit<Trainer, 'id'>) => void;
  trainer?: Trainer | null;
}

export default function TrainerForm({
  isOpen,
  onClose,
  onSubmit,
  trainer,
}: TrainerFormProps) {
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');

  useEffect(() => {
    if (trainer) {
      setName(trainer.name);
      setExperience(trainer.experience);
    } else {
      setName('');
      setExperience('');
    }
  }, [trainer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      experience,
      image: '/images/trainer-placeholder.jpg',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={trainer ? 'Edit Trainer' : 'Add Trainer'}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
          placeholder="e.g., 3+ Years"
        />
        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {trainer ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

