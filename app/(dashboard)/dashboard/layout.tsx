'use client';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

