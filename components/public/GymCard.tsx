'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Gym } from '@/lib/types';
import styles from './GymCard.module.css';

interface GymCardProps {
  gym: Gym;
}

export default function GymCard({ gym }: GymCardProps) {
  return (
    <Link href={`/gym/${gym.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={gym.image}
          alt={gym.name}
          width={300}
          height={200}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{gym.name}</h3>
        <p className={styles.location}>{gym.location}</p>
      </div>
    </Link>
  );
}


