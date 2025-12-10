'use client';

import Button from '@/components/shared/Button';

interface HeroSectionProps {
  subHeading?: string;
  mainHeading?: string;
  description?: string;
  backgroundImage?: string;
  button1Text?: string;
  button2Text?: string;
}

export default function HeroSection({
  subHeading = 'STAY HEALTHY, STAY FIT',
  mainHeading = 'GET IN SHAPE NOW',
  description = 'Train in the fitness gym and explore all benefits',
  backgroundImage = '/images/gym-placeholder.jpg',
  button1Text = 'See All Classes',
  button2Text = 'View Plans',
}: HeroSectionProps) {
  return (
    <section 
      className="hero-section"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="hero-section-overlay" />
      <div className="hero-section-content">
        <div className="hero-section-text-box">
          <p className="hero-section-sub-heading">{subHeading}</p>
        </div>
        <h1 className="hero-section-heading">{mainHeading}</h1>
        <p className="hero-section-description">
          {description}
        </p>
        <div className="hero-section-actions">
          <Button variant="secondary" size="lg">
            {button1Text}
          </Button>
          <Button variant="primary" size="lg">
            {button2Text}
          </Button>
        </div>
        <div className="hero-section-logo">
          <div className="hero-section-logo-circle">FITNESS</div>
        </div>
      </div>
    </section>
  );
}




