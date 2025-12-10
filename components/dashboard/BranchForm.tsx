'use client';

import { useState, useEffect } from 'react';
import { Branch } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';

interface BranchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (branch: Omit<Branch, 'id'>) => void;
  branch?: Branch | null;
}

export default function BranchForm({
  isOpen,
  onClose,
  onSubmit,
  branch,
}: BranchFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [manager, setManager] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    if (branch) {
      setName(branch.name);
      setAddress(branch.address);
      setPhone(branch.phone);
      setEmail(branch.email);
      setManager(branch.manager || '');
      setStatus(branch.status);
    } else {
      setName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setManager('');
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
      manager: manager || undefined,
      status,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={branch ? 'Edit Branch' : 'Add Branch'}>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <Input
          label="Branch Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Manager (Optional)"
          value={manager}
          onChange={(e) => setManager(e.target.value)}
        />
        <div className="input-group">
          <label className="input-label">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            className="input"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="dashboard-form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {branch ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


