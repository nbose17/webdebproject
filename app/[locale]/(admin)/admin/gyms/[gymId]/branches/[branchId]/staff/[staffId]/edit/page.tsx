'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Switch,
  message,
  Row,
  Col,
  Typography,
  Space,
  Skeleton,
  Alert
} from 'antd';
import {
  FaArrowLeft,
  FaUser,
  FaSave
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { Branch, Gym, User } from '@/lib/types';
import { UPDATE_USER, GET_USER, GET_BRANCH, GET_GYM } from '@/graphql/queries/admin';

const { Title, Text } = Typography;
const { Option } = Select;

interface PageProps {
  params: Promise<{ gymId: string; branchId: string; staffId: string; locale: string }>;
}

export default function EditStaffPage({ params }: PageProps) {
  const { gymId, branchId, staffId } = use(params);
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams.locale as string;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);

  // Fetch staff/user data
  const { data: userData, loading: userLoading, error: userError } = useQuery<{ user: User }>(GET_USER, {
    variables: { id: staffId },
    fetchPolicy: 'cache-and-network',
  });

  // Fetch branch data
  const { data: branchData, loading: branchLoading } = useQuery<{ branch: Branch }>(GET_BRANCH, {
    variables: { id: branchId, gymId },
    fetchPolicy: 'cache-and-network',
    skip: !branchId || !gymId,
  });

  // Fetch gym data
  const { data: gymData, loading: gymLoading } = useQuery<{ gym: Gym }>(GET_GYM, {
    variables: { id: gymId },
    fetchPolicy: 'cache-and-network',
    skip: !gymId,
  });

  const [updateUserMutation] = useMutation<{ updateUser: User }>(UPDATE_USER);

  // Pre-populate form when user data is loaded
  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [userData, form]);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const variables: any = {
        id: staffId,
        name: values.name,
        email: values.email,
        role: values.role,
        isActive: values.isActive,
        gymId: gymId,
        branchId: branchId,
      };

      // Only include password if it was provided
      if (values.password && values.password.trim() !== '') {
        variables.password = values.password;
      }

      const result = await updateUserMutation({
        variables,
        refetchQueries: [
          { query: GET_USER, variables: { id: staffId } },
          { query: GET_BRANCH, variables: { id: branchId, gymId } },
          { query: GET_GYM, variables: { id: gymId } },
        ],
      });

      if (result.data?.updateUser) {
        message.success('Staff member updated successfully!');
        // Redirect to branch detail page
        router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}`);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to update staff member');
      setLoading(false);
    }
  };

  // Get user, branch and gym
  const user = userData?.user;
  const branch = branchData?.branch;
  const gym = gymData?.gym;

  // Loading skeleton
  if (userLoading || branchLoading || gymLoading) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'users', action: 'update' }}>
        <div>
          <div className="dashboard-page-header">
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Skeleton.Button active size="default" style={{ width: 80 }} />
                <Skeleton.Button active size="large" style={{ width: 250, height: 32 }} />
              </div>
              <Skeleton.Input active size="small" style={{ width: 200 }} />
            </div>
          </div>

          <Card>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </div>
      </AdminProtectedRoute>
    );
  }

  // Error state
  if (userError || !user) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'users', action: 'update' }}>
        <div>
          <div className="dashboard-page-header">
            <div style={{ flex: 1 }}>
              <Button
                icon={<FaArrowLeft />}
                onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}`)}
              >
                Back
              </Button>
            </div>
          </div>
          <Card>
            <Alert
              message="Staff Member Not Found"
              description={userError?.message || "The requested staff member could not be found."}
              type="error"
              showIcon
              action={
                <Button onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}`)}>
                  Back to Branch
                </Button>
              }
            />
          </Card>
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'users', action: 'update' }}>
      <div>
        <div className="dashboard-page-header">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Button
                icon={<FaArrowLeft />}
                onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}`)}
              >
                Back
              </Button>
              <h1 className="dashboard-page-title" style={{ margin: 0 }}>
                <span className="dashboard-page-title-icon">
                  <FaUser />
                </span>
                Edit Staff Member
              </h1>
            </div>
            <p className="dashboard-page-subtitle">
              Update staff member information for {branch?.name} • {gym?.name}
            </p>
          </div>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isActive: user.isActive,
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={16}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Full Name"
                      name="name"
                      rules={[
                        { required: true, message: 'Please enter staff name' },
                        { min: 2, message: 'Name must be at least 2 characters' },
                      ]}
                    >
                      <Input
                        placeholder="John Doe"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter email address' },
                        { type: 'email', message: 'Please enter a valid email address' },
                      ]}
                    >
                      <Input
                        placeholder="john@example.com"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="New Password (Optional)"
                      name="password"
                      extra="Leave blank to keep current password"
                    >
                      <Input.Password
                        placeholder="Enter new password"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Role"
                      name="role"
                      rules={[{ required: true, message: 'Please select a role' }]}
                    >
                      <Select
                        placeholder="Select role"
                        size="large"
                      >
                        <Option value="GYM_TRAINER">GYM_TRAINER</Option>
                        <Option value="GYM_RECEPTIONIST">GYM_RECEPTIONIST</Option>
                        <Option value="GYM_MANAGER">GYM_MANAGER</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Status"
                  name="isActive"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="Information" style={{ background: '#f5f5f5' }}>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    <div style={{ marginBottom: 8 }}>
                      • Staff is assigned to {branch?.name}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      • Role determines access permissions
                    </div>
                    <div>
                      • Only provide password if changing it
                    </div>
                  </Text>
                </Card>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
              <Space size="large">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<FaSave />}
                  loading={loading}
                >
                  Update Staff Member
                </Button>
                <Button
                  size="large"
                  onClick={() => router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AdminProtectedRoute>
  );
}


