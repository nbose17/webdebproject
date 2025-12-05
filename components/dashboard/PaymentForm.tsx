'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { mockPaymentMethods } from '@/lib/constants';
import styles from './PaymentForm.module.css';

export default function PaymentForm() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    fullName: '',
    country: '',
    billingAddress: '',
    state: '',
    phoneNumber: '',
    zipCode: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission
    console.log('Payment submitted', { selectedMethod, selectedPlan, paymentInfo });
  };

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentMethods}>
        <h3 className={styles.sectionTitle}>PAYMENT METHODS</h3>
        <div className={styles.methodsList}>
          {mockPaymentMethods.map((method) => (
            <div
              key={method.id}
              className={`${styles.methodCard} ${
                selectedMethod === method.id ? styles.selected : ''
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <span className={styles.methodName}>{method.name}</span>
            </div>
          ))}
        </div>
        <div className={styles.planSelection}>
          <div className={styles.planOption}>
            <input
              type="radio"
              id="premium"
              name="plan"
              value="premium"
              checked={selectedPlan === 'premium'}
              onChange={(e) => setSelectedPlan(e.target.value)}
            />
            <label htmlFor="premium">
              <strong>PREMIUM</strong> - $7
            </label>
          </div>
          <ul className={styles.featuresList}>
            <li>Enjoy limitless use with interactive export options</li>
            <li>Custom profile and more</li>
            <li>HD video streaming</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.paymentForm}>
        <h3 className={styles.sectionTitle}>PAYMENT INFORMATION</h3>
        <div className={styles.formGroup}>
          <label>Select a payment method</label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            required
            className={styles.select}
          >
            <option value="">Select...</option>
            {mockPaymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formRow}>
          <Input
            label="Expiration date (MM/YYYY)"
            value={paymentInfo.expirationDate}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, expirationDate: e.target.value })
            }
            placeholder="MM/YYYY"
            required
          />
          <Input
            label="Card Number"
            value={paymentInfo.cardNumber}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
            }
            required
          />
        </div>
        <Input
          label="Security code"
          value={paymentInfo.securityCode}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, securityCode: e.target.value })
          }
          required
        />

        <h3 className={styles.sectionTitle}>BILLING INFORMATION</h3>
        <Input
          label="Full name"
          value={paymentInfo.fullName}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, fullName: e.target.value })
          }
          required
        />
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Country</label>
            <select
              value={paymentInfo.country}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, country: e.target.value })
              }
              required
              className={styles.select}
            >
              <option value="">Select...</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>State</label>
            <select
              value={paymentInfo.state}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, state: e.target.value })
              }
              required
              className={styles.select}
            >
              <option value="">Select...</option>
              <option value="NY">New York</option>
              <option value="CA">California</option>
              <option value="TX">Texas</option>
            </select>
          </div>
        </div>
        <Input
          label="Billing Address"
          value={paymentInfo.billingAddress}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, billingAddress: e.target.value })
          }
          required
        />
        <div className={styles.formRow}>
          <Input
            label="Phone Number"
            value={paymentInfo.phoneNumber}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, phoneNumber: e.target.value })
            }
            required
          />
          <Input
            label="Zip or Postal Code"
            value={paymentInfo.zipCode}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, zipCode: e.target.value })
            }
            required
          />
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={paymentInfo.rememberMe}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, rememberMe: e.target.checked })
            }
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>
        <div className={styles.total}>
          <p>Total Amount: 84/yr</p>
          <p className={styles.note}>fund will be not refundable</p>
        </div>
        <Button type="submit" variant="primary" size="lg" className={styles.submitButton}>
          Continue
        </Button>
      </form>
    </div>
  );
}


