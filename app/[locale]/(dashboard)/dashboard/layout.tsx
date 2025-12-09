'use client';

import { ConfigProvider } from 'antd';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4CAF50',
          colorPrimaryHover: '#45a049',
          colorPrimaryActive: '#45a049',
          borderRadius: 8,
        },
        components: {
          Select: {
            controlItemBgActive: '#e8f5e9',
            optionSelectedBg: '#e8f5e9',
          },
          Input: {
            activeBorderColor: '#4CAF50',
            hoverBorderColor: '#4CAF50',
          },
          Table: {
            headerBg: '#F5F5F5',
            headerColor: '#2D2D2D',
            rowHoverBg: '#f0f9f0',
            borderColor: '#E0E0E0',
          },
          Pagination: {
            itemActiveBg: '#4CAF50',
            itemActiveBgDisabled: '#4CAF50',
          },
        },
      }}
    >
      <ProtectedRoute>
        <div className="dashboard-container">
          <Sidebar />
          <div className="dashboard-content-wrapper">
            <TopBar />
            <main className="dashboard-main">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </ConfigProvider>
  );
}

