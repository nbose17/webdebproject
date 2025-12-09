'use client';

import PaymentForm from '@/components/dashboard/PaymentForm';

export default function PaymentPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">Payment Gateway</h1>
      </div>
      <PaymentForm />
    </div>
  );
}


