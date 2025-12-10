'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Input, 
  Select, 
  Modal, 
  Form,
  Typography,
  Row,
  Col,
  Statistic,
  Avatar,
  Popconfirm
} from 'antd';
import { 
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaSearch,
  FaFilter,
  FaEye,
  FaBan,
  FaCheck
} from 'react-icons/fa';
import { mockGymUsers, mockAdminGyms } from '@/lib/constants';
import { UserRole, GymUser } from '@/lib/types';
import UserManagement from '@/components/admin/UserManagement';
import RoleSelector from '@/components/admin/RoleSelector';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function UsersManagementPage() {
  const [users, setUsers] = useState<GymUser[]>(mockGymUsers);
  const [filteredUsers, setFilteredUsers] = useState<GymUser[]>(mockGymUsers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<GymUser | null>(null);
  const [form] = Form.useForm();
  
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  // Apply filters
  const applyFilters = () => {
    let filtered = users;
    
    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.gymId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }
    
    setFilteredUsers(filtered);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters();
  };

  // Handle filter changes
  const handleRoleFilter = (value: UserRole | 'all') => {
    setRoleFilter(value);
    applyFilters();
  };

  const handleStatusFilter = (value: 'all' | 'active' | 'inactive') => {
    setStatusFilter(value);
    applyFilters();
  };

  // User actions
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user: GymUser) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    applyFilters();
  };

  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);
    applyFilters();
  };

  const handleSaveUser = async (values: any) => {
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(user =>
        user.id === editingUser.id ? { ...user, ...values } : user
      );
      setUsers(updatedUsers);
    } else {
      // Add new user
      const newUser: GymUser = {
        id: `user-${Date.now()}`,
        ...values,
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true,
      };
      setUsers([...users, newUser]);
    }
    
    setIsModalVisible(false);
    form.resetFields();
    applyFilters();
  };

  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case UserRole.FITCONNECT_ADMIN: return 'red';
      case UserRole.GYM_OWNER: return 'purple';
      case UserRole.GYM_MANAGER: return 'blue';
      case UserRole.GYM_TRAINER: return 'green';
      case UserRole.GYM_RECEPTIONIST: return 'orange';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    return role.replace('gym_', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getGymName = (gymId: string): string => {
    const gym = mockAdminGyms.find(g => g.id === gymId);
    return gym?.name || 'Unknown Gym';
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (user: GymUser) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar size={40} style={{ backgroundColor: '#4CAF50', fontSize: '14px' }}>
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: '500', marginBottom: '2px' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => (
        <Tag color={getRoleColor(role)}>
          {getRoleLabel(role)}
        </Tag>
      ),
    },
    {
      title: 'Gym',
      dataIndex: 'gymId',
      key: 'gymId',
      render: (gymId: string) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => router.push(`/${locale}/admin/gyms/${gymId}`)}
        >
          {getGymName(gymId)}
        </Button>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branchId',
      key: 'branchId',
      render: (branchId: string | undefined, user: GymUser) => {
        if (!branchId) return <Text italic style={{ color: '#8c8c8c' }}>No branch</Text>;
        
        const gym = mockAdminGyms.find(g => g.id === user.gymId);
        const branch = gym?.branches.find(b => b.id === branchId);
        return branch?.name || 'Unknown Branch';
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (user: GymUser) => (
        <Tag color={user.isActive ? 'success' : 'default'}>
          {user.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (user: GymUser) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<FaEye />}
            onClick={() => router.push(`/${locale}/admin/users/${user.id}`)}
          >
            View
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<FaEdit />}
            onClick={() => handleEditUser(user)}
          >
            Edit
          </Button>
          <Popconfirm
            title={`${user.isActive ? 'Deactivate' : 'Activate'} user?`}
            onConfirm={() => handleToggleUserStatus(user.id)}
          >
            <Button 
              type="text" 
              size="small" 
              icon={user.isActive ? <FaBan /> : <FaCheck />}
              danger={user.isActive}
            >
              {user.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Delete user?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteUser(user.id)}
          >
            <Button 
              type="text" 
              size="small" 
              icon={<FaTrash />}
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const adminUsers = users.filter(u => u.role === UserRole.FITCONNECT_ADMIN).length;
  const gymOwners = users.filter(u => u.role === UserRole.GYM_OWNER).length;

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'users', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaUsers />
              </span>
              User Management
            </h1>
            <p className="dashboard-page-subtitle">Manage all users across the FitConnect platform</p>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={totalUsers}
                prefix={<FaUsers style={{ color: '#4CAF50' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={activeUsers}
                prefix={<FaUsers style={{ color: '#52c41a' }} />}
                suffix={`/ ${totalUsers}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Gym Owners"
                value={gymOwners}
                prefix={<FaUserShield style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Admin Users"
                value={adminUsers}
                prefix={<FaUserShield style={{ color: '#ff4d4f' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* User Management Table */}
        <Card>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Search
                placeholder="Search users..."
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 250 }}
                enterButton={<FaSearch />}
              />
              
              <Select
                style={{ width: 150 }}
                placeholder="Filter by role"
                value={roleFilter}
                onChange={handleRoleFilter}
              >
                <Option value="all">All Roles</Option>
                <Option value={UserRole.FITCONNECT_ADMIN}>Admin</Option>
                <Option value={UserRole.GYM_OWNER}>Owner</Option>
                <Option value={UserRole.GYM_MANAGER}>Manager</Option>
                <Option value={UserRole.GYM_TRAINER}>Trainer</Option>
                <Option value={UserRole.GYM_RECEPTIONIST}>Receptionist</Option>
              </Select>
              
              <Select
                style={{ width: 120 }}
                placeholder="Status"
                value={statusFilter}
                onChange={handleStatusFilter}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedRowKeys.length > 0 && (
                <Space>
                  <Button 
                    onClick={() => {
                      // Bulk deactivate
                      const updatedUsers = users.map(user =>
                        selectedRowKeys.includes(user.id) ? { ...user, isActive: false } : user
                      );
                      setUsers(updatedUsers);
                      setSelectedRowKeys([]);
                      applyFilters();
                    }}
                  >
                    Deactivate Selected ({selectedRowKeys.length})
                  </Button>
                  <Button 
                    danger
                    onClick={() => {
                      Modal.confirm({
                        title: 'Delete Selected Users',
                        content: `Are you sure you want to delete ${selectedRowKeys.length} users? This action cannot be undone.`,
                        onOk() {
                          const updatedUsers = users.filter(user => !selectedRowKeys.includes(user.id));
                          setUsers(updatedUsers);
                          setSelectedRowKeys([]);
                          applyFilters();
                        },
                      });
                    }}
                  >
                    Delete Selected ({selectedRowKeys.length})
                  </Button>
                </Space>
              )}
              
              <Button 
                type="primary" 
                icon={<FaPlus />}
                onClick={handleAddUser}
              >
                Add New User
              </Button>
            </div>
          </div>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredUsers.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} users`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Add/Edit User Modal */}
        <UserManagement
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSave={handleSaveUser}
          editingUser={editingUser}
          form={form}
          gyms={mockAdminGyms}
        />
      </div>
    </AdminProtectedRoute>
  );
}