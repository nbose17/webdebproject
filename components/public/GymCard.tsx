'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Gym } from '@/lib/types';

interface GymCardProps {
  gym: Gym;
}

export default function GymCard({ gym }: GymCardProps) {
  return (
    <Link href={`/gym/${gym.id}`} className="gym-card">
      <div className="gym-card-image-container">
        <Image
          src={gym.image}
          alt={gym.name}
          width={300}
          height={200}
          className="gym-card-image"
        />
      </div>
      <div className="gym-card-content">
        <h3 className="gym-card-name">{gym.name}</h3>
        <p className="gym-card-location">{gym.location}</p>
      </div>
    </Link>
  );
}




