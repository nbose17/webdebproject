'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Class } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import DataTable from '@/components/dashboard/DataTable';
import ClassForm from '@/components/dashboard/ClassForm';
import Button from '@/components/shared/Button';
import { FaCalendarAlt } from 'react-icons/fa';
import { Skeleton, Alert, message } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { GET_CLASSES, CREATE_CLASS, UPDATE_CLASS, DELETE_CLASS } from '@/graphql/queries/admin';

export default function ClassesPage() {
  const { user } = useAuth();
  const gymId = user?.gymId;
  
  const { data, loading, error, refetch } = useQuery(GET_CLASSES, {
    variables: { gymId },
    skip: !gymId,
    fetchPolicy: 'network-only',
  });
  
  const [createClass] = useMutation(CREATE_CLASS, {
    onCompleted: () => {
      message.success('Class created successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to create class: ${error.message}`);
    },
  });
  
  const [updateClass] = useMutation(UPDATE_CLASS, {
    onCompleted: () => {
      message.success('Class updated successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to update class: ${error.message}`);
    },
  });
  
  const [deleteClass] = useMutation(DELETE_CLASS, {
    onCompleted: () => {
      message.success('Class deleted successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to delete class: ${error.message}`);
    },
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  
  const classes = data?.classes || [];

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

  const handleDelete = async (classItem: Class) => {
    if (!gymId) return;
    
    await deleteClass({
      variables: {
        id: classItem.id,
        gymId,
      },
    });
  };

  const handleSubmit = async (classData: Omit<Class, 'id'>) => {
    if (!gymId) return;
    
    if (editingClass) {
      await updateClass({
        variables: {
          id: editingClass.id,
          gymId,
          ...classData,
        },
      });
    } else {
      await createClass({
        variables: {
          gymId,
          ...classData,
        },
      });
    }
    setIsFormOpen(false);
    setEditingClass(null);
  };
  
  if (!gymId) {
    return (
      <div>
        <Alert
          message="No Gym Associated"
          description="You need to be associated with a gym to manage classes."
          type="warning"
          showIcon
        />
      </div>
    );
  }
  
  if (loading) {
    return (
      <div>
        <div className="dashboard-page-header">
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaCalendarAlt />
            </span>
            Classes
          </h1>
        </div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Alert
          message="Error Loading Classes"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

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




