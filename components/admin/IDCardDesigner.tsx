'use client';

import React, { useState, useRef } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  Row, 
  Col, 
  Typography,
  Divider,
  Space,
  ColorPicker,
  InputNumber,
  Switch,
  Upload,
  message,
  Slider,
  Form
} from 'antd';
import { 
  FaSave,
  FaEye,
  FaImage,
  FaFont,
  FaPalette,
  FaRuler,
  FaUpload,
  FaArrowDown,
  FaArrowUp,
  FaTrash,
  FaPlus
} from 'react-icons/fa';

const { Title, Text } = Typography;
const { Option } = Select;

export interface IDCardElement {
  id: string;
  type: 'text' | 'image' | 'qr' | 'barcode' | 'logo';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  rotation?: number;
  opacity?: number;
}

export interface IDCardTemplate {
  id: string;
  name: string;
  description: string;
  width: number; // in mm
  height: number; // in mm
  backgroundColor: string;
  backgroundImage?: string;
  elements: IDCardElement[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

interface IDCardDesignerProps {
  template?: IDCardTemplate;
  onSave: (template: IDCardTemplate) => void;
  onCancel: () => void;
}

const CARD_SIZES = {
  'standard': { width: 85.6, height: 54, label: 'Standard (Credit Card Size)' },
  'large': { width: 100, height: 60, label: 'Large Card' },
  'badge': { width: 76, height: 102, label: 'Badge (Portrait)' },
  'custom': { width: 85.6, height: 54, label: 'Custom Size' }
};

const SAMPLE_DATA = {
  'member.name': 'John Doe',
  'member.id': 'GYM001234',
  'member.phone': '(555) 123-4567',
  'member.email': 'john.doe@email.com',
  'member.joinDate': '01/15/2024',
  'member.expiryDate': '01/15/2025',
  'member.membershipType': 'Premium',
  'gym.name': 'FitConnect Gym',
  'gym.address': '123 Fitness St, City, ST 12345',
  'gym.phone': '(555) 987-6543',
  'today': new Date().toLocaleDateString()
};

export default function IDCardDesigner({ template, onSave, onCancel }: IDCardDesignerProps) {
  const [cardTemplate, setCardTemplate] = useState<IDCardTemplate>(() => 
    template || {
      id: '',
      name: '',
      description: '',
      width: CARD_SIZES.standard.width,
      height: CARD_SIZES.standard.height,
      backgroundColor: '#ffffff',
      elements: [],
      isActive: true,
      createdBy: 'admin@fitconnect.com',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
  );

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(200); // 200% zoom for better visibility

  const addElement = (type: IDCardElement['type']) => {
    const newElement: IDCardElement = {
      id: `element-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      x: 10,
      y: 10,
      width: getDefaultWidth(type),
      height: getDefaultHeight(type),
      fontSize: 14,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#000000',
      backgroundColor: 'transparent',
      borderRadius: 0,
      borderWidth: 0,
      borderColor: '#000000',
      rotation: 0,
      opacity: 1
    };

    setCardTemplate(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));

    setSelectedElement(newElement.id);
  };

  const getDefaultContent = (type: string): string => {
    switch (type) {
      case 'text': return '{{member.name}}';
      case 'image': return '';
      case 'qr': return '{{member.id}}';
      case 'barcode': return '{{member.id}}';
      case 'logo': return '';
      default: return '';
    }
  };

  const getDefaultWidth = (type: string): number => {
    switch (type) {
      case 'text': return 60;
      case 'image': return 40;
      case 'qr': return 25;
      case 'barcode': return 50;
      case 'logo': return 30;
      default: return 40;
    }
  };

  const getDefaultHeight = (type: string): number => {
    switch (type) {
      case 'text': return 6;
      case 'image': return 30;
      case 'qr': return 25;
      case 'barcode': return 15;
      case 'logo': return 20;
      default: return 20;
    }
  };

  const updateElement = (elementId: string, updates: Partial<IDCardElement>) => {
    setCardTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  };

  const deleteElement = (elementId: string) => {
    setCardTemplate(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  };

  const moveElementLayer = (elementId: string, direction: 'up' | 'down') => {
    setCardTemplate(prev => {
      const elements = [...prev.elements];
      const index = elements.findIndex(el => el.id === elementId);
      
      if (direction === 'up' && index < elements.length - 1) {
        [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
      } else if (direction === 'down' && index > 0) {
        [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
      }
      
      return { ...prev, elements };
    });
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setSelectedElement(elementId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    const element = cardTemplate.elements.find(el => el.id === selectedElement);
    if (element) {
      const newX = Math.max(0, Math.min(cardTemplate.width - element.width, element.x + deltaX));
      const newY = Math.max(0, Math.min(cardTemplate.height - element.height, element.y + deltaY));
      
      updateElement(selectedElement, { x: newX, y: newY });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderElement = (element: IDCardElement) => {
    const scale = zoom / 100;
    
    // Process content with sample data
    let processedContent = element.content;
    Object.entries(SAMPLE_DATA).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processedContent = processedContent.replace(regex, value);
    });

    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x * scale}px`,
      top: `${element.y * scale}px`,
      width: `${element.width * scale}px`,
      height: `${element.height * scale}px`,
      fontSize: `${(element.fontSize || 14) * scale}px`,
      fontFamily: element.fontFamily || 'Arial',
      fontWeight: element.fontWeight || 'normal',
      color: element.color || '#000000',
      backgroundColor: element.backgroundColor || 'transparent',
      borderRadius: `${(element.borderRadius || 0) * scale}px`,
      border: element.borderWidth ? `${element.borderWidth * scale}px solid ${element.borderColor}` : 'none',
      transform: `rotate(${element.rotation || 0}deg)`,
      opacity: element.opacity || 1,
      cursor: 'move',
      border: selectedElement === element.id ? `2px solid #4CAF50` : element.borderWidth ? `${element.borderWidth * scale}px solid ${element.borderColor}` : 'none',
      zIndex: selectedElement === element.id ? 1000 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: element.type === 'text' ? 'flex-start' : 'center',
      padding: element.type === 'text' ? `${2 * scale}px` : '0',
      boxSizing: 'border-box',
      overflow: 'hidden'
    };

    const handleElementClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedElement(element.id);
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={style}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={handleElementClick}
          >
            {processedContent || 'Text'}
          </div>
        );
      
      case 'image':
      case 'logo':
        return (
          <div
            key={element.id}
            style={style}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={handleElementClick}
          >
            {element.content ? (
              <img 
                src={element.content} 
                alt="ID Card Element"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#f0f0f0',
                border: '2px dashed #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${10 * scale}px`,
                color: '#8c8c8c'
              }}>
                {element.type === 'logo' ? 'Logo' : 'Image'}
              </div>
            )}
          </div>
        );
      
      case 'qr':
        return (
          <div
            key={element.id}
            style={style}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={handleElementClick}
          >
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000000',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gridTemplateRows: 'repeat(8, 1fr)',
              gap: '1px'
            }}>
              {Array.from({ length: 64 }, (_, i) => (
                <div 
                  key={i}
                  style={{ 
                    backgroundColor: Math.random() > 0.5 ? '#000' : '#fff' 
                  }} 
                />
              ))}
            </div>
          </div>
        );
      
      case 'barcode':
        return (
          <div
            key={element.id}
            style={style}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={handleElementClick}
          >
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center'
            }}>
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: `${100 / 20}%`,
                    height: '80%',
                    backgroundColor: i % 2 === 0 ? '#000' : '#fff'
                  }}
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const selectedElementData = selectedElement 
    ? cardTemplate.elements.find(el => el.id === selectedElement)
    : null;

  const handleSave = () => {
    const updatedTemplate: IDCardTemplate = {
      ...cardTemplate,
      id: cardTemplate.id || `id-template-${Date.now()}`,
      lastModified: new Date().toISOString()
    };
    onSave(updatedTemplate);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Panel - Tools */}
      <div style={{ width: '300px', borderRight: '1px solid #f0f0f0', padding: '16px', overflow: 'auto' }}>
        <Title level={4}>Card Properties</Title>
        
        <Form layout="vertical" size="small">
          <Form.Item label="Template Name">
            <Input
              value={cardTemplate.name}
              onChange={(e) => setCardTemplate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter template name"
            />
          </Form.Item>
          
          <Form.Item label="Card Size">
            <Select
              value="standard"
              onChange={(value) => {
                const size = CARD_SIZES[value as keyof typeof CARD_SIZES];
                setCardTemplate(prev => ({
                  ...prev,
                  width: size.width,
                  height: size.height
                }));
              }}
            >
              {Object.entries(CARD_SIZES).map(([key, size]) => (
                <Option key={key} value={key}>{size.label}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="Width (mm)">
                <InputNumber
                  value={cardTemplate.width}
                  onChange={(value) => setCardTemplate(prev => ({ ...prev, width: value || 85.6 }))}
                  min={30}
                  max={200}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Height (mm)">
                <InputNumber
                  value={cardTemplate.height}
                  onChange={(value) => setCardTemplate(prev => ({ ...prev, height: value || 54 }))}
                  min={30}
                  max={200}
                  step={0.1}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="Background Color">
            <ColorPicker
              value={cardTemplate.backgroundColor}
              onChange={(color) => setCardTemplate(prev => ({ 
                ...prev, 
                backgroundColor: typeof color === 'string' ? color : color.toHexString() 
              }))}
            />
          </Form.Item>
        </Form>

        <Divider />

        <Title level={5}>Add Elements</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button icon={<FaFont />} onClick={() => addElement('text')} block>
            Add Text
          </Button>
          <Button icon={<FaImage />} onClick={() => addElement('image')} block>
            Add Image
          </Button>
          <Button icon={<FaImage />} onClick={() => addElement('logo')} block>
            Add Logo
          </Button>
          <Button onClick={() => addElement('qr')} block>
            Add QR Code
          </Button>
          <Button onClick={() => addElement('barcode')} block>
            Add Barcode
          </Button>
        </Space>

        {selectedElementData && (
          <>
            <Divider />
            <Title level={5}>Element Properties</Title>
            
            <Form layout="vertical" size="small">
              <Form.Item label="Content">
                {selectedElementData.type === 'text' ? (
                  <Input.TextArea
                    value={selectedElementData.content}
                    onChange={(e) => updateElement(selectedElement!, { content: e.target.value })}
                    rows={3}
                    placeholder="Enter text or {{variable}}"
                  />
                ) : selectedElementData.type === 'image' || selectedElementData.type === 'logo' ? (
                  <Input
                    value={selectedElementData.content}
                    onChange={(e) => updateElement(selectedElement!, { content: e.target.value })}
                    placeholder="Image URL or upload"
                    addonAfter={
                      <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={(file) => {
                          const reader = new FileReader();
                          reader.onload = () => {
                            updateElement(selectedElement!, { content: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                          return false;
                        }}
                      >
                        <Button icon={<FaUpload />} size="small" />
                      </Upload>
                    }
                  />
                ) : (
                  <Input
                    value={selectedElementData.content}
                    onChange={(e) => updateElement(selectedElement!, { content: e.target.value })}
                    placeholder="Content for QR/Barcode"
                  />
                )}
              </Form.Item>

              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="X Position">
                    <InputNumber
                      value={selectedElementData.x}
                      onChange={(value) => updateElement(selectedElement!, { x: value || 0 })}
                      min={0}
                      max={cardTemplate.width}
                      step={0.1}
                      size="small"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Y Position">
                    <InputNumber
                      value={selectedElementData.y}
                      onChange={(value) => updateElement(selectedElement!, { y: value || 0 })}
                      min={0}
                      max={cardTemplate.height}
                      step={0.1}
                      size="small"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="Width">
                    <InputNumber
                      value={selectedElementData.width}
                      onChange={(value) => updateElement(selectedElement!, { width: value || 10 })}
                      min={1}
                      max={cardTemplate.width}
                      step={0.1}
                      size="small"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Height">
                    <InputNumber
                      value={selectedElementData.height}
                      onChange={(value) => updateElement(selectedElement!, { height: value || 10 })}
                      min={1}
                      max={cardTemplate.height}
                      step={0.1}
                      size="small"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {selectedElementData.type === 'text' && (
                <>
                  <Form.Item label="Font Size">
                    <InputNumber
                      value={selectedElementData.fontSize}
                      onChange={(value) => updateElement(selectedElement!, { fontSize: value || 14 })}
                      min={6}
                      max={72}
                      size="small"
                    />
                  </Form.Item>

                  <Form.Item label="Font Weight">
                    <Select
                      value={selectedElementData.fontWeight}
                      onChange={(value) => updateElement(selectedElement!, { fontWeight: value })}
                      size="small"
                    >
                      <Option value="normal">Normal</Option>
                      <Option value="bold">Bold</Option>
                      <Option value="lighter">Lighter</Option>
                    </Select>
                  </Form.Item>
                </>
              )}

              <Form.Item label="Color">
                <ColorPicker
                  value={selectedElementData.color}
                  onChange={(color) => updateElement(selectedElement!, { 
                    color: typeof color === 'string' ? color : color.toHexString() 
                  })}
                />
              </Form.Item>

              <Form.Item label="Layer">
                <Space>
                  <Button 
                    icon={<FaMoveUp />} 
                    size="small"
                    onClick={() => moveElementLayer(selectedElement!, 'up')}
                  />
                  <Button 
                    icon={<FaArrowDown />} 
                    size="small"
                    onClick={() => moveElementLayer(selectedElement!, 'down')}
                  />
                  <Button 
                    icon={<FaTrash />} 
                    size="small"
                    danger
                    onClick={() => deleteElement(selectedElement!)}
                  />
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </div>

      {/* Center Panel - Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <div style={{ 
          padding: '8px 16px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Text>Zoom: </Text>
            <Slider
              value={zoom}
              onChange={setZoom}
              min={50}
              max={400}
              step={25}
              style={{ width: '120px', display: 'inline-block', marginLeft: '8px' }}
            />
            <Text style={{ marginLeft: '8px' }}>{zoom}%</Text>
          </div>
          
          <Space>
            <Button icon={<FaEye />}>
              Preview
            </Button>
            <Button 
              type="primary" 
              icon={<FaSave />}
              onClick={handleSave}
              disabled={!cardTemplate.name.trim()}
            >
              Save Template
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Space>
        </div>

        {/* Canvas Area */}
        <div style={{ 
          flex: 1, 
          padding: '20px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto'
        }}>
          <div
            ref={canvasRef}
            style={{
              width: `${cardTemplate.width * (zoom / 100)}px`,
              height: `${cardTemplate.height * (zoom / 100)}px`,
              backgroundColor: cardTemplate.backgroundColor,
              position: 'relative',
              border: '2px solid #d9d9d9',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              cursor: selectedElement ? 'move' : 'default'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={() => setSelectedElement(null)}
          >
            {cardTemplate.elements.map(renderElement)}
          </div>
        </div>
      </div>
    </div>
  );
}

