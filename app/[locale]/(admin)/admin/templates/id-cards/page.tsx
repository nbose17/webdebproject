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
  Modal,
  Input,
  Popconfirm,
  message
} from 'antd';
import { 
  FaIdCard,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCopy,
  FaDownload,
  FaSearch
} from 'react-icons/fa';
import { IDCardTemplate } from '@/components/admin/IDCardDesigner';
import IDCardDesigner from '@/components/admin/IDCardDesigner';
import IDCardPreview from '@/components/admin/IDCardPreview';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';

const { Title, Text } = Typography;
const { Search } = Input;

// Mock ID card templates
const mockTemplates: IDCardTemplate[] = [
  {
    id: 'id-template-1',
    name: 'Standard Membership Card',
    description: 'Basic membership ID card with photo and essential info',
    width: 85.6,
    height: 54,
    backgroundColor: '#ffffff',
    elements: [
      {
        id: 'gym-logo',
        type: 'logo',
        content: '/images/gym-logo.png',
        x: 5,
        y: 5,
        width: 25,
        height: 15,
        opacity: 1
      },
      {
        id: 'gym-name',
        type: 'text',
        content: '{{gym.name}}',
        x: 32,
        y: 5,
        width: 48,
        height: 8,
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#4CAF50'
      },
      {
        id: 'member-photo',
        type: 'image',
        content: '{{member.photo}}',
        x: 5,
        y: 22,
        width: 25,
        height: 25,
        borderRadius: 3
      },
      {
        id: 'member-name',
        type: 'text',
        content: '{{member.name}}',
        x: 32,
        y: 22,
        width: 48,
        height: 6,
        fontSize: 14,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#000000'
      },
      {
        id: 'member-id',
        type: 'text',
        content: 'ID: {{member.id}}',
        x: 32,
        y: 30,
        width: 48,
        height: 5,
        fontSize: 12,
        fontFamily: 'Arial',
        color: '#666666'
      },
      {
        id: 'membership-type',
        type: 'text',
        content: '{{member.membershipType}} Member',
        x: 32,
        y: 37,
        width: 48,
        height: 5,
        fontSize: 12,
        fontFamily: 'Arial',
        color: '#52c41a',
        fontWeight: 'bold'
      },
      {
        id: 'expiry-date',
        type: 'text',
        content: 'Valid until: {{member.expiryDate}}',
        x: 32,
        y: 44,
        width: 48,
        height: 5,
        fontSize: 10,
        fontFamily: 'Arial',
        color: '#8c8c8c'
      }
    ],
    isActive: true,
    createdBy: 'admin@fitconnect.com',
    createdAt: '2024-11-15',
    lastModified: '2024-12-01'
  },
  {
    id: 'id-template-2',
    name: 'Premium VIP Card',
    description: 'Elegant VIP membership card with QR code',
    width: 85.6,
    height: 54,
    backgroundColor: '#1a1a1a',
    elements: [
      {
        id: 'vip-background',
        type: 'text',
        content: 'VIP',
        x: 60,
        y: 35,
        width: 20,
        height: 15,
        fontSize: 24,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#ffd700',
        opacity: 0.3
      },
      {
        id: 'gym-logo-vip',
        type: 'logo',
        content: '/images/gym-logo.png',
        x: 5,
        y: 5,
        width: 20,
        height: 12,
        opacity: 1
      },
      {
        id: 'member-name-vip',
        type: 'text',
        content: '{{member.name}}',
        x: 5,
        y: 20,
        width: 50,
        height: 8,
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#ffffff'
      },
      {
        id: 'vip-text',
        type: 'text',
        content: 'VIP MEMBER',
        x: 5,
        y: 30,
        width: 50,
        height: 6,
        fontSize: 12,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#ffd700'
      },
      {
        id: 'member-id-vip',
        type: 'text',
        content: '{{member.id}}',
        x: 5,
        y: 38,
        width: 30,
        height: 5,
        fontSize: 10,
        fontFamily: 'Arial',
        color: '#cccccc'
      },
      {
        id: 'qr-code',
        type: 'qr',
        content: '{{member.id}}',
        x: 60,
        y: 20,
        width: 20,
        height: 20
      },
      {
        id: 'expiry-vip',
        type: 'text',
        content: 'Valid: {{member.expiryDate}}',
        x: 5,
        y: 45,
        width: 40,
        height: 4,
        fontSize: 8,
        fontFamily: 'Arial',
        color: '#888888'
      }
    ],
    isActive: true,
    createdBy: 'admin@fitconnect.com',
    createdAt: '2024-11-20',
    lastModified: '2024-11-20'
  }
];

export default function IDCardTemplatesPage() {
  const [templates, setTemplates] = useState<IDCardTemplate[]>(mockTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState<IDCardTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDesignerVisible, setIsDesignerVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<IDCardTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<IDCardTemplate | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  // Apply search filter
  const applyFilters = () => {
    let filtered = templates;
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTemplates(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters();
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setIsDesignerVisible(true);
  };

  const handleEditTemplate = (template: IDCardTemplate) => {
    setEditingTemplate(template);
    setIsDesignerVisible(true);
  };

  const handleSaveTemplate = (template: IDCardTemplate) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id ? template : t
      ));
      message.success('Template updated successfully');
    } else {
      // Create new template
      setTemplates(prev => [...prev, template]);
      message.success('Template created successfully');
    }
    
    setIsDesignerVisible(false);
    applyFilters();
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    message.success('Template deleted successfully');
    applyFilters();
  };

  const handleDuplicateTemplate = (template: IDCardTemplate) => {
    const duplicated: IDCardTemplate = {
      ...template,
      id: `id-template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    setTemplates(prev => [...prev, duplicated]);
    message.success('Template duplicated successfully');
    applyFilters();
  };

  const handlePreviewTemplate = (template: IDCardTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewVisible(true);
  };

  const handleToggleStatus = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, isActive: !t.isActive } : t
    ));
    applyFilters();
  };

  const columns = [
    {
      title: 'Template',
      key: 'template',
      render: (template: IDCardTemplate) => (
        <div>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>
            {template.name}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {template.description}
          </div>
          <div style={{ marginTop: '4px' }}>
            <Tag color={template.isActive ? 'success' : 'default'} size="small">
              {template.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Size',
      key: 'size',
      render: (template: IDCardTemplate) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>
            {template.width} × {template.height}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            mm
          </div>
        </div>
      ),
    },
    {
      title: 'Elements',
      key: 'elements',
      render: (template: IDCardTemplate) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>
            {template.elements.length}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            elements
          </div>
        </div>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy: string) => (
        <Text style={{ fontSize: '13px' }}>{createdBy}</Text>
      ),
    },
    {
      title: 'Last Modified',
      key: 'lastModified',
      render: (template: IDCardTemplate) => (
        <Text style={{ fontSize: '13px' }}>
          {new Date(template.lastModified).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (template: IDCardTemplate) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<FaEye />}
            onClick={() => handlePreviewTemplate(template)}
          >
            Preview
          </Button>
          <Button 
            type="text" 
            size="small"
            icon={<FaEdit />}
            onClick={() => handleEditTemplate(template)}
          >
            Edit
          </Button>
          <Button 
            type="text" 
            size="small"
            icon={<FaCopy />}
            onClick={() => handleDuplicateTemplate(template)}
          >
            Duplicate
          </Button>
          <Button 
            type="text" 
            size="small"
            onClick={() => handleToggleStatus(template.id)}
          >
            {template.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Popconfirm
            title="Delete Template"
            description="Are you sure you want to delete this template?"
            onConfirm={() => handleDeleteTemplate(template.id)}
          >
            <Button 
              type="text" 
              size="small"
              icon={<FaTrash />}
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Calculate statistics
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter(t => t.isActive).length;
  const avgElements = templates.reduce((sum, t) => sum + t.elements.length, 0) / totalTemplates || 0;

  if (isDesignerVisible) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'templates', action: 'create' }}>
        <IDCardDesigner
          template={editingTemplate || undefined}
          onSave={handleSaveTemplate}
          onCancel={() => setIsDesignerVisible(false)}
        />
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'templates', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaIdCard />
              </span>
              ID Card Templates
            </h1>
            <p className="dashboard-page-subtitle">Design and manage ID card templates for member cards</p>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Templates"
                value={totalTemplates}
                prefix={<FaIdCard style={{ color: '#4CAF50' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Active Templates"
                value={activeTemplates}
                prefix={<FaIdCard style={{ color: '#52c41a' }} />}
                suffix={`/ ${totalTemplates}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Avg Elements"
                value={avgElements.toFixed(1)}
                prefix={<FaIdCard style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Standard Size"
                value="85.6×54"
                suffix="mm"
                prefix={<FaIdCard style={{ color: '#fa8c16' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Templates Management */}
        <Card>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Search
                placeholder="Search templates..."
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 250 }}
                enterButton={<FaSearch />}
              />
            </div>
            
            <Button 
              type="primary" 
              icon={<FaPlus />}
              onClick={handleCreateTemplate}
            >
              Create Template
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={filteredTemplates}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} templates`,
            }}
          />
        </Card>

        {/* Preview Modal */}
        <Modal
          title="ID Card Preview"
          open={isPreviewVisible}
          onCancel={() => setIsPreviewVisible(false)}
          footer={null}
          width={800}
        >
          {previewTemplate && (
            <IDCardPreview 
              template={previewTemplate}
              showControls={true}
            />
          )}
        </Modal>
      </div>
    </AdminProtectedRoute>
  );
}