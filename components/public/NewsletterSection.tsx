'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

interface NewsletterSectionProps {
  heading?: string;
  subHeading?: string;
  buttonText?: string;
}

export default function NewsletterSection({
  heading = 'GET CONNECTED WITH US',
  subHeading = 'Join our community for motivation',
  buttonText = 'Join Now',
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h2 className="newsletter-heading">{heading}</h2>
        <p className="newsletter-sub-heading">{subHeading}</p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="newsletter-input"
          />
          <Button type="submit" variant="primary" size="lg">
            {buttonText}
          </Button>
        </form>
      </div>
    </section>
  );
}





