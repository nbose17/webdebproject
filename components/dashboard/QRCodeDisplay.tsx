'use client';

import { QRCodeSVG } from 'qrcode.react';
import { advertisementSubscription } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/shared/Button';

export default function QRCodeDisplay() {
  const { user } = useAuth();
  // In a real app, this would come from the user's gym data
  // For now, using gym ID '1' as default (first gym in mock data)
  const gymId = '1';
  const gymPageUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/gym/${gymId}`
    : `/gym/${gymId}`;

  const handleDownload = () => {
    // In a real app, this would download the QR code image
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

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-2xl)', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-md)' }}>Pay subscription and Publish</h3>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
          Standard rate of <strong>${advertisementSubscription.rate}/month</strong> for
          publishing advertisement. It will be live for{' '}
          <strong>{advertisementSubscription.duration} days</strong> and can be renewed.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)', background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <div className="qr-code-container">
          <QRCodeSVG value={gymPageUrl} size={200} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <Button variant="primary" onClick={handleDownload}>
            Download QR
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
    </div>
  );
}

