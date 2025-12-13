'use client';

import { FaHome, FaUsers, FaMoneyBillWave, FaClipboardList, FaDumbbell } from 'react-icons/fa';
import { useQuery } from '@apollo/client/react';
import { GET_DASHBOARD_STATS } from '@/graphql/queries/admin';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spin, Alert } from 'antd';
import StatsCard from '@/components/dashboard/StatsCard';
import PlanDistributionChart from '@/components/dashboard/PlanDistributionChart';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const gymId = user?.gymId;

  // Only fetch if associated with a gym
  const shouldFetch = !!gymId;

  const { data, loading, error } = useQuery<{ dashboardStats: any }>(GET_DASHBOARD_STATS, {
    variables: { gymId },
    skip: !shouldFetch,
    fetchPolicy: 'network-only' // Ensure fresh data on navigation
  });

  const stats = data?.dashboardStats;

  if (!shouldFetch) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <div className="dashboard-page-header">
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaHome />
            </span>
            {t('dashboard.sidebar.dashboard')}
          </h1>
        </div>
        <Alert
          message={t('dashboard.alerts.noGym')}
          description={t('dashboard.alerts.noGymDesc', { feature: 'dashboard stats' })}
          type="warning"
          showIcon
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <Alert
          message="Error loading dashboard stats"
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
        <div>
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaHome />
            </span>
            {t('dashboard.sidebar.dashboard')}
          </h1>
          <p className="dashboard-page-subtitle">
            {t('home.popularGymsAt')} {user?.gym?.name || 'Your Gym'}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'var(--spacing-lg)' }}>
        {/* Key Metrics Row */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title={t('dashboard.common.stats.clients')}
              value={stats?.totalClients || 0}
              icon={FaUsers}
              color="#4e73df"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title={t('dashboard.common.stats.revenue')}
              value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
              icon={FaMoneyBillWave}
              color="#00B96B" // Green
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title={t('dashboard.common.stats.activePlans')}
              value={stats?.activePlans || 0}
              icon={FaClipboardList}
              color="#f6c23e" // Yellow
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title={t('dashboard.common.stats.activeClasses')}
              value={stats?.activeClasses || 0}
              icon={FaDumbbell}
              color="#36b9cc" // Cyan
            />
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[24, 24]} style={{ marginTop: 'var(--spacing-lg)' }}>
          <Col xs={24} lg={16}>
            <PlanDistributionChart data={stats?.planDistribution || []} />
          </Col>
          <Col xs={24} lg={8}>
            {/* Placeholder for future activity log or other stat */}
            <div style={{
              background: 'var(--color-bg-primary)',
              height: '100%',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed var(--color-border)'
            }}>
              <p style={{ color: 'var(--text-color-secondary)' }}>More insights coming soon...</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
