'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaRocket, 
  FaCreditCard, 
  FaUserTie, 
  FaCalendarAlt, 
  FaPalette, 
  FaBullhorn, 
  FaCog,
  FaSignOutAlt 
} from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/dashboard/publish', label: 'Publish Gym', icon: FaRocket },
  { href: '/dashboard/plans', label: 'Plans', icon: FaCreditCard },
  { href: '/dashboard/trainers', label: 'Trainers', icon: FaUserTie },
  { href: '/dashboard/classes', label: 'Classes', icon: FaCalendarAlt },
  { href: '/dashboard/cms', label: 'CMS / Branding', icon: FaPalette },
  { href: '/dashboard/advertisement', label: 'Advertisement', icon: FaBullhorn },
  { href: '/dashboard/settings', label: 'Settings', icon: FaCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.branding}>FitConnect Ads</div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${
                pathname === item.href ? styles.active : ''
              }`}
            >
              <IconComponent className={styles.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout} className={styles.logout}>
        <FaSignOutAlt className={styles.icon} />
        <span>Logout</span>
      </button>
    </aside>
  );
}


