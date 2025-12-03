'use client';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';
import '@/styles/dashboard.css';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className={styles.dashboardContainer}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}

