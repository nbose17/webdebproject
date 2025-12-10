'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaGlobe } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;

  const handleLanguageChange = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    router.refresh();
  };

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
        {/* Main Footer Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid #ebebeb'
        }}>
          {/* Support Column */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#222222'
            }}>
              Support
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Safety Information
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Accessibility Support
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Report an Issue
                </Link>
              </li>
            </ul>
          </div>

          {/* For Gyms Column */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#222222'
            }}>
              For Gyms
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  List Your Gym
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Gym Resources
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Partner Support
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Refer a Gym
                </Link>
              </li>
            </ul>
          </div>

          {/* FitConnect Column */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#222222'
            }}>
              FitConnect
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" style={{
                  fontSize: '14px',
                  color: '#222222',
                  textDecoration: 'none'
                }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '24px',
          borderTop: '1px solid #ebebeb'
        }}>
          {/* Left Side - Copyright and Legal */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '14px',
              color: '#222222'
            }}>
              © {currentYear} FitConnect, Inc.
            </span>
            <Link href="#" style={{
              fontSize: '14px',
              color: '#222222',
              textDecoration: 'underline'
            }}>
              Privacy
            </Link>
            <Link href="#" style={{
              fontSize: '14px',
              color: '#222222',
              textDecoration: 'underline'
            }}>
              Terms
            </Link>
            <Link href="#" style={{
              fontSize: '14px',
              color: '#222222',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Your Privacy Choices
              <span style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#006AFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                ✓
              </span>
            </Link>
          </div>

          {/* Right Side - Language and Social */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Language Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#222222'
            }}>
              <FaGlobe style={{ fontSize: '14px' }} />
              <Select
                value={locale}
                onChange={handleLanguageChange}
                variant="borderless"
                style={{ fontSize: '14px' }}
                suffixIcon={null}
              >
                <Option value="en">English (US)</Option>
                <Option value="ru">Русский</Option>
              </Select>
            </div>

            {/* Social Media Icons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <a
                href="#"
                aria-label="Facebook"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#222222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none'
                }}
              >
                <FaFacebook size={14} />
              </a>
              <a
                href="#"
                aria-label="X (Twitter)"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#222222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none'
                }}
              >
                <FaXTwitter size={14} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#222222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none'
                }}
              >
                <FaInstagram size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}




