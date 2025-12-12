'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { Branch } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import { Select, Skeleton } from 'antd';
import { useAuth } from '@/hooks/useAuth';

import { GET_USERS } from '@/graphql/queries/admin';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

interface BranchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (branch: any) => void;
  branch?: Branch | null;
}

export default function BranchForm({
  isOpen,
  onClose,
  onSubmit,

  branch,
}: BranchFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const gymId = user?.gymId;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [managerId, setManagerId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Fetch gym managers for manager select
  const { data: usersData, loading: usersLoading } = useQuery<{ users: any[] }>(GET_USERS, {
    variables: {
      role: 'GYM_MANAGER',
      gymId: gymId,
      isActive: true
    },
    skip: !gymId || !isOpen,
    fetchPolicy: 'cache-and-network',
  });

  const managers = usersData?.users || [];

  useEffect(() => {
    if (branch) {
      setName(branch.name);
      setAddress(branch.address);
      setPhone(branch.phone);
      setEmail(branch.email);
      setManagerId(branch.managerId);
      setStatus(branch.status);
    } else {
      setName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setManagerId(undefined);
      setStatus('active');
    }
  }, [branch, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      address,
      phone,
      email,
      managerId: managerId || null,
      status,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={branch ? t('branches.edit') : t('branches.add')}>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <Input
          label={t('branches.fields.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label={t('branches.fields.address')}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Input
          label={t('branches.fields.phone')}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          label={t('branches.fields.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="input-group">
          <label className="input-label">{t('branches.fields.manager')} ({t('common.optional')})</label>
          {usersLoading ? (
            <Skeleton.Input active style={{ width: '100%', height: '40px' }} />
          ) : (
            <Select
              value={managerId || undefined}
              onChange={(value) => setManagerId(value || undefined)}
              placeholder={t('forms.placeholders.selectManager')}
              allowClear
              style={{ width: '100%' }}
            >
              {managers.map((manager: any) => (
                <Option key={manager.id} value={manager.id}>
                  {manager.name} ({manager.email})
                </Option>
              ))}
            </Select>
          )}
        </div>
        <div className="input-group">
          <label className="input-label">{t('branches.fields.status')}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            className="input"
            required
          >
            <option value="active">{t('dashboard.common.status.active')}</option>
            <option value="inactive">{t('dashboard.common.status.inactive')}</option>
          </select>
        </div>
        <div className="dashboard-form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {branch ? t('common.update') : t('dashboard.common.actions.add')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}



