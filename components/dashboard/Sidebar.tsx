'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaHome,
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

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FaHome },
  { href: '/dashboard/cms', label: 'CMS / Branding', icon: FaPalette },
  { href: '/dashboard/plans', label: 'Plans', icon: FaCreditCard },
  { href: '/dashboard/trainers', label: 'Trainers', icon: FaUserTie },
  { href: '/dashboard/classes', label: 'Classes', icon: FaCalendarAlt },
  { href: '/dashboard/advertisement', label: 'Advertisement', icon: FaBullhorn },
  { href: '/dashboard/publish', label: 'Publish Gym', icon: FaRocket },
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
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-branding">FitConnect Ads</div>
      <nav className="dashboard-sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dashboard-sidebar-link ${
                isActive ? 'active' : ''
              }`}
            >
              <IconComponent className="dashboard-sidebar-icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout} className="dashboard-sidebar-logout">
        <FaSignOutAlt className="dashboard-sidebar-icon" />
        <span>Logout</span>
      </button>
    </aside>
  );
}


