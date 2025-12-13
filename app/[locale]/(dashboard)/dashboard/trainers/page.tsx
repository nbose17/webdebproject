'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Trainer } from '@/lib/types';
import DataTable from '@/components/dashboard/DataTable';
import TrainerCard from '@/components/dashboard/TrainerCard';
import TrainerForm from '@/components/dashboard/TrainerForm';
import Button from '@/components/shared/Button';
import { FaTable, FaTh, FaUserTie } from 'react-icons/fa';
import { Skeleton, Alert, message, Popconfirm } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { GET_TRAINERS, CREATE_TRAINER, UPDATE_TRAINER, DELETE_TRAINER } from '@/graphql/queries/admin';

type ViewMode = 'table' | 'card';

export default function TrainersPage() {
  const { user } = useAuth();
  const gymId = user?.gymId;

  const { data, loading, error, refetch } = useQuery<{ trainers: any[] }>(GET_TRAINERS, {
    variables: { gymId },
    skip: !gymId,
    fetchPolicy: 'network-only',
  });

  const [createTrainer] = useMutation(CREATE_TRAINER, {
    onCompleted: () => {
      message.success('Trainer created successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to create trainer: ${error.message}`);
    },
  });

  const [updateTrainer] = useMutation(UPDATE_TRAINER, {
    onCompleted: () => {
      message.success('Trainer updated successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to update trainer: ${error.message}`);
    },
  });

  const [deleteTrainer] = useMutation(DELETE_TRAINER, {
    onCompleted: () => {
      message.success('Trainer deleted successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to delete trainer: ${error.message}`);
    },
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const trainers = data?.trainers || [];

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

  const handleDelete = async (trainer: Trainer) => {
    if (!gymId) return;

    await deleteTrainer({
      variables: {
        id: trainer.id,
        gymId,
      },
    });
  };

  const handleSubmit = async (trainerData: Omit<Trainer, 'id'>) => {
    if (!gymId) return;

    if (editingTrainer) {
      await updateTrainer({
        variables: {
          id: editingTrainer.id,
          gymId,
          ...trainerData,
        },
      });
    } else {
      await createTrainer({
        variables: {
          gymId,
          ...trainerData,
        },
      });
    }
    setIsFormOpen(false);
    setEditingTrainer(null);
  };

  if (!gymId) {
    return (
      <div>
        <Alert
          message="No Gym Associated"
          description="You need to be associated with a gym to manage trainers."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="dashboard-page-header">
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaUserTie />
            </span>
            Trainers
          </h1>
        </div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert
          message="Error Loading Trainers"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

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




