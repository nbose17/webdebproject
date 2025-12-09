'use client';

import { useState, useEffect } from 'react';
import { Plan } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';

interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: Omit<Plan, 'id'>) => void;
  plan?: Plan | null;
}

export default function PlanForm({
  isOpen,
  onClose,
  onSubmit,
  plan,
}: PlanFormProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setDuration(plan.duration);
      setPrice(plan.price.toString());
    } else {
      setName('');
      setDuration('');
      setPrice('');
    }
  }, [plan, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      duration,
      price: parseFloat(price),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={plan ? 'Edit Plan' : 'Add Plan'}>
      <form onSubmit={handleSubmit} className="dashboard-form">
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
          placeholder="e.g., 3 Months, 1 Year"
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
        <div className="dashboard-form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {plan ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}





