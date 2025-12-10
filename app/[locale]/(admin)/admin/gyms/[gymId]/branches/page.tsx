'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Typography,
  Row,
  Col,
  Statistic,
  Skeleton,
  Alert,
  message
} from 'antd';
import { 
  FaArrowLeft,
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMapMarker
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { GET_GYM, GET_BRANCHES, CREATE_BRANCH, UPDATE_BRANCH, DELETE_BRANCH } from '@/graphql/queries/admin';

const { Title, Text } = Typography;
const { Option } = Select;

interface PageProps {
  params: Promise<{ gymId: string; locale: string }>;
}

export default function BranchManagementPage({ params }: PageProps) {
  const { gymId } = use(params);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams.locale as string;

  // Fetch gym data
  const { data: gymData, loading: gymLoading, error: gymError } = useQuery(GET_GYM, {
    variables: { id: gymId },
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('Error fetching gym:', err);
    },
  });

  // Fetch branches
  const { data: branchesData, loading: branchesLoading, error: branchesError, refetch: refetchBranches } = useQuery(GET_BRANCHES, {
    variables: { gymId },
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('Error fetching branches:', err);
    },
  });

  const [createBranchMutation] = useMutation(CREATE_BRANCH, {
    onError: (err) => {
      console.error('Error creating branch:', err);
      message.error(err.message || 'Failed to create branch');
    },
  });

  const [updateBranchMutation] = useMutation(UPDATE_BRANCH, {
    onError: (err) => {
      console.error('Error updating branch:', err);
      message.error(err.message || 'Failed to update branch');
    },
  });

  const [deleteBranchMutation] = useMutation(DELETE_BRANCH, {
    onError: (err) => {
      console.error('Error deleting branch:', err);
      message.error(err.message || 'Failed to delete branch');
    },
  });

  const gym = gymData?.gym;
  const branches = branchesData?.branches || [];

  // Loading skeleton
  if (gymLoading) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'read' }}>
        <div>
          <div className="dashboard-page-header">
            <div style={{ flex: 1 }}>
              <Skeleton.Button active size="large" style={{ width: 300, height: 32, marginBottom: 8 }} />
              <Skeleton.Input active size="small" style={{ width: 200 }} />
            </div>
          </div>
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col xs={24} sm={8}>
              <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
            </Col>
          </Row>
          <Card style={{ marginTop: '24px' }}>
            <Skeleton active paragraph={{ rows: 5 }} />
          </Card>
        </div>
      </AdminProtectedRoute>
    );
  }

  // Error state
  if (gymError || !gym) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'read' }}>
        <div>
          <div className="dashboard-page-header">
            <div style={{ flex: 1 }}>
              <Button 
                icon={<FaArrowLeft />} 
                onClick={() => router.push(`/${locale}/admin/gyms`)}
              >
                Back
              </Button>
            </div>
          </div>
          <Card>
            <Alert
              message="Gym Not Found"
              description={gymError?.message || "The requested gym could not be found."}
              type="error"
              showIcon
              action={
                <Button onClick={() => router.push(`/${locale}/admin/gyms`)}>
                  Back to Gyms
                </Button>
              }
            />
          </Card>
        </div>
      </AdminProtectedRoute>
    );
  }

  const handleAddBranch = () => {
    setEditingBranch(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditBranch = (branch: any) => {
    setEditingBranch(branch);
    form.setFieldsValue({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      status: branch.status,
      managerId: branch.managerId,
    });
    setIsModalVisible(true);
  };

  const handleDeleteBranch = async (branchId: string) => {
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
          await refetchBranches();
        } catch (err: any) {
          message.error(err?.message || 'Failed to delete branch');
        }
      },
    });
  };

  const handleSaveBranch = async (values: any) => {
    try {
      if (editingBranch) {
        // Update existing branch
        await updateBranchMutation({
          variables: {
            id: editingBranch.id,
            gymId,
            ...values,
          },
        });
        message.success('Branch updated successfully');
      } else {
        // Create new branch
        await createBranchMutation({
          variables: {
            ...values,
            gymId,
          },
        });
        message.success('Branch created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      await refetchBranches();
    } catch (err: any) {
      message.error(err?.message || 'Failed to save branch');
    }
  };

  const columns = [
    {
      title: 'Branch Details',
      key: 'details',
      render: (branch: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <FaBuilding style={{ marginRight: '8px', color: '#4CAF50' }} />
            <span style={{ fontWeight: '500' }}>{branch.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#8c8c8c' }}>
            <FaMapMarker style={{ marginRight: '6px' }} />
            {branch.address}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (branch: any) => (
        <div>
          {branch.phone && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <FaPhone style={{ marginRight: '6px', color: '#8c8c8c' }} />
              <span style={{ fontSize: '13px' }}>{branch.phone}</span>
            </div>
          )}
          {branch.email && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaEnvelope style={{ marginRight: '6px', color: '#8c8c8c' }} />
              <span style={{ fontSize: '13px' }}>{branch.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Manager',
      key: 'manager',
      render: (branch: any) => (
        <div>
          {branch.manager ? (
            <div>
              <div style={{ fontWeight: '500' }}>{branch.manager.name}</div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{branch.manager.email}</div>
            </div>
          ) : (
            <Text type="secondary" italic>Not assigned</Text>
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
          <Button 
            type="text" 
            size="small" 
            icon={<FaEdit />}
            onClick={() => handleEditBranch(branch)}
          >
            Edit
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<FaTrash />}
            danger
            onClick={() => handleDeleteBranch(branch.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Calculate statistics
  const activeBranches = branches.filter((branch: any) => branch.status === 'active').length;

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Button 
                icon={<FaArrowLeft />} 
                onClick={() => router.push(`/${locale}/admin/gyms/${gymId}`)}
              >
                Back
              </Button>
              <h1 className="dashboard-page-title" style={{ margin: 0 }}>
                <span className="dashboard-page-title-icon">
                  <FaBuilding />
                </span>
                Branch Management - {gym.name}
              </h1>
            </div>
            <p className="dashboard-page-subtitle">Manage branches, staff assignments, and client distribution</p>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Col xs={24} sm={8}>
            <Card>
              {branchesLoading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <Statistic
                  title="Total Branches"
                  value={branches.length}
                  prefix={<FaBuilding style={{ color: '#4CAF50' }} />}
                  suffix={`(${activeBranches} active)`}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              {branchesLoading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <Statistic
                  title="Active Branches"
                  value={activeBranches}
                  prefix={<FaBuilding style={{ color: '#52c41a' }} />}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              {branchesLoading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <Statistic
                  title="Inactive Branches"
                  value={branches.length - activeBranches}
                  prefix={<FaBuilding style={{ color: '#8c8c8c' }} />}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* Branch List */}
        <Card 
          title="Branch List"
          extra={
            <Button 
              type="primary"
              icon={<FaPlus />}
              onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/new`)}
            >
              Add Branch
            </Button>
          }
        >
          {branchesLoading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : branches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text type="secondary">No branches found for this gym.</Text>
              <div style={{ marginTop: '16px' }}>
                <Button 
                  type="primary"
                  icon={<FaPlus />}
                  onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/new`)}
                >
                  Create First Branch
                </Button>
              </div>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={branches}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} branches`,
              }}
            />
          )}
        </Card>

      </div>
    </AdminProtectedRoute>
  );
}
