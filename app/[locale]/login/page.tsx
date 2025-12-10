'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Form, Input, Button, Select, Card, Divider, Space, Typography } from 'antd';
import { GoogleOutlined, FacebookFilled, GlobalOutlined } from '@ant-design/icons';

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
      const success = await login(values.email, values.password);
      if (success) {
        router.push(`/${locale}/dashboard`);
      } else {
        setError(t('login.invalidCredentials'));
      }
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSsoLoading('google');
    setError('');
    try {
      // In a real app, this would redirect to Google OAuth
      // For now, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = await login('google@example.com', 'google');
      if (success) {
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      setError(t('login.googleLoginFailed'));
    } finally {
      setSsoLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    setSsoLoading('facebook');
    setError('');
    try {
      // In a real app, this would redirect to Facebook OAuth
      // For now, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = await login('facebook@example.com', 'facebook');
      if (success) {
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      setError(t('login.facebookLoginFailed'));
    } finally {
      setSsoLoading(null);
    }
  };

  return (
    <div className="public-page">
      <Header />
      <main className="public-main">
        <div className="container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
          {/* Language Selector - Outside the card */}
          <div className="language-selector-container">
            <GlobalOutlined />
            <Select
              value={locale}
              onChange={handleLanguageChange}
              style={{ width: 120 }}
              size="small"
              variant="borderless"
              suffixIcon={null}
            >
              <Option value="en">{t('login.english')}</Option>
              <Option value="ru">{t('login.russian')}</Option>
            </Select>
          </div>

          {/* Login Card */}
          <Card className="login-card">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={2} style={{ marginBottom: '8px', color: '#1f1f1f' }}>
                {t('login.title')}
              </Title>
            </div>
            
            <Form onFinish={handleSubmit} layout="vertical" size="large">
              <Form.Item
                name="email"
                label={t('login.email')}
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={t('login.password')}
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              {error && (
                <div className="login-error-message">
                  {error}
                </div>
              )}

              <Form.Item>
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
                    fontWeight: '500'
                  }}
                >
                  {loading ? t('login.loggingIn') : t('login.submit')}
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ margin: '24px 0' }}>
              <Text style={{ color: '#999', fontSize: '14px' }}>
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
                  fontSize: '14px'
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
                  fontSize: '14px'
                }}
              >
                {t('login.continueWithFacebook')}
              </Button>
            </Space>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button
                type="link"
                onClick={() => router.push(`/${locale}/admin-login`)}
                style={{ padding: 0, fontSize: '14px' }}
              >
                Admin Login
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

