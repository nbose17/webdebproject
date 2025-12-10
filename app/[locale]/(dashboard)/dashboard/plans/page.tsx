'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import DataTable from '@/components/dashboard/DataTable';
import PlanForm from '@/components/dashboard/PlanForm';
import Button from '@/components/shared/Button';
import { FaCreditCard } from 'react-icons/fa';
import { Skeleton, Alert, message, Popconfirm } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { GET_PLANS, CREATE_PLAN, UPDATE_PLAN, DELETE_PLAN } from '@/graphql/queries/admin';

export default function PlansPage() {
  const { user, isLoading } = useAuth();
  const gymId = user?.gymId;
  
  console.log('🎯 PlansPage render:', { 
    hasUser: !!user, 
    userId: user?.id, 
    role: user?.role, 
    gymId: user?.gymId,
    isLoading,
    authContextUser: user 
  });
  
  const { data, loading, error, refetch } = useQuery(GET_PLANS, {
    variables: { gymId },
    skip: !gymId,
    fetchPolicy: 'network-only',
  });
  
  const [createPlan] = useMutation(CREATE_PLAN, {
    onCompleted: () => {
      message.success('Plan created successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to create plan: ${error.message}`);
    },
  });
  
  const [updatePlan] = useMutation(UPDATE_PLAN, {
    onCompleted: () => {
      message.success('Plan updated successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to update plan: ${error.message}`);
    },
  });
  
  const [deletePlan] = useMutation(DELETE_PLAN, {
    onCompleted: () => {
      message.success('Plan deleted successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to delete plan: ${error.message}`);
    },
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  const plans = data?.plans || [];
  
  console.log('🎯 PlansPage query setup:', { 
    gymId, 
    hasGymId: !!gymId, 
    querySkipped: !gymId,
    userFromAuth: user ? { id: user.id, role: user.role, gymId: user.gymId } : null
  });

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index: number) => index + 1 },
    { key: 'name', label: 'Name' },
    { key: 'duration', label: 'Duration' },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => formatCurrency(value),
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

  const handleDelete = async (plan: Plan) => {
    if (!gymId) return;
    
    await deletePlan({
      variables: {
        id: plan.id,
        gymId,
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
            Plans
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
          message="No Gym Associated"
          description={`You need to be associated with a gym to manage plans. ${user?.role === 'gym_owner' ? 'Please click the refresh button below to reload your user data.' : ''}`}
          type="warning"
          showIcon
          action={
            user?.role === 'gym_owner' ? (
              <Button variant="primary" onClick={handleRefresh} style={{ marginTop: '8px' }}>
                Refresh User Data
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
              Force Refresh User Data (Direct API Call)
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
              Debug Session
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
            Plans (Monthly / Yearly)
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
          message="Error Loading Plans"
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
          Plans (Monthly / Yearly)
        </h1>
        <Button variant="primary" onClick={handleAdd}>
          Add Plan
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={plans}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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

