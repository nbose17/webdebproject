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
import { GET_GYM, GET_CMS, GET_PLANS, GET_TRAINERS, GET_CLASSES } from '@/graphql/queries/admin';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GymPage({ params }: PageProps) {
  const { id } = use(params);
  
  const { data: gymData, loading: gymLoading, error: gymError } = useQuery(GET_GYM, {
    variables: { id },
  });
  
  const { data: cmsData, loading: cmsLoading, error: cmsError } = useQuery(GET_CMS, {
    variables: { gymId: id },
  });
  
  const loading = gymLoading || cmsLoading;
  const error = gymError || cmsError;
  
  if (loading) {
    return (
      <div className="public-page">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="public-page">
        <Alert
          message="Error Loading Gym"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }
  
  const gym = gymData?.gym;
  const cms = cmsData?.cms;
  
  if (!gym) {
    return (
      <div className="public-page">
        <Alert
          message="Gym Not Found"
          description="The gym you're looking for doesn't exist."
          type="warning"
          showIcon
        />
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

          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">{cms?.classesHeading || 'Class List Heading'}</h2>
            <p className="gym-detail-sub-heading">
              {cms?.classesSubHeading || 'Class List Sub Heading'}
            </p>
            <Carousel itemsPerView={3}>
              {(classesData?.classes || []).map((classItem: any) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </Carousel>
          </section>

          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">{cms?.plansHeading || 'Plan List Heading'}</h2>
            <p className="gym-detail-sub-heading">
              {cms?.plansSubHeading || 'Plan List Sub Heading'}
            </p>
            <Carousel itemsPerView={3}>
              {mockPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </Carousel>
          </section>

          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">{cms?.trainersHeading || 'Trainer List Heading'}</h2>
            <p className="gym-detail-sub-heading">
              {cms?.trainersSubHeading || 'Trainer List Sub Heading'}
            </p>
            <Carousel itemsPerView={3}>
              {(trainersData?.trainers || []).map((trainer: any) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </Carousel>
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

