'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Switch, FormInstance } from 'antd';
import { UserRole, GymUser, AdminGym } from '@/lib/types';
import RoleSelector from './RoleSelector';

const { Option } = Select;

interface UserManagementProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => Promise<void> | void;
  editingUser: GymUser | null;
  form: FormInstance;
  gyms: AdminGym[];
}

export default function UserManagement({
  visible,
  onCancel,
  onSave,
  editingUser,
  form,
  gyms
}: UserManagementProps) {

  const [selectedGymId, setSelectedGymId] = React.useState<string | undefined>(undefined);
  const [availableBranches, setAvailableBranches] = React.useState<any[]>([]);

  // Update available branches when gym changes
  useEffect(() => {
    if (selectedGymId) {
      const gym = gyms.find(g => g.id === selectedGymId);
      setAvailableBranches(gym?.branches || []);
    } else {
      setAvailableBranches([]);
    }
  }, [selectedGymId, gyms]);

  // Set initial gym ID when editing user
  useEffect(() => {
    if (editingUser) {
      setSelectedGymId(editingUser.gymId);
      form.setFieldsValue({
        ...editingUser,
        isActive: editingUser.isActive,
      });
    } else {
      setSelectedGymId(undefined);
      setAvailableBranches([]);
    }
  }, [editingUser, form]);

  const handleGymChange = (gymId: string) => {
    setSelectedGymId(gymId);
    // Clear branch selection when gym changes
    form.setFieldValue('branchId', undefined);
  };

  const handleFinish = async (values: any) => {
    try {
      await onSave(values);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const getRoleOptions = () => {
    return [
      { 
        value: UserRole.FITCONNECT_ADMIN, 
        label: 'FitConnect Admin',
        description: 'Full system access and management'
      },
      { 
        value: UserRole.GYM_OWNER, 
        label: 'Gym Owner',
        description: 'Owns and manages entire gym business'
      },
      { 
        value: UserRole.GYM_MANAGER, 
        label: 'Gym Manager',
        description: 'Manages branch operations and staff'
      },
      { 
        value: UserRole.GYM_TRAINER, 
        label: 'Gym Trainer',
        description: 'Provides training services to clients'
      },
      { 
        value: UserRole.GYM_RECEPTIONIST, 
        label: 'Receptionist',
        description: 'Front desk and client services'
      }
    ];
  };

  return (
    <Modal
      title={editingUser ? 'Edit User' : 'Add New User'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          isActive: true,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please enter full name' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter email address' },
                { type: 'email', message: 'Please enter valid email address' }
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role"
              label="User Role"
              rules={[{ required: true, message: 'Please select user role' }]}
            >
              <RoleSelector 
                options={getRoleOptions()}
                placeholder="Select user role"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="isActive"
              label="Account Status"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                defaultChecked
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="gymId"
              label="Assigned Gym"
              rules={[{ required: true, message: 'Please select gym' }]}
            >
              <Select
                placeholder="Select gym"
                onChange={handleGymChange}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {gyms.map(gym => (
                  <Option key={gym.id} value={gym.id}>
                    {gym.name} - {gym.location}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="branchId"
              label="Assigned Branch"
              tooltip="Optional - Leave empty for gym-wide access"
            >
              <Select
                placeholder="Select branch (optional)"
                disabled={!selectedGymId || availableBranches.length === 0}
                allowClear
              >
                {availableBranches.map(branch => (
                  <Option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.status === 'active' ? '✅' : '❌'}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Additional fields for admin users */}
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.role !== currentValues.role
        }>
          {({ getFieldValue }) => {
            const role = getFieldValue('role');
            
            if (role === UserRole.FITCONNECT_ADMIN) {
              return (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fff2f0',
                  border: '1px solid #ffccc7',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ 
                    fontWeight: '500', 
                    color: '#cf1322', 
                    marginBottom: '8px' 
                  }}>
                    ⚠️ Admin User Warning
                  </div>
                  <div style={{ fontSize: '14px', color: '#595959' }}>
                    This user will have full system access including:
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      <li>All gym management capabilities</li>
                      <li>User creation and deletion</li>
                      <li>System configuration access</li>
                      <li>Financial data and reports</li>
                    </ul>
                  </div>
                </div>
              );
            }
            
            if (role === UserRole.GYM_OWNER) {
              return (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ 
                    fontWeight: '500', 
                    color: '#389e0d', 
                    marginBottom: '8px' 
                  }}>
                    💼 Gym Owner Privileges
                  </div>
                  <div style={{ fontSize: '14px', color: '#595959' }}>
                    This user will be able to:
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      <li>Manage their gym's branches and staff</li>
                      <li>Access financial reports for their gym</li>
                      <li>Configure gym-specific settings</li>
                      <li>Manage client communications</li>
                    </ul>
                  </div>
                </div>
              );
            }
            
            return null;
          }}
        </Form.Item>

        {/* Contact Information */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="notes"
              label="Additional Notes"
              tooltip="Optional notes about this user"
            >
              <Input.TextArea 
                rows={3}
                placeholder="Add any additional notes about this user..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
