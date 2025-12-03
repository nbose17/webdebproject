'use client';

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim();

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}

