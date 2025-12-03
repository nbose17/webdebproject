'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/dashboard/plans', label: 'Plans' },
  { href: '/dashboard/trainers', label: 'Trainers' },
  { href: '/dashboard/classes', label: 'Classes' },
  { href: '/dashboard/cms', label: 'CMS / Branding' },
  { href: '/dashboard/settings', label: 'Settings' },
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
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${
              pathname === item.href ? styles.active : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button onClick={handleLogout} className={styles.logout}>
        Logout
      </button>
    </aside>
  );
}

