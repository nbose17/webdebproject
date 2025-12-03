'use client';

import { useState, useEffect } from 'react';
import { Class } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import styles from './ClassForm.module.css';

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classItem: Omit<Class, 'id'>) => void;
  classItem?: Class | null;
}

export default function ClassForm({
  isOpen,
  onClose,
  onSubmit,
  classItem,
}: ClassFormProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [numberOfClasses, setNumberOfClasses] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (classItem) {
      setName(classItem.name);
      setDuration(classItem.duration);
      setNumberOfClasses(classItem.numberOfClasses.toString());
      setPrice(classItem.price.toString());
    } else {
      setName('');
      setDuration('');
      setNumberOfClasses('');
      setPrice('');
    }
  }, [classItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      duration,
      numberOfClasses: parseInt(numberOfClasses),
      price: parseFloat(price),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={classItem ? 'Edit Class' : 'Add Class'}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          placeholder="e.g., 1 Hour, 45 Minutes"
        />
        <Input
          label="No of Classes"
          type="number"
          value={numberOfClasses}
          onChange={(e) => setNumberOfClasses(e.target.value)}
          required
          min="1"
        />
        <Input
          label="Price ($)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {classItem ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

