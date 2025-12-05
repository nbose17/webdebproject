'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CMSReview from '@/components/dashboard/CMSReview';
import ListingInfoForm from '@/components/dashboard/ListingInfoForm';
import PublishPreview from '@/components/dashboard/PublishPreview';
import PublishPaymentSection from '@/components/dashboard/PublishPaymentSection';
import Button from '@/components/shared/Button';
import { mockCMSItems } from '@/lib/constants';
import { Gym } from '@/lib/types';
import styles from './page.module.css';

export default function PublishPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [cmsData, setCmsData] = useState(mockCMSItems);
  const [listingInfo, setListingInfo] = useState<Partial<Gym>>({
    name: '',
    location: '',
    image: '',
    description: '',
  });
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleListingInfoChange = (data: Partial<Gym>) => {
    setListingInfo({ ...listingInfo, ...data });
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    // Auto-advance to next step after payment
    setTimeout(() => {
      setCurrentStep(3);
    }, 500);
  };

  const handleNext = () => {
    if (currentStep === 1 && isFormValid) {
      setCurrentStep(2);
    } else if (currentStep === 2 && paymentCompleted) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    if (!paymentCompleted) {
      alert('Please complete payment before publishing');
      return;
    }

    if (!listingInfo.name || !listingInfo.location) {
      alert('Please fill in all required listing information');
      return;
    }

    setIsPublishing(true);
    
    // Simulate publishing process
    setTimeout(() => {
      alert('Gym published successfully!');
      setIsPublishing(false);
      // In real app, this would redirect to the published gym page
      // router.push(`/gym/${listingInfo.id}`);
    }, 1500);
  };

  const isFormValid = listingInfo.name && listingInfo.location && listingInfo.image;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Publish Your Gym</h1>
        <p className={styles.subtitle}>
          Review your content, complete payment, and publish your gym to the public listing
        </p>
      </div>

      <div className={styles.progressIndicator}>
        <div 
          className={`${styles.step} ${currentStep === 1 ? styles.active : ''} ${isFormValid ? styles.completed : ''}`}
          onClick={() => setCurrentStep(1)}
        >
          <span className={styles.stepNumber}>1</span>
          <span className={styles.stepLabel}>Gym Information</span>
        </div>
        <div className={styles.stepDivider} />
        <div 
          className={`${styles.step} ${currentStep === 2 ? styles.active : ''} ${paymentCompleted ? styles.completed : ''} ${!isFormValid ? styles.disabled : ''}`}
          onClick={() => isFormValid && setCurrentStep(2)}
        >
          <span className={styles.stepNumber}>2</span>
          <span className={styles.stepLabel}>Payment</span>
        </div>
        <div className={styles.stepDivider} />
        <div 
          className={`${styles.step} ${currentStep === 3 ? styles.active : ''} ${paymentCompleted && isFormValid ? styles.completed : ''} ${!paymentCompleted || !isFormValid ? styles.disabled : ''}`}
          onClick={() => paymentCompleted && isFormValid && setCurrentStep(3)}
        >
          <span className={styles.stepNumber}>3</span>
          <span className={styles.stepLabel}>Publish</span>
        </div>
      </div>

      <div className={styles.contentFlow}>
        {/* Section 1: Gym Information */}
        {currentStep === 1 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>1</div>
              <div>
                <h2 className={styles.sectionTitle}>Gym Information</h2>
                <p className={styles.sectionDescription}>
                  Review your CMS content and fill in listing information
                </p>
              </div>
            </div>

            <div className={styles.sectionContent}>
              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>CMS Content Review</h3>
                <CMSReview cmsData={cmsData} />
                <p className={styles.editLink}>
                  <a href="/dashboard/cms">Edit CMS Content →</a>
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Listing Information</h3>
                <p className={styles.sectionDescription}>
                  Fill in the information that will appear on the gym listing page
                </p>
                <ListingInfoForm
                  data={listingInfo}
                  onChange={handleListingInfoChange}
                />
              </div>
            </div>

            <div className={styles.sectionFooter}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={!isFormValid}
              >
                Continue to Payment →
              </Button>
            </div>
          </section>
        )}

        {/* Section 2: Payment */}
        {currentStep === 2 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>2</div>
              <div>
                <h2 className={styles.sectionTitle}>Payment</h2>
                <p className={styles.sectionDescription}>
                  Select your subscription plan and complete payment
                </p>
              </div>
            </div>

            <div className={styles.sectionContent}>
              <PublishPaymentSection
                onPaymentComplete={handlePaymentComplete}
                paymentCompleted={paymentCompleted}
              />
            </div>

            <div className={styles.sectionFooter}>
              <div className={styles.navigationButtons}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePrevious}
                >
                  ← Back
                </Button>
                {paymentCompleted && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleNext}
                  >
                    Continue to Publish →
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Preview & Publish */}
        {currentStep === 3 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>3</div>
              <div>
                <h2 className={styles.sectionTitle}>Preview & Publish</h2>
                <p className={styles.sectionDescription}>
                  Review your gym listing and publish to go live
                </p>
              </div>
            </div>

            <div className={styles.sectionContent}>
              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Preview</h3>
                <PublishPreview
                  listingInfo={listingInfo}
                  cmsData={cmsData}
                />
              </div>

              <div className={styles.publishSection}>
                <div className={styles.statusChecklist}>
                  <div className={`${styles.statusItem} ${isFormValid ? styles.completed : ''}`}>
                    <span>{isFormValid ? '✓' : '○'}</span>
                    <span>Listing information complete</span>
                  </div>
                  <div className={`${styles.statusItem} ${paymentCompleted ? styles.completed : ''}`}>
                    <span>{paymentCompleted ? '✓' : '○'}</span>
                    <span>Payment completed</span>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePublish}
                  disabled={!isFormValid || !paymentCompleted || isPublishing}
                  className={styles.publishButton}
                >
                  {isPublishing ? 'Publishing...' : 'Publish Gym'}
                </Button>
              </div>
            </div>

            <div className={styles.sectionFooter}>
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
              >
                ← Back
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

