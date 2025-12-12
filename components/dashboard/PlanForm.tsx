'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { Plan, Class } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import { GET_CLASSES } from '@/graphql/queries/admin';
import { useAuth } from '@/hooks/useAuth';

import { Checkbox, Skeleton, Empty } from 'antd';
import { useTranslation } from 'react-i18next'; // Added import

interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: Omit<Plan, 'id'> & { includedClassIds?: string[] }) => void;
  plan?: Plan | null;
}

export default function PlanForm({
  isOpen,
  onClose,
  onSubmit,
  plan,
}: PlanFormProps) {
  const { t } = useTranslation(); // Added hook
  const { user } = useAuth();
  const gymId = user?.gymId;

  const [name, setName] = useState('');
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');
  const [price, setPrice] = useState('');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

  // Fetch classes for selection
  const { data: classesData, loading: classesLoading } = useQuery<{ classes: Class[] }>(GET_CLASSES, {
    variables: { gymId },
    skip: !gymId || !isOpen,
    fetchPolicy: 'cache-and-network',
  });

  const availableClasses: Class[] = classesData?.classes || [];

  useEffect(() => {
    if (plan) {
      setName(plan.name);

      // Convert total months to years and months
      const totalMonths = plan.durationMonths;
      const calcYears = Math.floor(totalMonths / 12);
      const calcMonths = totalMonths % 12;

      setYears(calcYears.toString());
      setMonths(calcMonths.toString());
      setPrice(plan.price.toString());

      // Set selected classes if editing
      if (plan.includedClasses) {
        setSelectedClassIds(plan.includedClasses.map(c => c.id));
      } else {
        setSelectedClassIds([]);
      }
    } else {
      setName('');
      setYears('');
      setMonths('');
      setPrice('');
      setSelectedClassIds([]);
    }
  }, [plan, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate total duration in months
    const durationMonths = (parseInt(years || '0') * 12) + parseInt(months || '0');

    if (durationMonths <= 0) {
      alert('Total duration must be at least 1 month');
      return;
    }

    onSubmit({
      name,
      durationMonths,
      price: parseFloat(price),
      includedClassIds: selectedClassIds,
    });
    onClose();
  };

  const handleClassSelectionChange = (checkedValues: any[]) => {
    setSelectedClassIds(checkedValues as string[]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={plan ? t('plans.edit') : t('plans.add')}>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <Input
          label={t('plans.fields.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Input
              label={t('forms.labels.years')}
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              label={t('forms.labels.months')}
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="0"
              min="0"
              max="11"
            />
          </div>
        </div>

        <Input
          label={t('plans.fields.price')}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('plans.fields.includedClasses')}</label>
          <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
            {classesLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : availableClasses.length === 0 ? (
              <Empty description={t('plans.fields.noClasses')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Checkbox.Group
                style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}
                value={selectedClassIds}
                onChange={handleClassSelectionChange}
              >
                {availableClasses.map((cls) => (
                  <Checkbox key={cls.id} value={cls.id}>
                    {cls.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            )}
          </div>
        </div>

        <div className="dashboard-form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {plan ? t('common.update') : t('dashboard.common.actions.add')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}





