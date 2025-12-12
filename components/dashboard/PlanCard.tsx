'use client';

import { Plan } from '@/lib/types';
import { formatCurrency, formatDuration } from '@/lib/utils';
import Button from '@/components/shared/Button';
import { FaEdit, FaTrash, FaClock, FaTags } from 'react-icons/fa';
import { Tag, Tooltip } from 'antd';

interface PlanCardProps {
    plan: Plan;
    onEdit?: (plan: Plan) => void;
    onDelete?: (plan: Plan) => void;
}

export default function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
    const classTotal = plan.includedClasses?.reduce((sum: number, cls: any) => sum + cls.price, 0) || 0;
    const totalPrice = plan.price + classTotal;

    const renderClasses = () => {
        const classes = plan.includedClasses || [];
        if (classes.length === 0) {
            return <Tag>No classes included</Tag>;
        }

        if (classes.length <= 2) {
            return (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {classes.map((c: any) => (
                        <Tag color="blue" key={c.id}>
                            {c.name}
                        </Tag>
                    ))}
                </div>
            );
        }

        const firstTwo = classes.slice(0, 2);
        const remainingCount = classes.length - 2;
        const remainingNames = classes.slice(2).map((c: any) => c.name).join(', ');

        return (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {firstTwo.map((c: any) => (
                    <Tag color="blue" key={c.id}>
                        {c.name}
                    </Tag>
                ))}
                <Tooltip title={remainingNames}>
                    <Tag>+{remainingCount} more</Tag>
                </Tooltip>
            </div>
        );
    };

    return (
        <div className="dashboard-trainer-card">
            <div className="dashboard-trainer-card-content" style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                        <h3 className="dashboard-trainer-card-name" style={{ marginBottom: 'var(--spacing-xs)' }}>{plan.name}</h3>
                        <span style={{
                            fontSize: 'var(--font-size-lg)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-primary)'
                        }}>
                            {formatCurrency(totalPrice)}
                        </span>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                            Base: {formatCurrency(plan.price)}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <FaClock style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {formatDuration(plan.durationMonths)}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                        <FaTags style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '6px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            {renderClasses()}
                        </div>
                    </div>
                </div>

                <div className="dashboard-trainer-card-actions">
                    {onEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(plan)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-sm)' }}
                            title="Edit"
                        >
                            <FaEdit />
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(plan)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-sm)' }}
                            title="Delete"
                        >
                            <FaTrash />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
