'use client';

import { useState } from 'react';
import { CMSItem } from '@/lib/types';
import { mockCMSItems } from '@/lib/constants';
import DataTable from '@/components/dashboard/DataTable';
import CMSForm from '@/components/dashboard/CMSForm';
import { FaPalette } from 'react-icons/fa';

export default function CMSPage() {
  const [items, setItems] = useState<CMSItem[]>(mockCMSItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSItem | null>(null);

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index: number) => index + 1 },
    { key: 'name', label: 'Name' },
  ];

  const handleEdit = (item: CMSItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSubmit = (item: CMSItem) => {
    setItems(
      items.map((i) => (i.id === item.id ? item : i))
    );
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">
          <span className="dashboard-page-title-icon">
            <FaPalette />
          </span>
          CMS / Branding
        </h1>
      </div>
      <DataTable
        columns={columns}
        data={items}
        onEdit={handleEdit}
      />
      <CMSForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        item={editingItem}
      />
    </div>
  );
}


