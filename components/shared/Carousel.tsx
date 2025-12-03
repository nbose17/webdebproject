'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './Carousel.module.css';

interface CarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
}

export default function Carousel({ children, itemsPerView = 3 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const max = Math.max(0, children.length - itemsPerView);
    setMaxIndex(max);
  }, [children.length, itemsPerView]);

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const translateX = -(currentIndex * (100 / itemsPerView));

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselContainer} ref={containerRef}>
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(${translateX}%)`,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className={styles.carouselItem}
              style={{ width: `${100 / itemsPerView}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {currentIndex > 0 && (
        <button
          className={`${styles.carouselButton} ${styles.prevButton}`}
          onClick={goToPrev}
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      {currentIndex < maxIndex && (
        <button
          className={`${styles.carouselButton} ${styles.nextButton}`}
          onClick={goToNext}
          aria-label="Next"
        >
          ›
        </button>
      )}

      <div className={styles.pagination}>
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`${styles.paginationDot} ${
              index === currentIndex ? styles.active : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

