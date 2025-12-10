'use client';

import { FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';

interface GymFooterProps {
  gymName: string;
  address?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export default function GymFooter({
  gymName,
  address,
  email,
  phone,
  facebook,
  twitter,
  instagram
}: GymFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#f7f7f7',
      paddingTop: '48px',
      paddingBottom: '24px',
      borderTop: '1px solid #ebebeb'
    }}>
      <div style={{
        maxWidth: '1760px',
        margin: '0 auto',
        padding: '0 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        {/* Gym Information Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid #ebebeb'
        }}>
          {/* Contact Information */}
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#222222'
            }}>
              Contact Us
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {address && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <FaMapMarkerAlt style={{ 
                    fontSize: '16px', 
                    color: '#4CAF50', 
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: '14px',
                    color: '#222222',
                    lineHeight: '1.5'
                  }}>
                    {address}
                  </span>
                </li>
              )}
              {phone && (
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaPhone style={{ 
                    fontSize: '16px', 
                    color: '#4CAF50',
                    flexShrink: 0
                  }} />
                  <Link 
                    href={`tel:${phone}`}
                    style={{
                      fontSize: '14px',
                      color: '#222222',
                      textDecoration: 'none'
                    }}
                  >
                    {phone}
                  </Link>
                </li>
              )}
              {email && (
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaEnvelope style={{ 
                    fontSize: '16px', 
                    color: '#4CAF50',
                    flexShrink: 0
                  }} />
                  <Link 
                    href={`mailto:${email}`}
                    style={{
                      fontSize: '14px',
                      color: '#222222',
                      textDecoration: 'none'
                    }}
                  >
                    {email}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Social Media */}
          {(facebook || twitter || instagram) && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '16px',
                color: '#222222'
              }}>
                Follow Us
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#222222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4CAF50';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#222222';
                    }}
                  >
                    <FaFacebook size={18} />
                  </a>
                )}
                {twitter && (
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#222222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4CAF50';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#222222';
                    }}
                  >
                    <FaXTwitter size={18} />
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#222222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4CAF50';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#222222';
                    }}
                  >
                    <FaInstagram size={18} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Strip - Powered by FitConnect */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '24px',
          borderTop: '1px solid #ebebeb'
        }}>
          {/* Left Side - Copyright */}
          <div>
            <span style={{
              fontSize: '14px',
              color: '#222222'
            }}>
              © {currentYear} {gymName}. All rights reserved.
            </span>
          </div>

          {/* Right Side - Powered by FitConnect */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '14px',
            color: '#8c8c8c'
          }}>
            <span>Powered by</span>
            <span style={{ 
              fontWeight: 600, 
              color: '#4CAF50',
              fontSize: '16px'
            }}>
              FitConnect
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

