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
  Tabs,
  Form,
  Input,
  Switch,
  Select,
  Modal,
  Alert,
  Progress,
  DatePicker,
  message,
  Tooltip
} from 'antd';
import { 
  FaCreditCard,
  FaPaypal,
  FaStripe,
  FaApplePay,
  FaGooglePay,
  FaBitcoin,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSync,
  FaCog,
  FaChartLine,
  FaDownload
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'square' | 'razorpay' | 'custom';
  status: 'active' | 'inactive' | 'testing';
  isDefault: boolean;
  configuration: {
    apiKey: string;
    secretKey: string;
    webhookUrl: string;
    sandboxMode: boolean;
  };
  supportedMethods: string[];
  fees: {
    percentage: number;
    fixedFee: number;
  };
  countries: string[];
  currencies: string[];
  monthlyVolume: number;
  transactionCount: number;
  successRate: number;
  createdAt: string;
  lastSync: string;
}

interface Transaction {
  id: string;
  gatewayId: string;
  gatewayName: string;
  gymId: string;
  gymName: string;
  amount: number;
  currency: string;
  status: 'successful' | 'failed' | 'pending' | 'refunded' | 'disputed';
  method: string;
  reference: string;
  description: string;
  createdAt: string;
  processedAt: string;
  fees: number;
}

const mockGateways: PaymentGateway[] = [
  {
    id: 'gateway-1',
    name: 'Stripe Production',
    type: 'stripe',
    status: 'active',
    isDefault: true,
    configuration: {
      apiKey: 'pk_live_...',
      secretKey: 'sk_live_...',
      webhookUrl: 'https://api.fitconnect.com/webhooks/stripe',
      sandboxMode: false
    },
    supportedMethods: ['card', 'apple_pay', 'google_pay', 'sepa_debit'],
    fees: {
      percentage: 2.9,
      fixedFee: 0.30
    },
    countries: ['US', 'CA', 'GB', 'EU'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD'],
    monthlyVolume: 45280.50,
    transactionCount: 156,
    successRate: 97.8,
    createdAt: '2024-01-15',
    lastSync: '2024-11-24T10:30:00Z'
  },
  {
    id: 'gateway-2',
    name: 'PayPal Business',
    type: 'paypal',
    status: 'active',
    isDefault: false,
    configuration: {
      apiKey: 'AYjcyDnhFj...',
      secretKey: 'ELb-7ZfCz4...',
      webhookUrl: 'https://api.fitconnect.com/webhooks/paypal',
      sandboxMode: false
    },
    supportedMethods: ['paypal', 'card'],
    fees: {
      percentage: 3.49,
      fixedFee: 0.49
    },
    countries: ['US', 'CA', 'GB', 'AU'],
    currencies: ['USD', 'EUR', 'GBP', 'AUD'],
    monthlyVolume: 12560.25,
    transactionCount: 42,
    successRate: 94.2,
    createdAt: '2024-02-01',
    lastSync: '2024-11-24T09:15:00Z'
  },
  {
    id: 'gateway-3',
    name: 'Stripe Test',
    type: 'stripe',
    status: 'testing',
    isDefault: false,
    configuration: {
      apiKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      webhookUrl: 'https://api-dev.fitconnect.com/webhooks/stripe',
      sandboxMode: true
    },
    supportedMethods: ['card', 'apple_pay', 'google_pay'],
    fees: {
      percentage: 2.9,
      fixedFee: 0.30
    },
    countries: ['US'],
    currencies: ['USD'],
    monthlyVolume: 1250.00,
    transactionCount: 25,
    successRate: 100,
    createdAt: '2024-11-01',
    lastSync: '2024-11-24T11:00:00Z'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    gatewayId: 'gateway-1',
    gatewayName: 'Stripe Production',
    gymId: '1',
    gymName: 'FITNESS GYM - Downtown',
    amount: 299.99,
    currency: 'USD',
    status: 'successful',
    method: 'card',
    reference: 'ch_3P8j7cL2ZvKyxqLp0sth5eqc',
    description: 'Monthly subscription - Premium Business',
    createdAt: '2024-11-24T08:30:00Z',
    processedAt: '2024-11-24T08:30:05Z',
    fees: 9.00
  },
  {
    id: 'txn-2',
    gatewayId: 'gateway-2',
    gatewayName: 'PayPal Business',
    gymId: '2',
    gymName: 'FITNESS GYM - Uptown',
    amount: 199.99,
    currency: 'USD',
    status: 'failed',
    method: 'paypal',
    reference: 'PAYID-MU2BWLA8VH839783B123456',
    description: 'Monthly subscription - Standard Business',
    createdAt: '2024-11-24T07:15:00Z',
    processedAt: '2024-11-24T07:15:12Z',
    fees: 0
  },
  {
    id: 'txn-3',
    gatewayId: 'gateway-1',
    gatewayName: 'Stripe Production',
    gymId: '3',
    gymName: 'FITNESS GYM - Westside',
    amount: 149.99,
    currency: 'USD',
    status: 'pending',
    method: 'sepa_debit',
    reference: 'ch_3P8j9fL2ZvKyxqLp1xyz2def',
    description: 'Monthly subscription - Basic Business',
    createdAt: '2024-11-24T06:45:00Z',
    processedAt: '',
    fees: 4.65
  }
];

export default function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>(mockGateways);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isGatewayModalVisible, setIsGatewayModalVisible] = useState(false);
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);
  const [gatewayForm] = Form.useForm();

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'stripe': return <FaStripe style={{ color: '#635bff' }} />;
      case 'paypal': return <FaPaypal style={{ color: '#0070ba' }} />;
      case 'square': return <FaCreditCard style={{ color: '#3e4348' }} />;
      case 'razorpay': return <FaCreditCard style={{ color: '#528ff0' }} />;
      default: return <FaCreditCard />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'testing': return 'processing';
      default: return 'default';
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'processing';
      case 'refunded': return 'warning';
      case 'disputed': return 'error';
      default: return 'default';
    }
  };

  const handleAddGateway = () => {
    setEditingGateway(null);
    gatewayForm.resetFields();
    setIsGatewayModalVisible(true);
  };

  const handleEditGateway = (gateway: PaymentGateway) => {
    setEditingGateway(gateway);
    gatewayForm.setFieldsValue({
      ...gateway,
      ...gateway.configuration
    });
    setIsGatewayModalVisible(true);
  };

  const handleSaveGateway = async (values: any) => {
    try {
      if (editingGateway) {
        // Update existing gateway
        setGateways(prev => prev.map(g => 
          g.id === editingGateway.id 
            ? { 
                ...g, 
                ...values,
                configuration: {
                  apiKey: values.apiKey,
                  secretKey: values.secretKey,
                  webhookUrl: values.webhookUrl,
                  sandboxMode: values.sandboxMode || false
                }
              }
            : g
        ));
        message.success('Gateway updated successfully');
      } else {
        // Add new gateway
        const newGateway: PaymentGateway = {
          id: `gateway-${Date.now()}`,
          ...values,
          configuration: {
            apiKey: values.apiKey,
            secretKey: values.secretKey,
            webhookUrl: values.webhookUrl,
            sandboxMode: values.sandboxMode || false
          },
          monthlyVolume: 0,
          transactionCount: 0,
          successRate: 0,
          createdAt: new Date().toISOString().split('T')[0],
          lastSync: new Date().toISOString()
        };
        setGateways(prev => [...prev, newGateway]);
        message.success('Gateway added successfully');
      }
      
      setIsGatewayModalVisible(false);
      gatewayForm.resetFields();
    } catch (error) {
      message.error('Failed to save gateway');
    }
  };

  const handleToggleGateway = (gatewayId: string) => {
    setGateways(prev => prev.map(g => 
      g.id === gatewayId 
        ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' }
        : g
    ));
  };

  const handleSetDefault = (gatewayId: string) => {
    setGateways(prev => prev.map(g => ({
      ...g,
      isDefault: g.id === gatewayId
    })));
    message.success('Default gateway updated');
  };

  const gatewayColumns = [
    {
      title: 'Gateway',
      key: 'gateway',
      render: (gateway: PaymentGateway) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>
            {getGatewayIcon(gateway.type)}
          </div>
          <div>
            <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {gateway.name}
              {gateway.isDefault && <Tag color="blue" size="small">DEFAULT</Tag>}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {gateway.type.charAt(0).toUpperCase() + gateway.type.slice(1)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (gateway: PaymentGateway) => (
        <Tag color={getStatusColor(gateway.status)}>
          {gateway.status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Monthly Stats',
      key: 'stats',
      render: (gateway: PaymentGateway) => (
        <div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>
            ${gateway.monthlyVolume.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {gateway.transactionCount} transactions
          </div>
        </div>
      ),
    },
    {
      title: 'Success Rate',
      key: 'successRate',
      render: (gateway: PaymentGateway) => (
        <div>
          <Progress 
            percent={gateway.successRate} 
            size="small"
            strokeColor={gateway.successRate >= 95 ? '#52c41a' : gateway.successRate >= 90 ? '#faad14' : '#ff4d4f'}
          />
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
            {gateway.successRate}%
          </div>
        </div>
      ),
    },
    {
      title: 'Fees',
      key: 'fees',
      render: (gateway: PaymentGateway) => (
        <div style={{ fontSize: '12px' }}>
          <div>{gateway.fees.percentage}%</div>
          <div>${gateway.fees.fixedFee}</div>
        </div>
      ),
    },
    {
      title: 'Last Sync',
      key: 'lastSync',
      render: (gateway: PaymentGateway) => (
        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
          {new Date(gateway.lastSync).toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (gateway: PaymentGateway) => (
        <Space>
          <Tooltip title="Edit Gateway">
            <Button 
              type="text" 
              size="small"
              icon={<FaEdit />}
              onClick={() => handleEditGateway(gateway)}
            />
          </Tooltip>
          
          <Tooltip title="Sync Data">
            <Button 
              type="text" 
              size="small"
              icon={<FaSync />}
              onClick={() => message.success('Gateway data synced')}
            />
          </Tooltip>
          
          <Tooltip title={gateway.isDefault ? "Cannot disable default gateway" : "Set as Default"}>
            <Button 
              type="text" 
              size="small"
              disabled={gateway.isDefault}
              onClick={() => handleSetDefault(gateway.id)}
            >
              {gateway.isDefault ? 'Default' : 'Set Default'}
            </Button>
          </Tooltip>
          
          <Tooltip title={gateway.status === 'active' ? 'Disable' : 'Enable'}>
            <Button 
              type="text" 
              size="small"
              disabled={gateway.isDefault && gateway.status === 'active'}
              onClick={() => handleToggleGateway(gateway.id)}
              danger={gateway.status === 'active'}
            >
              {gateway.status === 'active' ? 'Disable' : 'Enable'}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: 'Transaction',
      key: 'transaction',
      render: (txn: Transaction) => (
        <div>
          <div style={{ fontWeight: '500' }}>{txn.reference}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {txn.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Gym',
      dataIndex: 'gymName',
      key: 'gymName',
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (txn: Transaction) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '500' }}>
            ${txn.amount.toFixed(2)} {txn.currency}
          </div>
          {txn.fees > 0 && (
            <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
              Fee: ${txn.fees.toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Gateway',
      dataIndex: 'gatewayName',
      key: 'gatewayName',
    },
    {
      title: 'Method',
      key: 'method',
      render: (txn: Transaction) => (
        <Tag size="small">{txn.method.replace('_', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (txn: Transaction) => (
        <Tag color={getTransactionStatusColor(txn.status)}>
          {txn.status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      key: 'createdAt',
      render: (txn: Transaction) => (
        <Text style={{ fontSize: '12px' }}>
          {new Date(txn.createdAt).toLocaleString()}
        </Text>
      ),
    },
  ];

  // Calculate statistics
  const totalVolume = gateways.reduce((sum, g) => sum + g.monthlyVolume, 0);
  const totalTransactions = gateways.reduce((sum, g) => sum + g.transactionCount, 0);
  const activeGateways = gateways.filter(g => g.status === 'active').length;
  const avgSuccessRate = gateways.reduce((sum, g) => sum + g.successRate, 0) / gateways.length;

  const tabItems = [
    {
      key: 'gateways',
      label: 'Payment Gateways',
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Title level={4} style={{ margin: 0 }}>Configured Gateways</Title>
            <Button 
              type="primary"
              icon={<FaPlus />}
              onClick={handleAddGateway}
            >
              Add Gateway
            </Button>
          </div>

          <Table
            columns={gatewayColumns}
            dataSource={gateways}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: 'transactions',
      label: 'Recent Transactions',
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <RangePicker />
              <Select defaultValue="all" style={{ width: 120 }}>
                <Option value="all">All Status</Option>
                <Option value="successful">Successful</Option>
                <Option value="failed">Failed</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </div>
            
            <Button icon={<FaDownload />}>
              Export
            </Button>
          </div>

          <Table
            columns={transactionColumns}
            dataSource={transactions}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'payments', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaCreditCard />
              </span>
              Payment Gateway Management
            </h1>
            <p className="dashboard-page-subtitle">Configure payment gateways and monitor transaction processing</p>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Monthly Volume"
                value={totalVolume}
                precision={2}
                prefix="$"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Transactions"
                value={totalTransactions}
                prefix={<FaChartLine style={{ color: '#4CAF50' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Active Gateways"
                value={activeGateways}
                prefix={<FaCreditCard style={{ color: '#52c41a' }} />}
                suffix={`/ ${gateways.length}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Avg Success Rate"
                value={avgSuccessRate}
                precision={1}
                suffix="%"
                valueStyle={{ 
                  color: avgSuccessRate >= 95 ? '#52c41a' : avgSuccessRate >= 90 ? '#faad14' : '#ff4d4f' 
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card>
          <Tabs 
            defaultActiveKey="gateways"
            items={tabItems}
            size="large"
          />
        </Card>

        {/* Gateway Configuration Modal */}
        <Modal
          title={editingGateway ? 'Edit Payment Gateway' : 'Add Payment Gateway'}
          open={isGatewayModalVisible}
          onCancel={() => setIsGatewayModalVisible(false)}
          onOk={() => gatewayForm.submit()}
          width={600}
        >
          <Alert
            message="Security Notice"
            description="API keys and secrets are encrypted and stored securely. Never share these credentials."
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
          />
          
          <Form
            form={gatewayForm}
            layout="vertical"
            onFinish={handleSaveGateway}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Gateway Name"
                  rules={[{ required: true, message: 'Please enter gateway name' }]}
                >
                  <Input placeholder="e.g., Stripe Production" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Gateway Type"
                  rules={[{ required: true, message: 'Please select gateway type' }]}
                >
                  <Select placeholder="Select type">
                    <Option value="stripe">Stripe</Option>
                    <Option value="paypal">PayPal</Option>
                    <Option value="square">Square</Option>
                    <Option value="razorpay">Razorpay</Option>
                    <Option value="custom">Custom</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="apiKey"
                  label="API Key / Public Key"
                  rules={[{ required: true, message: 'Please enter API key' }]}
                >
                  <Input placeholder="pk_live_..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="secretKey"
                  label="Secret Key"
                  rules={[{ required: true, message: 'Please enter secret key' }]}
                >
                  <Input.Password placeholder="sk_live_..." />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="webhookUrl"
              label="Webhook URL"
              rules={[{ required: true, type: 'url', message: 'Please enter valid webhook URL' }]}
            >
              <Input placeholder="https://api.fitconnect.com/webhooks/stripe" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                    <Option value="testing">Testing</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="sandboxMode"
                  valuePropName="checked"
                  label="Sandbox Mode"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </AdminProtectedRoute>
  );
}

