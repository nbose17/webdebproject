'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { mockGyms } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/shared/Button';
import { FaWhatsapp, FaTelegram, FaDownload } from 'react-icons/fa';

export default function QRCodeDisplay() {
  const { user } = useAuth();
  // In a real app, this would come from the user's gym data
  // For now, using gym ID '1' as default (first gym in mock data)
  const gymId = '1';
  const gym = mockGyms.find(g => g.id === gymId) || mockGyms[0];
  const [gymPageUrl, setGymPageUrl] = useState(`/gym/${gymId}`);

  useEffect(() => {
    // Set the full URL only on client side to avoid hydration mismatch
    setGymPageUrl(`${window.location.origin}/gym/${gymId}`);
  }, [gymId]);

  const handleDownloadQR = () => {
    const qrContainer = document.querySelector('.qr-code-container');
    const svg = qrContainer?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'gym-qr-code.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`Check out ${gym.name}!\n\nScan the QR code or visit: ${gymPageUrl}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareTelegram = () => {
    const message = encodeURIComponent(`Check out ${gym.name}!\n\nScan the QR code or visit: ${gymPageUrl}`);
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(gymPageUrl)}&text=${message}`;
    window.open(telegramUrl, '_blank');
  };

  const handleDownloadBrochure = async () => {
    try {
      // Create a canvas for the brochure
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(gym.name, canvas.width / 2, 80);

      // Location
      ctx.fillStyle = '#666666';
      ctx.font = '18px Arial';
      ctx.fillText(gym.location, canvas.width / 2, 120);

      // Description
      if (gym.description) {
        ctx.fillStyle = '#333333';
        ctx.font = '16px Arial';
        const words = gym.description.split(' ');
        let line = '';
        let y = 180;
        const maxWidth = 600;
        const lineHeight = 24;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, canvas.width / 2, y);
      }

      // Get QR code as image
      const qrContainer = document.querySelector('.qr-code-container');
      const qrSvg = qrContainer?.querySelector('svg');
      if (qrSvg) {
        const svgData = new XMLSerializer().serializeToString(qrSvg);
        const qrImg = new Image();
        qrImg.onload = () => {
          // Draw QR code
          const qrSize = 250;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = 300;
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

          // QR code label
          ctx.fillStyle = '#666666';
          ctx.font = '14px Arial';
          ctx.fillText('Scan to visit our gym page', canvas.width / 2, qrY + qrSize + 30);

          // URL
          ctx.fillStyle = '#999999';
          ctx.font = '14px Arial';
          ctx.fillText('Visit us online at', canvas.width / 2, qrY + qrSize + 80);
          
          ctx.fillStyle = '#007bff';
          ctx.font = 'bold 16px Arial';
          ctx.fillText(gymPageUrl, canvas.width / 2, qrY + qrSize + 110);

          // Download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const downloadLink = document.createElement('a');
              downloadLink.download = `${gym.name.replace(/\s+/g, '-')}-brochure.png`;
              downloadLink.href = url;
              downloadLink.click();
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        };
        qrImg.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    } catch (error) {
      console.error('Error generating brochure:', error);
      alert('Error generating brochure. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-2xl)', flexWrap: 'wrap' }}>
      {/* QR Share Section */}
      <div style={{ flex: '1', minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)', background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-sm)' }}>Share QR Code</h3>
        <div className="qr-code-container">
          <QRCodeSVG value={gymPageUrl} size={200} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-md)', width: '100%' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={handleShareWhatsApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: '#25D366',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#20BA5A';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#25D366';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaWhatsapp />
              <span>Share on WhatsApp</span>
            </button>
            <button
              onClick={handleShareTelegram}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: '#0088cc',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0077B5';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0088cc';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaTelegram />
              <span>Share on Telegram</span>
            </button>
          </div>
          <Button variant="outline" onClick={handleDownloadQR} size="sm">
            <FaDownload style={{ marginRight: '6px' }} />
            Download QR Code
          </Button>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            Scan QR or go to the below link
            <br />
            <a
              href={gymPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
            >
              {gymPageUrl}
            </a>
          </p>
        </div>
      </div>

      {/* Brochure Section */}
      <div style={{ flex: '1', minWidth: '400px', background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-xs)' }}>Advertising Brochure</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            Download a professional brochure with your gym's QR code
          </p>
          <Button variant="primary" onClick={handleDownloadBrochure} style={{ width: '100%' }}>
            <FaDownload style={{ marginRight: '6px' }} />
            Download Brochure
          </Button>
        </div>
        
        {/* Preview of brochure */}
        <div style={{ 
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-bg-secondary)',
          textAlign: 'center',
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            Brochure Preview
          </p>
          <div style={{ 
            display: 'inline-block',
            padding: 'var(--spacing-lg)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: '100%',
            margin: '0 auto',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
              <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-xs)' }}>
                {gym.name}
              </h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                {gym.location}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
              <QRCodeSVG value={gymPageUrl} size={150} />
            </div>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Scan to visit our gym page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

