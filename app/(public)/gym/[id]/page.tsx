'use client';

import { use } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import HeroSection from '@/components/public/HeroSection';
import ClassCard from '@/components/public/ClassCard';
import PlanCard from '@/components/public/PlanCard';
import TrainerCard from '@/components/public/TrainerCard';
import NewsletterSection from '@/components/public/NewsletterSection';
import Carousel from '@/components/shared/Carousel';
import { mockClasses, mockPlans, mockTrainers, mockCMSItems } from '@/lib/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GymPage({ params }: PageProps) {
  const { id } = use(params);
  const featureBanner = mockCMSItems.find((item) => item.name === 'Feature Banner');

  return (
    <div className="public-page">
      <Header />
      <HeroSection />
      <main className="public-main">
        <div className="container">
          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">Feature Heading</h2>
            <p className="gym-detail-sub-heading">
              Feature Content Feature Content Feature Content Feature Content Feature Content Feature Content
            </p>
            {featureBanner && (
              <div className="gym-detail-feature-banner">
                <p>{featureBanner.content}</p>
              </div>
            )}
          </section>

          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">Class List Heading</h2>
            <p className="gym-detail-sub-heading">
              Class List Sub Heading Class List Sub Heading Class List Sub Heading Class List Sub Heading
            </p>
            <Carousel itemsPerView={3}>
              {mockClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </Carousel>
          </section>

          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">Plan List Heading</h2>
            <p className="gym-detail-sub-heading">
              Plan List Sub Heading Plan List Sub Heading Plan List Sub Heading Plan List Sub Heading
            </p>
            <Carousel itemsPerView={3}>
              {mockPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </Carousel>
          </section>

          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">Trainer List Heading</h2>
            <p className="gym-detail-sub-heading">
              Trainer List Sub Heading Trainer List Sub Heading Trainer List Sub Heading
            </p>
            <Carousel itemsPerView={3}>
              {mockTrainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </Carousel>
          </section>

          <NewsletterSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

