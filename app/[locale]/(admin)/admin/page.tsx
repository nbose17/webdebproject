'use client';

import { Card, Row, Col, Statistic, Progress, List, Tag, Button } from 'antd';
import { 
  FaHome,
  FaDumbbell, 
  FaUsers, 
  FaCreditCard, 
  FaChartLine,
  FaExclamationTriangle,
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';
import { usePermissions } from '@/hooks/usePermissions';
import { mockAdminGyms, mockGymUsers } from '@/lib/constants';

export default function AdminDashboard() {
  const { currentUser, isAdmin } = usePermissions();

  // Calculate statistics from mock data
  const totalGyms = mockAdminGyms.length;
  const activeGyms = mockAdminGyms.filter(gym => gym.subscriptionStatus === 'active').length;
  const totalUsers = mockGymUsers.length;
  const activeUsers = mockGymUsers.filter(user => user.isActive).length;
  const totalRevenue = 45280; // Mock revenue
  const monthlyGrowth = 12.5; // Mock growth percentage

  // Recent activities (mock data)
  const recentActivities = [
    {
      id: '1',
      action: 'New gym registered',
      details: 'FITNESS GYM - Downtown completed registration',
      time: '2 hours ago',
      type: 'success',
      icon: <FaCheckCircle style={{ color: '#52c41a' }} />
    },
    {
      id: '2', 
      action: 'Payment overdue',
      details: 'FITNESS GYM - Uptown payment is 3 days overdue',
      time: '5 hours ago',
      type: 'warning',
      icon: <FaExclamationTriangle style={{ color: '#faad14' }} />
    },
    {
      id: '3',
      action: 'User created',
      details: 'New trainer added to FITNESS GYM - Downtown',
      time: '1 day ago', 
      type: 'info',
      icon: <FaUsers style={{ color: '#4CAF50' }} />
    },
    {
      id: '4',
      action: 'Subscription expired',
      details: 'FITNESS GYM - Eastside subscription needs renewal',
      time: '2 days ago',
      type: 'error',
      icon: <FaTimesCircle style={{ color: '#ff4d4f' }} />
    }
  ];

  // System alerts (mock data)
  const systemAlerts = [
    {
      id: '1',
      title: 'Server maintenance scheduled',
      message: 'Planned maintenance window: Dec 15, 2024 2:00 AM - 4:00 AM UTC',
      type: 'info',
      priority: 'medium'
    },
    {
      id: '2', 
      title: 'Payment gateway update',
      message: 'New payment features will be deployed next week',
      type: 'success',
      priority: 'low'
    },
    {
      id: '3',
      title: 'Security patch required',
      message: 'Critical security update available for admin panel',
      type: 'error',
      priority: 'high'
    }
  ];

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaHome />
            </span>
            Admin Dashboard
          </h1>
          <p className="dashboard-page-subtitle">Welcome back, {currentUser?.name || 'Admin'}! Here's what's happening with your FitConnect network today.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Gyms"
              value={totalGyms}
              prefix={<FaDumbbell style={{ color: '#4CAF50' }} />}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  +2 this month
                </div>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={activeUsers}
              prefix={<FaUsers style={{ color: '#52c41a' }} />}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  {((activeUsers / totalUsers) * 100).toFixed(1)}% active
                </div>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Revenue"
              value={totalRevenue}
              precision={0}
              prefix="$"
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  +{monthlyGrowth}%
                </div>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <FaChartLine style={{ color: '#722ed1', marginRight: '8px' }} />
              <span style={{ fontWeight: '500' }}>System Health</span>
            </div>
            <Progress 
              percent={95} 
              size="small" 
              status="active"
              strokeColor="#52c41a"
            />
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
              All systems operational
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaBell style={{ marginRight: '8px', color: '#4CAF50' }} />
                Recent Activities
              </div>
            }
            extra={<Button type="link">View All</Button>}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.action}</span>
                        <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{item.time}</span>
                      </div>
                    }
                    description={item.details}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* System Alerts */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaExclamationTriangle style={{ marginRight: '8px', color: '#faad14' }} />
                System Alerts
              </div>
            }
            extra={<Button type="link">Manage</Button>}
          >
            <List
              itemLayout="vertical"
              size="small"
              dataSource={systemAlerts}
              renderItem={(alert) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '500', 
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {alert.title}
                        <Tag 
                          color={
                            alert.priority === 'high' ? 'red' : 
                            alert.priority === 'medium' ? 'orange' : 'blue'
                          }
                          style={{ marginLeft: '8px' }}
                        >
                          {alert.priority}
                        </Tag>
                      </div>
                      <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                        {alert.message}
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card 
        title="Quick Actions" 
        style={{ marginTop: 'var(--spacing-2xl)' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={6}>
            <Button 
              type="primary" 
              block 
              size="large"
              icon={<FaDumbbell />}
              onClick={() => window.location.href = `/admin/gyms`}
            >
              Manage Gyms
            </Button>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Button 
              block 
              size="large"
              icon={<FaCreditCard />}
              onClick={() => window.location.href = `/admin/payments`}
            >
              Payment Settings
            </Button>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Button 
              block 
              size="large"
              icon={<FaChartLine />}
              onClick={() => window.location.href = `/admin/analytics`}
            >
              View Analytics
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
