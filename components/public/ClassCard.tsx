'use client';

import { Class } from '@/lib/types';

interface ClassCardProps {
  classItem: Class;
}

export default function ClassCard({ classItem }: ClassCardProps) {
  return (
    <div className="class-card">
      <h3 className="class-card-title">{classItem.name}</h3>
      <p className="class-card-description">
        {classItem.description || 'Cardio training description Cardio training description Cardio training description'}
      </p>
    </div>
  );
}




