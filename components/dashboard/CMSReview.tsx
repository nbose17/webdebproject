'use client';

import { CMSItem } from '@/lib/types';
import styles from './CMSReview.module.css';

interface CMSReviewProps {
  cmsData: CMSItem[];
}

export default function CMSReview({ cmsData }: CMSReviewProps) {
  const importantItems = cmsData.filter(
    (item) =>
      item.name === 'Business Email' ||
      item.name === 'Business Contact' ||
      item.name === 'Business Timing' ||
      item.name === 'Business Logo'
  );

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <p className={styles.summaryText}>
          Your CMS content is configured. Review the key information below:
        </p>
      </div>
      
      <div className={styles.itemsList}>
        {importantItems.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.itemLabel}>{item.name}</div>
            <div className={styles.itemValue}>
              {item.type === 'image' ? (
                <span className={styles.imagePath}>{item.content}</span>
              ) : (
                <span>{item.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.completeIndicator}>
        <span className={styles.checkmark}>✓</span>
        <span>CMS Content Ready</span>
      </div>
    </div>
  );
}

