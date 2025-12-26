'use client';

import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface PlanCardProps {
  plan: Plan;
  onClick?: () => void;
}

export default function PlanCard({ plan, onClick }: PlanCardProps) {
  return (
    <div
      className="plan-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <h3 className="plan-card-title">{plan.name}</h3>
      <div className="plan-card-price">
        {formatCurrency(plan.price)}
        <span className="plan-card-duration"> / {plan.duration}</span>
      </div>
      {plan.description && (
        <p className="plan-card-description">{plan.description}</p>
      )}
      {plan.features && plan.features.length > 0 && (
        <ul className="plan-card-features">
          {plan.features.map((feature, index) => (
            <li key={index}>✓ {feature}</li>
          ))}
        </ul>
      )}
    </div>
  );
}





