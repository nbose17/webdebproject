'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Class } from '@/lib/types';
import { formatCurrency, formatClassDuration } from '@/lib/utils';
import DataTable from '@/components/dashboard/DataTable';
import ClassForm from '@/components/dashboard/ClassForm';
import Button from '@/components/shared/Button';
import { FaCalendarAlt } from 'react-icons/fa';
import { Skeleton, Alert, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { GET_CLASSES, CREATE_CLASS, UPDATE_CLASS, DELETE_CLASS, UPDATE_USER } from '@/graphql/queries/admin';
import { useEffect } from 'react';
import { FaTable, FaTh } from 'react-icons/fa';
import ClassCard from '@/components/dashboard/ClassCard';

type ViewMode = 'table' | 'card';

export default function ClassesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const gymId = user?.gymId;

  const { data, loading, error, refetch } = useQuery<{ classes: Class[] }>(GET_CLASSES, {
    variables: { gymId },
    skip: !gymId,
    fetchPolicy: 'network-only',
  });

  const [updateUserMutation] = useMutation(UPDATE_USER, {
    onError: (error) => {
      console.error('Failed to update user preferences:', error);
    },
  });

  const [createClass] = useMutation(CREATE_CLASS, {
    onCompleted: () => {
      message.success(t('common.success'));
      refetch();
    },
    onError: (error) => {
      message.error(`${t('common.error')}: ${error.message}`);
    },
  });

  const [updateClass] = useMutation(UPDATE_CLASS, {
    onCompleted: () => {
      message.success(t('common.success'));
      refetch();
    },
    onError: (error) => {
      message.error(`${t('common.error')}: ${error.message}`);
    },
  });

  const [deleteClass] = useMutation(DELETE_CLASS, {
    onCompleted: () => {
      message.success(t('common.success'));
      refetch();
    },
    onError: (error) => {
      message.error(`${t('common.error')}: ${error.message}`);
    },
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
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

  const classes = data?.classes || [];

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index: any) => index + 1 },
    { key: 'name', label: t('classes.fields.name') },
    {
      key: 'durationMinutes',
      label: t('classes.fields.duration'),
      render: (value: number) => formatClassDuration(value),
    },
    { key: 'numberOfClasses', label: t('classes.fields.sessions') },
    {
      key: 'price',
      label: t('classes.fields.price'),
      render: (value: number) => formatCurrency(value),
    },
  ];

  const handleAdd = () => {
    setEditingClass(null);
    setIsFormOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setIsFormOpen(true);
  };

  const handleDelete = (classItem: Class) => {
    if (!gymId) return;

    Modal.confirm({
      title: t('classes.deleteModal.title'),
      content: t('classes.deleteModal.content', { name: classItem.name }),
      okText: t('common.yes', { defaultValue: 'Yes' }),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteClass({
            variables: {
              id: classItem.id,
              gymId,
            },
          });
        } catch (error) {
          console.error('Delete failed:', error);
        }
      },
    });
  };

  const handleSubmit = async (classData: Omit<Class, 'id'>) => {
    if (!gymId) return;

    if (editingClass) {
      await updateClass({
        variables: {
          id: editingClass.id,
          gymId,
          ...classData,
        },
      });
    } else {
      await createClass({
        variables: {
          gymId,
          ...classData,
        },
      });
    }
    setIsFormOpen(false);
    setEditingClass(null);
  };

  if (!gymId) {
    return (
      <div>
        <Alert
          message={t('dashboard.alerts.noGym')}
          description={t('dashboard.alerts.noGymDesc', { feature: t('classes.title') })}
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
              <FaCalendarAlt />
            </span>
            {t('classes.title')}
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
            <FaCalendarAlt />
          </span>
          {t('classes.title')}
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
            {t('classes.add')}
          </Button>
        </div>
      </div>
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={classes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="dashboard-trainer-cards-grid">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <ClassForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingClass(null);
        }}
        onSubmit={handleSubmit}
        classItem={editingClass}
      />
    </div>
  );
}




