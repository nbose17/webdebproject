'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Card, Typography, Alert, Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { FaShieldAlt, FaUser, FaLock } from 'react-icons/fa';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

function AdminLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginAsAdmin } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { t, i18n } = useTranslation(['common']);

  const handleLanguageChange = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    router.refresh();
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      const result = await loginAsAdmin(values.email, values.password);
      if (result.success) {
        // Additional delay to ensure state is fully updated
        await new Promise(resolve => setTimeout(resolve, 300));
        // Use window.location for a hard redirect to ensure fresh state
        window.location.href = `/${locale}/admin`;
      } else {
        setError(result.message || 'Invalid admin credentials. Please check your email and password.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Language Selector - Top Right */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}>
        <GlobalOutlined style={{ color: '#667eea', fontSize: '16px' }} />
        <Select
          value={locale}
          onChange={handleLanguageChange}
          style={{ width: 100 }}
          size="small"
          variant="borderless"
          suffixIcon={null}
        >
          <Option value="en">{t('login.english')}</Option>
          <Option value="ru">{t('login.russian')}</Option>
        </Select>
      </div>

      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#1890ff',
            marginBottom: '16px'
          }}>
            <FaShieldAlt style={{ fontSize: '32px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: '0 0 8px 0', color: '#262626' }}>
            Admin Login
          </Title>
          <Text style={{ color: '#8c8c8c' }}>
            FitConnect Admin Portal
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            style={{ marginBottom: '24px' }}
          />
        )}

        <Form
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Admin Email"
            rules={[
              { required: true, message: 'Please enter your admin email' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input
              prefix={<FaUser style={{ color: '#bfbfbf' }} />}
              placeholder="admin@fitconnect.com"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<FaLock style={{ color: '#bfbfbf' }} />}
              placeholder="Enter your password"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '44px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                marginTop: '8px'
              }}
            >
              Sign In as Admin
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button
            type="link"
            onClick={() => router.push(`/${locale}/login`)}
            style={{ padding: 0 }}
          >
            Back to Regular Login
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <AdminLoginForm />
    </AdminAuthProvider>
  );
}
