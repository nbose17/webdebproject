'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Branch } from '@/lib/types';
import DataTable from '@/components/dashboard/DataTable';
import BranchCard from '@/components/dashboard/BranchCard';
import BranchForm from '@/components/dashboard/BranchForm';
import Button from '@/components/shared/Button';
import { FaCodeBranch, FaTable, FaTh } from 'react-icons/fa';
import { Skeleton, Alert, message } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { GET_BRANCHES, CREATE_BRANCH, UPDATE_BRANCH, DELETE_BRANCH } from '@/graphql/queries/admin';

type ViewMode = 'table' | 'card';

export default function BranchesPage() {
  const { user } = useAuth();
  const gymId = user?.gymId;
  
  const { data, loading, error, refetch } = useQuery(GET_BRANCHES, {
    variables: { gymId },
    skip: !gymId,
    fetchPolicy: 'network-only',
  });
  
  const [createBranch] = useMutation(CREATE_BRANCH, {
    onCompleted: () => {
      message.success('Branch created successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to create branch: ${error.message}`);
    },
  });
  
  const [updateBranch] = useMutation(UPDATE_BRANCH, {
    onCompleted: () => {
      message.success('Branch updated successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to update branch: ${error.message}`);
    },
  });
  
  const [deleteBranch] = useMutation(DELETE_BRANCH, {
    onCompleted: () => {
      message.success('Branch deleted successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to delete branch: ${error.message}`);
    },
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  
  const branches = data?.branches || [];

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index?: number) => (index ?? 0) + 1 },
    { key: 'name', label: 'Branch Name' },
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { 
      key: 'manager', 
      label: 'Manager',
      render: (_: any, row: any) => row.manager?.name || 'Not assigned'
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

  const handleDelete = async (branch: Branch) => {
    if (!gymId) return;
    
    if (confirm(`Are you sure you want to delete "${branch.name}"?`)) {
      await deleteBranch({
        variables: {
          id: branch.id,
          gymId,
        },
      });
    }
  };

  const handleSubmit = async (branchData: any) => {
    if (!gymId) return;
    
    const variables: any = {
      gymId,
      name: branchData.name,
      address: branchData.address,
      phone: branchData.phone,
      email: branchData.email,
      status: branchData.status || 'active',
      managerId: branchData.managerId || null,
    };
    
    if (editingBranch) {
      variables.id = editingBranch.id;
      await updateBranch({ variables });
    } else {
      await createBranch({ variables });
    }
    setIsFormOpen(false);
    setEditingBranch(null);
  };
  
  if (!gymId) {
    return (
      <div>
        <Alert
          message="No Gym Associated"
          description="You need to be associated with a gym to manage branches."
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
              <FaCodeBranch />
            </span>
            Branches
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
          message="Error Loading Branches"
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

