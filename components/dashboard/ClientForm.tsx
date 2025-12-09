'use client';

import { useState, useEffect, useRef } from 'react';
import { Client } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id'>) => void;
  client?: Client | null;
}

export default function ClientForm({
  isOpen,
  onClose,
  onSubmit,
  client,
}: ClientFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipType, setMembershipType] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [image, setImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [subscriptionEndDate, setSubscriptionEndDate] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setPhone(client.phone);
      setMembershipType(client.membershipType);
      setJoinDate(client.joinDate);
      setStatus(client.status);
      setImage(client.image || '');
      setImagePreview(client.image || '');
      setSubscriptionEndDate(client.subscriptionEndDate || '');
      setContractStartDate(client.contractStartDate || '');
      setContractEndDate(client.contractEndDate || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setMembershipType('');
      setJoinDate(new Date().toISOString().split('T')[0]);
      setStatus('active');
      setImage('');
      setImagePreview('');
      setSubscriptionEndDate('');
      setContractStartDate('');
      setContractEndDate('');
    }
  }, [client, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImage(result); // Store as data URL for now
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImage(url);
    setImagePreview(url);
  };

  const handleRemoveImage = () => {
    setImage('');
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      phone,
      membershipType,
      joinDate,
      status,
      image: image || undefined,
      subscriptionEndDate: subscriptionEndDate || undefined,
      contractStartDate: contractStartDate || undefined,
      contractEndDate: contractEndDate || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? 'Edit Client' : 'Add Client'}>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          label="Membership Type"
          value={membershipType}
          onChange={(e) => setMembershipType(e.target.value)}
          required
          placeholder="e.g., Premium, Basic"
        />
        <Input
          label="Join Date"
          type="date"
          value={joinDate}
          onChange={(e) => setJoinDate(e.target.value)}
          required
        />
        <Input
          label="Subscription End Date (Optional)"
          type="date"
          value={subscriptionEndDate}
          onChange={(e) => setSubscriptionEndDate(e.target.value)}
        />
        <Input
          label="Contract Start Date (Optional)"
          type="date"
          value={contractStartDate}
          onChange={(e) => setContractStartDate(e.target.value)}
        />
        <Input
          label="Contract End Date (Optional)"
          type="date"
          value={contractEndDate}
          onChange={(e) => setContractEndDate(e.target.value)}
        />
        <div className="dashboard-form-image-upload-group">
          <label className="input-label">Client Image (Optional)</label>
          <div className="dashboard-form-image-upload-container">
            {imagePreview ? (
              <div className="dashboard-form-image-preview-container">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="dashboard-form-image-preview"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="dashboard-form-remove-image-button"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="dashboard-form-image-placeholder">
                <span>No image selected</span>
              </div>
            )}
            <div className="dashboard-form-image-input-container">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="dashboard-form-file-input"
                id="client-image-upload"
              />
              <label htmlFor="client-image-upload" className="dashboard-form-file-input-label">
                Choose File
              </label>
              <span className="dashboard-form-or-text">or</span>
              <Input
                type="text"
                placeholder="Enter image URL"
                value={image && !image.startsWith('data:') ? image : ''}
                onChange={handleImageUrlChange}
                className="dashboard-form-url-input"
              />
            </div>
          </div>
        </div>
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
            {client ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

