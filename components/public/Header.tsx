'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Button from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
import { FaSearch, FaPlus } from 'react-icons/fa';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would navigate to a search results page
      // For now, we'll just log it or you can implement search functionality
      console.log('Searching for:', searchQuery);
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePostAdvertisement = () => {
    if (isAuthenticated) {
      router.push(`/${locale}/dashboard/publish`);
    } else {
      router.push(`/${locale}/login`);
    }
  };

  return (
    <header className="public-header">
      <div className="public-header-content">
        <div className="public-header-branding-container">
          <p className="public-header-branding">FitConnect Ads</p>
        </div>
        <div className="public-header-search-container">
          <form onSubmit={handleSearch} className="public-header-search-form">
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="public-header-search-input"
            />
            <button type="submit" className="public-header-search-button">
              <FaSearch />
            </button>
          </form>
        </div>
        <div className="public-header-actions">
          <Link href={`/${locale}/login`} className="public-header-login-link">
            {t('header.login')}
          </Link>
          <Button 
            variant="primary" 
            size="md" 
            onClick={handlePostAdvertisement}
            className="public-header-post-button"
          >
            <FaPlus style={{ marginRight: '6px' }} />
            {t('header.listYourGym')}
          </Button>
        </div>
      </div>
    </header>
  );
}


