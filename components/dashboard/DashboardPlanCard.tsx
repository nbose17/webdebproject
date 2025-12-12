import { Plan } from '@/lib/types';
import { formatCurrency, formatDuration } from '@/lib/utils';
import { Card, Tag, Tooltip, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface DashboardPlanCardProps {
    plan: Plan;
    onEdit: (plan: Plan) => void;
    onDelete: (plan: Plan) => void;
}

export default function DashboardPlanCard({ plan, onEdit, onDelete }: DashboardPlanCardProps) {
    const classTotal = plan.includedClasses?.reduce((sum: number, cls: any) => sum + cls.price, 0) || 0;
    const totalPrice = plan.price + classTotal;

    const renderClasses = () => {
        const classes = plan.includedClasses || [];
        if (classes.length === 0) {
            return <Tag>No classes included</Tag>;
        }

        if (classes.length <= 2) {
            return (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
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
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
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
        <Card
            className="h-full hover:shadow-sm transition-shadow duration-300"
            title={plan.name}
            extra={<span className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</span>}
            actions={[
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(plan)}
                    key="edit"
                >
                    Edit
                </Button>,
                <Popconfirm
                    title="Delete Plan"
                    description="Are you sure you want to delete this plan?"
                    onConfirm={() => onDelete(plan)}
                    okText="Yes"
                    cancelText="No"
                    key="delete"
                >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                        Delete
                    </Button>
                </Popconfirm>
            ]}
        >
            <div className="flex flex-col gap-4">
                <div className="text-gray-600">
                    <span className="font-medium">Duration:</span> {formatDuration(plan.durationMonths)}
                </div>

                {plan.description && (
                    <div className="text-gray-600 line-clamp-2">
                        {plan.description}
                    </div>
                )}

                <div>
                    {/* Base Price + Class Price Breakdown (Optional, can be added if needed) */}
                    {/* <div className="text-xs text-gray-400 mb-1">
             Base: {formatCurrency(plan.price)} + Classes: {formatCurrency(classTotal)}
           </div> */}
                    <div className="font-medium mb-2">Included Classes:</div>
                    {renderClasses()}
                </div>
            </div>
        </Card>
    );
}
