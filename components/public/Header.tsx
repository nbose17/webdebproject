'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';

interface HeaderProps {
  variant?: 'listing' | 'gym';
  gymLogo?: string;
  gymName?: string;
}

export default function Header({ variant = 'listing', gymLogo, gymName }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t } = useTranslation(['common']);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would navigate to search results
      console.log('Searching for:', searchQuery);
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Gym page header
  if (variant === 'gym') {
    return (
      <header className="public-header">
        <div className="public-header-content" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%'
        }}>
          {/* Gym Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '40px' }}>
              <Image
                src={gymLogo || '/images/logo.png'}
                alt={gymName || 'Gym Logo'}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Listing page header - FitConnect logo + search
  return (
    <header className="public-header">
      <div className="public-header-content" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        gap: '24px'
      }}>
        {/* FitConnect Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 700, 
            color: '#4CAF50',
            letterSpacing: '-0.5px'
          }}>
            FitConnect
          </div>
        </div>
        
        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <form onSubmit={handleSearch} style={{ 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: '40px',
            border: '1px solid #ddd',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
          }}>
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 20px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: 'transparent'
              }}
            />
            <button 
              type="submit" 
              style={{
                padding: '12px 20px',
                border: 'none',
                backgroundColor: '#4CAF50',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaSearch />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}


