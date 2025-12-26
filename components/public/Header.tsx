'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Search } = Input;

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleSearch = (value: string) => {
    if (value.trim()) {
      // In a real app, this would navigate to a search results page
      // For now, we'll just log it or you can implement search functionality
      console.log('Searching for:', value);
      // router.push(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handlePostAdvertisement = () => {
    if (isAuthenticated) {
      router.push('/dashboard/advertisement');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="public-header">
      <div className="public-header-content">
        <div className="public-header-branding-container">
          <Link href="/" className="public-header-branding-link">
            <p className="public-header-branding">FitConnect Ads</p>
          </Link>
        </div>
        <div className="public-header-search-container">
          <Search
            placeholder="Search gyms, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            enterButton={
              <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            }
            style={{ width: '100%' }}
          />
        </div>
        <div className="public-header-actions">
          <Link href="/login" className="public-header-login-link">
            Login
          </Link>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handlePostAdvertisement}
            className="public-header-post-button"
          >
            List Your Gym
          </Button>
        </div>
      </div>
    </header>
  );
}



