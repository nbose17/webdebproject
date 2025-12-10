'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Tabs, 
  Upload, 
  Space,
  Divider,
  message,
  Skeleton,
  Alert
} from 'antd';
import { 
  FaPalette, 
  FaImage, 
  FaEdit, 
  FaUpload,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaHeadset
} from 'react-icons/fa';
import { Image as AntImage } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { GET_CMS, UPDATE_CMS } from '@/graphql/queries/admin';
import { apolloClient } from '@/lib/apollo-client';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CMSData {
  // Hero Section
  heroSubHeading: string;
  heroMainHeading: string;
  heroDescription: string;
  heroBackgroundImage: string;
  heroButton1Text: string;
  heroButton2Text: string;
  
  // Feature Section
  featureHeading: string;
  featureSubHeading: string;
  featureBannerContent: string;
  
  // Section Headings
  classesHeading: string;
  classesSubHeading: string;
  plansHeading: string;
  plansSubHeading: string;
  trainersHeading: string;
  trainersSubHeading: string;
  
  // Newsletter Section
  newsletterHeading: string;
  newsletterSubHeading: string;
  newsletterButtonText: string;
  
  // Branding & Contact
  gymLogo: string;
  address: string;
  email: string;
  phone: string;
  businessHours: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}

export default function CMSPage() {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const gymId = user?.gymId;
  
  const { data, loading: queryLoading, error: queryError, refetch } = useQuery(GET_CMS, {
    variables: { gymId },
    skip: !gymId,
    fetchPolicy: 'network-only',
  });
  
  const [updateCMS, { loading: mutationLoading }] = useMutation(UPDATE_CMS, {
    onCompleted: () => {
      message.success('CMS content saved successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to save CMS content: ${error.message}`);
    },
  });
  
  const loading = queryLoading || mutationLoading;
  
  useEffect(() => {
    if (data?.cms) {
      form.setFieldsValue(data.cms);
    }
  }, [data, form]);
  
  if (!gymId) {
    return (
      <div>
        <Alert
          message="No Gym Associated"
          description="You need to be associated with a gym to manage CMS content."
          type="warning"
          showIcon
        />
      </div>
    );
  }
  
  if (queryError) {
    return (
      <div>
        <Alert
          message="Error Loading CMS"
          description={queryError.message}
          type="error"
          showIcon
        />
      </div>
    );
  }
  
  // Default values while loading
  const initialValues: CMSData = {
    heroSubHeading: 'STAY HEALTHY, STAY FIT',
    heroMainHeading: 'GET IN SHAPE NOW',
    heroDescription: 'Train in the fitness gym and explore all benefits',
    heroBackgroundImage: '/images/gym-placeholder.jpg',
    heroButton1Text: 'See All Classes',
    heroButton2Text: 'View Plans',
    featureHeading: 'Feature Heading',
    featureSubHeading: 'Feature Content Feature Content Feature Content',
    featureBannerContent: 'Feature Banner Content',
    classesHeading: 'Class List Heading',
    classesSubHeading: 'Class List Sub Heading',
    plansHeading: 'Plan List Heading',
    plansSubHeading: 'Plan List Sub Heading',
    trainersHeading: 'Trainer List Heading',
    trainersSubHeading: 'Trainer List Sub Heading',
    newsletterHeading: 'GET CONNECTED WITH US',
    newsletterSubHeading: 'Join our community for motivation',
    newsletterButtonText: 'Join Now',
    gymLogo: '/images/logo.png',
    address: '123 Fitness Street, Uralskaya, EKB 620000',
    email: 'info@fitnessgym.com',
    phone: '+7 (343) 123-4567',
    businessHours: 'Monday - Saturday\n6:00 AM - 10:00 PM',
    facebookUrl: 'https://facebook.com/fitnessgym',
    twitterUrl: 'https://twitter.com/fitnessgym',
    instagramUrl: 'https://instagram.com/fitnessgym',
  };

  const handleSubmit = async (values: CMSData) => {
    if (!gymId) return;
    
    await updateCMS({
      variables: {
        gymId,
        ...values,
      },
    });
  };

  const handleImageUpload = (file: File) => {
    // In real app, upload to server and get URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPreviewImage(imageUrl);
      form.setFieldValue('heroBackgroundImage', imageUrl);
    };
    reader.readAsDataURL(file);
    return false; // Prevent auto upload
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      form.setFieldValue('gymLogo', imageUrl);
    };
    reader.readAsDataURL(file);
    return false;
  };

  if (queryLoading) {
    return (
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaPalette />
              </span>
              CMS / Branding
            </h1>
            <p className="dashboard-page-subtitle">
              Customize your gym's public page content and branding
            </p>
          </div>
        </div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }
  
  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaPalette />
            </span>
            CMS / Branding
          </h1>
          <p className="dashboard-page-subtitle">
            Customize your gym's public page content and branding
          </p>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        style={{ marginTop: '24px' }}
      >
        <Tabs
          defaultActiveKey="hero"
          items={[
            {
              key: 'hero',
              label: 'Hero Section',
              children: (
                <Card title="Hero Section" style={{ marginBottom: '24px' }}>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} lg={12}>
                      <Form.Item
                        label="Sub Heading"
                        name="heroSubHeading"
                        rules={[{ required: true, message: 'Please enter sub heading' }]}
                      >
                        <Input placeholder="e.g., STAY HEALTHY, STAY FIT" size="large" />
                      </Form.Item>

                      <Form.Item
                        label="Main Heading"
                        name="heroMainHeading"
                        rules={[{ required: true, message: 'Please enter main heading' }]}
                      >
                        <Input placeholder="e.g., GET IN SHAPE NOW" size="large" />
                      </Form.Item>

                      <Form.Item
                        label="Description"
                        name="heroDescription"
                        rules={[{ required: true, message: 'Please enter description' }]}
                      >
                        <TextArea 
                          rows={3} 
                          placeholder="Brief description for the hero section"
                          size="large"
                        />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label="Button 1 Text"
                            name="heroButton1Text"
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="See All Classes" size="large" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Button 2 Text"
                            name="heroButton2Text"
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="View Plans" size="large" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={24} lg={12}>
                      <Form.Item
                        label="Background Image"
                        name="heroBackgroundImage"
                        extra="Recommended size: 1920x1080px"
                      >
                        <div>
                          <Upload
                            beforeUpload={handleImageUpload}
                            showUploadList={false}
                            accept="image/*"
                          >
                            <Button icon={<FaUpload />} block size="large">
                              Upload Background Image
                            </Button>
                          </Upload>
                          {form.getFieldValue('heroBackgroundImage') && (
                            <div style={{ marginTop: '16px' }}>
                              <AntImage
                                src={form.getFieldValue('heroBackgroundImage')}
                                alt="Hero background"
                                style={{ width: '100%', borderRadius: '8px' }}
                                fallback="/images/gym-placeholder.jpg"
                              />
                            </div>
                          )}
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ),
            },
            {
              key: 'sections',
              label: 'Page Sections',
              children: (
                <div>
                  {/* Feature Section */}
                  <Card title="Feature Section" style={{ marginBottom: '24px' }}>
                    <Form.Item
                      label="Heading"
                      name="featureHeading"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Feature Section Heading" size="large" />
                    </Form.Item>

                    <Form.Item
                      label="Sub Heading"
                      name="featureSubHeading"
                      rules={[{ required: true }]}
                    >
                      <TextArea 
                        rows={2} 
                        placeholder="Feature section description"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Banner Content"
                      name="featureBannerContent"
                      rules={[{ required: true }]}
                    >
                      <TextArea 
                        rows={3} 
                        placeholder="Banner content text"
                        size="large"
                      />
                    </Form.Item>
                  </Card>

                  {/* Classes Section */}
                  <Card title="Classes Section" style={{ marginBottom: '24px' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Heading"
                          name="classesHeading"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Class List Heading" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Sub Heading"
                          name="classesSubHeading"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Class List Sub Heading" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* Plans Section */}
                  <Card title="Plans Section" style={{ marginBottom: '24px' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Heading"
                          name="plansHeading"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Plan List Heading" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Sub Heading"
                          name="plansSubHeading"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Plan List Sub Heading" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* Trainers Section */}
                  <Card title="Trainers Section" style={{ marginBottom: '24px' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Heading"
                          name="trainersHeading"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Trainer List Heading" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Sub Heading"
                          name="trainersSubHeading"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Trainer List Sub Heading" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* Newsletter Section */}
                  <Card title="Newsletter Section" style={{ marginBottom: '24px' }}>
                    <Form.Item
                      label="Heading"
                      name="newsletterHeading"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Newsletter Heading" size="large" />
                    </Form.Item>

                    <Form.Item
                      label="Sub Heading"
                      name="newsletterSubHeading"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Newsletter sub heading" size="large" />
                    </Form.Item>

                    <Form.Item
                      label="Button Text"
                      name="newsletterButtonText"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Join Now" size="large" />
                    </Form.Item>
                  </Card>
                </div>
              ),
            },
            {
              key: 'branding',
              label: 'Branding & Contact',
              children: (
                <div>
                  {/* Gym Logo */}
                  <Card title="Gym Logo" style={{ marginBottom: '24px' }}>
                    <Form.Item
                      label="Gym Logo"
                      name="gymLogo"
                      extra="This logo will appear in the header and footer"
                    >
                      <div>
                        <Upload
                          beforeUpload={handleLogoUpload}
                          showUploadList={false}
                          accept="image/*"
                        >
                          <Button icon={<FaUpload />} size="large">
                            Upload Gym Logo
                          </Button>
                        </Upload>
                        {form.getFieldValue('gymLogo') && (
                          <div style={{ marginTop: '16px' }}>
                            <AntImage
                              src={form.getFieldValue('gymLogo')}
                              alt="Gym logo"
                              width={200}
                              style={{ borderRadius: '8px' }}
                              fallback="/images/logo.png"
                            />
                          </div>
                        )}
                      </div>
                    </Form.Item>
                  </Card>

                  {/* Contact Information */}
                  <Card title="Contact Information" style={{ marginBottom: '24px' }}>
                    <Form.Item
                      label={
                        <span>
                          <FaMapMarkerAlt style={{ marginRight: '8px', color: '#4CAF50' }} />
                          Address
                        </span>
                      }
                      name="address"
                      rules={[{ required: true, message: 'Please enter address' }]}
                    >
                      <TextArea 
                        rows={2} 
                        placeholder="Full gym address"
                        size="large"
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span>
                              <FaPhone style={{ marginRight: '8px', color: '#4CAF50' }} />
                              Phone
                            </span>
                          }
                          name="phone"
                          rules={[{ required: true, message: 'Please enter phone number' }]}
                        >
                          <Input placeholder="+7 (343) 123-4567" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span>
                              <FaEnvelope style={{ marginRight: '8px', color: '#4CAF50' }} />
                              Email
                            </span>
                          }
                          name="email"
                          rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' }
                          ]}
                        >
                          <Input placeholder="info@fitnessgym.com" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label={
                        <span>
                          <FaClock style={{ marginRight: '8px', color: '#4CAF50' }} />
                          Business Hours
                        </span>
                      }
                      name="businessHours"
                      rules={[{ required: true, message: 'Please enter business hours' }]}
                    >
                      <TextArea 
                        rows={3} 
                        placeholder="Monday - Saturday&#10;6:00 AM - 10:00 PM"
                        size="large"
                      />
                    </Form.Item>
                  </Card>

                  {/* Social Media */}
                  <Card title="Social Media Links">
                    <Form.Item
                      label={
                        <span>
                          <FaFacebook style={{ marginRight: '8px', color: '#1877f2' }} />
                          Facebook URL
                        </span>
                      }
                      name="facebookUrl"
                      rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                      <Input placeholder="https://facebook.com/yourpage" size="large" />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span>
                          <FaTwitter style={{ marginRight: '8px', color: '#1DA1F2' }} />
                          Twitter/X URL
                        </span>
                      }
                      name="twitterUrl"
                      rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                      <Input placeholder="https://twitter.com/yourpage" size="large" />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span>
                          <FaInstagram style={{ marginRight: '8px', color: '#E4405F' }} />
                          Instagram URL
                        </span>
                      }
                      name="instagramUrl"
                      rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                      <Input placeholder="https://instagram.com/yourpage" size="large" />
                    </Form.Item>
                  </Card>
                </div>
              ),
            },
          ]}
        />

        <div style={{ 
          marginTop: '32px', 
          padding: '24px', 
          background: '#fff', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text type="secondary">
            Changes will be reflected on your public gym page immediately after saving
          </Text>
          <Space>
            <Button size="large" onClick={() => form.resetFields()}>
              Reset
            </Button>
            <Button 
              type="primary" 
              size="large" 
              htmlType="submit"
              loading={loading}
              icon={<FaEdit />}
            >
              Save All Changes
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
}


