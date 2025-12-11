'use client';

import { Typography, Row, Col, Card, Statistic } from 'antd';
import { FaUserShield, FaUsers, FaCog, FaShieldAlt } from 'react-icons/fa';
import RoleManager from '@/components/admin/RoleManager';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { mockGymUsers } from '@/lib/constants';
import { UserRole } from '@/lib/types';

const { Title, Text } = Typography;

export default function RolesPage() {
  // Calculate role statistics
  const totalUsers = mockGymUsers.length;
  const adminUsers = mockGymUsers.filter(u => u.role === UserRole.FITCONNECT_ADMIN).length;
  const ownerUsers = mockGymUsers.filter(u => u.role === UserRole.GYM_OWNER).length;
  const managerUsers = mockGymUsers.filter(u => u.role === UserRole.GYM_MANAGER).length;
  const trainerUsers = mockGymUsers.filter(u => u.role === UserRole.GYM_TRAINER).length;
  const staffUsers = mockGymUsers.filter(u => u.role === UserRole.GYM_RECEPTIONIST).length;

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'settings', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaUserShield />
              </span>
              Role & Permission Management
            </h1>
            <p className="dashboard-page-subtitle">Manage system roles, custom roles, and permission sets for FitConnect platform</p>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Col xs={24} sm={8} md={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={totalUsers}
                prefix={<FaUsers style={{ color: '#4CAF50' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card>
              <Statistic
                title="Admin Users"
                value={adminUsers}
                prefix={<FaShieldAlt style={{ color: '#ff4d4f' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card>
              <Statistic
                title="Gym Owners"
                value={ownerUsers}
                prefix={<FaUserShield style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card>
              <Statistic
                title="Staff Members"
                value={managerUsers + trainerUsers + staffUsers}
                prefix={<FaUsers style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Role Distribution Card */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Card title="Role Distribution" extra={<FaCog />}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#ff4d4f' }}>
                      {adminUsers}
                    </div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      FitConnect Admins
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#722ed1' }}>
                      {ownerUsers}
                    </div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      Gym Owners
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#4CAF50' }}>
                      {managerUsers}
                    </div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      Managers
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#52c41a' }}>
                      {trainerUsers}
                    </div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      Trainers
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#fa8c16' }}>
                      {staffUsers}
                    </div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      Receptionists
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#13c2c2' }}>
                      1
                    </div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      Custom Roles
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Role Manager Component */}
        <RoleManager />
      </div>
    </AdminProtectedRoute>
  );
}

