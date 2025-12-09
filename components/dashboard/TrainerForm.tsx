'use client';

import { useState, useEffect, useRef } from 'react';
import { Trainer } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';

interface TrainerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trainer: Omit<Trainer, 'id'>) => void;
  trainer?: Trainer | null;
}

export default function TrainerForm({
  isOpen,
  onClose,
  onSubmit,
  trainer,
}: TrainerFormProps) {
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [image, setImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (trainer) {
      setName(trainer.name);
      setExperience(trainer.experience);
      setImage(trainer.image);
      setImagePreview(trainer.image);
    } else {
      setName('');
      setExperience('');
      setImage('');
      setImagePreview('');
    }
  }, [trainer, isOpen]);

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
      experience,
      image: image || '/images/trainer-placeholder.jpg',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={trainer ? 'Edit Trainer' : 'Add Trainer'}>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
          placeholder="e.g., 3+ Years"
        />
        
        <div className="dashboard-form-image-upload-group">
          <label className="input-label">Profile Image</label>
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
                id="trainer-image-upload"
              />
              <label htmlFor="trainer-image-upload" className="dashboard-form-file-input-label">
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

        <div className="dashboard-form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {trainer ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}




