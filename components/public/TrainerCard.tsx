'use client';

import Image from 'next/image';
import { Trainer } from '@/lib/types';
import styles from './TrainerCard.module.css';

interface TrainerCardProps {
  trainer: Trainer;
}

export default function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={trainer.image}
          alt={trainer.name}
          width={200}
          height={200}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{trainer.name}</h3>
      </div>
    </div>
  );
}


