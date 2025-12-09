'use client';

import QRCodeDisplay from '@/components/dashboard/QRCodeDisplay';

export default function AdvertisementPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Advertisement</h1>
          <p className="dashboard-page-subtitle">Share your gym's QR code and manage your subscription</p>
        </div>
      </div>
      <QRCodeDisplay />
    </div>
  );
}


