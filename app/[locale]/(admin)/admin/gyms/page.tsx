'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, Table, Tag, Button, Input, Space, Dropdown, Modal, Typography, Statistic, Row, Col, message, Skeleton } from 'antd';
import { 
  FaDumbbell, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaBuilding,
  FaUsers,
  FaCrown,
  FaExclamationTriangle
} from 'react-icons/fa';
import type { AdminGym } from '@/lib/types';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { GET_GYMS, DELETE_GYM } from '@/graphql/queries/admin';

const { Title, Text } = Typography;
const { Search } = Input;

export default function GymsManagementPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  // Fetch gyms from GraphQL API
  const { data, loading, error, refetch } = useQuery(GET_GYMS, {
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('Error fetching gyms:', err);
      message.error('Failed to load gyms. Please try again.');
    },
  });

  const [deleteGymMutation] = useMutation(DELETE_GYM);

  const [filteredGyms, setFilteredGyms] = useState<AdminGym[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Transform GraphQL data to match AdminGym interface
  const [allGyms, setAllGyms] = useState<AdminGym[]>([]);

  useEffect(() => {
    if (data?.gyms) {
      const transformedGyms: AdminGym[] = data.gyms.map((gym: any) => ({
        id: gym.id,
        name: gym.name,
        location: gym.location,
        image: gym.image,
        featured: gym.featured,
        description: gym.description,
        ownerId: gym.ownerId,
        subscriptionStatus: gym.subscriptionStatus.toLowerCase(),
        paymentStatus: gym.paymentStatus.toLowerCase(),
        createdAt: gym.createdAt,
        lastActive: gym.lastActive,
        branches: gym.branches || [],
        users: gym.users || [],
      }));
      setAllGyms(transformedGyms);
      // Apply current search filter if any
      if (searchTerm.trim()) {
        const filtered = transformedGyms.filter(gym =>
          gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gym.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (gym.ownerId?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGyms(filtered);
      } else {
        setFilteredGyms(transformedGyms);
      }
    }
  }, [data, searchTerm]);

  const gyms = filteredGyms;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredGyms(allGyms);
    } else {
      const filtered = allGyms.filter(gym =>
        gym.name.toLowerCase().includes(value.toLowerCase()) ||
        gym.location.toLowerCase().includes(value.toLowerCase()) ||
        (gym.ownerId?.toString() || '').toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGyms(filtered);
    }
  };

  const handleViewDetails = (gymId: string) => {
    router.push(`/${locale}/admin/gyms/${gymId}`);
  };

  const handleEditGym = (gymId: string) => {
    router.push(`/${locale}/admin/gyms/${gymId}/edit`);
  };

  const handleDeleteGym = async (gymId: string) => {
    Modal.confirm({
      title: 'Delete Gym',
      content: 'Are you sure you want to delete this gym? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await deleteGymMutation({
            variables: { id: gymId },
          });
          message.success('Gym deleted successfully');
          // Refetch gyms to update the list
          await refetch();
        } catch (err: any) {
          message.error(err?.message || 'Failed to delete gym');
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'current': return 'success';
      case 'overdue': return 'error';
      default: return 'warning';
    }
  };

  const columns = [
    {
      title: 'Gym Details',
      key: 'details',
      render: (record: AdminGym) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={record.image} 
            alt={record.name}
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '8px', 
              objectFit: 'cover' 
            }}
          />
          <div>
            <div style={{ fontWeight: '500', marginBottom: '2px' }}>
              {record.name}
              {record.featured && <FaCrown style={{ color: '#faad14', marginLeft: '6px' }} />}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {record.location}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Branches',
      dataIndex: 'branches',
      key: 'branches',
      render: (branches: any[]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaBuilding style={{ color: '#4CAF50' }} />
          <span>{branches?.length || 0}</span>
        </div>
      ),
    },
    {
      title: 'Total Users',
      key: 'totalUsers',
      render: (record: AdminGym) => {
        // Get user count from users array or calculate from branches
        const totalUsers = record.users?.length || record.branches?.reduce((sum, branch: any) => sum + (branch.staff?.length || 0), 0) || 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaUsers style={{ color: '#4CAF50' }} />
            <span>{totalUsers}</span>
          </div>
        );
      },
    },
    {
      title: 'Subscription',
      dataIndex: 'subscriptionStatus',
      key: 'subscriptionStatus',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => (
        <Tag color={getPaymentColor(status)}>
          {status === 'current' ? 'CURRENT' : 'OVERDUE'}
        </Tag>
      ),
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (date: string) => (
        <Text style={{ fontSize: '13px' }}>
          {date ? new Date(date).toLocaleDateString() : 'Never'}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: AdminGym) => {
        const items = [
          {
            key: 'view',
            label: 'View Details',
            icon: <FaEye />,
            onClick: () => handleViewDetails(record.id),
          },
          {
            key: 'edit',
            label: 'Edit Gym',
            icon: <FaEdit />,
            onClick: () => handleEditGym(record.id),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <FaTrash />,
            danger: true,
            onClick: () => handleDeleteGym(record.id),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button 
              type="text" 
              icon={<FaEllipsisV />}
              style={{ transform: 'rotate(90deg)' }}
            />
          </Dropdown>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Calculate statistics from all gyms (not just filtered)
  const totalGyms = allGyms.length;
  const activeGyms = allGyms.filter(g => g.subscriptionStatus === 'active').length;
  const overduePayments = allGyms.filter(g => g.paymentStatus === 'overdue').length;
  const totalBranches = allGyms.reduce((sum, gym) => sum + (gym.branches?.length || 0), 0);

  // Show error state
  if (error && !loading) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'gyms', action: 'read' }}>
        <div>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text type="danger">Failed to load gyms. Please try again.</Text>
            </div>
          </Card>
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'gyms', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaDumbbell />
              </span>
              Gym Management
            </h1>
            <p className="dashboard-page-subtitle">Manage all gyms, their branches, and monitor subscription status</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              {loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <Statistic
                  title="Total Gyms"
                  value={totalGyms}
                  prefix={<FaDumbbell style={{ color: '#4CAF50' }} />}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              {loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <Statistic
                  title="Active Gyms"
                  value={activeGyms}
                  prefix={<FaDumbbell style={{ color: '#52c41a' }} />}
                  suffix={`/ ${totalGyms}`}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              {loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <Statistic
                  title="Total Branches"
                  value={totalBranches}
                  prefix={<FaBuilding style={{ color: '#722ed1' }} />}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              {loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <Statistic
                  title="Payment Issues"
                  value={overduePayments}
                  prefix={<FaExclamationTriangle style={{ color: '#ff4d4f' }} />}
                  valueStyle={{ color: overduePayments > 0 ? '#ff4d4f' : '#52c41a' }}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* Gym Management Table */}
        <Card>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Search
                placeholder="Search gyms, locations, or owners..."
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300 }}
                enterButton
              />
              <Button icon={<FaFilter />}>
                Filter
              </Button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedRowKeys.length > 0 && (
                <Button 
                  danger
                  disabled={loading}
                >
                  Delete Selected ({selectedRowKeys.length})
                </Button>
              )}
              <Button 
                type="primary" 
                icon={<FaPlus />}
                onClick={() => router.push(`/${locale}/admin/gyms/new`)}
              >
                Add New Gym
              </Button>
            </div>
          </div>

          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredGyms}
              rowKey="id"
              pagination={{
                total: filteredGyms.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} gyms`,
              }}
              scroll={{ x: 1200 }}
            />
          )}
        </Card>
      </div>
    </AdminProtectedRoute>
  );
}

