import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import HeroSection from '@/components/public/HeroSection';
import ClassCard from '@/components/public/ClassCard';
import PlanCard from '@/components/public/PlanCard';
import PlanList from '@/components/public/PlanList';
import TrainerCard from '@/components/public/TrainerCard';
import NewsletterSection from '@/components/public/NewsletterSection';
import Carousel from '@/components/shared/Carousel';
import { mockClasses, mockPlans, mockTrainers, mockCMSItems, mockGyms } from '@/lib/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all gym pages
export async function generateStaticParams() {
  return mockGyms.map((gym) => ({
    id: gym.id,
  }));
}


export default async function GymPage({ params }: PageProps) {
  const { id } = await params;

  // Find the specific gym by ID
  const gym = mockGyms.find((g) => g.id === id);

  // Get CMS content
  const featureBanner = mockCMSItems.find((item) => item.name === 'Feature Banner');
  const featureHeading = mockCMSItems.find((item) => item.name === 'Feature Heading');
  const featureDescription = mockCMSItems.find((item) => item.name === 'Feature Description');
  const classListHeading = mockCMSItems.find((item) => item.name === 'Class List Heading');
  const classListDescription = mockCMSItems.find((item) => item.name === 'Class List Description');
  const planListHeading = mockCMSItems.find((item) => item.name === 'Plan List Heading');
  const planListDescription = mockCMSItems.find((item) => item.name === 'Plan List Description');
  const trainerListHeading = mockCMSItems.find((item) => item.name === 'Trainer List Heading');
  const trainerListDescription = mockCMSItems.find((item) => item.name === 'Trainer List Description');

  // If gym not found, show default content
  if (!gym) {
    return (
      <div className="public-page">
        <Header />
        <main className="public-main">
          <div className="container">
            <h1>Gym not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-page">
      <Header />
      <HeroSection image={gym.image} />
      <main className="public-main">
        <div className="container">
          {/* Feature Section */}
          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">{featureHeading?.content || 'Feature Heading'}</h2>
            <p className="gym-detail-sub-heading">
              {featureDescription?.content || 'Feature Content Feature Content Feature Content Feature Content Feature Content Feature Content'}
            </p>
            {featureBanner && (
              <div className="gym-detail-feature-banner">
                <p>{featureBanner.content}</p>
              </div>
            )}
          </section>

          {/* Classes Section */}
          <section id="classes-section" className="gym-detail-section">
            <h2 className="gym-detail-heading">{classListHeading?.content || 'Class List Heading'}</h2>
            <p className="gym-detail-sub-heading">
              {classListDescription?.content || 'Class List Sub Heading Class List Sub Heading Class List Sub Heading Class List Sub Heading'}
            </p>
            <Carousel itemsPerView={3}>
              {mockClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </Carousel>
          </section>

          {/* Plans Section */}
          <section id="plans-section" className="gym-detail-section">
            <h2 className="gym-detail-heading">{planListHeading?.content || 'Plan List Heading'}</h2>
            <p className="gym-detail-sub-heading">
              {planListDescription?.content || 'Plan List Sub Heading Plan List Sub Heading Plan List Sub Heading Plan List Sub Heading'}
            </p>
            <PlanList plans={mockPlans} />
          </section>

          {/* Trainers Section */}
          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">{trainerListHeading?.content || 'Trainer List Heading'}</h2>
            <p className="gym-detail-sub-heading">
              {trainerListDescription?.content || 'Trainer List Sub Heading Trainer List Sub Heading Trainer List Sub Heading'}
            </p>
            <Carousel itemsPerView={3}>
              {mockTrainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </Carousel>
          </section>

          {/* Newsletter Section */}
          <NewsletterSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}


