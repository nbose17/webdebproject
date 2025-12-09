'use client';

import { useState } from 'react';
import { Trainer } from '@/lib/types';
import { mockTrainers } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import DataTable from '@/components/dashboard/DataTable';
import TrainerForm from '@/components/dashboard/TrainerForm';
import Button from '@/components/shared/Button';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index: number) => index + 1 },
    { 
      key: 'image', 
      label: 'Image', 
      render: (value: string) => (
        value ? (
          <img 
            src={value} 
            alt="Trainer" 
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <span style={{ color: 'var(--color-text-secondary)' }}>No image</span>
        )
      )
    },
    { key: 'name', label: 'Name' },
    { key: 'experience', label: 'Experience' },
  ];

  const handleAdd = () => {
    setEditingTrainer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setIsFormOpen(true);
  };

  const handleDelete = (trainer: Trainer) => {
    if (confirm(`Are you sure you want to delete "${trainer.name}"?`)) {
      setTrainers(trainers.filter((t) => t.id !== trainer.id));
    }
  };

  const handleSubmit = (trainerData: Omit<Trainer, 'id'>) => {
    if (editingTrainer) {
      setTrainers(
        trainers.map((t) =>
          t.id === editingTrainer.id ? { ...trainerData, id: editingTrainer.id } : t
        )
      );
    } else {
      setTrainers([...trainers, { ...trainerData, id: generateId() }]);
    }
    setIsFormOpen(false);
    setEditingTrainer(null);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">Trainers</h1>
        <Button variant="primary" onClick={handleAdd}>
          Add Trainer
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={trainers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TrainerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTrainer(null);
        }}
        onSubmit={handleSubmit}
        trainer={editingTrainer}
      />
    </div>
  );
}




