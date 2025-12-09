'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('login');

  const handleLanguageChange = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push(`/${locale}/dashboard`);
      } else {
        setError(t('invalidCredentials'));
      }
    } catch (err) {
      setError(t('error'));
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
      setError(t('googleLoginFailed'));
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
      setError(t('facebookLoginFailed'));
    } finally {
      setSsoLoading(null);
    }
  };

  return (
    <div className="public-page">
      <Header />
      <main className="public-main">
        <div className="container">
          <div className="login-container">
            <div className="login-header">
              <h1 className="login-title">{t('title')}</h1>
              <div className="language-selector">
                <label className="language-selector-label">{t('selectLanguage')}</label>
                <select
                  value={locale}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="language-selector-select"
                >
                  <option value="en">{t('english')}</option>
                  <option value="ru">{t('russian')}</option>
                </select>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="login-form">
              <Input
                type="email"
                label={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('emailPlaceholder')}
              />
              <Input
                type="password"
                label={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('passwordPlaceholder')}
              />
              {error && <div className="login-error">{error}</div>}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || ssoLoading !== null}
                className="login-submit-button"
              >
                {loading ? t('loggingIn') : t('submit')}
              </Button>
            </form>

            <div className="login-divider">
              <span className="login-divider-line"></span>
              <span className="login-divider-text">{t('or')}</span>
              <span className="login-divider-line"></span>
            </div>

            <div className="login-sso-buttons">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || ssoLoading !== null}
                className="login-sso-button login-sso-google"
              >
                <FaGoogle className="login-sso-icon" />
                <span>{ssoLoading === 'google' ? t('signingIn') : t('continueWithGoogle')}</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={loading || ssoLoading !== null}
                className="login-sso-button login-sso-facebook"
              >
                <FaFacebook className="login-sso-icon" />
                <span>{ssoLoading === 'facebook' ? t('signingIn') : t('continueWithFacebook')}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

