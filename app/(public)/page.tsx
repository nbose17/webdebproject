'use client';

import { useState } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import AdvertisementBanner from '@/components/public/AdvertisementBanner';
import GymCard from '@/components/public/GymCard';
import Button from '@/components/shared/Button';
import { mockGyms } from '@/lib/constants';
import '@/styles/public.css';
import styles from './page.module.css';

export default function PublicGymListingPage() {
  const [displayCount, setDisplayCount] = useState(12);
  const featuredGyms = mockGyms.filter((gym) => gym.featured);
  const allGyms = mockGyms;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  return (
    <div className="public-page">
      <Header />
      <main className="public-main">
        <div className="container">
          <AdvertisementBanner />

          <section className={styles.section}>
            <h2 className="section-heading">Newly Featured</h2>
            <div className="gym-grid">
              {featuredGyms.slice(0, 6).map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className="section-heading">All</h2>
            <div className="gym-grid">
              {allGyms.slice(0, displayCount).map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
            {displayCount < allGyms.length && (
              <div className="load-more-container">
                <Button variant="primary" size="lg" onClick={handleLoadMore}>
                  Load More
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

