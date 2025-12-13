'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Typography, 
  Row, 
  Col,
  Descriptions,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Alert,
  Divider
} from 'antd';
import { 
  FaUserShield,
  FaEdit,
  FaPlus,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { UserRole, Permission } from '@/lib/types';
import { ROLE_PERMISSIONS, PERMISSIONS, getRolePermissions } from '@/lib/roles';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdBy: string;
  createdAt: string;
}

export default function RoleManager() {
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([
    {
      id: 'custom-1',
      name: 'Branch Supervisor',
      description: 'Supervises multiple branches with limited admin access',
      permissions: [
        { resource: 'branches', actions: ['read', 'update'] },
        { resource: 'users', actions: ['read', 'update'] },
        { resource: 'clients', actions: ['read', 'update', 'delete'] },
      ],
      isSystem: false,
      createdBy: 'admin@fitconnect.com',
      createdAt: '2024-12-01'
    }
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewingRole, setViewingRole] = useState<UserRole | CustomRole | null>(null);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [form] = Form.useForm();

  // Get all system roles with their permissions
  const systemRoles = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
    role: role as UserRole,
    permissions,
    isSystem: true
  }));

  const handleViewRole = (role: UserRole | CustomRole) => {
    setViewingRole(role);
  };

  const handleEditRole = (role: CustomRole) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions.map(p => `${p.resource}:${p.actions.join(',')}`),
    });
    setIsModalVisible(true);
  };

  const handleAddRole = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDeleteRole = (roleId: string) => {
    Modal.confirm({
      title: 'Delete Custom Role',
      content: 'Are you sure you want to delete this custom role? Users assigned to this role will lose their permissions.',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk() {
        setCustomRoles(roles => roles.filter(r => r.id !== roleId));
      },
    });
  };

  const handleSaveRole = async (values: any) => {
    const permissions: Permission[] = values.permissions.map((perm: string) => {
      const [resource, actions] = perm.split(':');
      return {
        resource,
        actions: actions.split(',')
      };
    });

    if (editingRole) {
      // Update existing role
      setCustomRoles(roles => roles.map(r => 
        r.id === editingRole.id 
          ? { 
              ...r, 
              name: values.name,
              description: values.description,
              permissions 
            }
          : r
      ));
    } else {
      // Create new role
      const newRole: CustomRole = {
        id: `custom-${Date.now()}`,
        name: values.name,
        description: values.description,
        permissions,
        isSystem: false,
        createdBy: 'admin@fitconnect.com',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomRoles(roles => [...roles, newRole]);
    }
    
    setIsModalVisible(false);
    form.resetFields();
  };

  const systemRoleColumns = [
    {
      title: 'Role',
      key: 'role',
      render: (record: any) => (
        <div>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>
            {record.role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </div>
          <Tag color="blue">SYSTEM ROLE</Tag>
        </div>
      ),
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (record: any) => (
        <div>
          <Text style={{ fontSize: '14px', fontWeight: '500' }}>
            {record.permissions.length} permissions
          </Text>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
            {record.permissions.slice(0, 3).map((p: Permission, i: number) => (
              <Tag key={i}>{p.resource}</Tag>
            ))}
            {record.permissions.length > 3 && (
              <Tag>+{record.permissions.length - 3} more</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button 
          type="text" 
         
          icon={<FaEye />}
          onClick={() => handleViewRole(record.role)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const customRoleColumns = [
    {
      title: 'Role',
      key: 'role',
      render: (record: CustomRole) => (
        <div>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>
            {record.name}
          </div>
          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (record: CustomRole) => (
        <div>
          <Text style={{ fontSize: '14px', fontWeight: '500' }}>
            {record.permissions.length} permissions
          </Text>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
            {record.permissions.slice(0, 3).map((p, i) => (
              <Tag key={i}>{p.resource}</Tag>
            ))}
            {record.permissions.length > 3 && (
              <Tag>+{record.permissions.length - 3} more</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Created',
      key: 'created',
      render: (record: CustomRole) => (
        <div style={{ fontSize: '12px' }}>
          <div>{new Date(record.createdAt).toLocaleDateString()}</div>
          <div style={{ color: '#8c8c8c' }}>by {record.createdBy}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: CustomRole) => (
        <Space>
          <Button 
            type="text" 
           
            icon={<FaEye />}
            onClick={() => handleViewRole(record)}
          >
            View
          </Button>
          <Button 
            type="text" 
           
            icon={<FaEdit />}
            onClick={() => handleEditRole(record)}
          >
            Edit
          </Button>
          <Button 
            type="text" 
           
            icon={<FaTrash />}
            danger
            onClick={() => handleDeleteRole(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const getAvailablePermissions = () => {
    return Object.values(PERMISSIONS).map(permission => ({
      value: `${permission.resource}:${permission.actions.join(',')}`,
      label: `${permission.resource.charAt(0).toUpperCase() + permission.resource.slice(1)} - ${permission.actions.join(', ')}`,
      resource: permission.resource,
      actions: permission.actions
    }));
  };

  return (
    <div>
      {/* System Roles */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserShield style={{ marginRight: '8px', color: '#4CAF50' }} />
            System Roles
          </div>
        }
        style={{ marginBottom: '24px' }}
      >
        <Alert
          message="System Role Information"
          description="These are built-in roles that cannot be modified. They provide predefined permission sets for common user types."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        
        <Table
          columns={systemRoleColumns}
          dataSource={systemRoles}
          rowKey="role"
          pagination={false}
        />
      </Card>

      {/* Custom Roles */}
      <Card 
        title="Custom Roles"
        extra={
          <Button 
            type="primary" 
            icon={<FaPlus />}
            onClick={handleAddRole}
          >
            Create Custom Role
          </Button>
        }
      >
        {customRoles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <FaUserShield style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4} style={{ color: '#8c8c8c' }}>No Custom Roles</Title>
            <Paragraph style={{ color: '#8c8c8c' }}>
              Create custom roles to define specific permission sets for your organization.
            </Paragraph>
            <Button type="primary" icon={<FaPlus />} onClick={handleAddRole}>
              Create First Custom Role
            </Button>
          </div>
        ) : (
          <Table
            columns={customRoleColumns}
            dataSource={customRoles}
            rowKey="id"
            pagination={false}
          />
        )}
      </Card>

      {/* Role Details Modal */}
      {viewingRole && (
        <Modal
          title={`Role Details: ${typeof viewingRole === 'string' ? 
            viewingRole.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 
            (viewingRole as CustomRole).name
          }`}
          open={!!viewingRole}
          onCancel={() => setViewingRole(null)}
          footer={[
            <Button key="close" onClick={() => setViewingRole(null)}>
              Close
            </Button>
          ]}
          width={600}
        >
          {typeof viewingRole === 'string' ? (
            // System role
            <div>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Role Type">System Role</Descriptions.Item>
                <Descriptions.Item label="Role ID">{viewingRole}</Descriptions.Item>
                <Descriptions.Item label="Modifiable">
                  <Tag color="red">No - System Protected</Tag>
                </Descriptions.Item>
              </Descriptions>
              
              <Divider>Permissions</Divider>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {getRolePermissions(viewingRole as UserRole).map((permission, index) => (
                  <Card key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong>{permission.resource.toUpperCase()}</Text>
                      </div>
                      <div>
                        {permission.actions.map(action => (
                          <Tag key={action} color="blue">
                            {action.toUpperCase()}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Custom role
            <div>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Role Name">{viewingRole.name}</Descriptions.Item>
                <Descriptions.Item label="Description">{viewingRole.description}</Descriptions.Item>
                <Descriptions.Item label="Role Type">
                  <Tag color="green">Custom Role</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created By">{viewingRole.createdBy}</Descriptions.Item>
                <Descriptions.Item label="Created Date">
                  {new Date(viewingRole.createdAt).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>
              
              <Divider>Permissions</Divider>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {viewingRole.permissions.map((permission, index) => (
                  <Card key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong>{permission.resource.toUpperCase()}</Text>
                      </div>
                      <div>
                        {permission.actions.map(action => (
                          <Tag key={action} color="blue">
                            {action.toUpperCase()}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Add/Edit Custom Role Modal */}
      <Modal
        title={editingRole ? 'Edit Custom Role' : 'Create Custom Role'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveRole}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Role Name"
                rules={[{ required: true, message: 'Please enter role name' }]}
              >
                <Input placeholder="e.g., Branch Supervisor" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter role description' }]}
              >
                <Input placeholder="Brief description of this role" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select at least one permission' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select permissions for this role"
              optionLabelProp="label"
            >
              {getAvailablePermissions().map(perm => (
                <Option key={perm.value} value={perm.value} label={perm.label}>
                  <div>
                    <div style={{ fontWeight: '500' }}>
                      {perm.resource.charAt(0).toUpperCase() + perm.resource.slice(1)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {perm.actions.join(', ').toUpperCase()}
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Alert
            message="Role Creation Guidelines"
            description="Custom roles should follow the principle of least privilege. Only grant the minimum permissions necessary for users to perform their duties."
            type="warning"
            showIcon
            style={{ marginTop: '16px' }}
          />
        </Form>
      </Modal>
    </div>
  );
}

