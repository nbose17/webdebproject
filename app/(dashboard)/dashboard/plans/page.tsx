'use client';

import { useState } from 'react';
import { Plan } from '@/lib/types';
import { mockPlans } from '@/lib/constants';
import { generateId, formatCurrency } from '@/lib/utils';
import DataTable from '@/components/dashboard/DataTable';
import PlanForm from '@/components/dashboard/PlanForm';
import Button from '@/components/shared/Button';
import { FaCreditCard } from 'react-icons/fa';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index: number) => index + 1 },
    { key: 'name', label: 'Name' },
    { key: 'duration', label: 'Duration' },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => formatCurrency(value),
    },
  ];

  const handleAdd = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleDelete = (plan: Plan) => {
    if (confirm(`Are you sure you want to delete "${plan.name}"?`)) {
      setPlans(plans.filter((p) => p.id !== plan.id));
    }
  };

  const handleSubmit = (planData: Omit<Plan, 'id'>) => {
    if (editingPlan) {
      setPlans(
        plans.map((p) =>
          p.id === editingPlan.id ? { ...planData, id: editingPlan.id } : p
        )
      );
    } else {
      setPlans([...plans, { ...planData, id: generateId() }]);
    }
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">
          <span className="dashboard-page-title-icon">
            <FaCreditCard />
          </span>
          Plans (Monthly / Yearly)
        </h1>
        <Button variant="primary" onClick={handleAdd}>
          Add Plan
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={plans}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PlanForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={handleSubmit}
        plan={editingPlan}
      />
    </div>
  );
}

