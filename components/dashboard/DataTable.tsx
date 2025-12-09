'use client';

import React, { useMemo } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Button from '@/components/shared/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, index?: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps) {
  // Convert custom column format to Ant Design column format
  const antdColumns: ColumnsType<any> = useMemo(() => {
    const convertedColumns: ColumnsType<any> = columns.map((col) => ({
      title: col.label,
      dataIndex: col.key,
      key: col.key,
      render: (value: any, record: any, index: number) => {
        if (col.render) {
          return col.render(value, record, index);
        }
        return value;
      },
    }));

    // Add Actions column if edit or delete handlers are provided
    if (onEdit || onDelete) {
      convertedColumns.push({
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (_: any, record: any) => (
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', justifyContent: 'center' }}>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(record)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: 'var(--spacing-sm)',
                  minWidth: 'auto'
                }}
                title="Edit"
              >
                <FaEdit />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(record)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: 'var(--spacing-sm)',
                  minWidth: 'auto'
                }}
                title="Delete"
              >
                <FaTrash />
              </Button>
            )}
          </div>
        ),
      });
    }

    return convertedColumns;
  }, [columns, onEdit, onDelete]);

  return (
    <div style={{ 
      background: 'var(--color-white)', 
      padding: 'var(--spacing-lg)', 
      borderRadius: 'var(--radius-lg)', 
      boxShadow: 'var(--shadow-md)' 
    }}>
      <Table
        columns={antdColumns}
        dataSource={data.map((item, index) => ({ ...item, key: item.id || index }))}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
