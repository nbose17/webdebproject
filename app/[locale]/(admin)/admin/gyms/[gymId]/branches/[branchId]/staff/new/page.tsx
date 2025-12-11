'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
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
import { CREATE_USER, GET_BRANCH, GET_GYM } from '@/graphql/queries/admin';

const { Title, Text } = Typography;
const { Option } = Select;

interface PageProps {
  params: Promise<{ gymId: string; branchId: string; locale: string }>;
}

export default function AddStaffPage({ params }: PageProps) {
  const { gymId, branchId } = use(params);
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams.locale as string;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch branch data
  const { data: branchData, loading: branchLoading, error: branchError } = useQuery(GET_BRANCH, {
    variables: { id: branchId, gymId },
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('Error fetching branch:', err);
    },
  });

  // Fetch gym data
  const { data: gymData, loading: gymLoading } = useQuery(GET_GYM, {
    variables: { id: gymId },
    fetchPolicy: 'cache-and-network',
    skip: !gymId,
  });

  const [createUserMutation] = useMutation(CREATE_USER, {
    onError: (err) => {
      console.error('Error creating staff:', err);
      message.error(err.message || 'Failed to create staff member. Please try again.');
      setLoading(false);
    },
  });

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const variables = {
        email: values.email,
        name: values.name,
        password: values.password,
        role: values.role,
        gymId: gymId,
        branchId: branchId,
      };

      const result = await createUserMutation({
        variables,
        refetchQueries: [
          { query: GET_BRANCH, variables: { id: branchId, gymId } },
          { query: GET_GYM, variables: { id: gymId } },
        ],
      });

      if (result.data?.createUser) {
        message.success('Staff member created successfully!');
        // Redirect to branch detail page
        router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}`);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to create staff member');
      setLoading(false);
    }
  };

  // Get branch and gym
  const branch = branchData?.branch;
  const gym = gymData?.gym;

  // Loading skeleton
  if (branchLoading || gymLoading) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'users', action: 'create' }}>
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
  if (branchError || !branch) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'users', action: 'create' }}>
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
              message="Branch Not Found"
              description={branchError?.message || "The requested branch could not be found."}
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

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'users', action: 'create' }}>
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
                Add Staff Member
              </h1>
            </div>
            <p className="dashboard-page-subtitle">
              Add a new staff member to {branch.name} • {gym?.name}
            </p>
          </div>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
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
                      label="Password"
                      name="password"
                      rules={[
                        { required: true, message: 'Please enter password' },
                        { min: 6, message: 'Password must be at least 6 characters' },
                      ]}
                    >
                      <Input.Password 
                        placeholder="Enter password" 
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
              </Col>

              <Col xs={24} lg={8}>
                <Card title="Information" style={{ background: '#f5f5f5' }}>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    <div style={{ marginBottom: 8 }}>
                      • Staff will be assigned to {branch.name}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      • Role determines access permissions
                    </div>
                    <div>
                      • Password can be changed later
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
                  Create Staff Member
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


