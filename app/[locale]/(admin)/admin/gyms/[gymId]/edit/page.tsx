'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
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
  Upload, 
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
  FaDumbbell,
  FaSave,
  FaUpload,
  FaImage
} from 'react-icons/fa';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { UPDATE_GYM, GET_GYM, GET_USERS } from '@/graphql/queries/admin';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PageProps {
  params: Promise<{ gymId: string; locale: string }>;
}

export default function EditGymPage({ params }: PageProps) {
  const { gymId } = use(params);
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams.locale as string;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch gym data
  const { data: gymData, loading: gymLoading, error: gymError } = useQuery(GET_GYM, {
    variables: { id: gymId },
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('Error fetching gym:', err);
      message.error('Failed to load gym details. Please try again.');
    },
  });

  // Fetch gym owners for the owner select
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: { role: 'GYM_OWNER' },
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('Error fetching gym owners:', err);
    },
  });

  const [updateGymMutation] = useMutation(UPDATE_GYM, {
    onError: (err) => {
      console.error('Error updating gym:', err);
      message.error(err.message || 'Failed to update gym. Please try again.');
      setLoading(false);
    },
  });

  // Populate form when gym data loads
  useEffect(() => {
    if (gymData?.gym) {
      const gym = gymData.gym;
      setImageUrl(gym.image || '/images/gym-placeholder.jpg');
      form.setFieldsValue({
        name: gym.name,
        location: gym.location,
        description: gym.description || '',
        ownerId: gym.ownerId,
        featured: gym.featured || false,
        subscriptionStatus: gym.subscriptionStatus?.toLowerCase() || 'active',
        paymentStatus: gym.paymentStatus?.toLowerCase() || 'current',
        image: gym.image || '/images/gym-placeholder.jpg',
      });
    }
  }, [gymData, form]);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const variables: any = {
        id: gymId,
        name: values.name,
        location: values.location,
        image: imageUrl || values.image || '/images/gym-placeholder.jpg',
        description: values.description || '',
        featured: values.featured || false,
        subscriptionStatus: values.subscriptionStatus || 'active',
        paymentStatus: values.paymentStatus || 'current',
      };

      // Include ownerId if provided (allows changing owner)
      if (values.ownerId) {
        variables.ownerId = values.ownerId;
      }

      const result = await updateGymMutation({
        variables,
      });

      if (result.data?.updateGym) {
        message.success('Gym updated successfully!');
        // Redirect to the gym detail page
        router.push(`/${locale}/admin/gyms/${gymId}`);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to update gym');
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageChange = (info: any) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      // In a real app, you would upload to a server and get the URL
      // For now, we'll just use the placeholder or the provided URL
      if (info.file.response?.url) {
        setImageUrl(info.file.response.url);
      } else if (info.file.originFileObj) {
        // Create a preview URL for local files
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageUrl(e.target?.result as string);
        };
        reader.readAsDataURL(info.file.originFileObj);
      }
    }
    setFileList(info.fileList);
  };

  // Get gym owners list
  const gymOwners = usersData?.users || [];
  const gym = gymData?.gym;

  // Loading skeleton
  if (gymLoading) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'gyms', action: 'update' }}>
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
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        </div>
      </AdminProtectedRoute>
    );
  }

  // Error state
  if (gymError || !gym) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'gyms', action: 'update' }}>
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

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'gyms', action: 'update' }}>
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
                  <FaDumbbell />
                </span>
                Edit Gym
              </h1>
            </div>
            <p className="dashboard-page-subtitle">Update gym information and settings</p>
          </div>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              featured: false,
              subscriptionStatus: 'active',
              paymentStatus: 'current',
              image: '/images/gym-placeholder.jpg',
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={16}>
                <Form.Item
                  label="Gym Name"
                  name="name"
                  rules={[
                    { required: true, message: 'Please enter gym name' },
                    { min: 3, message: 'Gym name must be at least 3 characters' },
                  ]}
                >
                  <Input 
                    placeholder="e.g., FITNESS GYM - Downtown" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Location"
                  name="location"
                  rules={[
                    { required: true, message: 'Please enter gym location' },
                  ]}
                >
                  <Input 
                    placeholder="e.g., 123 Main Street, Downtown, City" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Gym Owner"
                  name="ownerId"
                  rules={[
                    { required: true, message: 'Please select a gym owner' },
                  ]}
                >
                  <Select
                    placeholder="Select gym owner"
                    size="large"
                    loading={usersLoading}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {gymOwners.map((owner: any) => (
                      <Option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </Option>
                    ))}
                  </Select>
                  {usersLoading && (
                    <div style={{ marginTop: 8 }}>
                      <Skeleton active paragraph={{ rows: 1 }} />
                    </div>
                  )}
                  {!usersLoading && gymOwners.length === 0 && (
                    <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                      No gym owners found. Please create a gym owner first.
                    </Text>
                  )}
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { max: 1000, message: 'Description must be less than 1000 characters' },
                  ]}
                >
                  <TextArea 
                    rows={6}
                    placeholder="Enter a detailed description of the gym, its facilities, and services..."
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>

                <Form.Item
                  label="Gym Image URL"
                  name="image"
                  extra="Enter a URL or upload an image below"
                >
                  <Input 
                    placeholder="https://example.com/gym-image.jpg"
                    size="large"
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Upload Image"
                  extra="Upload a gym image (optional)"
                >
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleImageChange}
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    {fileList.length < 1 && (
                      <div>
                        <FaUpload style={{ fontSize: '24px', marginBottom: '8px' }} />
                        <div>Upload</div>
                      </div>
                    )}
                  </Upload>
                  {imageUrl && (
                    <div style={{ marginTop: 16 }}>
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="Additional Settings" style={{ marginBottom: 24 }}>
                  <Form.Item
                    label="Featured Gym"
                    name="featured"
                    valuePropName="checked"
                    extra="Featured gyms will be highlighted in listings"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    label="Subscription Status"
                    name="subscriptionStatus"
                    rules={[{ required: true }]}
                  >
                    <Select size="large">
                      <Option value="active">Active</Option>
                      <Option value="suspended">Suspended</Option>
                      <Option value="expired">Expired</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Payment Status"
                    name="paymentStatus"
                    rules={[{ required: true }]}
                  >
                    <Select size="large">
                      <Option value="current">Current</Option>
                      <Option value="overdue">Overdue</Option>
                    </Select>
                  </Form.Item>
                </Card>

                <Card title="Information" style={{ background: '#f5f5f5' }}>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    <div style={{ marginBottom: 8 }}>
                      • Changes will be saved immediately
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      • Owner changes affect gym access
                    </div>
                    <div>
                      • Status changes may affect billing
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
                  Save Changes
                </Button>
                <Button
                  size="large"
                  onClick={() => router.push(`/${locale}/admin/gyms/${gymId}`)}
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


