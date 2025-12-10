'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Form, Input, Button, Select, Card, Divider, Space, Typography } from 'antd';
import { GoogleOutlined, FacebookFilled, GlobalOutlined } from '@ant-design/icons';
import { FaDumbbell, FaUser, FaLock } from 'react-icons/fa';

const { Title, Text } = Typography;
const { Option } = Select;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;

  const handleLanguageChange = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    router.refresh();
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        router.push(`/${locale}/dashboard`);
      } else {
        setError(result.message || t('login.invalidCredentials'));
      }
    } catch (err: any) {
      setError(err?.message || t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSsoLoading('google');
    setError('');
    try {
      // In a real app, this would redirect to Google OAuth
      // For now, show a message that OAuth is not yet implemented
      setError('Google login is not yet implemented. Please use email and password.');
      setSsoLoading(null);
    } catch (err: any) {
      setError(err?.message || t('login.googleLoginFailed'));
      setSsoLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    setSsoLoading('facebook');
    setError('');
    try {
      // In a real app, this would redirect to Facebook OAuth
      // For now, show a message that OAuth is not yet implemented
      setError('Facebook login is not yet implemented. Please use email and password.');
      setSsoLoading(null);
    } catch (err: any) {
      setError(err?.message || t('login.facebookLoginFailed'));
      setSsoLoading(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
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
        <GlobalOutlined style={{ color: '#4CAF50', fontSize: '16px' }} />
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

      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Login Card */}
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
            border: 'none',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: '40px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
            }}>
              <FaDumbbell style={{ fontSize: '36px', color: 'white' }} />
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#262626', fontWeight: 600 }}>
              {t('login.title')}
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
              Welcome back! Please sign in to continue
            </Text>
          </div>
            
          <Form onFinish={handleSubmit} layout="vertical" size="large">
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 500, color: '#262626' }}>{t('login.email')}</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                prefix={<FaUser style={{ color: '#bfbfbf' }} />}
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  borderRadius: '8px',
                  height: '44px',
                  fontSize: '15px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 500, color: '#262626' }}>{t('login.password')}</span>}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<FaLock style={{ color: '#bfbfbf' }} />}
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  borderRadius: '8px',
                  height: '44px',
                  fontSize: '15px'
                }}
              />
            </Form.Item>

            {error && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: '8px',
                color: '#ff4d4f',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            <Form.Item style={{ marginBottom: '24px', marginTop: '8px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={ssoLoading !== null}
                block
                size="large"
                style={{ 
                  borderRadius: '8px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: '500',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                }}
              >
                {loading ? t('login.loggingIn') : t('login.submit')}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '28px 0', borderColor: '#f0f0f0' }}>
            <Text style={{ color: '#8c8c8c', fontSize: '13px', backgroundColor: '#fff', padding: '0 16px' }}>
              {t('login.or')}
            </Text>
          </Divider>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button
              icon={<GoogleOutlined />}
              onClick={handleGoogleLogin}
              loading={ssoLoading === 'google'}
              disabled={loading || (ssoLoading !== null && ssoLoading !== 'google')}
              block
              size="large"
              style={{
                borderRadius: '8px',
                height: '48px',
                borderColor: '#db4437',
                color: '#db4437',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff5f5';
                e.currentTarget.style.borderColor = '#db4437';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.borderColor = '#db4437';
              }}
            >
              {t('login.continueWithGoogle')}
            </Button>

            <Button
              icon={<FacebookFilled />}
              onClick={handleFacebookLogin}
              loading={ssoLoading === 'facebook'}
              disabled={loading || (ssoLoading !== null && ssoLoading !== 'facebook')}
              block
              size="large"
              style={{
                borderRadius: '8px',
                height: '48px',
                borderColor: '#1877f2',
                color: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f7ff';
                e.currentTarget.style.borderColor = '#1877f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.borderColor = '#1877f2';
              }}
            >
              {t('login.continueWithFacebook')}
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
