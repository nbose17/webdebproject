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
  Skeleton,
  message,
  Modal
} from 'antd';
import {
  FaArrowLeft,
  FaBuilding,
  FaUsers,
  FaEdit,
  FaTrash,
  FaPhone,
  FaEnvelope,
  FaMapMarker,
  FaUser,
  FaUserTie,
  FaExclamationTriangle
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { Branch } from '@/lib/types';
import { GET_BRANCH, DELETE_BRANCH, DELETE_USER } from '@/graphql/queries/admin';

const { Title, Text } = Typography;

interface PageProps {
  params: Promise<{ gymId: string; branchId: string; locale: string }>;
}

export default function BranchDetailsPage({ params }: PageProps) {
  const { gymId, branchId } = use(params);
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams.locale as string;

  // Fetch branch data from GraphQL
  const { data, loading, error, refetch } = useQuery<{ branch: Branch }>(GET_BRANCH, {
    variables: { id: branchId, gymId },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteBranchMutation] = useMutation<{ deleteBranch: boolean }>(DELETE_BRANCH);

  const [deleteUserMutation] = useMutation<{ deleteUser: boolean }>(DELETE_USER);

  const branch = data?.branch;

  // Loading skeleton
  if (loading) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'read' }}>
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
                <Skeleton active paragraph={{ rows: 8 }} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
                </Col>
                <Col span={24}>
                  <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
                </Col>
                <Col span={24}>
                  <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </AdminProtectedRoute>
    );
  }

  // Error state
  if (error || !branch) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'read' }}>
        <div>
          <div className="dashboard-page-header">
            <div style={{ flex: 1 }}>
              <Button
                icon={<FaArrowLeft />}
                onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches`)}
              >
                Back
              </Button>
            </div>
          </div>
          <Card>
            <Alert
              message="Branch Not Found"
              description={error?.message || "The requested branch could not be found."}
              type="error"
              showIcon
              action={
                <Button onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches`)}>
                  Back to Branches
                </Button>
              }
            />
          </Card>
        </div>
      </AdminProtectedRoute>
    );
  }

  const handleEditBranch = () => {
    router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}/edit`);
  };

  const handleDeleteBranch = () => {
    Modal.confirm({
      title: 'Delete Branch',
      content: 'Are you sure you want to delete this branch? All associated staff and clients will need to be reassigned.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await deleteBranchMutation({
            variables: { id: branchId, gymId },
          });
          message.success('Branch deleted successfully');
          router.push(`/${locale}/admin/gyms/${gymId}/branches`);
        } catch (err: any) {
          message.error(err?.message || 'Failed to delete branch');
        }
      },
    });
  };

  const handleDeleteStaff = async (staffId: string, staffName: string) => {
    Modal.confirm({
      title: 'Delete Staff Member',
      content: `Are you sure you want to delete ${staffName}? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await deleteUserMutation({
            variables: { id: staffId },
            refetchQueries: [
              { query: GET_BRANCH, variables: { id: branchId, gymId } },
            ],
          });
          message.success('Staff member deleted successfully');
        } catch (err: any) {
          message.error(err?.message || 'Failed to delete staff member');
        }
      },
    });
  };

  const staffColumns = [
    {
      title: 'Name',
      key: 'name',
      render: (staff: any) => (
        <div>
          <div style={{ fontWeight: '500' }}>{staff.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{staff.email}</div>
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
    {
      title: 'Actions',
      key: 'actions',
      render: (staff: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<FaEdit />}
            onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}/staff/${staff.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            type="text"
            size="small"
            icon={<FaTrash />}
            danger
            onClick={() => handleDeleteStaff(staff.id, staff.name)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const clientColumns = [
    {
      title: 'Name',
      key: 'name',
      render: (client: any) => (
        <div>
          <div style={{ fontWeight: '500' }}>{client.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{client.email}</div>
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Membership',
      dataIndex: 'membershipType',
      key: 'membershipType',
      render: (type: string) => <Tag>{type || 'N/A'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status?.toUpperCase() || 'N/A'}
        </Tag>
      ),
    },
  ];

  const totalStaff = branch.staff?.length || 0;
  const activeStaff = branch.staff?.filter((s: any) => s.isActive).length || 0;
  const totalClients = branch.clients?.length || 0;
  const activeClients = branch.clients?.filter((c: any) => c.status === 'active').length || 0;

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Branch Information">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Branch Name">{branch.name}</Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={branch.status === 'active' ? 'success' : 'error'}>
                      {branch.status?.toUpperCase() || 'UNKNOWN'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FaMapMarker style={{ marginRight: '8px', color: '#8c8c8c' }} />
                      {branch.address}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FaPhone style={{ marginRight: '8px', color: '#8c8c8c' }} />
                      {branch.phone}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FaEnvelope style={{ marginRight: '8px', color: '#8c8c8c' }} />
                      {branch.email}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Gym">
                    {branch.gym ? (
                      <div>
                        <div style={{ fontWeight: '500' }}>{branch.gym.name}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{branch.gym.location}</div>
                      </div>
                    ) : (
                      <Text type="secondary">N/A</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Manager">
                    {branch.manager ? (
                      <div>
                        <div style={{ fontWeight: '500' }}>{branch.manager.name}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{branch.manager.email}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                          <Tag>{branch.manager.role?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}</Tag>
                        </div>
                      </div>
                    ) : (
                      <Text type="secondary" italic>Not assigned</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created">
                    {branch.createdAt ? new Date(branch.createdAt).toLocaleDateString() : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    {branch.updatedAt ? new Date(branch.updatedAt).toLocaleDateString() : 'N/A'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Row gutter={[16, 16]}>
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
                <Col span={24}>
                  <Card>
                    <Statistic
                      title="Branch Status"
                      value={branch.status === 'active' ? 'Active' : 'Inactive'}
                      prefix={<FaBuilding style={{ color: branch.status === 'active' ? '#4CAF50' : '#8c8c8c' }} />}
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
      key: 'staff',
      label: `Staff (${totalStaff})`,
      children: (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Title level={4} style={{ margin: 0 }}>Branch Staff</Title>
            <Button
              type="primary"
              icon={<FaUser />}
              onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}/staff/new`)}
            >
              Add Staff
            </Button>
          </div>

          {totalStaff === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">No staff members assigned to this branch.</Text>
              </div>
            </Card>
          ) : (
            <Table
              columns={staffColumns}
              dataSource={branch.staff || []}
              rowKey="id"
              pagination={totalStaff > 10 ? { pageSize: 10 } : false}
            />
          )}
        </div>
      ),
    },
    {
      key: 'clients',
      label: `Clients (${totalClients})`,
      children: (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Title level={4} style={{ margin: 0 }}>Branch Clients</Title>
            <Button
              type="primary"
              icon={<FaUser />}
              onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}/clients/new`)}
            >
              Add Client
            </Button>
          </div>

          {totalClients === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">No clients assigned to this branch.</Text>
              </div>
            </Card>
          ) : (
            <Table
              columns={clientColumns}
              dataSource={branch.clients || []}
              rowKey="id"
              pagination={totalClients > 10 ? { pageSize: 10 } : false}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Button
                icon={<FaArrowLeft />}
                onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches`)}
              >
                Back
              </Button>
              <h1 className="dashboard-page-title" style={{ margin: 0 }}>
                <span className="dashboard-page-title-icon">
                  <FaBuilding />
                </span>
                {branch.name}
              </h1>
            </div>
            <p className="dashboard-page-subtitle">
              {branch.gym?.name} • {branch.address}
            </p>
          </div>
          <div>
            <Space>
              <Button
                icon={<FaEdit />}
                onClick={handleEditBranch}
              >
                Edit Branch
              </Button>
              <Button
                danger
                icon={<FaTrash />}
                onClick={handleDeleteBranch}
              >
                Delete Branch
              </Button>
            </Space>
          </div>
        </div>

        {branch.status === 'inactive' && (
          <Alert
            message="Branch Inactive"
            description="This branch is currently inactive. Staff and clients may need to be reassigned."
            type="warning"
            icon={<FaExclamationTriangle />}
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Tabs items={tabItems} defaultActiveKey="overview" />
      </div>
    </AdminProtectedRoute>
  );
}


