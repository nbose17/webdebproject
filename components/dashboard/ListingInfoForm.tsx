'use client';

import { useState, useEffect } from 'react';
import { Gym } from '@/lib/types';
import Input from '@/components/shared/Input';
import styles from './ListingInfoForm.module.css';

interface ListingInfoFormProps {
  data: Partial<Gym>;
  onChange: (data: Partial<Gym>) => void;
}

export default function ListingInfoForm({ data, onChange }: ListingInfoFormProps) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    location: data.location || '',
    image: data.image || '',
    description: data.description || '',
  });

  useEffect(() => {
    setFormData({
      name: data.name || '',
      location: data.location || '',
      image: data.image || '',
      description: data.description || '',
    });
  }, [data]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      // For now, we'll use a local URL
      const imageUrl = URL.createObjectURL(file);
      handleChange('image', imageUrl);
    }
  };

  return (
    <div className={styles.container}>
      <Input
        label="Gym Name *"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Enter your gym name"
        required
      />

      <Input
        label="Location *"
        value={formData.location}
        onChange={(e) => handleChange('location', e.target.value)}
        placeholder="e.g., Uralskaya, EKB"
        required
      />

      <div className={styles.imageUpload}>
        <label className={styles.imageLabel}>Gym Image *</label>
        <div className={styles.imageUploadArea}>
          {formData.image ? (
            <div className={styles.imagePreview}>
              <img src={formData.image} alt="Gym preview" />
              <button
                type="button"
                onClick={() => handleChange('image', '')}
                className={styles.removeImage}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className={styles.uploadPlaceholder}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
                id="gym-image-upload"
              />
              <label htmlFor="gym-image-upload" className={styles.uploadLabel}>
                <span>+</span>
                <span>Click to upload gym image</span>
                <span className={styles.uploadHint}>Recommended: 300x200px</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <Input
        label="Description (Optional)"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Brief description of your gym"
        multiline
      />
    </div>
  );
}

