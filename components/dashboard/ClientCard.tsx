'use client';

import Link from 'next/link';
import { Client } from '@/lib/types';
import Button from '@/components/shared/Button';
import { FaEdit, FaTrash, FaEnvelope, FaPhone, FaCreditCard, FaCalendarAlt, FaDownload, FaIdCard } from 'react-icons/fa';

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onDownloadContract?: (client: Client) => void;
  onDownloadIDCard?: (client: Client) => void;
}

export default function ClientCard({ 
  client, 
  onEdit, 
  onDelete,
  onDownloadContract,
  onDownloadIDCard
}: ClientCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-trainer-card">
      <div className="dashboard-trainer-card-content" style={{ padding: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flex: 1 }}>
            {client.image ? (
              <img
                src={client.image}
                alt={client.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--color-border)',
                  flexShrink: 0
                }}
              />
            ) : (
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                flexShrink: 0
              }}>
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <Link
                href={`/dashboard/clients/${client.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h3 className="dashboard-trainer-card-name" style={{ marginBottom: 'var(--spacing-xs)', cursor: 'pointer' }}>
                  {client.name}
                </h3>
              </Link>
              <span style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                background: client.status === 'active' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                color: client.status === 'active' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'inline-block'
              }}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <FaEnvelope style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {client.email}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <FaPhone style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {client.phone}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <FaCreditCard style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {client.membershipType}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <FaCalendarAlt style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Joined: {formatDate(client.joinDate)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
          {(onDownloadContract || onDownloadIDCard) && (
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
              {onDownloadContract && (
                <button
                  onClick={() => onDownloadContract(client)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-primary)',
                    transition: 'all var(--transition-base)',
                    flex: 1,
                    minWidth: '120px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Download Contract"
                >
                  <FaDownload />
                  <span>Contract</span>
                </button>
              )}
              {onDownloadIDCard && (
                <button
                  onClick={() => onDownloadIDCard(client)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-primary)',
                    transition: 'all var(--transition-base)',
                    flex: 1,
                    minWidth: '120px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Download ID Card"
                >
                  <FaIdCard />
                  <span>ID Card</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="dashboard-trainer-card-actions">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(client)}
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
              onClick={() => onDelete(client)}
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

