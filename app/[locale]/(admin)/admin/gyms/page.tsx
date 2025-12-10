'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, Table, Tag, Button, Input, Space, Dropdown, Modal, Typography, Statistic, Row, Col } from 'antd';
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
import { mockAdminGyms } from '@/lib/constants';
import type { AdminGym } from '@/lib/types';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';

const { Title, Text } = Typography;
const { Search } = Input;

export default function GymsManagementPage() {
  const [gyms, setGyms] = useState<AdminGym[]>(mockAdminGyms);
  const [filteredGyms, setFilteredGyms] = useState<AdminGym[]>(mockAdminGyms);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredGyms(gyms);
    } else {
      const filtered = gyms.filter(gym =>
        gym.name.toLowerCase().includes(value.toLowerCase()) ||
        gym.location.toLowerCase().includes(value.toLowerCase()) ||
        gym.ownerId.toLowerCase().includes(value.toLowerCase())
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

  const handleDeleteGym = (gymId: string) => {
    Modal.confirm({
      title: 'Delete Gym',
      content: 'Are you sure you want to delete this gym? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        const updatedGyms = gyms.filter(gym => gym.id !== gymId);
        setGyms(updatedGyms);
        setFilteredGyms(updatedGyms.filter(gym =>
          !searchTerm || 
          gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gym.location.toLowerCase().includes(searchTerm.toLowerCase())
        ));
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
          <span>{branches.length}</span>
        </div>
      ),
    },
    {
      title: 'Total Users',
      key: 'totalUsers',
      render: (record: AdminGym) => {
        const totalUsers = record.branches.reduce((sum, branch) => sum + branch.staff.length, 0);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaUsers style={{ color: '#52c41a' }} />
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

  // Calculate statistics
  const totalGyms = gyms.length;
  const activeGyms = gyms.filter(g => g.subscriptionStatus === 'active').length;
  const overduePayments = gyms.filter(g => g.paymentStatus === 'overdue').length;
  const totalBranches = gyms.reduce((sum, gym) => sum + gym.branches.length, 0);

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
              <Statistic
                title="Total Gyms"
                value={totalGyms}
                prefix={<FaDumbbell style={{ color: '#4CAF50' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Gyms"
                value={activeGyms}
                prefix={<FaDumbbell style={{ color: '#52c41a' }} />}
                suffix={`/ ${totalGyms}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Branches"
                value={totalBranches}
                prefix={<FaBuilding style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Payment Issues"
                value={overduePayments}
                prefix={<FaExclamationTriangle style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: overduePayments > 0 ? '#ff4d4f' : '#52c41a' }}
              />
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

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredGyms}
            rowKey="id"
            loading={loading}
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
        </Card>
      </div>
    </AdminProtectedRoute>
  );
}