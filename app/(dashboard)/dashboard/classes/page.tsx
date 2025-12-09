'use client';

import { useState } from 'react';
import { Class } from '@/lib/types';
import { mockClasses } from '@/lib/constants';
import { generateId, formatCurrency } from '@/lib/utils';
import DataTable from '@/components/dashboard/DataTable';
import ClassForm from '@/components/dashboard/ClassForm';
import Button from '@/components/shared/Button';
import { FaCalendarAlt } from 'react-icons/fa';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index: number) => index + 1 },
    { key: 'name', label: 'Name' },
    { key: 'duration', label: 'Duration' },
    { key: 'numberOfClasses', label: 'No of Classes' },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => formatCurrency(value),
    },
  ];

  const handleAdd = () => {
    setEditingClass(null);
    setIsFormOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setIsFormOpen(true);
  };

  const handleDelete = (classItem: Class) => {
    if (confirm(`Are you sure you want to delete "${classItem.name}"?`)) {
      setClasses(classes.filter((c) => c.id !== classItem.id));
    }
  };

  const handleSubmit = (classData: Omit<Class, 'id'>) => {
    if (editingClass) {
      setClasses(
        classes.map((c) =>
          c.id === editingClass.id ? { ...classData, id: editingClass.id } : c
        )
      );
    } else {
      setClasses([...classes, { ...classData, id: generateId() }]);
    }
    setIsFormOpen(false);
    setEditingClass(null);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">
          <span className="dashboard-page-title-icon">
            <FaCalendarAlt />
          </span>
          Classes
        </h1>
        <Button variant="primary" onClick={handleAdd}>
          Add Class
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={classes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ClassForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingClass(null);
        }}
        onSubmit={handleSubmit}
        classItem={editingClass}
      />
    </div>
  );
}




