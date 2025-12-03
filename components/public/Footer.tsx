'use client';

import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.branding}>FitConnect Ads</div>
        <div className={styles.social}>
          <a
            href="#"
            className={styles.socialIcon}
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="#"
            className={styles.socialIcon}
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            className={styles.socialIcon}
            aria-label="X (Twitter)"
          >
            <FaXTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}

