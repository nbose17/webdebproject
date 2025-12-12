'use client';

import { Class } from '@/lib/types';
import { formatCurrency, formatClassDuration } from '@/lib/utils';
import Button from '@/components/shared/Button';
import { FaEdit, FaTrash, FaClock, FaCalendarCheck } from 'react-icons/fa';

interface ClassCardProps {
    classItem: Class; // Renamed to avoid reserved word conflict, though 'class' is not strictly reserved as prop name, better safe
    onEdit?: (classItem: Class) => void;
    onDelete?: (classItem: Class) => void;
}

export default function ClassCard({ classItem, onEdit, onDelete }: ClassCardProps) {
    return (
        <div className="dashboard-trainer-card">
            <div className="dashboard-trainer-card-content" style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                        <h3 className="dashboard-trainer-card-name" style={{ marginBottom: 'var(--spacing-xs)' }}>{classItem.name}</h3>
                        <span style={{
                            fontSize: 'var(--font-size-lg)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-primary)'
                        }}>
                            {formatCurrency(classItem.price)}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <FaClock style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {formatClassDuration(classItem.durationMinutes)}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <FaCalendarCheck style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }} />
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {classItem.numberOfClasses ? `${classItem.numberOfClasses} Sessions` : 'Unlimited Sessions'}
                        </span>
                    </div>
                </div>

                <div className="dashboard-trainer-card-actions">
                    {onEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(classItem)}
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
                            onClick={() => onDelete(classItem)}
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
