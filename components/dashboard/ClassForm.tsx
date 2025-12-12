'use client';

import { useState, useEffect } from 'react';
import { Class } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';

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
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [numberOfClasses, setNumberOfClasses] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (classItem && classItem.durationMinutes) {
      setName(classItem.name);
      setHours(Math.floor(classItem.durationMinutes / 60).toString());
      setMinutes((classItem.durationMinutes % 60).toString());
      setNumberOfClasses(classItem.numberOfClasses.toString());
      setPrice(classItem.price.toString());
    } else {
      setName('');
      setHours('');
      setMinutes('');
      setNumberOfClasses('');
      setPrice('');
    }
  }, [classItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = (parseInt(hours || '0') * 60) + parseInt(minutes || '0');

    onSubmit({
      name,
      durationMinutes: totalMinutes,
      numberOfClasses: parseInt(numberOfClasses),
      price: parseFloat(price),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={classItem ? 'Edit Class' : 'Add Class'}>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Hours"
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            min="0"
            required={!minutes} // Required if minutes is empty
            placeholder="0"
          />
          <Input
            label="Minutes"
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            min="0"
            max="59"
            required={!hours} // Required if hours is empty
            placeholder="0"
          />
        </div>
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
        <div className="dashboard-form-actions">
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





