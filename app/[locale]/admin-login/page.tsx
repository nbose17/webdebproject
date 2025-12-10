'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { FaShieldAlt, FaUser, FaLock } from 'react-icons/fa';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

const { Title, Text } = Typography;

function AdminLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginAsAdmin } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      const success = await loginAsAdmin(values.email, values.password);
      if (success) {
        // Wait a moment to ensure localStorage is saved and state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push(`/${locale}/admin`);
        router.refresh();
      } else {
        setError('Invalid admin credentials. Please check your email and password.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
      padding: '20px'
    }}>
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

        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Test Credentials:
          </Text>
          <Text style={{ color: '#595959', display: 'block' }}>
            Email: <code>admin@fitconnect.com</code>
          </Text>
          <Text style={{ color: '#595959', display: 'block' }}>
            Password: <code>any password</code>
          </Text>
        </div>

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