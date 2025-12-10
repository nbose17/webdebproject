'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Descriptions, 
  Table, 
  Typography, 
  Space,
  Statistic,
  Tabs,
  Alert,
  Modal
} from 'antd';
import { 
  FaArrowLeft,
  FaDumbbell,
  FaBuilding,
  FaUsers,
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaCrown,
  FaCalendar,
  FaMoneyBill,
  FaExclamationTriangle
} from 'react-icons/fa';
import { mockAdminGyms, mockGymUsers } from '@/lib/constants';
import type { AdminGym, Branch, GymUser } from '@/lib/types';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';

const { Title, Text } = Typography;

interface PageProps {
  params: Promise<{ gymId: string }>;
}

export default function GymDetailsPage({ params }: PageProps) {
  const { gymId } = use(params);
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams.locale as string;
  
  const gym = mockAdminGyms.find(g => g.id === gymId);
  const [selectedGym, setSelectedGym] = useState<AdminGym | undefined>(gym);

  if (!selectedGym) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Alert
          message="Gym Not Found"
          description="The requested gym could not be found."
          type="error"
          showIcon
          action={
            <Button onClick={() => router.push(`/${locale}/admin/gyms`)}>
              Back to Gyms
            </Button>
          }
        />
      </div>
    );
  }

  const totalStaff = selectedGym.branches.reduce((sum, branch) => sum + branch.staff.length, 0);
  const totalClients = selectedGym.branches.reduce((sum, branch) => sum + branch.clients.length, 0);
  const activeBranches = selectedGym.branches.filter(branch => branch.status === 'active').length;

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

  const handleDeleteGym = (gymId: string) => {
    Modal.confirm({
      title: 'Delete Gym',
      content: 'Are you sure you want to delete this gym? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        router.push(`/${locale}/admin/gyms`);
      },
    });
  };

  const branchColumns = [
    {
      title: 'Branch Name',
      key: 'name',
      render: (branch: Branch) => (
        <div>
          <div style={{ fontWeight: '500' }}>{branch.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{branch.address}</div>
        </div>
      ),
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager: string) => manager || 'Not assigned',
    },
    {
      title: 'Staff',
      key: 'staff',
      render: (branch: Branch) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaUsers style={{ color: '#4CAF50' }} />
          <span>{branch.staff.length}</span>
        </div>
      ),
    },
    {
      title: 'Clients',
      key: 'clients',
      render: (branch: Branch) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaUsers style={{ color: '#52c41a' }} />
          <span>{branch.clients.length}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (branch: Branch) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<FaEye />}
            onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/${branch.id}`)}
          >
            View
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<FaEdit />}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Gym Information">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Gym Name">{selectedGym.name}</Descriptions.Item>
                  <Descriptions.Item label="Location">{selectedGym.location}</Descriptions.Item>
                  <Descriptions.Item label="Owner ID">{selectedGym.ownerId}</Descriptions.Item>
                  <Descriptions.Item label="Featured">
                    {selectedGym.featured ? (
                      <Tag color="gold" icon={<FaCrown />}>FEATURED</Tag>
                    ) : (
                      <Tag>STANDARD</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created">
                    {new Date(selectedGym.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Active">
                    {selectedGym.lastActive ? new Date(selectedGym.lastActive).toLocaleDateString() : 'Never'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description" span={2}>
                    {selectedGym.description || 'No description provided'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card>
                    <Statistic
                      title="Total Branches"
                      value={selectedGym.branches.length}
                      prefix={<FaBuilding style={{ color: '#4CAF50' }} />}
                      suffix={`(${activeBranches} active)`}
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Statistic
                      title="Total Staff"
                      value={totalStaff}
                      prefix={<FaUsers style={{ color: '#52c41a' }} />}
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Statistic
                      title="Total Clients"
                      value={totalClients}
                      prefix={<FaUsers style={{ color: '#722ed1' }} />}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'branches',
      label: `Branches (${selectedGym.branches.length})`,
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px' 
          }}>
            <Title level={4} style={{ margin: 0 }}>Branch Management</Title>
            <Button 
              type="primary"
              icon={<FaPlus />}
              onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/new`)}
            >
              Add Branch
            </Button>
          </div>
          
          <Table
            columns={branchColumns}
            dataSource={selectedGym.branches}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: 'subscription',
      label: 'Subscription & Billing',
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Subscription Status">
                <div style={{ marginBottom: '16px' }}>
                  <Tag 
                    color={getStatusColor(selectedGym.subscriptionStatus)} 
                    style={{ fontSize: '14px', padding: '4px 12px' }}
                  >
                    {selectedGym.subscriptionStatus.toUpperCase()}
                  </Tag>
                </div>
                <Descriptions column={1}>
                  <Descriptions.Item label="Plan">Premium Business</Descriptions.Item>
                  <Descriptions.Item label="Monthly Fee">$299.99</Descriptions.Item>
                  <Descriptions.Item label="Next Billing">January 15, 2025</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card title="Payment Status">
                <div style={{ marginBottom: '16px' }}>
                  <Tag 
                    color={getPaymentColor(selectedGym.paymentStatus)}
                    style={{ fontSize: '14px', padding: '4px 12px' }}
                  >
                    {selectedGym.paymentStatus === 'current' ? 'CURRENT' : 'OVERDUE'}
                  </Tag>
                </div>
                <Descriptions column={1}>
                  <Descriptions.Item label="Last Payment">December 15, 2024</Descriptions.Item>
                  <Descriptions.Item label="Payment Method">Credit Card (**** 1234)</Descriptions.Item>
                  <Descriptions.Item label="Amount">$299.99</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'gyms', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div style={{ flex: 1 }}>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaDumbbell />
              </span>
              {selectedGym.name}
              {selectedGym.featured && <FaCrown style={{ color: '#faad14', marginLeft: '8px', fontSize: '20px' }} />}
            </h1>
            <p className="dashboard-page-subtitle">{selectedGym.location}</p>
          </div>
          <div>
            <Space>
              <Button icon={<FaEdit />}>
                Edit Gym
              </Button>
              <Button 
                icon={<FaTrash />} 
                danger
                onClick={() => handleDeleteGym(selectedGym.id)}
              >
                Delete
              </Button>
            </Space>
          </div>
        </div>

        {/* Status Alerts */}
        {selectedGym.paymentStatus === 'overdue' && (
          <Alert
            message="Payment Overdue"
            description="This gym has overdue payments. Consider suspending services."
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
            action={
              <Button size="small" type="primary">
                Send Payment Reminder
              </Button>
            }
          />
        )}

        {/* Tabbed Content */}
        <Tabs 
          defaultActiveKey="overview"
          items={tabItems}
          size="large"
        />
      </div>
    </AdminProtectedRoute>
  );
}