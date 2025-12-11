'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Gym } from '@/lib/types';
import { useState } from 'react';

interface GymCardProps {
  gym: Gym & {
    subscriptionStatus?: string;
    branches?: Array<{ id: string; name: string; status?: string }>;
  };
}

export default function GymCard({ gym }: GymCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Fallback image for when gym image is not available
  const fallbackImage = '/images/gym-placeholder.jpg';
  const displayImage = imageError || !gym.image ? fallbackImage : gym.image;

  // Get gym status for display
  const isActive = gym.subscriptionStatus === 'active';
  const branchCount = gym.branches?.length || 0;

  return (
    <Link href={`/gym/${gym.id}`} className="gym-card">
      <div className="gym-card-image-container">
        <Image
          src={displayImage}
          alt={gym.name}
          width={300}
          height={240}
          className="gym-card-image"
          onError={() => setImageError(true)}
          placeholder="blur"
          priority={gym.featured}
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {gym.featured && (
          <span className="gym-card-featured-badge">✨ Featured</span>
        )}
      </div>
      <div className="gym-card-content">
        <h3 className="gym-card-name">{gym.name}</h3>
        <p className="gym-card-location">{gym.location}</p>
        
        <div className="gym-card-meta">
          <div className="gym-card-status">
            {isActive ? 'Open Now' : 'Contact for Hours'}
          </div>
          <div className="gym-card-arrow"></div>
        </div>
      </div>
    </Link>
  );
}




