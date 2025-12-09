'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import GymCard from '@/components/public/GymCard';
import Button from '@/components/shared/Button';
import { mockGyms } from '@/lib/constants';

export default function PublicGymListingPage() {
  const t = useTranslations('home');
  const [displayCount, setDisplayCount] = useState(12);
  const [userLocation, setUserLocation] = useState<string>('Your Location');
  const featuredGyms = mockGyms.filter((gym) => gym.featured);
  const allGyms = mockGyms;

  useEffect(() => {
    // Try to get user's location from browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding to get location name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            if (data.city && data.principalSubdivision) {
              setUserLocation(`${data.city}, ${data.principalSubdivision}`);
            } else if (data.locality) {
              setUserLocation(data.locality);
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            // Fallback to a default location
            setUserLocation('Your Area');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback: try to get location from IP
          fetch('https://ipapi.co/json/')
            .then((res) => res.json())
            .then((data) => {
              if (data.city && data.region) {
                setUserLocation(`${data.city}, ${data.region}`);
              } else {
                setUserLocation('Your Area');
              }
            })
            .catch(() => {
              setUserLocation('Your Area');
            });
        }
      );
    } else {
      // Fallback: try to get location from IP
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          if (data.city && data.region) {
            setUserLocation(`${data.city}, ${data.region}`);
          } else {
            setUserLocation('Your Area');
          }
        })
        .catch(() => {
          setUserLocation('Your Area');
        });
    }
  }, []);

  // Filter gyms by location (for demo, we'll use a simple match)
  // In a real app, this would filter based on actual location proximity
  const popularGymsAtLocation = allGyms.filter((gym) => {
    // For demo purposes, we'll show some gyms as "popular at location"
    // In a real app, this would be based on actual location matching
    return gym.id === '1' || gym.id === '2' || gym.id === '3' || gym.id === '4';
  });

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  return (
    <div className="public-page">
      <Header />
      <main className="public-main">
        <div className="container">
          <section className="public-section">
            <h2 className="section-heading">{t('newlyFeatured')}</h2>
            <div className="gym-grid">
              {featuredGyms.slice(0, 4).map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          </section>

          <section className="public-section">
            <h2 className="section-heading">{t('popularGymsAt')} {userLocation}</h2>
            <div className="gym-grid">
              {popularGymsAtLocation.slice(0, 4).map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          </section>

          <section className="public-section">
            <h2 className="section-heading">{t('all')}</h2>
            <div className="gym-grid">
              {allGyms.slice(0, displayCount).map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
            {displayCount < allGyms.length && (
              <div className="load-more-container">
                <Button variant="primary" size="lg" onClick={handleLoadMore}>
                  {t('loadMore')}
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

