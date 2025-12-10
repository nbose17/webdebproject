'use client';

import { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  Select, 
  Button, 
  Typography, 
  Row, 
  Col,
  Divider,
  Upload,
  ColorPicker,
  message,
  Alert,
  Space,
  Tag
} from 'antd';
import { 
  FaCog, 
  FaGlobe, 
  FaEnvelope, 
  FaShieldAlt, 
  FaPalette,
  FaUpload,
  FaSave,
  FaRedo,
  FaDatabase,
  FaBell
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface GlobalSettings {
  // General Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  supportEmail: string;
  defaultLanguage: string;
  timezone: string;
  
  // Security Settings
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  twoFactorRequired: boolean;
  
  // Email Settings
  emailProvider: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  emailFrom: string;
  
  // Notification Settings
  notifications: {
    newGymRegistration: boolean;
    paymentFailures: boolean;
    subscriptionExpiry: boolean;
    systemAlerts: boolean;
  };
  
  // Business Settings
  currency: string;
  taxRate: number;
  defaultSubscriptionDuration: number;
  gracePeriodDays: number;
  
  // Branding
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  
  // System Settings
  maintenanceMode: boolean;
  debugMode: boolean;
  apiRateLimit: number;
  maxFileUploadSize: number;
}

const mockSettings: GlobalSettings = {
  siteName: 'FitConnect Admin Portal',
  siteDescription: 'Comprehensive gym management platform',
  siteUrl: 'https://admin.fitconnect.com',
  adminEmail: 'admin@fitconnect.com',
  supportEmail: 'support@fitconnect.com',
  defaultLanguage: 'en',
  timezone: 'UTC',
  
  sessionTimeout: 120,
  maxLoginAttempts: 5,
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  twoFactorRequired: false,
  
  emailProvider: 'smtp',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  emailFrom: 'noreply@fitconnect.com',
  
  notifications: {
    newGymRegistration: true,
    paymentFailures: true,
    subscriptionExpiry: true,
    systemAlerts: true
  },
  
  currency: 'USD',
  taxRate: 8.5,
  defaultSubscriptionDuration: 12,
  gracePeriodDays: 7,
  
  logo: '/images/fitconnect-logo.png',
  favicon: '/images/favicon.ico',
  primaryColor: '#4CAF50',
  secondaryColor: '#52c41a',
  
  maintenanceMode: false,
  debugMode: false,
  apiRateLimit: 1000,
  maxFileUploadSize: 10
};

export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings>(mockSettings);
  const [form] = Form.useForm();
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Settings saved successfully');
      setHasChanges(false);
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(mockSettings);
    setSettings(mockSettings);
    setHasChanges(false);
    message.info('Settings reset to defaults');
  };

  const handleValuesChange = () => {
    setHasChanges(true);
  };

  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <FaGlobe /> General
        </span>
      ),
      children: (
        <div>
          <Title level={4}>General Configuration</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="siteName"
                label="Site Name"
                rules={[{ required: true, message: 'Please enter site name' }]}
              >
                <Input placeholder="FitConnect Admin Portal" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="siteUrl"
                label="Site URL"
                rules={[{ required: true, type: 'url', message: 'Please enter valid URL' }]}
              >
                <Input placeholder="https://admin.fitconnect.com" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="siteDescription"
            label="Site Description"
          >
            <TextArea 
              rows={3} 
              placeholder="Brief description of the platform"
            />
          </Form.Item>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="adminEmail"
                label="Admin Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input placeholder="admin@fitconnect.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="supportEmail"
                label="Support Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input placeholder="support@fitconnect.com" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="defaultLanguage"
                label="Default Language"
              >
                <Select>
                  <Option value="en">English</Option>
                  <Option value="ru">Russian</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="timezone"
                label="Timezone"
              >
                <Select showSearch>
                  <Option value="UTC">UTC</Option>
                  <Option value="America/New_York">Eastern Time</Option>
                  <Option value="America/Chicago">Central Time</Option>
                  <Option value="America/Denver">Mountain Time</Option>
                  <Option value="America/Los_Angeles">Pacific Time</Option>
                  <Option value="Europe/London">London</Option>
                  <Option value="Europe/Moscow">Moscow</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <FaShieldAlt /> Security
        </span>
      ),
      children: (
        <div>
          <Title level={4}>Security Configuration</Title>
          
          <Alert
            message="Security Settings"
            description="These settings affect the security of the entire platform. Changes should be made carefully."
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
          />
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="sessionTimeout"
                label="Session Timeout (minutes)"
                tooltip="How long users can stay logged in without activity"
              >
                <InputNumber min={15} max={480} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxLoginAttempts"
                label="Max Login Attempts"
                tooltip="Number of failed attempts before account lockout"
              >
                <InputNumber min={3} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider>Password Policy</Divider>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name={['passwordPolicy', 'minLength']}
                label="Minimum Length"
              >
                <InputNumber min={6} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['passwordPolicy', 'requireUppercase']}
                valuePropName="checked"
                label="Require Uppercase"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name={['passwordPolicy', 'requireNumbers']}
                valuePropName="checked"
                label="Require Numbers"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['passwordPolicy', 'requireSpecialChars']}
                valuePropName="checked"
                label="Require Special Characters"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="twoFactorRequired"
            valuePropName="checked"
            label="Require Two-Factor Authentication"
          >
            <Switch />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'email',
      label: (
        <span>
          <FaEnvelope /> Email
        </span>
      ),
      children: (
        <div>
          <Title level={4}>Email Configuration</Title>
          
          <Form.Item
            name="emailProvider"
            label="Email Provider"
          >
            <Select>
              <Option value="smtp">SMTP</Option>
              <Option value="sendgrid">SendGrid</Option>
              <Option value="mailgun">Mailgun</Option>
              <Option value="ses">Amazon SES</Option>
            </Select>
          </Form.Item>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="smtpHost"
                label="SMTP Host"
              >
                <Input placeholder="smtp.gmail.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="smtpPort"
                label="SMTP Port"
              >
                <InputNumber min={1} max={65535} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="smtpUser"
                label="SMTP Username"
              >
                <Input placeholder="your-email@gmail.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="smtpPassword"
                label="SMTP Password"
              >
                <Input.Password placeholder="Your app password" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="emailFrom"
            label="From Email Address"
            rules={[{ type: 'email' }]}
          >
            <Input placeholder="noreply@fitconnect.com" />
          </Form.Item>
          
          <Button type="primary" style={{ marginTop: '16px' }}>
            Test Email Configuration
          </Button>
        </div>
      ),
    },
    {
      key: 'notifications',
      label: (
        <span>
          <FaBell /> Notifications
        </span>
      ),
      children: (
        <div>
          <Title level={4}>Notification Settings</Title>
          
          <Paragraph>
            Configure which events should trigger notifications to administrators.
          </Paragraph>
          
          <Form.Item
            name={['notifications', 'newGymRegistration']}
            valuePropName="checked"
            label="New Gym Registration"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name={['notifications', 'paymentFailures']}
            valuePropName="checked"
            label="Payment Failures"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name={['notifications', 'subscriptionExpiry']}
            valuePropName="checked"
            label="Subscription Expiry Warnings"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name={['notifications', 'systemAlerts']}
            valuePropName="checked"
            label="System Alerts"
          >
            <Switch />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'business',
      label: (
        <span>
          <FaDatabase /> Business
        </span>
      ),
      children: (
        <div>
          <Title level={4}>Business Configuration</Title>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Default Currency"
              >
                <Select>
                  <Option value="USD">USD - US Dollar</Option>
                  <Option value="EUR">EUR - Euro</Option>
                  <Option value="GBP">GBP - British Pound</Option>
                  <Option value="RUB">RUB - Russian Ruble</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="taxRate"
                label="Tax Rate (%)"
              >
                <InputNumber 
                  min={0} 
                  max={50} 
                  step={0.1} 
                  precision={2}
                  style={{ width: '100%' }} 
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="defaultSubscriptionDuration"
                label="Default Subscription (months)"
              >
                <InputNumber min={1} max={60} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gracePeriodDays"
                label="Grace Period (days)"
                tooltip="Days after subscription expires before suspension"
              >
                <InputNumber min={0} max={30} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'branding',
      label: (
        <span>
          <FaPalette /> Branding
        </span>
      ),
      children: (
        <div>
          <Title level={4}>Branding Configuration</Title>
          
          <Form.Item
            name="logo"
            label="Company Logo"
          >
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
            >
              <Button icon={<FaUpload />}>Upload Logo</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="favicon"
            label="Favicon"
          >
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
            >
              <Button icon={<FaUpload />}>Upload Favicon</Button>
            </Upload>
          </Form.Item>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="primaryColor"
                label="Primary Color"
              >
                <ColorPicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="secondaryColor"
                label="Secondary Color"
              >
                <ColorPicker />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'system',
      label: (
        <span>
          <FaCog /> System
        </span>
      ),
      children: (
        <div>
          <Title level={4}>System Configuration</Title>
          
          <Alert
            message="System Settings"
            description="These settings affect system performance and behavior. Use with caution."
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
          
          <Form.Item
            name="maintenanceMode"
            valuePropName="checked"
            label="Maintenance Mode"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name="debugMode"
            valuePropName="checked"
            label="Debug Mode"
            tooltip="Enable detailed logging and error reporting"
          >
            <Switch />
          </Form.Item>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="apiRateLimit"
                label="API Rate Limit (requests/hour)"
              >
                <InputNumber min={100} max={10000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxFileUploadSize"
                label="Max File Upload Size (MB)"
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'settings', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div style={{ flex: 1 }}>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaCog />
              </span>
              Global Settings
            </h1>
            <p className="dashboard-page-subtitle">Configure system-wide settings and preferences</p>
          </div>
          <div>
            
            <Space>
              {hasChanges && (
                <Tag color="orange">Unsaved Changes</Tag>
              )}
              <Button 
                icon={<FaRedo />}
                onClick={handleReset}
                disabled={!hasChanges}
              >
                Reset
              </Button>
              <Button 
                type="primary" 
                icon={<FaSave />}
                loading={loading}
                onClick={handleSave}
                disabled={!hasChanges}
              >
                Save Settings
              </Button>
            </Space>
          </div>
        </div>

        {/* Settings Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            initialValues={settings}
            onValuesChange={handleValuesChange}
          >
            <Tabs 
              defaultActiveKey="general"
              items={tabItems}
              size="large"
              style={{ minHeight: '600px' }}
            />
          </Form>
        </Card>
      </div>
    </AdminProtectedRoute>
  );
}