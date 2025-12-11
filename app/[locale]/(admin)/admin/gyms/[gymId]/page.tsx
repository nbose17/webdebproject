'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
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
  Modal,
  Skeleton,
  message,
  Image as AntImage
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
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { GET_GYM, DELETE_GYM } from '@/graphql/queries/admin';

const { Title, Text } = Typography;

interface PageProps {
  params: Promise<{ gymId: string; locale: string }>;
}

export default function GymDetailsPage({ params }: PageProps) {
  const { gymId } = use(params);
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams.locale as string;
  
  // Fetch gym data from GraphQL
  const { data, loading, error, refetch } = useQuery(GET_GYM, {
    variables: { id: gymId },
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('Error fetching gym:', err);
      message.error('Failed to load gym details. Please try again.');
    },
  });

  const [deleteGymMutation] = useMutation(DELETE_GYM);

  // Loading skeleton
  if (loading) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'gyms', action: 'read' }}>
        <div>
          <div className="dashboard-page-header">
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Skeleton.Button active size="default" style={{ width: 80 }} />
                <Skeleton.Button active size="large" style={{ width: 250, height: 32 }} />
              </div>
              <Skeleton.Input active size="small" style={{ width: 200 }} />
            </div>
            <div>
              <Space>
                <Skeleton.Button active size="default" style={{ width: 100 }} />
                <Skeleton.Button active size="default" style={{ width: 100 }} />
              </Space>
            </div>
          </div>

          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col xs={24} lg={16}>
              <Card>
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <Skeleton.Image active style={{ width: 200, height: 150 }} />
                </div>
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card>
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Tabs Skeleton */}
          <Card style={{ marginTop: '24px' }}>
            <Skeleton active paragraph={{ rows: 1 }} style={{ marginBottom: 16 }} />
            <Skeleton active paragraph={{ rows: 5 }} />
          </Card>
        </div>
      </AdminProtectedRoute>
    );
  }

  // Error state
  if (error || !data?.gym) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'gyms', action: 'read' }}>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Alert
            message="Gym Not Found"
            description={error?.message || "The requested gym could not be found."}
            type="error"
            showIcon
            action={
              <Button onClick={() => router.push(`/${locale}/admin/gyms`)}>
                Back to Gyms
              </Button>
            }
          />
        </div>
      </AdminProtectedRoute>
    );
  }

  const gym = data.gym;
  const branches = gym.branches || [];
  const users = gym.users || [];
  const clients = gym.clients || [];
  const subscription = gym.subscription;
  
  // Calculate statistics
  const totalStaff = users.length;
  const totalClients = clients.length;
  const activeBranches = branches.filter((branch: any) => branch.status === 'active').length;
  const activeStaff = users.filter((user: any) => user.isActive).length;
  const activeClients = clients.filter((client: any) => client.status === 'active').length;

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
          router.push(`/${locale}/admin/gyms`);
        } catch (err: any) {
          message.error(err?.message || 'Failed to delete gym');
        }
      },
    });
  };

  const handleEditGym = () => {
    router.push(`/${locale}/admin/gyms/${gymId}/edit`);
  };

  const branchColumns = [
    {
      title: 'Branch Name',
      key: 'name',
      render: (branch: any) => (
        <div>
          <div style={{ fontWeight: '500' }}>{branch.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{branch.address}</div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (branch: any) => (
        <div>
          {branch.email && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              <FaEnvelope style={{ marginRight: '4px' }} />
              {branch.email}
            </div>
          )}
          {branch.phone && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              <FaPhone style={{ marginRight: '4px' }} />
              {branch.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status?.toUpperCase() || 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (branch: any) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<FaEye />}
            onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/${branch.id}`)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const userColumns = [
    {
      title: 'Name',
      key: 'name',
      render: (user: any) => (
        <div>
          <div style={{ fontWeight: '500' }}>{user.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{user.email}</div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag>{role?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
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
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <AntImage
                    src={gym.image || '/images/gym-placeholder.jpg'}
                    alt={gym.name}
                    width={200}
                    height={150}
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                    fallback="/images/gym-placeholder.jpg"
                  />
                </div>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Gym Name">{gym.name}</Descriptions.Item>
                  <Descriptions.Item label="Location">{gym.location}</Descriptions.Item>
                  <Descriptions.Item label="Owner">
                    {gym.owner ? (
                      <div>
                        <div style={{ fontWeight: '500' }}>{gym.owner.name}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{gym.owner.email}</div>
                      </div>
                    ) : (
                      <Text type="secondary">Not assigned</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Featured">
                    {gym.featured ? (
                      <Tag color="gold" icon={<FaCrown />}>FEATURED</Tag>
                    ) : (
                      <Tag>STANDARD</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Subscription Status">
                    <Tag color={getStatusColor(gym.subscriptionStatus?.toLowerCase() || '')}>
                      {gym.subscriptionStatus?.toUpperCase() || 'N/A'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Status">
                    <Tag color={getPaymentColor(gym.paymentStatus?.toLowerCase() || '')}>
                      {gym.paymentStatus?.toUpperCase() || 'N/A'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Created">
                    {gym.createdAt ? new Date(gym.createdAt).toLocaleDateString() : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Active">
                    {gym.lastActive ? new Date(gym.lastActive).toLocaleDateString() : 'Never'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description" span={2}>
                    {gym.description || 'No description provided'}
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
                      value={branches.length}
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
                      suffix={`(${activeStaff} active)`}
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Statistic
                      title="Total Clients"
                      value={totalClients}
                      prefix={<FaUsers style={{ color: '#722ed1' }} />}
                      suffix={`(${activeClients} active)`}
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
      label: `Branches (${branches.length})`,
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
          
          {branches.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">No branches found for this gym.</Text>
              </div>
            </Card>
          ) : (
            <Table
              columns={branchColumns}
              dataSource={branches}
              rowKey="id"
              pagination={branches.length > 10 ? { pageSize: 10 } : false}
            />
          )}
        </div>
      ),
    },
    {
      key: 'users',
      label: `Users (${users.length})`,
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px' 
          }}>
            <Title level={4} style={{ margin: 0 }}>Gym Staff & Users</Title>
            <Button 
              type="primary"
              icon={<FaPlus />}
              onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/users/new`)}
            >
              Add User
            </Button>
          </div>
          
          {users.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">No users found for this gym.</Text>
              </div>
            </Card>
          ) : (
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              pagination={users.length > 10 ? { pageSize: 10 } : false}
            />
          )}
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
                    color={getStatusColor(gym.subscriptionStatus?.toLowerCase() || '')} 
                    style={{ fontSize: '14px', padding: '4px 12px' }}
                  >
                    {gym.subscriptionStatus?.toUpperCase() || 'N/A'}
                  </Tag>
                </div>
                <Descriptions column={1}>
                  <Descriptions.Item label="Plan">
                    {subscription?.planType || 'Not subscribed'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Amount">
                    {subscription?.amount ? `$${subscription.amount.toFixed(2)}` : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Billing Cycle">
                    {subscription?.billingCycle ? subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1) : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Start Date">
                    {subscription?.startDate ? new Date(subscription.startDate).toLocaleDateString() : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="End Date">
                    {subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Next Billing">
                    {subscription?.nextPaymentDate ? new Date(subscription.nextPaymentDate).toLocaleDateString() : 'N/A'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card title="Payment Status">
                <div style={{ marginBottom: '16px' }}>
                  <Tag 
                    color={getPaymentColor(gym.paymentStatus?.toLowerCase() || '')}
                    style={{ fontSize: '14px', padding: '4px 12px' }}
                  >
                    {gym.paymentStatus?.toUpperCase() || 'N/A'}
                  </Tag>
                </div>
                <Descriptions column={1}>
                  <Descriptions.Item label="Last Payment">
                    {subscription?.lastPaymentDate ? new Date(subscription.lastPaymentDate).toLocaleDateString() : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    {subscription?.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : 'N/A'}
                  </Descriptions.Item>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Button 
                icon={<FaArrowLeft />} 
                onClick={() => router.push(`/${locale}/admin/gyms`)}
                style={{ marginRight: '8px' }}
              >
                Back
              </Button>
              <h1 className="dashboard-page-title" style={{ margin: 0 }}>
                <span className="dashboard-page-title-icon">
                  <FaDumbbell />
                </span>
                {gym.name}
                {gym.featured && <FaCrown style={{ color: '#faad14', marginLeft: '8px', fontSize: '20px' }} />}
              </h1>
            </div>
            <p className="dashboard-page-subtitle">{gym.location}</p>
          </div>
          <div>
            <Space>
              <Button icon={<FaEdit />} onClick={handleEditGym}>
                Edit Gym
              </Button>
              <Button 
                icon={<FaTrash />} 
                danger
                onClick={() => handleDeleteGym(gym.id)}
              >
                Delete
              </Button>
            </Space>
          </div>
        </div>

        {/* Status Alerts */}
        {gym.paymentStatus?.toLowerCase() === 'overdue' && (
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

        {gym.subscriptionStatus?.toLowerCase() === 'expired' && (
          <Alert
            message="Subscription Expired"
            description="This gym's subscription has expired. Renew to restore access."
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
            action={
              <Button size="small" type="primary">
                Renew Subscription
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

