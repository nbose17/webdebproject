'use client';

import React from 'react';
import Button from '@/components/shared/Button';
import styles from './DataTable.module.css';

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
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((column) => (
              <th key={column.key} className={styles.headerCell}>
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className={styles.headerCell}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index} className={styles.row}>
              {columns.map((column) => (
                <td key={column.key} className={styles.cell}>
                  {column.render
                    ? column.render(row[column.key], row, index)
                    : row[column.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className={styles.cell}>
                  <div className={styles.actions}>
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(row)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(row)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

