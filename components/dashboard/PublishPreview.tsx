'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gym, CMSItem } from '@/lib/types';
import styles from './PublishPreview.module.css';

interface PublishPreviewProps {
  listingInfo: Partial<Gym>;
  cmsData: CMSItem[];
}

export default function PublishPreview({ listingInfo, cmsData }: PublishPreviewProps) {
  const [activeTab, setActiveTab] = useState<'listing' | 'public'>('listing');
  const heroMain = cmsData.find((item) => item.name === 'Hero Section Main');
  const heroSub = cmsData.find((item) => item.name === 'Hero Section Sub');

  return (
    <div className={styles.container}>
      <div className={styles.previewTabs}>
        <button
          className={`${styles.tab} ${activeTab === 'listing' ? styles.active : ''}`}
          onClick={() => setActiveTab('listing')}
        >
          Listing Card
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'public' ? styles.active : ''}`}
          onClick={() => setActiveTab('public')}
        >
          Public Page
        </button>
      </div>

      <div className={styles.previewContent}>
        {activeTab === 'listing' && (
          <div className={styles.listingPreview}>
            <h3 className={styles.previewTitle}>How it will appear on the listing page:</h3>
            <div className={styles.cardPreview}>
              {listingInfo.image ? (
                <div className={styles.cardImage}>
                  <Image
                    src={listingInfo.image}
                    alt={listingInfo.name || 'Gym'}
                    width={300}
                    height={200}
                  />
                </div>
              ) : (
                <div className={styles.cardImagePlaceholder}>
                  <span>No image</span>
                </div>
              )}
              <div className={styles.cardContent}>
                <h4 className={styles.cardName}>
                  {listingInfo.name || 'Gym Name'}
                </h4>
                <p className={styles.cardLocation}>
                  {listingInfo.location || 'Location'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'public' && (
          <div className={styles.publicPagePreview}>
            <h3 className={styles.previewTitle}>Public Page Preview:</h3>
            <div className={styles.heroPreview}>
              <div className={styles.heroContent}>
                <p className={styles.heroMain}>
                  {heroMain?.content || 'STAY HEALTHY, STAY FIT'}
                </p>
                <h2 className={styles.heroSub}>
                  {heroSub?.content || 'GET IN SHAPE NOW'}
                </h2>
              </div>
            </div>
            <div className={styles.previewInfo}>
              <p>Your public page will include:</p>
              <ul>
                <li>Hero section with your CMS content</li>
                <li>Classes, Plans, and Trainers sections</li>
                <li>Newsletter signup</li>
                <li>Contact information from CMS</li>
              </ul>
              {listingInfo.name && (
                <Link
                  href={`/gym/preview`}
                  className={styles.previewLink}
                  target="_blank"
                >
                  View Full Preview →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

