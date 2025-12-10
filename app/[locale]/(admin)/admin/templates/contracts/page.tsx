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
  Select,
  Popconfirm,
  message
} from 'antd';
import { 
  FaFileContract,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCopy,
  FaDownload,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { ContractTemplate, TemplateEngine } from '@/lib/templateEngine';
import ContractEditor from '@/components/admin/ContractEditor';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Mock contract templates
const mockTemplates: ContractTemplate[] = [
  {
    id: 'template-1',
    name: 'Standard Membership Contract',
    description: 'Standard monthly membership agreement',
    category: 'membership',
    content: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #2c3e50;">Gym Membership Contract</h1>
        
        <p><strong>Gym Name:</strong> {{gym.name}}</p>
        <p><strong>Address:</strong> {{gym.address}}</p>
        <p><strong>Phone:</strong> {{gym.phone}}</p>
        
        <h2>Member Information</h2>
        <p><strong>Full Name:</strong> {{client.name}}</p>
        <p><strong>Email:</strong> {{client.email}}</p>
        <p><strong>Phone:</strong> {{client.phone}}</p>
        <p><strong>Address:</strong> {{client.address}}</p>
        
        <h2>Membership Details</h2>
        <p><strong>Membership Type:</strong> {{membership.type}}</p>
        <p><strong>Monthly Fee:</strong> ${'$'}{{membership.price}}</p>
        <p><strong>Contract Duration:</strong> {{contract.duration}}</p>
        <p><strong>Start Date:</strong> {{contract.startDate}}</p>
        <p><strong>End Date:</strong> {{contract.endDate}}</p>
        <p><strong>Payment Method:</strong> {{payment.method}}</p>
        
        <h2>Terms and Conditions</h2>
        <p>By signing this contract, the member agrees to the following terms:</p>
        <ul>
          <li>Monthly payments are due by the 1st of each month</li>
          <li>Membership is non-transferable</li>
          <li>30-day written notice required for cancellation</li>
          <li>Member must follow all gym rules and regulations</li>
        </ul>
        
        <div style="margin-top: 40px;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p>Member Signature: _________________________</p>
              <p>Date: {{today}}</p>
            </div>
            <div>
              <p>Gym Representative: _____________________</p>
              <p>Date: {{today}}</p>
            </div>
          </div>
        </div>
      </div>
    `,
    variables: [
      { key: 'gym.name', label: 'Gym Name', type: 'text', required: true },
      { key: 'gym.address', label: 'Gym Address', type: 'address', required: true },
      { key: 'gym.phone', label: 'Gym Phone', type: 'phone', required: true },
      { key: 'client.name', label: 'Client Name', type: 'text', required: true },
      { key: 'client.email', label: 'Client Email', type: 'email', required: true },
      { key: 'client.phone', label: 'Client Phone', type: 'phone', required: true },
      { key: 'client.address', label: 'Client Address', type: 'address', required: false },
      { key: 'membership.type', label: 'Membership Type', type: 'select', required: true, options: ['Basic', 'Premium', 'VIP'] },
      { key: 'membership.price', label: 'Monthly Price', type: 'number', required: true },
      { key: 'contract.duration', label: 'Contract Duration', type: 'select', required: true, options: ['1 Month', '3 Months', '6 Months', '12 Months'] },
      { key: 'contract.startDate', label: 'Start Date', type: 'date', required: true },
      { key: 'contract.endDate', label: 'End Date', type: 'date', required: true },
      { key: 'payment.method', label: 'Payment Method', type: 'select', required: true, options: ['Monthly Direct Debit', 'Credit Card', 'Bank Transfer'] },
      { key: 'today', label: 'Today\'s Date', type: 'date', required: false, defaultValue: 'current_date' }
    ],
    isActive: true,
    createdBy: 'admin@fitconnect.com',
    createdAt: '2024-11-15',
    lastModified: '2024-12-01',
    version: 2
  },
  {
    id: 'template-2',
    name: 'Personal Training Agreement',
    description: 'One-on-one personal training contract',
    category: 'training',
    content: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #2c3e50;">Personal Training Agreement</h1>
        
        <p><strong>Trainer:</strong> {{trainer.name}}</p>
        <p><strong>Client:</strong> {{client.name}}</p>
        <p><strong>Sessions:</strong> {{training.sessions}} sessions</p>
        <p><strong>Rate:</strong> ${'$'}{{training.rate}} per session</p>
        
        <h2>Training Schedule</h2>
        <p>Sessions will be scheduled by mutual agreement between trainer and client.</p>
        
        <h2>Cancellation Policy</h2>
        <p>24-hour notice required for session cancellations.</p>
      </div>
    `,
    variables: [
      { key: 'trainer.name', label: 'Trainer Name', type: 'text', required: true },
      { key: 'client.name', label: 'Client Name', type: 'text', required: true },
      { key: 'training.sessions', label: 'Number of Sessions', type: 'number', required: true },
      { key: 'training.rate', label: 'Rate per Session', type: 'number', required: true }
    ],
    isActive: true,
    createdBy: 'admin@fitconnect.com',
    createdAt: '2024-11-20',
    lastModified: '2024-11-20',
    version: 1
  }
];

export default function ContractTemplatesPage() {
  const [templates, setTemplates] = useState<ContractTemplate[]>(mockTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState<ContractTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ContractTemplate | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  // Apply filters
  const applyFilters = () => {
    let filtered = templates;
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(template => template.category === categoryFilter);
    }
    
    setFilteredTemplates(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters();
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    applyFilters();
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setIsEditorVisible(true);
  };

  const handleEditTemplate = (template: ContractTemplate) => {
    setEditingTemplate(template);
    setIsEditorVisible(true);
  };

  const handleSaveTemplate = (template: ContractTemplate) => {
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
    
    setIsEditorVisible(false);
    applyFilters();
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    message.success('Template deleted successfully');
    applyFilters();
  };

  const handleDuplicateTemplate = (template: ContractTemplate) => {
    const duplicated: ContractTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: 1
    };
    
    setTemplates(prev => [...prev, duplicated]);
    message.success('Template duplicated successfully');
    applyFilters();
  };

  const handlePreviewTemplate = (template: ContractTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewVisible(true);
  };

  const handleToggleStatus = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, isActive: !t.isActive } : t
    ));
    applyFilters();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'membership': return 'blue';
      case 'training': return 'green';
      case 'corporate': return 'purple';
      case 'trial': return 'orange';
      case 'custom': return 'default';
      default: return 'default';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const columns = [
    {
      title: 'Template',
      key: 'template',
      render: (template: ContractTemplate) => (
        <div>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>
            {template.name}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {template.description}
          </div>
          <div style={{ marginTop: '4px' }}>
            <Tag color={getCategoryColor(template.category)} size="small">
              {getCategoryLabel(template.category)}
            </Tag>
            <Tag color={template.isActive ? 'success' : 'default'} size="small">
              {template.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Variables',
      key: 'variables',
      render: (template: ContractTemplate) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>
            {template.variables.length}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            variables
          </div>
        </div>
      ),
    },
    {
      title: 'Version',
      key: 'version',
      render: (template: ContractTemplate) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>
            v{template.version}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {new Date(template.lastModified).toLocaleDateString()}
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
      title: 'Actions',
      key: 'actions',
      render: (template: ContractTemplate) => (
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
  const templatesByCategory = templates.reduce((acc, template) => {
    acc[template.category] = (acc[template.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isEditorVisible) {
    return (
      <AdminProtectedRoute requiredPermission={{ resource: 'templates', action: 'create' }}>
        <div style={{ padding: '24px', height: 'calc(100vh - 64px)' }}>
          <ContractEditor
            template={editingTemplate || undefined}
            onSave={handleSaveTemplate}
            onCancel={() => setIsEditorVisible(false)}
          />
        </div>
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
                <FaFileContract />
              </span>
              Contract Templates
            </h1>
            <p className="dashboard-page-subtitle">Create and manage contract templates with dynamic variables</p>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Templates"
                value={totalTemplates}
                prefix={<FaFileContract style={{ color: '#4CAF50' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Active Templates"
                value={activeTemplates}
                prefix={<FaFileContract style={{ color: '#52c41a' }} />}
                suffix={`/ ${totalTemplates}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Membership"
                value={templatesByCategory.membership || 0}
                prefix={<FaFileContract style={{ color: '#4CAF50' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Training"
                value={templatesByCategory.training || 0}
                prefix={<FaFileContract style={{ color: '#52c41a' }} />}
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
              
              <Select
                style={{ width: 150 }}
                placeholder="Category"
                value={categoryFilter}
                onChange={handleCategoryFilter}
              >
                <Option value="all">All Categories</Option>
                <Option value="membership">Membership</Option>
                <Option value="training">Training</Option>
                <Option value="corporate">Corporate</Option>
                <Option value="trial">Trial</Option>
                <Option value="custom">Custom</Option>
              </Select>
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
          title="Contract Preview"
          open={isPreviewVisible}
          onCancel={() => setIsPreviewVisible(false)}
          footer={null}
          width={900}
        >
          {previewTemplate && (
            <div 
              style={{ 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px', 
                padding: '16px',
                backgroundColor: 'white',
                minHeight: '500px',
                overflow: 'auto'
              }}
              dangerouslySetInnerHTML={{ 
                __html: TemplateEngine.generatePreview(previewTemplate) 
              }}
            />
          )}
        </Modal>
      </div>
    </AdminProtectedRoute>
  );
}