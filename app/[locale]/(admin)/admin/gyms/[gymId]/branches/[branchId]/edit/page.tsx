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
  FaBuilding,
  FaSave,
  FaUser
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { UPDATE_BRANCH, GET_BRANCH, GET_GYM, GET_USERS } from '@/graphql/queries/admin';

const { Title, Text } = Typography;
const { Option } = Select;

interface PageProps {
  params: Promise<{ gymId: string; branchId: string; locale: string }>;
}

export default function EditBranchPage({ params }: PageProps) {
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

  // Fetch gym data to display gym name
  const { data: gymData, loading: gymLoading } = useQuery(GET_GYM, {
    variables: { id: gymId },
    fetchPolicy: 'cache-and-network',
    skip: !gymId,
  });

  // Fetch gym managers for manager select
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: { 
      role: 'GYM_MANAGER',
      gymId: gymId,
      isActive: true 
    },
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('Error fetching managers:', err);
    },
  });

  const [updateBranchMutation] = useMutation(UPDATE_BRANCH, {
    onError: (err) => {
      console.error('Error updating branch:', err);
      message.error(err.message || 'Failed to update branch. Please try again.');
      setLoading(false);
    },
  });

  // Pre-populate form when branch data is loaded
  useEffect(() => {
    if (branchData?.branch) {
      const branch = branchData.branch;
      form.setFieldsValue({
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        managerId: branch.managerId || undefined,
        status: branch.status || 'active',
      });
    }
  }, [branchData, form]);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const variables = {
        id: branchId,
        gymId: gymId,
        name: values.name,
        address: values.address,
        phone: values.phone,
        email: values.email,
        managerId: values.managerId || null,
        status: values.status || 'active',
      };

      const result = await updateBranchMutation({
        variables,
        refetchQueries: [
          { query: GET_BRANCH, variables: { id: branchId, gymId } },
          { query: GET_GYM, variables: { id: gymId } },
        ],
      });

      if (result.data?.updateBranch) {
        message.success('Branch updated successfully!');
        // Redirect to branch detail page
        router.push(`/${locale}/admin/gyms/${gymId}/branches/${branchId}`);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to update branch');
      setLoading(false);
    }
  };

  // Get branch, gym and managers
  const branch = branchData?.branch;
  const gym = gymData?.gym;
  const managers = usersData?.users || [];

  // Loading skeleton
  if (branchLoading || gymLoading) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'update' }}>
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
      <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'update' }}>
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
    <AdminProtectedRoute requiredPermission={{ resource: 'branches', action: 'update' }}>
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
                  <FaBuilding />
                </span>
                Edit Branch
              </h1>
            </div>
            <p className="dashboard-page-subtitle">
              Update branch information for {branch.name} • {gym?.name}
            </p>
          </div>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: branch.status || 'active',
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={16}>
                <Form.Item
                  label="Branch Name"
                  name="name"
                  rules={[
                    { required: true, message: 'Please enter branch name' },
                    { min: 3, message: 'Branch name must be at least 3 characters' },
                  ]}
                >
                  <Input 
                    placeholder="e.g., Downtown Main Branch" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Address"
                  name="address"
                  rules={[
                    { required: true, message: 'Please enter branch address' },
                  ]}
                >
                  <Input.TextArea 
                    rows={3}
                    placeholder="Full branch address including street, city, state, zip"
                    size="large"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Phone"
                      name="phone"
                      rules={[
                        { required: true, message: 'Please enter phone number' },
                      ]}
                    >
                      <Input 
                        placeholder="+1 (555) 123-4567" 
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
                        placeholder="branch@gym.com" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Branch Manager"
                  name="managerId"
                  extra="Optional: Assign a manager to this branch"
                >
                  <Select
                    placeholder="Select branch manager (optional)"
                    size="large"
                    loading={usersLoading}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {managers.map((manager: any) => (
                      <Option key={manager.id} value={manager.id}>
                        {manager.name} ({manager.email})
                      </Option>
                    ))}
                  </Select>
                  {usersLoading && (
                    <div style={{ marginTop: 8 }}>
                      <Skeleton active paragraph={{ rows: 1 }} />
                    </div>
                  )}
                  {!usersLoading && managers.length === 0 && (
                    <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                      No managers found. Managers can be assigned later.
                    </Text>
                  )}
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="Additional Settings" style={{ marginBottom: 24 }}>
                  <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true }]}
                  >
                    <Select size="large">
                      <Option value="active">Active</Option>
                      <Option value="inactive">Inactive</Option>
                    </Select>
                  </Form.Item>
                </Card>

                <Card title="Information" style={{ background: '#f5f5f5' }}>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    <div style={{ marginBottom: 8 }}>
                      • Changes will update the branch in the gym database
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      • Manager can be changed or removed
                    </div>
                    <div>
                      • Staff and clients remain assigned
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
                  Update Branch
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


