'use client';

import { Trainer } from '@/lib/types';
import Button from '@/components/shared/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface TrainerCardProps {
  trainer: Trainer;
  onEdit?: (trainer: Trainer) => void;
  onDelete?: (trainer: Trainer) => void;
}

export default function TrainerCard({ trainer, onEdit, onDelete }: TrainerCardProps) {
  return (
    <div className="dashboard-trainer-card">
      <div className="dashboard-trainer-card-image-container">
        {trainer.image ? (
          <img
            src={trainer.image}
            alt={trainer.name}
            className="dashboard-trainer-card-image"
          />
        ) : (
          <div className="dashboard-trainer-card-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className="dashboard-trainer-card-content">
        <h3 className="dashboard-trainer-card-name">{trainer.name}</h3>
        <p className="dashboard-trainer-card-experience">{trainer.experience}</p>
        {trainer.bio && (
          <p className="dashboard-trainer-card-bio">{trainer.bio}</p>
        )}
        <div className="dashboard-trainer-card-actions">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(trainer)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-sm)' }}
              title="Edit"
            >
              <FaEdit />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(trainer)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-sm)' }}
              title="Delete"
            >
              <FaTrash />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

