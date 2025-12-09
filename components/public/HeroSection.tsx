'use client';

import Button from '@/components/shared/Button';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-section-overlay" />
      <div className="hero-section-content">
        <div className="hero-section-text-box">
          <p className="hero-section-sub-heading">STAY HEALTHY, STAY FIT</p>
        </div>
        <h1 className="hero-section-heading">GET IN SHAPE NOW</h1>
        <p className="hero-section-description">
          Train in the fitness gym and explore all benefits
        </p>
        <div className="hero-section-actions">
          <Button variant="secondary" size="lg">
            See All Classes
          </Button>
          <Button variant="primary" size="lg">
            View Plans
          </Button>
        </div>
        <div className="hero-section-logo">
          <div className="hero-section-logo-circle">FITNESS</div>
        </div>
      </div>
    </section>
  );
}




