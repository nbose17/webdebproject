'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { advertisementSubscription } from '@/lib/constants';
import styles from './PublishPaymentSection.module.css';

interface PublishPaymentSectionProps {
  onPaymentComplete: () => void;
  paymentCompleted: boolean;
}

export default function PublishPaymentSection({
  onPaymentComplete,
  paymentCompleted,
}: PublishPaymentSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    basic: {
      name: 'Basic',
      price: advertisementSubscription.rate,
      duration: advertisementSubscription.duration,
      features: ['Standard listing', '30 days visibility', 'Basic support'],
    },
    premium: {
      name: 'Premium',
      price: 7,
      duration: advertisementSubscription.duration,
      features: ['Featured placement', '30 days visibility', 'Priority support', 'Analytics'],
    },
  };

  const selectedPlanData = plans[selectedPlan];
  const totalAmount = selectedPlanData.price;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if (!cardInfo.cardNumber || !cardInfo.expirationDate || !cardInfo.securityCode) {
        alert('Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
      alert('Payment successful! You can now publish your gym.');
    }, 2000);
  };

  if (paymentCompleted) {
    return (
      <div className={styles.completedSection}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>Payment Completed</h3>
        <p className={styles.successMessage}>
          Your payment of ${totalAmount} has been processed successfully.
        </p>
        <p className={styles.successNote}>
          Your gym will be live for {selectedPlanData.duration} days after publishing.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.planSelection}>
        <h3 className={styles.sectionTitle}>Select Subscription Plan</h3>
        <div className={styles.plansGrid}>
          <div
            className={`${styles.planCard} ${
              selectedPlan === 'basic' ? styles.selected : ''
            }`}
            onClick={() => setSelectedPlan('basic')}
          >
            <div className={styles.planHeader}>
              <h4 className={styles.planName}>Basic</h4>
              <div className={styles.planPrice}>
                <span className={styles.priceAmount}>${plans.basic.price}</span>
                <span className={styles.pricePeriod}>/month</span>
              </div>
            </div>
            <ul className={styles.planFeatures}>
              {plans.basic.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div
            className={`${styles.planCard} ${
              selectedPlan === 'premium' ? styles.selected : ''
            }`}
            onClick={() => setSelectedPlan('premium')}
          >
            <div className={styles.planHeader}>
              <h4 className={styles.planName}>Premium</h4>
              <div className={styles.planPrice}>
                <span className={styles.priceAmount}>${plans.premium.price}</span>
                <span className={styles.pricePeriod}>/month</span>
              </div>
            </div>
            <ul className={styles.planFeatures}>
              {plans.premium.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handlePayment} className={styles.paymentForm}>
        <h3 className={styles.sectionTitle}>Payment Method</h3>
        
        <div className={styles.paymentMethods}>
          <button
            type="button"
            className={`${styles.methodButton} ${
              paymentMethod === 'paypal' ? styles.selected : ''
            }`}
            onClick={() => setPaymentMethod('paypal')}
          >
            PayPal
          </button>
          <button
            type="button"
            className={`${styles.methodButton} ${
              paymentMethod === 'card' ? styles.selected : ''
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            Credit Card
          </button>
        </div>

        {paymentMethod === 'card' && (
          <div className={styles.cardForm}>
            <Input
              label="Card Number"
              value={cardInfo.cardNumber}
              onChange={(e) =>
                setCardInfo({ ...cardInfo, cardNumber: e.target.value })
              }
              placeholder="1234 5678 9012 3456"
              required
            />
            <div className={styles.cardRow}>
              <Input
                label="Expiration (MM/YY)"
                value={cardInfo.expirationDate}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, expirationDate: e.target.value })
                }
                placeholder="MM/YY"
                required
              />
              <Input
                label="CVV"
                value={cardInfo.securityCode}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, securityCode: e.target.value })
                }
                placeholder="123"
                required
              />
            </div>
          </div>
        )}

        <div className={styles.totalSection}>
          <div className={styles.totalRow}>
            <span>Plan:</span>
            <span>{selectedPlanData.name}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Duration:</span>
            <span>{selectedPlanData.duration} days</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total Amount:</span>
            <span className={styles.totalAmount}>${totalAmount}</span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isProcessing}
          className={styles.payButton}
        >
          {isProcessing ? 'Processing...' : `Pay $${totalAmount}`}
        </Button>

        <p className={styles.termsNote}>
          By proceeding, you agree to our Terms of Service. Payment is non-refundable.
        </p>
      </form>
    </div>
  );
}

