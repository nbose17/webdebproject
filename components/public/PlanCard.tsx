'use client';

import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import styles from './PlanCard.module.css';

interface PlanCardProps {
  plan: Plan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{plan.name}</h3>
      <p className={styles.description}>
        Cardio training description Cardio training description Cardio training description
      </p>
    </div>
  );
}

