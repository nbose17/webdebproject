'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plan } from '@/lib/types';
import { formatCurrency, formatDuration } from '@/lib/utils';
import DataTable from '@/components/dashboard/DataTable';
import PlanForm from '@/components/dashboard/PlanForm';
import Button from '@/components/shared/Button';
import { FaCreditCard } from 'react-icons/fa';
import { Skeleton, Alert, message, Modal, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { GET_PLANS, CREATE_PLAN, UPDATE_PLAN, DELETE_PLAN, UPDATE_USER } from '@/graphql/queries/admin'; // Added UPDATE_USER
import { FaTable, FaTh } from 'react-icons/fa';
import PlanCard from '@/components/dashboard/PlanCard';
import { useEffect } from 'react'; // Added useEffect

type ViewMode = 'table' | 'card';

export default function PlansPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const gymId = user?.gymId;

  // ... (existing console logs)

  const { data, loading, error, refetch } = useQuery<{ plans: Plan[] }>(GET_PLANS, {
    variables: { gymId },
    skip: !gymId,
    fetchPolicy: 'network-only',
  });

  const [updateUserMutation] = useMutation(UPDATE_USER, {
    onError: (error) => {
      console.error('Failed to update user preferences:', error);
    },
  });

  const [createPlan] = useMutation(CREATE_PLAN, {
    onCompleted: () => {
      message.success(t('common.success'));
      refetch();
    },
    onError: (error) => {
      message.error(`${t('common.error')}: ${error.message}`);
    },
  });

  const [updatePlan] = useMutation(UPDATE_PLAN, {
    onCompleted: () => {
      message.success(t('common.success'));
      refetch();
    },
    onError: (error) => {
      message.error(`${t('common.error')}: ${error.message}`);
    },
  });

  const [deletePlan] = useMutation(DELETE_PLAN, {
    onCompleted: () => {
      message.success(t('common.success'));
      refetch();
    },
    onError: (error) => {
      message.error(`${t('common.error')}: ${error.message}`);
    },
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Sync viewMode from user preferences
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

  // ... (rest of component)


  const plans = data?.plans || [];

  console.log('🎯 PlansPage query setup:', {
    gymId,
    hasGymId: !!gymId,
    querySkipped: !gymId,
    userFromAuth: user ? { id: user.id, role: user.role, gymId: user.gymId } : null
  });

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index: any) => index + 1 },
    { key: 'name', label: t('plans.fields.name') },
    {
      key: 'durationMonths',
      label: t('plans.fields.duration'),
      render: (value: number) => formatDuration(value),
    },
    {
      key: 'price',
      label: t('plans.fields.price'),
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'totalPrice',
      label: t('plans.fields.totalPrice'),
      render: (_: any, plan: any) => {
        const classTotal = plan.includedClasses?.reduce((sum: number, cls: any) => sum + cls.price, 0) || 0;
        return formatCurrency(plan.price + classTotal);
      },
    },
    {
      key: 'includedClasses',
      label: t('plans.fields.includedClasses'),
      render: (classes: any[]) => {
        if (!classes || classes.length === 0) {
          return <Tag>{t('plans.fields.noClasses')}</Tag>;
        }

        if (classes.length <= 2) {
          return (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {classes.map((c: any) => (
                <Tag color="blue" key={c.id}>
                  {c.name}
                </Tag>
              ))}
            </div>
          );
        }

        const firstTwo = classes.slice(0, 2);
        const remainingCount = classes.length - 2;
        const remainingNames = classes.slice(2).map((c: any) => c.name).join(', ');

        return (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {firstTwo.map((c: any) => (
              <Tag color="blue" key={c.id}>
                {c.name}
              </Tag>
            ))}
            <Tooltip title={remainingNames}>
              <Tag>+{remainingCount} {t('plans.fields.more')}</Tag>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleAdd = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleDelete = (plan: Plan) => {
    if (!gymId) return;

    Modal.confirm({
      title: t('plans.deleteModal.title'),
      content: t('plans.deleteModal.content', { name: plan.name }),
      okText: t('common.yes', { defaultValue: 'Yes' }),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deletePlan({
            variables: {
              id: plan.id,
              gymId,
            },
          });
        } catch (error) {
          console.error('Delete failed:', error);
        }
      },
    });
  };

  const handleSubmit = async (planData: Omit<Plan, 'id'>) => {
    if (!gymId) return;

    if (editingPlan) {
      await updatePlan({
        variables: {
          id: editingPlan.id,
          gymId,
          ...planData,
        },
      });
    } else {
      await createPlan({
        variables: {
          gymId,
          ...planData,
        },
      });
    }
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  if (isLoading) {
    return (
      <div>
        <div className="dashboard-page-header">
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaCreditCard />
            </span>
            {t('plans.title')}
          </h1>
        </div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!gymId) {
    const lsUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    console.log('❌ Plans page: No gymId found', {
      user: user ? { id: user.id, email: user.email, role: user.role, gymId: user.gymId } : null,
      localStorageUser: lsUser,
      localStorageParsed: lsUser ? JSON.parse(lsUser) : null,
      isLoading,
    });

    // Force refresh user data if gym owner
    const handleRefresh = async () => {
      if (typeof window !== 'undefined') {
        // Clear all cached data
        localStorage.removeItem('user');
        const token = localStorage.getItem('token');

        console.log('🔄 Force refreshing user data...', { hasToken: !!token });

        if (token) {
          try {
            // Direct API call to bypass all caching
            const response = await fetch('/api/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                query: `
                  query GetMe {
                    me {
                      id
                      email
                      name
                      role
                      gymId
                      branchId
                      isActive
                    }
                  }
                `,
              }),
            });

            const result = await response.json();
            console.log('🎯 Direct API response:', result);

            if (result.data?.me) {
              const userData = {
                id: result.data.me.id,
                email: result.data.me.email,
                name: result.data.me.name,
                role: result.data.me.role.toLowerCase(),
                gymId: result.data.me.gymId,
                branchId: result.data.me.branchId,
              };

              console.log('💾 Saving fresh user data:', userData);
              localStorage.setItem('user', JSON.stringify(userData));
              window.location.reload();
            } else {
              console.error('❌ No user data in response:', result);
            }
          } catch (error) {
            console.error('❌ Error refreshing user data:', error);
          }
        } else {
          // No token, redirect to login
          window.location.href = '/en/login';
        }
      }
    };

    return (
      <div>
        <Alert
          message={t('dashboard.alerts.noGym')}
          description={`${t('dashboard.alerts.noGymDesc', { feature: t('plans.title') })} ${user?.role === 'gym_owner' ? 'Please click the refresh button below to reload your user data.' : ''}`}
          type="warning"
          showIcon
          action={
            user?.role === 'gym_owner' ? (
              <Button variant="primary" onClick={handleRefresh} style={{ marginTop: '8px' }}>
                {t('dashboard.alerts.refreshUser')}
              </Button>
            ) : null
          }
        />
        {process.env.NODE_ENV === 'development' && user && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <strong>Debug Info:</strong>
            <pre style={{ marginTop: '8px', fontSize: '12px' }}>
              {JSON.stringify({ userId: user.id, email: user.email, role: user.role, gymId: user.gymId }, null, 2)}
            </pre>
            <strong>LocalStorage User:</strong>
            <pre style={{ marginTop: '8px', fontSize: '12px' }}>
              {typeof window !== 'undefined' ? localStorage.getItem('user') : 'N/A'}
            </pre>
            <Button variant="primary" onClick={handleRefresh} style={{ marginTop: '8px' }}>
              {t('dashboard.alerts.refreshUser')} (Direct API Call)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Add session debug helper to window
                (window as any).debugSession = () => {
                  const token = localStorage.getItem('token');
                  const user = localStorage.getItem('user');
                  const adminToken = localStorage.getItem('adminToken');

                  console.log('🔍 Session Debug Info:', {
                    hasToken: !!token,
                    tokenPreview: token ? `${token.substring(0, 30)}...` : null,
                    tokenLength: token?.length,
                    hasUser: !!user,
                    userParsed: user ? JSON.parse(user) : null,
                    hasAdminToken: !!adminToken,
                    location: window.location.href,
                  });

                  // Test token validity
                  if (token) {
                    fetch('/api/graphql', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        query: 'query { me { id email role gymId } }',
                      }),
                    })
                      .then(r => r.json())
                      .then(result => {
                        console.log('🎯 Token test result:', result);
                      })
                      .catch(err => {
                        console.error('❌ Token test error:', err);
                      });
                  }
                };

                console.log('🔧 Debug helper added! Run debugSession() in console to check session state.');
                (window as any).debugSession();
              }}
              style={{ marginTop: '8px', marginLeft: '8px' }}
            >
              {t('dashboard.alerts.debugSession')}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="dashboard-page-header">
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaCreditCard />
            </span>
            {t('plans.title')} {t('plans.subtitle')}
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
            <FaCreditCard />
          </span>
          {t('plans.title')} {t('plans.subtitle')}
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
            {t('plans.add')}
          </Button>
        </div>
      </div>
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={plans}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="dashboard-trainer-cards-grid">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <PlanForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={handleSubmit}
        plan={editingPlan}
      />
    </div>
  );
}

