'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
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
  Statistic
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
import { mockAdminGyms, mockGymUsers } from '@/lib/constants';
import type { AdminGym, Branch } from '@/lib/types';
import BranchTree from '@/components/admin/BranchTree';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';

const { Title, Text } = Typography;
const { Option } = Select;

interface PageProps {
  params: Promise<{ gymId: string }>;
}

export default function BranchManagementPage({ params }: PageProps) {
  const { gymId } = use(params);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams.locale as string;

  const gym = mockAdminGyms.find(g => g.id === gymId);
  const [branches, setBranches] = useState<Branch[]>(gym?.branches || []);

  if (!gym) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Gym not found</Text>
        <Button onClick={() => router.push(`/${locale}/admin/gyms`)}>
          Back to Gyms
        </Button>
      </div>
    );
  }

  const handleAddBranch = () => {
    setEditingBranch(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    form.setFieldsValue(branch);
    setIsModalVisible(true);
  };

  const handleDeleteBranch = (branchId: string) => {
    Modal.confirm({
      title: 'Delete Branch',
      content: 'Are you sure you want to delete this branch? All associated staff and clients will need to be reassigned.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setBranches(branches.filter(branch => branch.id !== branchId));
      },
    });
  };

  const handleSaveBranch = async (values: any) => {
    if (editingBranch) {
      // Update existing branch
      setBranches(branches.map(branch => 
        branch.id === editingBranch.id 
          ? { ...branch, ...values }
          : branch
      ));
    } else {
      // Add new branch
      const newBranch: Branch = {
        id: `branch-${Date.now()}`,
        ...values,
        staff: [],
        clients: [],
        createdAt: new Date().toISOString(),
      };
      setBranches([...branches, newBranch]);
    }
    
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Branch Details',
      key: 'details',
      render: (branch: Branch) => (
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
      render: (branch: Branch) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <FaPhone style={{ marginRight: '6px', color: '#8c8c8c' }} />
            <span style={{ fontSize: '13px' }}>{branch.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaEnvelope style={{ marginRight: '6px', color: '#8c8c8c' }} />
            <span style={{ fontSize: '13px' }}>{branch.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager: string) => manager || <Text italic>Not assigned</Text>,
    },
    {
      title: 'Staff',
      key: 'staff',
      render: (branch: Branch) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '500', color: '#4CAF50' }}>
            {branch.staff.length}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            members
          </div>
        </div>
      ),
    },
    {
      title: 'Clients',
      key: 'clients',
      render: (branch: Branch) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '500', color: '#52c41a' }}>
            {branch.clients.length}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            clients
          </div>
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
  const totalStaff = branches.reduce((sum, branch) => sum + branch.staff.length, 0);
  const totalClients = branches.reduce((sum, branch) => sum + branch.clients.length, 0);
  const activeBranches = branches.filter(branch => branch.status === 'active').length;

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaBuilding />
              </span>
              Branch Management - {gym.name}
            </h1>
            <p className="dashboard-page-subtitle">Manage branches, staff assignments, and client distribution</p>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Branches"
                value={branches.length}
                prefix={<FaBuilding style={{ color: '#4CAF50' }} />}
                suffix={`(${activeBranches} active)`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Staff"
                value={totalStaff}
                prefix={<FaUsers style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Clients"
                value={totalClients}
                prefix={<FaUsers style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Branch Tree Visualization */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={8}>
            <Card title="Branch Hierarchy">
              <BranchTree gym={gym} branches={branches} />
            </Card>
          </Col>
          
          <Col xs={24} lg={16}>
            <Card 
              title="Branch List"
              extra={
                <Button 
                  type="primary"
                  icon={<FaPlus />}
                  onClick={handleAddBranch}
                >
                  Add Branch
                </Button>
              }
            >
              <Table
                columns={columns}
                dataSource={branches}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Branch Modal */}
        <Modal
          title={editingBranch ? 'Edit Branch' : 'Add New Branch'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveBranch}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Branch Name"
                  rules={[{ required: true, message: 'Please enter branch name' }]}
                >
                  <Input placeholder="e.g., Downtown Branch" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select placeholder="Select status">
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input.TextArea rows={2} placeholder="Full branch address" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="+1 (555) 123-4567" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input placeholder="branch@gym.com" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="manager"
              label="Manager"
            >
              <Input placeholder="Branch manager name" />
            </Form.Item>
            
            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingBranch ? 'Update Branch' : 'Create Branch'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminProtectedRoute>
  );
}