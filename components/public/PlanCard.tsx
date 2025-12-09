'use client';

import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface PlanCardProps {
  plan: Plan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="plan-card">
      <h3 className="plan-card-title">{plan.name}</h3>
      <p className="plan-card-description">
        Cardio training description Cardio training description Cardio training description
      </p>
    </div>
  );
}




