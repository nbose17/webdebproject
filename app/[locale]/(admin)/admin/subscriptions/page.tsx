'use client';

import { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Typography,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  message,
  Tabs,
  Alert,
  Progress,
  List,
  Avatar,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  FaBell,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaPhone,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaPause,
  FaPlay,
  FaStop,
  FaEdit,
  FaEye,
  FaSms,
  FaWhatsapp
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { mockAdminGyms } from '@/lib/constants';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Subscription {
  id: string;
  gymId: string;
  gymName: string;
  plan: string;
  status: 'active' | 'suspended' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  renewalDate: string;
  monthlyFee: number;
  totalRevenue: number;
  paymentStatus: 'current' | 'overdue' | 'failed';
  lastPayment: string;
  nextBilling: string;
  autoRenew: boolean;
  branches: number;
  users: number;
}

interface Communication {
  id: string;
  gymId: string;
  gymName: string;
  type: 'email' | 'sms' | 'whatsapp' | 'phone';
  subject: string;
  content: string;
  status: 'sent' | 'pending' | 'failed' | 'delivered';
  sentAt: string;
  sentBy: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    gymId: '1',
    gymName: 'FITNESS GYM - Downtown',
    plan: 'Premium Business',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    renewalDate: '2024-12-01',
    monthlyFee: 299.99,
    totalRevenue: 2999.90,
    paymentStatus: 'current',
    lastPayment: '2024-11-01',
    nextBilling: '2024-12-01',
    autoRenew: true,
    branches: 3,
    users: 25
  },
  {
    id: 'sub-2',
    gymId: '2',
    gymName: 'FITNESS GYM - Uptown',
    plan: 'Standard Business',
    status: 'active',
    startDate: '2024-06-15',
    endDate: '2025-06-15',
    renewalDate: '2024-12-15',
    monthlyFee: 199.99,
    totalRevenue: 1199.94,
    paymentStatus: 'overdue',
    lastPayment: '2024-10-15',
    nextBilling: '2024-11-15',
    autoRenew: false,
    branches: 1,
    users: 8
  }
];

const mockCommunications: Communication[] = [
  {
    id: 'comm-1',
    gymId: '2',
    gymName: 'FITNESS GYM - Uptown',
    type: 'email',
    subject: 'Payment Overdue Reminder',
    content: 'Your monthly subscription payment is overdue. Please update your payment method.',
    status: 'delivered',
    sentAt: '2024-11-20T10:30:00Z',
    sentBy: 'admin@fitconnect.com'
  },
  {
    id: 'comm-2',
    gymId: '1',
    gymName: 'FITNESS GYM - Downtown',
    type: 'sms',
    subject: 'Subscription Renewal',
    content: 'Your subscription will renew in 7 days. $299.99 will be charged to your card ending in 1234.',
    status: 'sent',
    sentAt: '2024-11-24T14:15:00Z',
    sentBy: 'system@fitconnect.com'
  }
];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [communications, setCommunications] = useState<Communication[]>(mockCommunications);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [isCommModalVisible, setIsCommModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [commForm] = Form.useForm();

  // Apply filters
  const applyFilters = () => {
    let filtered = subscriptions;
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(sub =>
        sub.gymName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }
    
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(sub => sub.paymentStatus === paymentFilter);
    }
    
    setFilteredSubscriptions(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters();
  };

  const handleStatusChange = (subId: string, newStatus: Subscription['status']) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subId ? { ...sub, status: newStatus } : sub
    ));
    applyFilters();
    message.success(`Subscription ${newStatus}`);
  };

  const handleSendCommunication = () => {
    setIsCommModalVisible(true);
  };

  const handleCommSubmit = async (values: any) => {
    const newComm: Communication = {
      id: `comm-${Date.now()}`,
      gymId: selectedSubscription?.gymId || '',
      gymName: selectedSubscription?.gymName || '',
      type: values.type,
      subject: values.subject,
      content: values.content,
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentBy: 'admin@fitconnect.com'
    };
    
    setCommunications(prev => [newComm, ...prev]);
    setIsCommModalVisible(false);
    commForm.resetFields();
    message.success('Communication sent successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      case 'expired': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'current': return 'success';
      case 'overdue': return 'error';
      case 'failed': return 'error';
      default: return 'warning';
    }
  };

  const subscriptionColumns = [
    {
      title: 'Gym',
      key: 'gym',
      render: (sub: Subscription) => (
        <div>
          <div style={{ fontWeight: '500' }}>{sub.gymName}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {sub.branches} branches • {sub.users} users
          </div>
        </div>
      ),
    },
    {
      title: 'Plan',
      key: 'plan',
      render: (sub: Subscription) => (
        <div>
          <div style={{ fontWeight: '500' }}>{sub.plan}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            ${sub.monthlyFee}/month
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (sub: Subscription) => (
        <div>
          <Tag color={getStatusColor(sub.status)}>
            {sub.status.toUpperCase()}
          </Tag>
          <br />
          <Tag color={getPaymentColor(sub.paymentStatus)} size="small">
            {sub.paymentStatus.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Next Billing',
      key: 'billing',
      render: (sub: Subscription) => {
        const daysUntilBilling = Math.ceil(
          (new Date(sub.nextBilling).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return (
          <div>
            <div style={{ fontSize: '13px' }}>
              {new Date(sub.nextBilling).toLocaleDateString()}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: daysUntilBilling <= 7 ? '#ff4d4f' : '#8c8c8c' 
            }}>
              {daysUntilBilling > 0 ? `${daysUntilBilling} days` : 'Overdue'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Revenue',
      key: 'revenue',
      render: (sub: Subscription) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '500' }}>
            ${sub.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            Total
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (sub: Subscription) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" size="small" icon={<FaEye />} />
          </Tooltip>
          
          <Tooltip title="Send Communication">
            <Button 
              type="text" 
              size="small" 
              icon={<FaEnvelope />}
              onClick={() => {
                setSelectedSubscription(sub);
                setIsCommModalVisible(true);
              }}
            />
          </Tooltip>
          
          {sub.status === 'active' && (
            <Popconfirm
              title="Suspend subscription?"
              onConfirm={() => handleStatusChange(sub.id, 'suspended')}
            >
              <Button 
                type="text" 
                size="small" 
                icon={<FaPause />}
                danger
              />
            </Popconfirm>
          )}
          
          {sub.status === 'suspended' && (
            <Popconfirm
              title="Reactivate subscription?"
              onConfirm={() => handleStatusChange(sub.id, 'active')}
            >
              <Button 
                type="text" 
                size="small" 
                icon={<FaPlay />}
                style={{ color: '#52c41a' }}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Calculate statistics
  const totalSubs = subscriptions.length;
  const activeSubs = subscriptions.filter(s => s.status === 'active').length;
  const overdueSubs = subscriptions.filter(s => s.paymentStatus === 'overdue').length;
  const monthlyRevenue = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.monthlyFee, 0);

  const tabItems = [
    {
      key: 'overview',
      label: 'Subscription Overview',
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Search
                placeholder="Search subscriptions..."
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 250 }}
                enterButton={<FaSearch />}
              />
              
              <Select
                style={{ width: 120 }}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  applyFilters();
                }}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="suspended">Suspended</Option>
                <Option value="expired">Expired</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
              
              <Select
                style={{ width: 130 }}
                value={paymentFilter}
                onChange={(value) => {
                  setPaymentFilter(value);
                  applyFilters();
                }}
              >
                <Option value="all">All Payments</Option>
                <Option value="current">Current</Option>
                <Option value="overdue">Overdue</Option>
                <Option value="failed">Failed</Option>
              </Select>
            </div>
          </div>

          <Table
            columns={subscriptionColumns}
            dataSource={filteredSubscriptions}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} subscriptions`,
            }}
          />
        </div>
      ),
    },
    {
      key: 'communications',
      label: 'Communication Center',
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Title level={4} style={{ margin: 0 }}>Recent Communications</Title>
            <Button 
              type="primary"
              icon={<FaEnvelope />}
              onClick={handleSendCommunication}
            >
              Send Communication
            </Button>
          </div>

          <List
            itemLayout="horizontal"
            dataSource={communications}
            renderItem={(comm) => (
              <List.Item
                actions={[
                  <Tag key="status" color={comm.status === 'delivered' ? 'success' : 'processing'}>
                    {comm.status}
                  </Tag>,
                  <Text key="time" style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {new Date(comm.sentAt).toLocaleString()}
                  </Text>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={
                        comm.type === 'email' ? <FaEnvelope /> :
                        comm.type === 'sms' ? <FaSms /> :
                        comm.type === 'whatsapp' ? <FaWhatsapp /> :
                        <FaPhone />
                      }
                      style={{ 
                        backgroundColor: 
                          comm.type === 'email' ? '#4CAF50' :
                          comm.type === 'sms' ? '#52c41a' :
                          comm.type === 'whatsapp' ? '#25d366' :
                          '#fa541c'
                      }}
                    />
                  }
                  title={
                    <div>
                      <Text strong>{comm.subject}</Text>
                      <Text style={{ marginLeft: '8px', color: '#8c8c8c' }}>
                        to {comm.gymName}
                      </Text>
                    </div>
                  }
                  description={
                    <Text style={{ fontSize: '13px' }}>
                      {comm.content.length > 100 ? 
                        `${comm.content.substring(0, 100)}...` : 
                        comm.content
                      }
                    </Text>
                  }
                />
              </List.Item>
            )}
            pagination={{ pageSize: 5 }}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'subscriptions', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaBell />
              </span>
              Subscription Management
            </h1>
            <p className="dashboard-page-subtitle">Monitor subscriptions, billing, and communicate with gym owners</p>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Subscriptions"
                value={totalSubs}
                prefix={<FaBell style={{ color: '#4CAF50' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Active Subscriptions"
                value={activeSubs}
                prefix={<FaCheckCircle style={{ color: '#52c41a' }} />}
                suffix={`/ ${totalSubs}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Payment Issues"
                value={overdueSubs}
                prefix={<FaExclamationTriangle style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: overdueSubs > 0 ? '#ff4d4f' : '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Monthly Revenue"
                value={monthlyRevenue}
                precision={2}
                prefix="$"
                suffix=""
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Alerts */}
        {overdueSubs > 0 && (
          <Alert
            message="Payment Issues Detected"
            description={`${overdueSubs} subscription${overdueSubs > 1 ? 's have' : ' has'} overdue payments. Consider sending payment reminders.`}
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
            action={
              <Button size="small" type="primary">
                Send Bulk Reminders
              </Button>
            }
          />
        )}

        {/* Main Content */}
        <Card>
          <Tabs 
            defaultActiveKey="overview"
            items={tabItems}
            size="large"
          />
        </Card>

        {/* Communication Modal */}
        <Modal
          title="Send Communication"
          open={isCommModalVisible}
          onCancel={() => setIsCommModalVisible(false)}
          onOk={() => commForm.submit()}
          width={600}
        >
          <Form
            form={commForm}
            layout="vertical"
            onFinish={handleCommSubmit}
          >
            <Form.Item
              name="type"
              label="Communication Type"
              rules={[{ required: true, message: 'Please select communication type' }]}
            >
              <Select placeholder="Select type">
                <Option value="email">
                  <FaEnvelope style={{ marginRight: '8px' }} />
                  Email
                </Option>
                <Option value="sms">
                  <FaSms style={{ marginRight: '8px' }} />
                  SMS
                </Option>
                <Option value="whatsapp">
                  <FaWhatsapp style={{ marginRight: '8px' }} />
                  WhatsApp
                </Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: 'Please enter subject' }]}
            >
              <Input placeholder="Communication subject" />
            </Form.Item>
            
            <Form.Item
              name="content"
              label="Message"
              rules={[{ required: true, message: 'Please enter message' }]}
            >
              <TextArea 
                rows={5}
                placeholder="Type your message here..."
                maxLength={500}
                showCount
              />
            </Form.Item>
            
            {selectedSubscription && (
              <Alert
                message={`Sending to: ${selectedSubscription.gymName}`}
                type="info"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
          </Form>
        </Modal>
      </div>
    </AdminProtectedRoute>
  );
}

