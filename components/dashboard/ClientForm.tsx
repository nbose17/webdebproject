'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client/react';
import { Client, Plan } from '@/lib/types';
import { Form, Input as AntInput, Select, DatePicker, Button as AntButton, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Modal from '@/components/shared/Modal';
import { useAuth } from '@/hooks/useAuth';
import { GET_PLANS } from '@/graphql/queries/admin';
import dayjs from 'dayjs';

const { Option } = Select;

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
  const { user } = useAuth();
  const gymId = user?.gymId;

  const { data: plansData } = useQuery<{ plans: Plan[] }>(GET_PLANS, {
    variables: { gymId },
    skip: !gymId,
  });

  // Form state
  const [form] = Form.useForm();
  const [image, setImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Watch for changes to auto-calculate dates
  const selectedPlanName = Form.useWatch('membershipType', form);
  const contractStartDate = Form.useWatch('contractStartDate', form);

  // Initialize form when client changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (client) {
        form.setFieldsValue({
          name: client.name,
          email: client.email,
          phone: client.phone,
          membershipType: client.membershipType,
          joinDate: client.joinDate ? dayjs(client.joinDate) : dayjs(),
          contractStartDate: client.contractStartDate ? dayjs(client.contractStartDate) : dayjs(),
          contractEndDate: client.contractEndDate ? dayjs(client.contractEndDate) : null,
          status: client.status,
        });
        setImage(client.image || '');
        setImagePreview(client.image || '');
      } else {
        form.resetFields();
        form.setFieldsValue({
          joinDate: dayjs(),
          contractStartDate: dayjs(),
          status: 'active',
        });
        setImage('');
        setImagePreview('');
      }
    }
  }, [client, isOpen, form]);

  // Auto-calculate contract end date
  useEffect(() => {
    if (selectedPlanName && contractStartDate && plansData?.plans) {
      const selectedPlan = plansData.plans.find(p => p.name === selectedPlanName);
      if (selectedPlan) {
        // Calculate end date: start date + duration months
        const endDate = dayjs(contractStartDate).add(selectedPlan.durationMonths, 'month');
        form.setFieldValue('contractEndDate', endDate);
      }
    }
  }, [selectedPlanName, contractStartDate, plansData, form]);

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const contractEnd = values.contractEndDate ? values.contractEndDate.toISOString() : undefined;

      onSubmit({
        name: values.name,
        email: values.email,
        phone: values.phone,
        membershipType: values.membershipType,
        joinDate: values.joinDate.toISOString(),
        status: values.status,
        image: image || undefined,
        // Map contractEndDate to subscriptionEndDate as requested by logic, or keep them synced
        subscriptionEndDate: contractEnd,
        contractStartDate: values.contractStartDate ? values.contractStartDate.toISOString() : undefined,
        contractEndDate: contractEnd,
      });
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? 'Edit Client' : 'Add Client'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="dashboard-form"
        initialValues={{ status: 'active' }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter client name' }]}
        >
          <AntInput placeholder="Enter client name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <AntInput placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <AntInput placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="membershipType"
          label="Membership Plan"
          rules={[{ required: true, message: 'Please select a plan' }]}
        >
          <Select placeholder="Select a Plan">
            {plansData?.plans.map((plan) => (
              <Option key={plan.id} value={plan.name}>
                {plan.name} ({plan.durationMonths} months - ${plan.price})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="joinDate"
          label="Join Date"
          rules={[{ required: true, message: 'Please select join date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="contractStartDate"
            label="Contract Start Date"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="contractEndDate"
            label="Contract End Date"
            help="Calculated automatically based on plan"
          >
            <DatePicker style={{ width: '100%' }} disabled />
          </Form.Item>
        </div>

        <Form.Item label="Client Image (Optional)">
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
              <AntInput
                placeholder="Enter image URL"
                value={image && !image.startsWith('data:') ? image : ''}
                onChange={handleImageUrlChange}
                className="dashboard-form-url-input"
              />
            </div>
          </div>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <div className="dashboard-form-actions">
          <AntButton onClick={onClose} style={{ marginRight: '8px' }}>
            Cancel
          </AntButton>
          <AntButton type="primary" htmlType="submit">
            {client ? 'Update' : 'Add'}
          </AntButton>
        </div>
      </Form>
    </Modal>
  );
}

