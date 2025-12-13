'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client/react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import GymCard from '@/components/public/GymCard';
import Button from '@/components/shared/Button';
import { GET_GYMS } from '@/graphql/queries/admin';
import { Skeleton, Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function PublicGymListingPage() {
  const { t } = useTranslation(['common']);
  const [displayCount, setDisplayCount] = useState(12);
  const [userLocation, setUserLocation] = useState<string>('Your Location');

  // Fetch all gyms with active subscription
  const {
    data: gymsData,
    loading: gymsLoading,
    error: gymsError,
    refetch: refetchGyms
  } = useQuery<{ gyms: any[] }>(GET_GYMS, {
    variables: {
      subscriptionStatus: 'active' // Only show active gyms on public page
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  const allGyms = gymsData?.gyms || [];
  const featuredGyms = allGyms.filter((gym: any) => gym.featured);

  console.log('🏋️ Public page gym data:', {
    totalGyms: allGyms.length,
    featuredCount: featuredGyms.length,
    loading: gymsLoading,
    hasError: !!gymsError
  });

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

  // Filter gyms by location (enhanced logic)
  // For now, we'll use location-based filtering on the gym location field
  const popularGymsAtLocation = allGyms.filter((gym: any) => {
    if (!gym.location) return false;

    // Simple location matching - in production, you'd use geospatial queries
    const gymLocation = gym.location.toLowerCase();
    const userLoc = userLocation.toLowerCase();

    // Check if user location matches gym location (city/state matching)
    if (userLoc.includes('your') || userLoc.includes('area')) {
      // Fallback: show first few gyms if location is generic
      return allGyms.indexOf(gym) < 4;
    }

    // Check if gym location contains parts of user location
    const locationParts = userLoc.split(',').map(part => part.trim());
    return locationParts.some(part =>
      part.length > 2 && gymLocation.includes(part)
    );
  }).slice(0, 4);

  // If no location matches, show first 4 gyms
  const finalPopularGyms = popularGymsAtLocation.length > 0
    ? popularGymsAtLocation
    : allGyms.slice(0, 4);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  // Render loading state
  if (gymsLoading && !gymsData) {
    return (
      <div className="public-page">
        <Header variant="listing" />
        <main className="public-main">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48, color: '#4CAF50' }} spin />}
                size="large"
              />
              <div style={{ marginTop: 24, fontSize: 18, color: '#666' }}>
                Loading gyms in your area...
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render error state
  if (gymsError && !gymsData) {
    return (
      <div className="public-page">
        <Header variant="listing" />
        <main className="public-main">
          <div className="container">
            <div style={{ padding: '60px 20px' }}>
              <Alert
                message="Unable to load gyms"
                description="We're having trouble loading gym listings. Please try again later."
                type="error"
                showIcon
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => refetchGyms()}
                  >
                    Try Again
                  </Button>
                }
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-page">
      <Header variant="listing" />
      <main className="public-main">
        <div className="container">
          {/* Featured Gyms Section */}
          <section className="public-section">
            <h2 className="section-heading">{t('home.newlyFeatured')}</h2>
            {gymsLoading ? (
              <div className="gym-grid">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} style={{ marginBottom: 24 }}>
                    <Skeleton.Image
                      style={{ width: '100%', height: 200 }}
                      active
                    />
                    <Skeleton
                      active
                      title={{ width: '80%' }}
                      paragraph={{ rows: 2, width: ['60%', '40%'] }}
                    />
                  </div>
                ))}
              </div>
            ) : featuredGyms.length > 0 ? (
              <div className="gym-grid">
                {featuredGyms.slice(0, 4).map((gym: any) => (
                  <GymCard key={gym.id} gym={gym} />
                ))}
              </div>
            ) : (
              <div className="gym-section-empty">
                <p>No featured gyms available at the moment.</p>
                <small>Check back soon for newly featured fitness centers!</small>
              </div>
            )}
          </section>

          {/* Popular at Location Section */}
          <section className="public-section">
            <h2 className="section-heading">{t('home.popularGymsAt')} {userLocation}</h2>
            {gymsLoading ? (
              <div className="gym-grid">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} style={{ marginBottom: 24 }}>
                    <Skeleton.Image
                      style={{ width: '100%', height: 200 }}
                      active
                    />
                    <Skeleton
                      active
                      title={{ width: '80%' }}
                      paragraph={{ rows: 2, width: ['60%', '40%'] }}
                    />
                  </div>
                ))}
              </div>
            ) : finalPopularGyms.length > 0 ? (
              <div className="gym-grid">
                {finalPopularGyms.map((gym: any) => (
                  <GymCard key={gym.id} gym={gym} />
                ))}
              </div>
            ) : (
              <div className="gym-section-empty">
                <p>No gyms found near {userLocation}</p>
                <small>Try checking out all available gyms below or expand your search area.</small>
              </div>
            )}
          </section>

          {/* All Gyms Section */}
          <section className="public-section">
            <h2 className="section-heading">{t('home.all')}</h2>
            {gymsLoading ? (
              <div className="gym-grid">
                {Array(displayCount).fill(0).map((_, index) => (
                  <div key={index} style={{ marginBottom: 24 }}>
                    <Skeleton.Image
                      style={{ width: '100%', height: 200 }}
                      active
                    />
                    <Skeleton
                      active
                      title={{ width: '80%' }}
                      paragraph={{ rows: 2, width: ['60%', '40%'] }}
                    />
                  </div>
                ))}
              </div>
            ) : allGyms.length > 0 ? (
              <>
                <div className="gym-grid">
                  {allGyms.slice(0, displayCount).map((gym: any) => (
                    <GymCard key={gym.id} gym={gym} />
                  ))}
                </div>
                {displayCount < allGyms.length && (
                  <div className="load-more-container">
                    <button
                      className="btn"
                      onClick={handleLoadMore}
                      type="button"
                    >
                      {t('home.loadMore')} ({allGyms.length - displayCount} more)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="gym-section-empty">
                <p>No gyms available at the moment</p>
                <small>We're working on adding more fitness centers to our platform. Please check back later!</small>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

