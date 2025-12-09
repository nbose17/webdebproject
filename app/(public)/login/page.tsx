'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
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
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Facebook login failed. Please try again.');
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
            <h1 className="login-title">Login</h1>
            
            <form onSubmit={handleSubmit} className="login-form">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              {error && <div className="login-error">{error}</div>}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || ssoLoading !== null}
                className="login-submit-button"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="login-divider">
              <span className="login-divider-line"></span>
              <span className="login-divider-text">or</span>
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
                <span>{ssoLoading === 'google' ? 'Signing in...' : 'Continue with Google'}</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={loading || ssoLoading !== null}
                className="login-sso-button login-sso-facebook"
              >
                <FaFacebook className="login-sso-icon" />
                <span>{ssoLoading === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

