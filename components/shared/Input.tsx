'use client';

import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
}

export default function Input({
  label,
  error,
  multiline = false,
  className = '',
  ...props
}: InputProps) {
  const inputClasses = `${styles.input} ${error ? styles.error : ''} ${className}`.trim();

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={props.id} className={styles.label}>
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          className={inputClasses}
          {...(props as any)}
          rows={4}
        />
      ) : (
        <input className={inputClasses} {...props} />
      )}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

