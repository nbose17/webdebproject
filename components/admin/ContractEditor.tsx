'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  Row, 
  Col, 
  Typography,
  Divider,
  Tag,
  Tooltip,
  Space,
  Modal,
  Form,
  List,
  Popover,
  Alert
} from 'antd';
import { 
  FaSave,
  FaEye,
  FaCode,
  FaPlus,
  FaTrash,
  FaEdit,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaTable,
  FaImage,
  FaUndo,
  FaRedo
} from 'react-icons/fa';
import { ContractTemplate, TemplateVariable, COMMON_VARIABLES, TemplateEngine } from '@/lib/templateEngine';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ContractEditorProps {
  template?: ContractTemplate;
  onSave: (template: ContractTemplate) => void;
  onCancel: () => void;
}

export default function ContractEditor({ template, onSave, onCancel }: ContractEditorProps) {
  const [templateData, setTemplateData] = useState<ContractTemplate>(() => 
    template || {
      id: '',
      name: '',
      description: '',
      category: 'membership',
      content: '',
      variables: [],
      isActive: true,
      createdBy: 'admin@fitconnect.com',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: 1
    }
  );
  
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isVariableModalVisible, setIsVariableModalVisible] = useState(false);
  const [editingVariable, setEditingVariable] = useState<TemplateVariable | null>(null);
  const [variableForm] = Form.useForm();
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'html'>('wysiwyg');

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorMode === 'wysiwyg') {
      editorRef.current.innerHTML = templateData.content;
    }
  }, [templateData.content, editorMode]);

  // Format toolbar buttons
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      setTemplateData(prev => ({
        ...prev,
        content: editorRef.current!.innerHTML
      }));
    }
  };

  const insertVariable = (variable: TemplateVariable) => {
    const placeholder = `{{${variable.key}}}`;
    
    if (editorMode === 'wysiwyg' && editorRef.current) {
      // Insert at cursor position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'template-variable';
        span.style.backgroundColor = '#e6f7ff';
        span.style.color = '#4CAF50';
        span.style.padding = '2px 6px';
        span.style.borderRadius = '4px';
        span.style.border = '1px solid #91d5ff';
        span.textContent = placeholder;
        range.deleteContents();
        range.insertNode(span);
        selection.removeAllRanges();
      } else {
        // Fallback: append at end
        const span = document.createElement('span');
        span.className = 'template-variable';
        span.style.backgroundColor = '#e6f7ff';
        span.style.color = '#4CAF50';
        span.style.padding = '2px 6px';
        span.style.borderRadius = '4px';
        span.style.border = '1px solid #91d5ff';
        span.textContent = placeholder;
        editorRef.current.appendChild(span);
      }
      updateContent();
    } else {
      // HTML mode
      setTemplateData(prev => ({
        ...prev,
        content: prev.content + placeholder
      }));
    }

    // Add variable to template if not already present
    if (!templateData.variables.find(v => v.key === variable.key)) {
      setTemplateData(prev => ({
        ...prev,
        variables: [...prev.variables, variable]
      }));
    }
  };

  const handleAddCustomVariable = () => {
    setEditingVariable(null);
    variableForm.resetFields();
    setIsVariableModalVisible(true);
  };

  const handleEditVariable = (variable: TemplateVariable) => {
    setEditingVariable(variable);
    variableForm.setFieldsValue(variable);
    setIsVariableModalVisible(true);
  };

  const handleSaveVariable = (values: any) => {
    const variable: TemplateVariable = {
      key: values.key,
      label: values.label,
      type: values.type,
      required: values.required || false,
      description: values.description,
      options: values.type === 'select' ? values.options : undefined,
      defaultValue: values.defaultValue,
      format: values.type === 'date' ? values.format : undefined
    };

    if (editingVariable) {
      // Update existing variable
      setTemplateData(prev => ({
        ...prev,
        variables: prev.variables.map(v => 
          v.key === editingVariable.key ? variable : v
        )
      }));
    } else {
      // Add new variable
      setTemplateData(prev => ({
        ...prev,
        variables: [...prev.variables, variable]
      }));
    }

    setIsVariableModalVisible(false);
    variableForm.resetFields();
  };

  const handleDeleteVariable = (variableKey: string) => {
    setTemplateData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v.key !== variableKey)
    }));
  };

  const handleSave = () => {
    const updatedTemplate: ContractTemplate = {
      ...templateData,
      id: templateData.id || `template-${Date.now()}`,
      lastModified: new Date().toISOString()
    };
    onSave(updatedTemplate);
  };

  const generatePreview = () => {
    const preview = TemplateEngine.generatePreview(templateData);
    return preview;
  };

  const toolbarButtons = [
    { command: 'bold', icon: FaBold, tooltip: 'Bold' },
    { command: 'italic', icon: FaItalic, tooltip: 'Italic' },
    { command: 'underline', icon: FaUnderline, tooltip: 'Underline' },
    { type: 'divider' },
    { command: 'justifyLeft', icon: FaAlignLeft, tooltip: 'Align Left' },
    { command: 'justifyCenter', icon: FaAlignCenter, tooltip: 'Align Center' },
    { command: 'justifyRight', icon: FaAlignRight, tooltip: 'Align Right' },
    { type: 'divider' },
    { command: 'insertUnorderedList', icon: FaListUl, tooltip: 'Bullet List' },
    { command: 'insertOrderedList', icon: FaListOl, tooltip: 'Numbered List' },
    { type: 'divider' },
    { command: 'undo', icon: FaUndo, tooltip: 'Undo' },
    { command: 'redo', icon: FaRedo, tooltip: 'Redo' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Card size="small" style={{ marginBottom: '16px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Input
              placeholder="Template Name"
              value={templateData.name}
              onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
            />
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              value={templateData.category}
              onChange={(value) => setTemplateData(prev => ({ ...prev, category: value }))}
            >
              <Option value="membership">Membership Contract</Option>
              <Option value="training">Personal Training</Option>
              <Option value="corporate">Corporate Contract</Option>
              <Option value="trial">Trial Membership</Option>
              <Option value="custom">Custom Contract</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Space>
              <Button 
                icon={<FaEye />}
                onClick={() => setIsPreviewVisible(true)}
              >
                Preview
              </Button>
              <Button 
                type="primary" 
                icon={<FaSave />}
                onClick={handleSave}
                disabled={!templateData.name.trim() || !templateData.content.trim()}
              >
                Save Template
              </Button>
              <Button onClick={onCancel}>
                Cancel
              </Button>
            </Space>
          </Col>
        </Row>
        
        <div style={{ marginTop: '12px' }}>
          <Input
            placeholder="Template Description"
            value={templateData.description}
            onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
      </Card>

      <Row gutter={16} style={{ flex: 1 }}>
        {/* Editor */}
        <Col span={16}>
          <Card 
            title="Contract Template Editor"
            size="small"
            extra={
              <Space>
                <Button
                  type={editorMode === 'wysiwyg' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setEditorMode('wysiwyg')}
                >
                  Visual
                </Button>
                <Button
                  type={editorMode === 'html' ? 'primary' : 'default'}
                  size="small"
                  icon={<FaCode />}
                  onClick={() => setEditorMode('html')}
                >
                  HTML
                </Button>
              </Space>
            }
            style={{ height: '100%' }}
            styles={{ body: { height: 'calc(100% - 57px)', display: 'flex', flexDirection: 'column' } }}
          >
            {editorMode === 'wysiwyg' && (
              <div style={{ marginBottom: '8px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                <Space wrap>
                  {toolbarButtons.map((button, index) => {
                    if (button.type === 'divider') {
                      return <Divider key={index} type="vertical" />;
                    }
                    
                    const IconComponent = button.icon;
                    return (
                      <Tooltip key={button.command} title={button.tooltip}>
                        <Button
                          type="text"
                          size="small"
                          icon={<IconComponent />}
                          onClick={() => formatText(button.command)}
                        />
                      </Tooltip>
                    );
                  })}
                </Space>
              </div>
            )}
            
            {editorMode === 'wysiwyg' ? (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={updateContent}
                style={{
                  flex: 1,
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '12px',
                  minHeight: '300px',
                  backgroundColor: 'white',
                  overflow: 'auto'
                }}
              />
            ) : (
              <TextArea
                value={templateData.content}
                onChange={(e) => setTemplateData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter HTML content..."
                style={{ flex: 1, minHeight: '300px' }}
                autoSize={{ minRows: 15, maxRows: 25 }}
              />
            )}
          </Card>
        </Col>

        {/* Variables Panel */}
        <Col span={8}>
          <Card 
            title="Template Variables"
            size="small"
            extra={
              <Button
                type="primary"
                size="small"
                icon={<FaPlus />}
                onClick={handleAddCustomVariable}
              >
                Add Variable
              </Button>
            }
            style={{ height: '100%' }}
            styles={{ body: { height: 'calc(100% - 57px)', overflow: 'auto' } }}
          >
            {/* Common Variables */}
            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>Common Variables</Title>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {COMMON_VARIABLES.map(variable => (
                  <Tooltip key={variable.key} title={variable.description}>
                    <Tag
                      style={{ cursor: 'pointer', margin: '2px' }}
                      onClick={() => insertVariable(variable)}
                    >
                      {variable.label}
                    </Tag>
                  </Tooltip>
                ))}
              </div>
            </div>

            <Divider />

            {/* Template Variables */}
            <div>
              <Title level={5}>Template Variables</Title>
              {templateData.variables.length === 0 ? (
                <Text style={{ color: '#8c8c8c' }}>No variables added yet</Text>
              ) : (
                <List
                  size="small"
                  dataSource={templateData.variables}
                  renderItem={(variable) => (
                    <List.Item
                      actions={[
                        <Button
                          key="edit"
                          type="text"
                          size="small"
                          icon={<FaEdit />}
                          onClick={() => handleEditVariable(variable)}
                        />,
                        <Button
                          key="delete"
                          type="text"
                          size="small"
                          icon={<FaTrash />}
                          danger
                          onClick={() => handleDeleteVariable(variable.key)}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <div>
                            <Text strong>{variable.label}</Text>
                            {variable.required && <Tag color="red" size="small">Required</Tag>}
                          </div>
                        }
                        description={
                          <div>
                            <Text code style={{ fontSize: '11px' }}>{`{{${variable.key}}}`}</Text>
                            <br />
                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                              {variable.description}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Preview Modal */}
      <Modal
        title="Contract Preview"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={800}
      >
        <Alert
          message="Sample Data Preview"
          description="This preview uses sample data to demonstrate how the contract will look when filled out."
          type="info"
          style={{ marginBottom: '16px' }}
        />
        <div 
          style={{ 
            border: '1px solid #d9d9d9', 
            borderRadius: '6px', 
            padding: '16px',
            backgroundColor: 'white',
            minHeight: '400px'
          }}
          dangerouslySetInnerHTML={{ __html: generatePreview() }}
        />
      </Modal>

      {/* Variable Modal */}
      <Modal
        title={editingVariable ? 'Edit Variable' : 'Add Custom Variable'}
        open={isVariableModalVisible}
        onCancel={() => setIsVariableModalVisible(false)}
        onOk={() => variableForm.submit()}
      >
        <Form
          form={variableForm}
          layout="vertical"
          onFinish={handleSaveVariable}
        >
          <Form.Item
            name="key"
            label="Variable Key"
            rules={[{ required: true, message: 'Please enter variable key' }]}
          >
            <Input placeholder="e.g., client.membershipId" />
          </Form.Item>
          
          <Form.Item
            name="label"
            label="Display Label"
            rules={[{ required: true, message: 'Please enter display label' }]}
          >
            <Input placeholder="e.g., Membership ID" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Variable Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select placeholder="Select type">
                  <Option value="text">Text</Option>
                  <Option value="number">Number</Option>
                  <Option value="date">Date</Option>
                  <Option value="email">Email</Option>
                  <Option value="phone">Phone</Option>
                  <Option value="address">Address</Option>
                  <Option value="select">Select Options</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="required"
                valuePropName="checked"
                label=" "
              >
                <Tag color="red">Required Variable</Tag>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input placeholder="Brief description of this variable" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

