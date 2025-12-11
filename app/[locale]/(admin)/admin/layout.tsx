'use client';

import { ConfigProvider } from 'antd';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { CustomApolloProvider } from '@/components/providers/ApolloProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomApolloProvider>
      <AdminAuthProvider>
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
        <AdminProtectedRoute>
          <div className="dashboard-container">
            <AdminSidebar />
            <div className="dashboard-content-wrapper">
              <AdminTopBar />
              <main className="dashboard-main">{children}</main>
            </div>
          </div>
        </AdminProtectedRoute>
      </ConfigProvider>
      </AdminAuthProvider>
    </CustomApolloProvider>
  );
}

