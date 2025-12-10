'use client';

import React from 'react';
import { Card, Typography, Space, Button, Input, Form, Row, Col } from 'antd';
import { FaDownload, FaPrint, FaEye } from 'react-icons/fa';
import { IDCardTemplate, IDCardElement } from './IDCardDesigner';

const { Title, Text } = Typography;

interface IDCardPreviewProps {
  template: IDCardTemplate;
  memberData?: Record<string, any>;
  showControls?: boolean;
  onDataChange?: (data: Record<string, any>) => void;
}

const DEFAULT_MEMBER_DATA = {
  'member.name': 'John Doe',
  'member.id': 'GYM001234',
  'member.phone': '(555) 123-4567',
  'member.email': 'john.doe@email.com',
  'member.joinDate': '01/15/2024',
  'member.expiryDate': '01/15/2025',
  'member.membershipType': 'Premium',
  'member.photo': '/images/member-placeholder.jpg',
  'gym.name': 'FitConnect Gym',
  'gym.address': '123 Fitness St, City, ST 12345',
  'gym.phone': '(555) 987-6543',
  'gym.logo': '/images/gym-logo.png',
  'today': new Date().toLocaleDateString()
};

export default function IDCardPreview({ 
  template, 
  memberData = DEFAULT_MEMBER_DATA,
  showControls = false,
  onDataChange
}: IDCardPreviewProps) {
  const [previewData, setPreviewData] = React.useState<Record<string, any>>(memberData);
  const [form] = Form.useForm();

  // Convert mm to pixels (assuming 300 DPI for high quality)
  const MM_TO_PX = 11.81; // 300 DPI conversion factor
  const cardWidthPx = template.width * MM_TO_PX;
  const cardHeightPx = template.height * MM_TO_PX;

  // For display, we'll scale it down to fit nicely
  const displayScale = 0.6;
  const displayWidth = cardWidthPx * displayScale;
  const displayHeight = cardHeightPx * displayScale;

  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(previewData);
    }
  }, [previewData, onDataChange]);

  const processContent = (content: string): string => {
    let processed = content;
    Object.entries(previewData).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*}}`, 'g');
      processed = processed.replace(regex, String(value || ''));
    });
    return processed;
  };

  const renderElement = (element: IDCardElement) => {
    const processedContent = processContent(element.content);
    
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x * MM_TO_PX * displayScale}px`,
      top: `${element.y * MM_TO_PX * displayScale}px`,
      width: `${element.width * MM_TO_PX * displayScale}px`,
      height: `${element.height * MM_TO_PX * displayScale}px`,
      fontSize: `${(element.fontSize || 14) * displayScale}px`,
      fontFamily: element.fontFamily || 'Arial, sans-serif',
      fontWeight: element.fontWeight || 'normal',
      color: element.color || '#000000',
      backgroundColor: element.backgroundColor || 'transparent',
      borderRadius: `${(element.borderRadius || 0) * displayScale}px`,
      border: element.borderWidth ? 
        `${element.borderWidth * displayScale}px solid ${element.borderColor}` : 'none',
      transform: `rotate(${element.rotation || 0}deg)`,
      opacity: element.opacity || 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: element.type === 'text' ? 'flex-start' : 'center',
      padding: element.type === 'text' ? `${2 * displayScale}px` : '0',
      boxSizing: 'border-box',
      overflow: 'hidden',
      lineHeight: '1.2'
    };

    switch (element.type) {
      case 'text':
        return (
          <div key={element.id} style={style}>
            {processedContent || 'Text'}
          </div>
        );
      
      case 'image':
        return (
          <div key={element.id} style={style}>
            {processedContent ? (
              <img 
                src={processedContent} 
                alt="Member Photo"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: `${(element.borderRadius || 0) * displayScale}px`
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/images/placeholder-image.png';
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                border: '1px dashed #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${8 * displayScale}px`,
                color: '#8c8c8c'
              }}>
                Photo
              </div>
            )}
          </div>
        );
      
      case 'logo':
        return (
          <div key={element.id} style={style}>
            {processedContent ? (
              <img 
                src={processedContent} 
                alt="Gym Logo"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/images/placeholder-logo.png';
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                border: '1px dashed #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${8 * displayScale}px`,
                color: '#8c8c8c'
              }}>
                Logo
              </div>
            )}
          </div>
        );
      
      case 'qr':
        return (
          <div key={element.id} style={style}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: 'repeat(12, 1fr)',
              gap: `${0.5 * displayScale}px`,
              padding: `${2 * displayScale}px`,
              boxSizing: 'border-box'
            }}>
              {Array.from({ length: 144 }, (_, i) => {
                // Create a simple QR-like pattern based on the content
                const contentHash = processedContent.split('').reduce((a, b) => {
                  a = ((a << 5) - a) + b.charCodeAt(0);
                  return a & a;
                }, 0);
                const isBlack = (contentHash + i) % 3 !== 0;
                
                return (
                  <div 
                    key={i}
                    style={{ 
                      backgroundColor: isBlack ? '#000' : '#fff',
                      borderRadius: `${0.5 * displayScale}px`
                    }} 
                  />
                );
              })}
            </div>
          </div>
        );
      
      case 'barcode':
        return (
          <div key={element.id} style={style}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              padding: `${2 * displayScale}px`,
              boxSizing: 'border-box'
            }}>
              {Array.from({ length: 30 }, (_, i) => {
                // Create barcode pattern based on content
                const contentHash = processedContent.split('').reduce((a, b) => {
                  a = ((a << 5) - a) + b.charCodeAt(0);
                  return a & a;
                }, 0);
                const width = ((contentHash + i) % 3) + 1;
                const isBlack = (contentHash + i) % 2 === 0;
                
                return (
                  <div
                    key={i}
                    style={{
                      width: `${width}px`,
                      height: '80%',
                      backgroundColor: isBlack ? '#000' : '#fff',
                      marginRight: `${0.5 * displayScale}px`
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ID Card - ${previewData['member.name']}</title>
            <style>
              body { margin: 0; padding: 20px; }
              .id-card { 
                width: ${cardWidthPx}px; 
                height: ${cardHeightPx}px; 
                position: relative;
                background-color: ${template.backgroundColor};
                margin: 0 auto;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .id-card { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="id-card">
              ${template.elements.map(element => {
                const processedContent = processContent(element.content);
                const elementStyle = `
                  position: absolute;
                  left: ${element.x * MM_TO_PX}px;
                  top: ${element.y * MM_TO_PX}px;
                  width: ${element.width * MM_TO_PX}px;
                  height: ${element.height * MM_TO_PX}px;
                  font-size: ${element.fontSize || 14}px;
                  font-family: ${element.fontFamily || 'Arial, sans-serif'};
                  font-weight: ${element.fontWeight || 'normal'};
                  color: ${element.color || '#000000'};
                  background-color: ${element.backgroundColor || 'transparent'};
                  border-radius: ${element.borderRadius || 0}px;
                  border: ${element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor}` : 'none'};
                  transform: rotate(${element.rotation || 0}deg);
                  opacity: ${element.opacity || 1};
                  display: flex;
                  align-items: center;
                  justify-content: ${element.type === 'text' ? 'flex-start' : 'center'};
                  padding: ${element.type === 'text' ? '2px' : '0'};
                  box-sizing: border-box;
                  overflow: hidden;
                  line-height: 1.2;
                `;
                
                if (element.type === 'text') {
                  return `<div style="${elementStyle}">${processedContent || 'Text'}</div>`;
                } else if (element.type === 'image' || element.type === 'logo') {
                  return processedContent ? 
                    `<div style="${elementStyle}"><img src="${processedContent}" style="width: 100%; height: 100%; object-fit: ${element.type === 'image' ? 'cover' : 'contain'};" /></div>` :
                    `<div style="${elementStyle}; background-color: #f0f0f0; border: 1px dashed #d9d9d9; font-size: 8px; color: #8c8c8c;">${element.type === 'logo' ? 'Logo' : 'Photo'}</div>`;
                }
                return '';
              }).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    // This is a simplified download - in a real app, you'd generate a proper image
    const canvas = document.createElement('canvas');
    canvas.width = cardWidthPx;
    canvas.height = cardHeightPx;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fill background
      ctx.fillStyle = template.backgroundColor;
      ctx.fillRect(0, 0, cardWidthPx, cardHeightPx);
      
      // Add text elements (simplified)
      template.elements.forEach(element => {
        if (element.type === 'text') {
          const processedContent = processContent(element.content);
          ctx.fillStyle = element.color || '#000000';
          ctx.font = `${element.fontWeight || 'normal'} ${element.fontSize || 14}px ${element.fontFamily || 'Arial'}`;
          ctx.fillText(
            processedContent, 
            element.x * MM_TO_PX, 
            (element.y + element.height / 2) * MM_TO_PX
          );
        }
      });
      
      // Download as image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `id-card-${previewData['member.name'] || 'member'}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <div>
      {showControls && (
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Title level={5}>Member Information</Title>
          <Form form={form} layout="vertical" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Full Name">
                  <Input
                    value={previewData['member.name']}
                    onChange={(e) => setPreviewData(prev => ({ ...prev, 'member.name': e.target.value }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Member ID">
                  <Input
                    value={previewData['member.id']}
                    onChange={(e) => setPreviewData(prev => ({ ...prev, 'member.id': e.target.value }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Membership Type">
                  <Input
                    value={previewData['member.membershipType']}
                    onChange={(e) => setPreviewData(prev => ({ ...prev, 'member.membershipType': e.target.value }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Phone">
                  <Input
                    value={previewData['member.phone']}
                    onChange={(e) => setPreviewData(prev => ({ ...prev, 'member.phone': e.target.value }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Email">
                  <Input
                    value={previewData['member.email']}
                    onChange={(e) => setPreviewData(prev => ({ ...prev, 'member.email': e.target.value }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Expiry Date">
                  <Input
                    value={previewData['member.expiryDate']}
                    onChange={(e) => setPreviewData(prev => ({ ...prev, 'member.expiryDate': e.target.value }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      <Card 
        title="ID Card Preview"
        extra={
          <Space>
            <Button icon={<FaPrint />} onClick={handlePrint}>
              Print
            </Button>
            <Button icon={<FaDownload />} onClick={handleDownload}>
              Download
            </Button>
          </Space>
        }
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <div
            style={{
              width: `${displayWidth}px`,
              height: `${displayHeight}px`,
              backgroundColor: template.backgroundColor,
              position: 'relative',
              border: '2px solid #d9d9d9',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden'
            }}
          >
            {template.elements.map(renderElement)}
          </div>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
            Actual size: {template.width}mm × {template.height}mm
          </Text>
        </div>
      </Card>
    </div>
  );
}