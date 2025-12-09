'use client';

import { useState } from 'react';
import { Branch } from '@/lib/types';
import { mockBranches } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import DataTable from '@/components/dashboard/DataTable';
import BranchCard from '@/components/dashboard/BranchCard';
import BranchForm from '@/components/dashboard/BranchForm';
import Button from '@/components/shared/Button';
import { FaCodeBranch, FaTable, FaTh } from 'react-icons/fa';

type ViewMode = 'table' | 'card';

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index?: number) => (index ?? 0) + 1 },
    { key: 'name', label: 'Branch Name' },
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { 
      key: 'manager', 
      label: 'Manager',
      render: (value: string) => value || 'Not assigned'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span style={{
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          background: value === 'active' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
          color: value === 'active' ? 'var(--color-primary)' : 'var(--color-text-secondary)'
        }}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
  ];

  const handleAdd = () => {
    setEditingBranch(null);
    setIsFormOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handleDelete = (branch: Branch) => {
    if (confirm(`Are you sure you want to delete "${branch.name}"?`)) {
      setBranches(branches.filter((b) => b.id !== branch.id));
    }
  };

  const handleSubmit = (branchData: Omit<Branch, 'id'>) => {
    if (editingBranch) {
      setBranches(
        branches.map((b) =>
          b.id === editingBranch.id ? { ...branchData, id: editingBranch.id } : b
        )
      );
    } else {
      setBranches([...branches, { ...branchData, id: generateId() }]);
    }
    setIsFormOpen(false);
    setEditingBranch(null);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">
          <span className="dashboard-page-title-icon">
            <FaCodeBranch />
          </span>
          Branches
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
            Add Branch
          </Button>
        </div>
      </div>
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={branches}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="dashboard-trainer-cards-grid">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <BranchForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBranch(null);
        }}
        onSubmit={handleSubmit}
        branch={editingBranch}
      />
    </div>
  );
}

