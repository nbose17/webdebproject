'use client';

import Button from '@/components/shared/Button';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.textBox}>
          <p className={styles.subHeading}>STAY HEALTHY, STAY FIT</p>
        </div>
        <h1 className={styles.heading}>GET IN SHAPE NOW</h1>
        <p className={styles.description}>
          Train in the fitness gym and explore all benefits
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" size="lg">
            See All Classes
          </Button>
          <Button variant="primary" size="lg">
            View Plans
          </Button>
        </div>
        <div className={styles.logo}>
          <div className={styles.logoCircle}>FITNESS</div>
        </div>
      </div>
    </section>
  );
}


