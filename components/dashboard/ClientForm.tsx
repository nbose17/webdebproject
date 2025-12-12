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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
        alert(t('forms.validation.imageType'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('forms.validation.imageSize'));
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
    <Modal isOpen={isOpen} onClose={onClose} title={client ? t('clients.edit') : t('clients.add')}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="dashboard-form"
        initialValues={{ status: 'active' }}
      >
        <Form.Item
          name="name"
          label={t('clients.fields.name')}
          rules={[{ required: true, message: t('forms.validation.required') }]}
        >
          <AntInput placeholder={t('forms.placeholders.enterName')} />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('clients.fields.email')}
          rules={[
            { required: true, message: t('forms.validation.required') },
            { type: 'email', message: t('forms.validation.email') }
          ]}
        >
          <AntInput placeholder={t('forms.placeholders.enterEmail')} />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t('clients.fields.phone')}
          rules={[{ required: true, message: t('forms.validation.required') }]}
        >
          <AntInput placeholder={t('forms.placeholders.enterPhone')} />
        </Form.Item>

        <Form.Item
          name="membershipType"
          label={t('clients.fields.membershipType')}
          rules={[{ required: true, message: t('forms.validation.required') }]}
        >
          <Select placeholder={t('forms.placeholders.select')}>
            {plansData?.plans.map((plan) => (
              <Option key={plan.id} value={plan.name}>
                {plan.name} ({plan.durationMonths} months - ${plan.price})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="joinDate"
          label={t('clients.fields.joinDate')}
          rules={[{ required: true, message: t('forms.validation.required') }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="contractStartDate"
            label={t('forms.labels.contractStart')}
            rules={[{ required: true, message: t('forms.validation.required') }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="contractEndDate"
            label={t('forms.labels.contractEnd')}
            help="Calculated automatically based on plan"
          >
            <DatePicker style={{ width: '100%' }} disabled />
          </Form.Item>
        </div>

        <Form.Item label={t('forms.labels.image')}>
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
                <span>{t('forms.labels.image')}</span>
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
                {t('forms.labels.chooseFile')}
              </label>
              <span className="dashboard-form-or-text">{t('forms.labels.or')}</span>
              <AntInput
                placeholder={t('forms.placeholders.enterUrl')}
                value={image && !image.startsWith('data:') ? image : ''}
                onChange={handleImageUrlChange}
                className="dashboard-form-url-input"
              />
            </div>
          </div>
        </Form.Item>

        <Form.Item
          name="status"
          label={t('clients.fields.status')}
          rules={[{ required: true, message: t('forms.validation.required') }]}
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <div className="dashboard-form-actions">
          <AntButton onClick={onClose} style={{ marginRight: '8px' }}>
            {t('common.cancel')}
          </AntButton>
          <AntButton type="primary" htmlType="submit">
            {client ? t('common.update') : t('dashboard.common.actions.add')}
          </AntButton>
        </div>
      </Form>
    </Modal>
  );
}

