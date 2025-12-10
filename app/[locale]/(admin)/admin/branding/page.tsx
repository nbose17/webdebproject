'use client';

import { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Table, 
  Button, 
  Typography, 
  Space,
  Row,
  Col,
  Form,
  Input,
  Select,
  Upload,
  ColorPicker,
  Switch,
  Modal,
  message,
  Tag,
  Divider,
  Alert,
  Tooltip
} from 'antd';
import { 
  FaPalette,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUpload,
  FaImage,
  FaFont,
  FaCode,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaSave,
  FaReset
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { CMSItem } from '@/lib/types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface BrandingTheme {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingWeight: string;
    bodyWeight: string;
  };
  layout: {
    headerHeight: number;
    sidebarWidth: number;
    borderRadius: number;
    spacing: number;
  };
  components: {
    buttonStyle: 'rounded' | 'square' | 'pill';
    cardStyle: 'elevated' | 'outlined' | 'filled';
    inputStyle: 'outlined' | 'filled' | 'underlined';
  };
  customCSS: string;
  createdAt: string;
  lastModified: string;
}

interface GlobalBrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'icon' | 'banner' | 'favicon' | 'background';
  url: string;
  alt?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  isActive: boolean;
  usage: string[];
  createdAt: string;
}

const mockThemes: BrandingTheme[] = [
  {
    id: 'theme-1',
    name: 'FitConnect Default',
    description: 'Default branding theme for FitConnect platform',
    isActive: true,
    colors: {
      primary: '#4CAF50',
      secondary: '#52c41a',
      accent: '#faad14',
      background: '#f0f2f5',
      surface: '#ffffff',
      text: '#262626',
      textSecondary: '#8c8c8c'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingWeight: '600',
      bodyWeight: '400'
    },
    layout: {
      headerHeight: 64,
      sidebarWidth: 280,
      borderRadius: 8,
      spacing: 16
    },
    components: {
      buttonStyle: 'rounded',
      cardStyle: 'elevated',
      inputStyle: 'outlined'
    },
    customCSS: '',
    createdAt: '2024-01-01',
    lastModified: '2024-11-24'
  },
  {
    id: 'theme-2',
    name: 'Dark Professional',
    description: 'Dark theme for professional environments',
    isActive: false,
    colors: {
      primary: '#722ed1',
      secondary: '#13c2c2',
      accent: '#fa8c16',
      background: '#141414',
      surface: '#1f1f1f',
      text: '#ffffff',
      textSecondary: '#a6a6a6'
    },
    typography: {
      headingFont: 'Roboto',
      bodyFont: 'Roboto',
      headingWeight: '700',
      bodyWeight: '400'
    },
    layout: {
      headerHeight: 72,
      sidebarWidth: 300,
      borderRadius: 12,
      spacing: 20
    },
    components: {
      buttonStyle: 'pill',
      cardStyle: 'filled',
      inputStyle: 'filled'
    },
    customCSS: '.dark-theme { --shadow-color: rgba(0,0,0,0.5); }',
    createdAt: '2024-02-01',
    lastModified: '2024-11-20'
  }
];

const mockAssets: GlobalBrandAsset[] = [
  {
    id: 'asset-1',
    name: 'FitConnect Main Logo',
    type: 'logo',
    url: '/images/fitconnect-logo-main.svg',
    alt: 'FitConnect Logo',
    dimensions: { width: 200, height: 60 },
    fileSize: 15420,
    isActive: true,
    usage: ['header', 'login', 'emails'],
    createdAt: '2024-01-01'
  },
  {
    id: 'asset-2',
    name: 'Favicon',
    type: 'favicon',
    url: '/images/favicon.ico',
    dimensions: { width: 32, height: 32 },
    fileSize: 2048,
    isActive: true,
    usage: ['browser-tab'],
    createdAt: '2024-01-01'
  },
  {
    id: 'asset-3',
    name: 'Email Header Banner',
    type: 'banner',
    url: '/images/email-banner.jpg',
    alt: 'Email Header Banner',
    dimensions: { width: 600, height: 200 },
    fileSize: 85400,
    isActive: true,
    usage: ['emails', 'notifications'],
    createdAt: '2024-01-15'
  }
];

const mockCMSContent: CMSItem[] = [
  {
    id: 'cms-1',
    name: 'Platform Welcome Message',
    content: 'Welcome to FitConnect - Your Complete Gym Management Solution',
    type: 'text'
  },
  {
    id: 'cms-2',
    name: 'Support Email Footer',
    content: 'Need help? Contact us at support@fitconnect.com',
    type: 'text'
  },
  {
    id: 'cms-3',
    name: 'Privacy Policy Link',
    content: 'https://fitconnect.com/privacy',
    type: 'text'
  }
];

export default function AdminBrandingPage() {
  const [themes, setThemes] = useState<BrandingTheme[]>(mockThemes);
  const [assets, setAssets] = useState<GlobalBrandAsset[]>(mockAssets);
  const [cmsContent, setCmsContent] = useState<CMSItem[]>(mockCMSContent);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isAssetModalVisible, setIsAssetModalVisible] = useState(false);
  const [isCmsModalVisible, setIsCmsModalVisible] = useState(false);
  const [editingTheme, setEditingTheme] = useState<BrandingTheme | null>(null);
  const [editingAsset, setEditingAsset] = useState<GlobalBrandAsset | null>(null);
  const [editingCms, setEditingCms] = useState<CMSItem | null>(null);
  const [themeForm] = Form.useForm();
  const [assetForm] = Form.useForm();
  const [cmsForm] = Form.useForm();

  const handleAddTheme = () => {
    setEditingTheme(null);
    themeForm.resetFields();
    setIsThemeModalVisible(true);
  };

  const handleEditTheme = (theme: BrandingTheme) => {
    setEditingTheme(theme);
    themeForm.setFieldsValue(theme);
    setIsThemeModalVisible(true);
  };

  const handleSaveTheme = async (values: any) => {
    if (editingTheme) {
      setThemes(prev => prev.map(t => 
        t.id === editingTheme.id ? { ...t, ...values, lastModified: new Date().toISOString() } : t
      ));
      message.success('Theme updated successfully');
    } else {
      const newTheme: BrandingTheme = {
        id: `theme-${Date.now()}`,
        ...values,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setThemes(prev => [...prev, newTheme]);
      message.success('Theme created successfully');
    }
    setIsThemeModalVisible(false);
  };

  const handleActivateTheme = (themeId: string) => {
    setThemes(prev => prev.map(t => ({
      ...t,
      isActive: t.id === themeId
    })));
    message.success('Theme activated');
  };

  const handleAddAsset = () => {
    setEditingAsset(null);
    assetForm.resetFields();
    setIsAssetModalVisible(true);
  };

  const handleEditAsset = (asset: GlobalBrandAsset) => {
    setEditingAsset(asset);
    assetForm.setFieldsValue(asset);
    setIsAssetModalVisible(true);
  };

  const handleSaveAsset = async (values: any) => {
    if (editingAsset) {
      setAssets(prev => prev.map(a => 
        a.id === editingAsset.id ? { ...a, ...values } : a
      ));
      message.success('Asset updated successfully');
    } else {
      const newAsset: GlobalBrandAsset = {
        id: `asset-${Date.now()}`,
        ...values,
        createdAt: new Date().toISOString()
      };
      setAssets(prev => [...prev, newAsset]);
      message.success('Asset added successfully');
    }
    setIsAssetModalVisible(false);
  };

  const themeColumns = [
    {
      title: 'Theme',
      key: 'theme',
      render: (theme: BrandingTheme) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div 
              style={{ 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                backgroundColor: theme.colors.primary 
              }} 
            />
            <span style={{ fontWeight: '500' }}>{theme.name}</span>
            {theme.isActive && <Tag color="green" size="small">ACTIVE</Tag>}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {theme.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Colors',
      key: 'colors',
      render: (theme: BrandingTheme) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          {Object.entries(theme.colors).slice(0, 4).map(([key, color]) => (
            <Tooltip key={key} title={`${key}: ${color}`}>
              <div 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '4px', 
                  backgroundColor: color,
                  border: '1px solid #d9d9d9'
                }} 
              />
            </Tooltip>
          ))}
        </div>
      ),
    },
    {
      title: 'Typography',
      key: 'typography',
      render: (theme: BrandingTheme) => (
        <div style={{ fontSize: '12px' }}>
          <div>Heading: {theme.typography.headingFont}</div>
          <div>Body: {theme.typography.bodyFont}</div>
        </div>
      ),
    },
    {
      title: 'Last Modified',
      key: 'lastModified',
      render: (theme: BrandingTheme) => (
        <Text style={{ fontSize: '12px' }}>
          {new Date(theme.lastModified).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (theme: BrandingTheme) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<FaEye />}
          >
            Preview
          </Button>
          <Button 
            type="text" 
            size="small"
            icon={<FaEdit />}
            onClick={() => handleEditTheme(theme)}
          >
            Edit
          </Button>
          {!theme.isActive && (
            <Button 
              type="text" 
              size="small"
              onClick={() => handleActivateTheme(theme.id)}
            >
              Activate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const assetColumns = [
    {
      title: 'Asset',
      key: 'asset',
      render: (asset: GlobalBrandAsset) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {asset.type === 'logo' || asset.type === 'icon' || asset.type === 'banner' ? (
            <img 
              src={asset.url} 
              alt={asset.name}
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/images/placeholder-image.png';
              }}
            />
          ) : (
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}>
              <FaImage />
            </div>
          )}
          <div>
            <div style={{ fontWeight: '500' }}>{asset.name}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {asset.type.toUpperCase()}
              {asset.dimensions && ` • ${asset.dimensions.width}×${asset.dimensions.height}px`}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (asset: GlobalBrandAsset) => (
        <div>
          {asset.usage.map(use => (
            <Tag key={use} size="small">{use}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'File Size',
      key: 'fileSize',
      render: (asset: GlobalBrandAsset) => (
        <Text style={{ fontSize: '12px' }}>
          {asset.fileSize ? `${(asset.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (asset: GlobalBrandAsset) => (
        <Tag color={asset.isActive ? 'success' : 'default'}>
          {asset.isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (asset: GlobalBrandAsset) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<FaEdit />}
            onClick={() => handleEditAsset(asset)}
          >
            Edit
          </Button>
          <Button 
            type="text" 
            size="small"
            icon={<FaTrash />}
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const cmsColumns = [
    {
      title: 'Content Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{type.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Content Preview',
      key: 'content',
      render: (cms: CMSItem) => (
        <Text style={{ fontSize: '12px' }}>
          {cms.content.length > 50 ? `${cms.content.substring(0, 50)}...` : cms.content}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (cms: CMSItem) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<FaEdit />}
            onClick={() => {
              setEditingCms(cms);
              cmsForm.setFieldsValue(cms);
              setIsCmsModalVisible(true);
            }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'themes',
      label: (
        <span>
          <FaPalette /> Themes
        </span>
      ),
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Title level={4} style={{ margin: 0 }}>Branding Themes</Title>
            <Button 
              type="primary"
              icon={<FaPlus />}
              onClick={handleAddTheme}
            >
              Create Theme
            </Button>
          </div>

          <Table
            columns={themeColumns}
            dataSource={themes}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: 'assets',
      label: (
        <span>
          <FaImage /> Brand Assets
        </span>
      ),
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Title level={4} style={{ margin: 0 }}>Brand Assets</Title>
            <Button 
              type="primary"
              icon={<FaUpload />}
              onClick={handleAddAsset}
            >
              Upload Asset
            </Button>
          </div>

          <Table
            columns={assetColumns}
            dataSource={assets}
            rowKey="id"
            pagination={{ pageSize: 8 }}
          />
        </div>
      ),
    },
    {
      key: 'content',
      label: (
        <span>
          <FaGlobe /> Global Content
        </span>
      ),
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Title level={4} style={{ margin: 0 }}>Global CMS Content</Title>
            <Button 
              type="primary"
              icon={<FaPlus />}
              onClick={() => {
                setEditingCms(null);
                cmsForm.resetFields();
                setIsCmsModalVisible(true);
              }}
            >
              Add Content
            </Button>
          </div>

          <Table
            columns={cmsColumns}
            dataSource={cmsContent}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'branding', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaPalette />
              </span>
              CMS & Branding Management
            </h1>
            <p className="dashboard-page-subtitle">Manage global branding, themes, assets, and content across the platform</p>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <Tabs 
            defaultActiveKey="themes"
            items={tabItems}
            size="large"
          />
        </Card>

        {/* Theme Modal */}
        <Modal
          title={editingTheme ? 'Edit Theme' : 'Create New Theme'}
          open={isThemeModalVisible}
          onCancel={() => setIsThemeModalVisible(false)}
          onOk={() => themeForm.submit()}
          width={800}
        >
          <Form
            form={themeForm}
            layout="vertical"
            onFinish={handleSaveTheme}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Theme Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="description"
                  label="Description"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            
            <Divider>Colors</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={['colors', 'primary']} label="Primary Color">
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['colors', 'secondary']} label="Secondary Color">
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['colors', 'accent']} label="Accent Color">
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>

            <Divider>Typography</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={['typography', 'headingFont']} label="Heading Font">
                  <Select>
                    <Option value="Inter">Inter</Option>
                    <Option value="Roboto">Roboto</Option>
                    <Option value="Arial">Arial</Option>
                    <Option value="Helvetica">Helvetica</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['typography', 'bodyFont']} label="Body Font">
                  <Select>
                    <Option value="Inter">Inter</Option>
                    <Option value="Roboto">Roboto</Option>
                    <Option value="Arial">Arial</Option>
                    <Option value="Helvetica">Helvetica</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="customCSS"
              label="Custom CSS"
            >
              <TextArea rows={4} placeholder="/* Custom CSS rules */" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Asset Modal */}
        <Modal
          title={editingAsset ? 'Edit Asset' : 'Upload New Asset'}
          open={isAssetModalVisible}
          onCancel={() => setIsAssetModalVisible(false)}
          onOk={() => assetForm.submit()}
        >
          <Form
            form={assetForm}
            layout="vertical"
            onFinish={handleSaveAsset}
          >
            <Form.Item
              name="name"
              label="Asset Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="type"
              label="Asset Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="logo">Logo</Option>
                <Option value="icon">Icon</Option>
                <Option value="banner">Banner</Option>
                <Option value="favicon">Favicon</Option>
                <Option value="background">Background</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="url"
              label="Asset URL"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="usage"
              label="Usage Areas"
            >
              <Select mode="multiple" placeholder="Select where this asset is used">
                <Option value="header">Header</Option>
                <Option value="login">Login Page</Option>
                <Option value="emails">Email Templates</Option>
                <Option value="notifications">Notifications</Option>
                <Option value="reports">Reports</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* CMS Content Modal */}
        <Modal
          title={editingCms ? 'Edit Content' : 'Add Content'}
          open={isCmsModalVisible}
          onCancel={() => setIsCmsModalVisible(false)}
          onOk={() => cmsForm.submit()}
        >
          <Form
            form={cmsForm}
            layout="vertical"
            onFinish={(values) => {
              if (editingCms) {
                setCmsContent(prev => prev.map(c => 
                  c.id === editingCms.id ? { ...c, ...values } : c
                ));
              } else {
                setCmsContent(prev => [...prev, { id: `cms-${Date.now()}`, ...values }]);
              }
              setIsCmsModalVisible(false);
              message.success('Content saved successfully');
            }}
          >
            <Form.Item
              name="name"
              label="Content Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="type"
              label="Content Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="text">Text</Option>
                <Option value="image">Image</Option>
                <Option value="banner">Banner</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminProtectedRoute>
  );
}
