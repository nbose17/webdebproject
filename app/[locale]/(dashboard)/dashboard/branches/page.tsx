'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Branch } from '@/lib/types';
import DataTable from '@/components/dashboard/DataTable';
import BranchCard from '@/components/dashboard/BranchCard';
import BranchForm from '@/components/dashboard/BranchForm';
import Button from '@/components/shared/Button';
import { FaCodeBranch, FaTable, FaTh } from 'react-icons/fa';
import { Skeleton, Alert, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { GET_BRANCHES, CREATE_BRANCH, UPDATE_BRANCH, DELETE_BRANCH, UPDATE_USER } from '@/graphql/queries/admin';
import { useEffect } from 'react';

type ViewMode = 'table' | 'card';

export default function BranchesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const gymId = user?.gymId;

  const { data, loading, error, refetch } = useQuery<{ branches: Branch[] }>(GET_BRANCHES, {
    variables: { gymId },
    skip: !gymId,
    fetchPolicy: 'network-only',
  });

  const [updateUserMutation] = useMutation(UPDATE_USER, {
    onError: (error) => {
      console.error('Failed to update user preferences:', error);
    },
  });

  const [createBranch] = useMutation(CREATE_BRANCH, {
    onCompleted: () => {
      message.success(t('common.success'));
      refetch();
    },
    onError: (error) => {
      message.error(`${t('common.error')}: ${error.message}`);
    },
  });

  const [updateBranch] = useMutation(UPDATE_BRANCH, {
    onCompleted: () => {
      message.success(t('common.success'));
      refetch();
    },
    onError: (error) => {
      message.error(`${t('common.error')}: ${error.message}`);
    },
  });

  const [deleteBranch] = useMutation(DELETE_BRANCH, {
    onCompleted: () => {
      message.success(t('common.success'));
      refetch();
    },
    onError: (error) => {
      message.error(`${t('common.error')}: ${error.message}`);
    },
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  useEffect(() => {
    if (user?.preferences?.dashboardViewMode) {
      setViewMode(user.preferences.dashboardViewMode as ViewMode);
    }
  }, [user]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (user) {
      updateUserMutation({
        variables: {
          id: user.id,
          preferences: { dashboardViewMode: mode },
        },
      });
    }
  };

  const branches = data?.branches || [];

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index?: number) => (index ?? 0) + 1 },
    { key: 'name', label: t('branches.fields.name') },
    { key: 'address', label: t('branches.fields.address') },
    { key: 'phone', label: t('branches.fields.phone') },
    { key: 'email', label: t('branches.fields.email') },
    {
      key: 'manager',
      label: t('branches.fields.manager'),
      render: (_: any, row: any) => row.manager?.name || t('common.notAssigned')
    },
    {
      key: 'status',
      label: t('branches.fields.status'),
      render: (value: string) => (
        <span style={{
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          background: value === 'active' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
          color: value === 'active' ? 'var(--color-primary)' : 'var(--color-text-secondary)'
        }}>
          {value === 'active' ? t('dashboard.common.status.active') : t('dashboard.common.status.inactive')}
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
    if (!gymId) return;

    Modal.confirm({
      title: t('branches.deleteModal.title'),
      content: t('branches.deleteModal.content', { name: branch.name }),
      okText: t('common.yes'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteBranch({
            variables: {
              id: branch.id,
              gymId,
            },
          });
        } catch (error) {
          console.error('Delete failed:', error);
        }
      },
    });
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
          message={t('dashboard.alerts.noGym')}
          description={t('dashboard.alerts.noGymDesc', { feature: t('branches.title') })}
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
            {t('branches.title')}
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
          message={t('common.error')}
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
          {t('branches.title')}
        </h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', backgroundColor: 'var(--color-bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => handleViewModeChange('table')}
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
              <span>{t('dashboard.common.viewMode.table')}</span>
            </button>
            <button
              onClick={() => handleViewModeChange('card')}
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
              <span>{t('dashboard.common.viewMode.card')}</span>
            </button>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            {t('branches.add')}
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

