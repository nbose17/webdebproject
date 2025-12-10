'use client';

import { Branch } from '@/lib/types';
import Button from '@/components/shared/Button';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';

interface BranchCardProps {
  branch: Branch;
  onEdit?: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
}

export default function BranchCard({ branch, onEdit, onDelete }: BranchCardProps) {
  return (
    <div className="dashboard-trainer-card">
      <div className="dashboard-trainer-card-content" style={{ padding: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
          <div>
            <h3 className="dashboard-trainer-card-name" style={{ marginBottom: 'var(--spacing-xs)' }}>{branch.name}</h3>
            <span style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              background: branch.status === 'active' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
              color: branch.status === 'active' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              display: 'inline-block'
            }}>
              {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
            <FaMapMarkerAlt style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
              {branch.address}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <FaPhone style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {branch.phone}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <FaEnvelope style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {branch.email}
            </span>
          </div>
          {(branch.manager || (branch as any).manager?.name) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <FaUser style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                {(branch as any).manager?.name || branch.manager || 'Not assigned'}
              </span>
            </div>
          )}
        </div>

        <div className="dashboard-trainer-card-actions">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(branch)}
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
              onClick={() => onDelete(branch)}
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



