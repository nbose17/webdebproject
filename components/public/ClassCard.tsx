'use client';

import { Class } from '@/lib/types';
import styles from './ClassCard.module.css';

interface ClassCardProps {
  classItem: Class;
}

export default function ClassCard({ classItem }: ClassCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{classItem.name}</h3>
      <p className={styles.description}>
        {classItem.description || 'Cardio training description Cardio training description Cardio training description'}
      </p>
    </div>
  );
}

