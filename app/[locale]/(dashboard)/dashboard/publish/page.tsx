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
import { FaRocket } from 'react-icons/fa';

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
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaRocket />
            </span>
            Publish Your Gym
          </h1>
          <p className="dashboard-page-subtitle">
            Review your content, complete payment, and publish your gym to the public listing
          </p>
        </div>
      </div>

      <div className="publish-progress-indicator">
        <div 
          className={`publish-step ${currentStep === 1 ? 'active' : ''} ${isFormValid ? 'completed' : ''}`}
          onClick={() => setCurrentStep(1)}
        >
          <span className="publish-step-number">1</span>
          <span className="publish-step-label">Gym Information</span>
        </div>
        <div className="publish-step-divider" />
        <div 
          className={`publish-step ${currentStep === 2 ? 'active' : ''} ${paymentCompleted ? 'completed' : ''} ${!isFormValid ? 'disabled' : ''}`}
          onClick={() => isFormValid && setCurrentStep(2)}
        >
          <span className="publish-step-number">2</span>
          <span className="publish-step-label">Payment</span>
        </div>
        <div className="publish-step-divider" />
        <div 
          className={`publish-step ${currentStep === 3 ? 'active' : ''} ${paymentCompleted && isFormValid ? 'completed' : ''} ${!paymentCompleted || !isFormValid ? 'disabled' : ''}`}
          onClick={() => paymentCompleted && isFormValid && setCurrentStep(3)}
        >
          <span className="publish-step-number">3</span>
          <span className="publish-step-label">Publish</span>
        </div>
      </div>

      <div className="publish-content-flow">
        {/* Section 1: Gym Information */}
        {currentStep === 1 && (
          <section className="publish-section">
            <div className="publish-section-header">
              <div className="publish-section-number">1</div>
              <div>
                <h2 className="publish-section-title">Gym Information</h2>
                <p className="publish-section-description">
                  Review your CMS content and fill in listing information
                </p>
              </div>
            </div>

            <div className="publish-section-content">
              <div className="publish-subsection">
                <h3 className="publish-subsection-title">CMS Content Review</h3>
                <CMSReview cmsData={cmsData} />
                <p className="publish-edit-link">
                  <a href="/dashboard/cms">Edit CMS Content →</a>
                </p>
              </div>

              <div className="publish-subsection">
                <h3 className="publish-subsection-title">Listing Information</h3>
                <p className="publish-section-description">
                  Fill in the information that will appear on the gym listing page
                </p>
                <ListingInfoForm
                  data={listingInfo}
                  onChange={handleListingInfoChange}
                />
              </div>
            </div>

            <div className="publish-section-footer">
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
          <section className="publish-section">
            <div className="publish-section-header">
              <div className="publish-section-number">2</div>
              <div>
                <h2 className="publish-section-title">Payment</h2>
                <p className="publish-section-description">
                  Select your subscription plan and complete payment
                </p>
              </div>
            </div>

            <div className="publish-section-content">
              <PublishPaymentSection
                onPaymentComplete={handlePaymentComplete}
                paymentCompleted={paymentCompleted}
              />
            </div>

            <div className="publish-section-footer">
              <div className="publish-navigation-buttons">
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
          <section className="publish-section">
            <div className="publish-section-header">
              <div className="publish-section-number">3</div>
              <div>
                <h2 className="publish-section-title">Preview & Publish</h2>
                <p className="publish-section-description">
                  Review your gym listing and publish to go live
                </p>
              </div>
            </div>

            <div className="publish-section-content">
              <div className="publish-subsection">
                <h3 className="publish-subsection-title">Preview</h3>
                <PublishPreview
                  listingInfo={listingInfo}
                  cmsData={cmsData}
                />
              </div>

              <div className="publish-publish-section">
                <div className="publish-status-checklist">
                  <div className={`publish-status-item ${isFormValid ? 'completed' : ''}`}>
                    <span>{isFormValid ? '✓' : '○'}</span>
                    <span>Listing information complete</span>
                  </div>
                  <div className={`publish-status-item ${paymentCompleted ? 'completed' : ''}`}>
                    <span>{paymentCompleted ? '✓' : '○'}</span>
                    <span>Payment completed</span>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePublish}
                  disabled={!isFormValid || !paymentCompleted || isPublishing}
                  className="publish-publish-button"
                >
                  {isPublishing ? 'Publishing...' : 'Publish Gym'}
                </Button>
              </div>
            </div>

            <div className="publish-section-footer">
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

