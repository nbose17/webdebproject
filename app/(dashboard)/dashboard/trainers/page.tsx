'use client';

import { useState } from 'react';
import { Trainer } from '@/lib/types';
import { mockTrainers } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import DataTable from '@/components/dashboard/DataTable';
import TrainerCard from '@/components/dashboard/TrainerCard';
import TrainerForm from '@/components/dashboard/TrainerForm';
import Button from '@/components/shared/Button';
import { FaTable, FaTh, FaUserTie } from 'react-icons/fa';

type ViewMode = 'table' | 'card';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index?: number) => (index ?? 0) + 1 },
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
        <h1 className="dashboard-page-title">
          <span className="dashboard-page-title-icon">
            <FaUserTie />
          </span>
          Trainers
        </h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', backgroundColor: 'var(--color-bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'table' ? 'var(--color-white)' : 'transparent',
                color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: viewMode === 'table' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                transition: 'all var(--transition-base)',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <FaTable />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'card' ? 'var(--color-white)' : 'transparent',
                color: viewMode === 'card' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: viewMode === 'card' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                transition: 'all var(--transition-base)',
                boxShadow: viewMode === 'card' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <FaTh />
              <span>Card</span>
            </button>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            Add Trainer
          </Button>
        </div>
      </div>
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={trainers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="dashboard-trainer-cards-grid">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
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




