'use client';

import { use } from 'react';
import { useQuery } from '@apollo/client/react';
import { Skeleton, Alert } from 'antd';
import Header from '@/components/public/Header';
import GymFooter from '@/components/public/GymFooter';
import HeroSection from '@/components/public/HeroSection';
import ClassCard from '@/components/public/ClassCard';
import PlanCard from '@/components/public/PlanCard';
import TrainerCard from '@/components/public/TrainerCard';
import NewsletterSection from '@/components/public/NewsletterSection';
import Carousel from '@/components/shared/Carousel';
import { GET_GYM, GET_CMS, GET_PLANS, GET_TRAINERS, GET_CLASSES, GET_GYMS } from '@/graphql/queries/admin';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GymPage({ params }: PageProps) {
  const { id } = use(params);
  
  console.log('🏋️ GymPage loading for ID:', id);
  
  // Fetch gym data
  const { data: gymData, loading: gymLoading, error: gymError } = useQuery(GET_GYM, {
    variables: { id },
    errorPolicy: 'all'
  });
  
  console.log('🏋️ Gym query result:', { 
    data: gymData?.gym ? { id: gymData.gym.id, name: gymData.gym.name } : null, 
    loading: gymLoading, 
    hasError: !!gymError,
    errorMessage: gymError?.message 
  });
  
  // Fetch CMS data
  const { data: cmsData, loading: cmsLoading, error: cmsError } = useQuery(GET_CMS, {
    variables: { gymId: id },
    errorPolicy: 'all'
  });
  
  // Fetch plans data
  const { data: plansData, loading: plansLoading, error: plansError } = useQuery(GET_PLANS, {
    variables: { gymId: id },
    errorPolicy: 'all'
  });
  
  // Fetch classes data
  const { data: classesData, loading: classesLoading, error: classesError } = useQuery(GET_CLASSES, {
    variables: { gymId: id },
    errorPolicy: 'all'
  });
  
  // Fetch trainers data
  const { data: trainersData, loading: trainersLoading, error: trainersError } = useQuery(GET_TRAINERS, {
    variables: { gymId: id },
    errorPolicy: 'all'
  });
  
  // Fetch available gyms for debugging/fallback
  const { data: allGymsData } = useQuery(GET_GYMS, {
    variables: { subscriptionStatus: 'active' },
    errorPolicy: 'all'
  });
  
  const loading = gymLoading || cmsLoading || plansLoading || classesLoading || trainersLoading;
  const error = gymError || cmsError || plansError || classesError || trainersError;
  
  // Show loading for main gym data only
  if (gymLoading && !gymData) {
    return (
      <div className="public-page">
        <div style={{ padding: '60px 20px' }}>
          <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: '32px' }} />
          <Skeleton.Image style={{ width: '100%', height: '400px' }} active />
          <div style={{ marginTop: '32px' }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        </div>
      </div>
    );
  }
  
  // Show error if main gym data fails
  if (gymError && !gymData) {
    return (
      <div className="public-page">
        <div style={{ padding: '60px 20px' }}>
          <Alert
            message="Error Loading Gym"
            description={gymError.message || "Unable to load gym details. Please try again later."}
            type="error"
            showIcon
            action={
              <button 
                className="btn" 
                onClick={() => window.location.reload()}
                style={{ marginTop: '16px' }}
              >
                Try Again
              </button>
            }
          />
        </div>
      </div>
    );
  }
  
  const gym = gymData?.gym;
  const cms = cmsData?.cms;
  
  if (!gym) {
    return (
      <div className="public-page">
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Alert
            message="Gym Not Found"
            description={
              <div>
                <p>The gym with ID <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>"{id}"</code> doesn't exist or may have been removed.</p>
                {allGymsData?.gyms && (
                  <details style={{ marginTop: '12px' }}>
                    <summary style={{ cursor: 'pointer', color: '#4CAF50' }}>
                      Debug: Show available gym IDs ({allGymsData.gyms.length} found)
                    </summary>
                    <div style={{ marginTop: '8px', fontSize: '12px', background: '#f8faf8', padding: '8px', borderRadius: '4px' }}>
                      {allGymsData.gyms.map((gym: any) => (
                        <div key={gym.id} style={{ marginBottom: '4px' }}>
                          <code>{gym.id}</code> - {gym.name}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            }
            type="warning"
            showIcon
            style={{ marginBottom: '32px' }}
            action={
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  className="btn"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </button>
                <button 
                  className="btn"
                  onClick={() => window.location.href = '/en'}
                >
                  View All Gyms
                </button>
              </div>
            }
          />
          
          <div style={{ 
            background: 'linear-gradient(135deg, #f8faf8 0%, #e8f5e9 100%)',
            padding: '32px',
            borderRadius: '12px',
            marginTop: '24px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#2D2D2D' }}>
              Available Gyms
            </h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Here are some gyms you might be interested in:
            </p>
            
            {allGymsData?.gyms && allGymsData.gyms.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {allGymsData.gyms.slice(0, 4).map((gym: any) => (
                  <div
                    key={gym.id}
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      console.log('🔗 Navigating to gym:', gym.id, gym.name);
                      window.location.href = `/en/gym/${gym.id}`;
                    }}
                  >
                    <h4 style={{ margin: '0 0 8px 0', color: '#4CAF50' }}>{gym.name}</h4>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>📍 {gym.location}</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#4CAF50' }}>
                      Click to view →
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '24px' }}>
                Loading available gyms...
              </p>
            )}
            
            <button 
              className="btn"
              style={{ 
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '24px'
              }}
              onClick={() => window.location.href = '/en'}
            >
              View All Gyms
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Use CMS data if available, otherwise fallback to defaults
  const gymInfo = {
    name: gym.name,
    logo: cms?.gymLogo || gym.image || '/images/gym-placeholder.jpg',
    address: cms?.address || '',
    email: cms?.email || '',
    phone: cms?.phone || '',
    facebook: cms?.facebookUrl || '',
    twitter: cms?.twitterUrl || '',
    instagram: cms?.instagramUrl || '',
  };

  return (
    <div className="public-page">
      <Header variant="gym" gymLogo={gymInfo.logo} gymName={gymInfo.name} />
      <HeroSection
        subHeading={cms?.heroSubHeading}
        mainHeading={cms?.heroMainHeading}
        description={cms?.heroDescription}
        backgroundImage={cms?.heroBackgroundImage}
        button1Text={cms?.heroButton1Text}
        button2Text={cms?.heroButton2Text}
      />
      <main className="public-main">
        <div className="container">
          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">{cms?.featureHeading || 'Feature Heading'}</h2>
            <p className="gym-detail-sub-heading">
              {cms?.featureSubHeading || 'Feature Content'}
            </p>
            {cms?.featureBannerContent && (
              <div className="gym-detail-feature-banner">
                <p>{cms.featureBannerContent}</p>
              </div>
            )}
          </section>

          {/* Classes Section */}
          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">{cms?.classesHeading || 'Our Fitness Classes'}</h2>
            <p className="gym-detail-sub-heading">
              {cms?.classesSubHeading || 'Discover our diverse range of fitness classes designed for all levels'}
            </p>
            {classesLoading ? (
              <div style={{ display: 'flex', gap: '16px' }}>
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} active paragraph={{ rows: 4 }} style={{ flex: 1 }} />
                ))}
              </div>
            ) : (classesData?.classes || []).length > 0 ? (
              <Carousel itemsPerView={3}>
                {(classesData?.classes || []).map((classItem: any) => (
                  <ClassCard key={classItem.id} classItem={classItem} />
                ))}
              </Carousel>
            ) : (
              <div className="gym-section-empty">
                <p>No fitness classes available</p>
                <small>Check back soon for new class offerings!</small>
              </div>
            )}
          </section>

          {/* Plans Section */}
          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">{cms?.plansHeading || 'Membership Plans'}</h2>
            <p className="gym-detail-sub-heading">
              {cms?.plansSubHeading || 'Choose the perfect membership plan that fits your lifestyle'}
            </p>
            {plansLoading ? (
              <div style={{ display: 'flex', gap: '16px' }}>
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} active paragraph={{ rows: 4 }} style={{ flex: 1 }} />
                ))}
              </div>
            ) : (plansData?.plans || []).length > 0 ? (
              <Carousel itemsPerView={3}>
                {(plansData?.plans || []).map((plan: any) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </Carousel>
            ) : (
              <div className="gym-section-empty">
                <p>No membership plans available</p>
                <small>Contact us for custom membership options!</small>
              </div>
            )}
          </section>

          {/* Trainers Section */}
          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">{cms?.trainersHeading || 'Our Expert Trainers'}</h2>
            <p className="gym-detail-sub-heading">
              {cms?.trainersSubHeading || 'Meet our certified fitness professionals dedicated to your success'}
            </p>
            {trainersLoading ? (
              <div style={{ display: 'flex', gap: '16px' }}>
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} active paragraph={{ rows: 4 }} style={{ flex: 1 }} />
                ))}
              </div>
            ) : (trainersData?.trainers || []).length > 0 ? (
              <Carousel itemsPerView={3}>
                {(trainersData?.trainers || []).map((trainer: any) => (
                  <TrainerCard key={trainer.id} trainer={trainer} />
                ))}
              </Carousel>
            ) : (
              <div className="gym-section-empty">
                <p>No trainers available</p>
                <small>We're building our team of fitness experts!</small>
              </div>
            )}
          </section>

          <NewsletterSection
            heading={cms?.newsletterHeading}
            subHeading={cms?.newsletterSubHeading}
            buttonText={cms?.newsletterButtonText}
          />
        </div>
      </main>
      <GymFooter
        gymName={gymInfo.name}
        address={gymInfo.address}
        email={gymInfo.email}
        phone={gymInfo.phone}
        facebook={gymInfo.facebook}
        twitter={gymInfo.twitter}
        instagram={gymInfo.instagram}
      />
    </div>
  );
}

