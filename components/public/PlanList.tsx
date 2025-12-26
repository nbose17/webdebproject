'use client';

import { useState } from 'react';
import { Modal, Button as AntButton } from 'antd';
import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import Carousel from '@/components/shared/Carousel';
import PlanCard from '@/components/public/PlanCard';

interface PlanListProps {
    plans: Plan[];
}

export default function PlanList({ plans }: PlanListProps) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    const handlePlanClick = (plan: Plan) => {
        setSelectedPlan(plan);
    };

    const handleCloseModal = () => {
        setSelectedPlan(null);
    };

    return (
        <>
            <Carousel itemsPerView={3}>
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        onClick={() => handlePlanClick(plan)}
                    />
                ))}
            </Carousel>

            <Modal
                title={<span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedPlan?.name}</span>}
                open={!!selectedPlan}
                onCancel={handleCloseModal}
                footer={[
                    <AntButton key="close" onClick={handleCloseModal}>
                        Close
                    </AntButton>,
                    <AntButton key="select" type="primary">
                        Select Plan
                    </AntButton>
                ]}
                width={600}
            >
                {selectedPlan && (
                    <div className="plan-modal-content">
                        <div style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                            {formatCurrency(selectedPlan.price)}
                            <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 'normal' }}> / {selectedPlan.duration}</span>
                        </div>

                        {selectedPlan.description && (
                            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                {selectedPlan.description}
                            </p>
                        )}

                        {selectedPlan.features && selectedPlan.features.length > 0 && (
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Features:</h4>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {selectedPlan.features.map((feature, index) => (
                                        <li key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--color-primary)', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}
