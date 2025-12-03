'use client';

import { QRCode } from 'qrcode.react';
import { advertisementSubscription } from '@/lib/constants';
import Button from '@/components/shared/Button';
import styles from './QRCodeDisplay.module.css';

export default function QRCodeDisplay() {
  const handleDownload = () => {
    // In a real app, this would download the QR code image
    const svg = document.querySelector('svg');
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
        downloadLink.download = 'qr-code.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h3 className={styles.title}>Pay subscription and Publish</h3>
        <p className={styles.description}>
          Standard rate of <strong>${advertisementSubscription.rate}/month</strong> for
          publishing advertisement. It will be live for{' '}
          <strong>{advertisementSubscription.duration} days</strong> and can be renewed.
        </p>
      </div>
      <div className={styles.qrSection}>
        <div className={styles.qrCode}>
          <QRCode value={advertisementSubscription.paymentLink} size={200} />
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={handleDownload}>
            Download QR
          </Button>
          <p className={styles.linkText}>
            Scan QR or go to the below link
            <br />
            <a
              href={advertisementSubscription.paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {advertisementSubscription.paymentLink}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

