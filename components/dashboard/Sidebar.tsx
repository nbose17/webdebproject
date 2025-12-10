'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { 
  FaHome,
  FaRocket, 
  FaCreditCard, 
  FaUserTie, 
  FaCalendarAlt, 
  FaPalette, 
  FaBullhorn, 
  FaCog,
  FaSignOutAlt,
  FaChartLine,
  FaFileInvoice,
  FaUsers,
  FaCodeBranch
} from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

const mainItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FaHome },
];

const yourBusinessItems = [
  { href: '/dashboard/cms', label: 'CMS / Branding', icon: FaPalette },
  { href: '/dashboard/plans', label: 'Plans', icon: FaCreditCard },
  { href: '/dashboard/trainers', label: 'Trainers', icon: FaUserTie },
  { href: '/dashboard/classes', label: 'Classes', icon: FaCalendarAlt },
  { href: '/dashboard/advertisement', label: 'Advertisement', icon: FaBullhorn },
  { href: '/dashboard/publish', label: 'Publish Gym', icon: FaRocket },
];

const manageBusinessItems = [
  { href: '/dashboard/branches', label: 'Branches', icon: FaCodeBranch },
  { href: '/dashboard/clients', label: 'Clients', icon: FaUsers },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/login`);
  };

  const isActive = (href: string) => {
    const fullHref = `/${locale}${href}`;
    if (href === '/dashboard') {
      return pathname === fullHref || pathname === `/${locale}/dashboard`;
    }
    return pathname === fullHref || pathname.startsWith(fullHref + '/');
  };

  const renderNavItem = (item: { href: string; label: string; icon: any }) => {
    const IconComponent = item.icon;
    const fullHref = `/${locale}${item.href}`;
    return (
      <Link
        key={item.href}
        href={fullHref}
        className={`dashboard-sidebar-link ${
          isActive(item.href) ? 'active' : ''
        }`}
      >
        <IconComponent className="dashboard-sidebar-icon" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-branding">FitConnect Ads</div>
      <nav className="dashboard-sidebar-nav">
        {/* Main Section */}
        <div className="dashboard-sidebar-section">
          <div className="dashboard-sidebar-section-title">Main</div>
          {mainItems.map(renderNavItem)}
        </div>

        {/* Your Business Section */}
        <div className="dashboard-sidebar-section">
          <div className="dashboard-sidebar-section-title">Your Business</div>
          {yourBusinessItems.map(renderNavItem)}
        </div>

        {/* Manage Business Section */}
        <div className="dashboard-sidebar-section">
          <div className="dashboard-sidebar-section-title">Manage Business</div>
          {manageBusinessItems.map(renderNavItem)}
        </div>

        {/* Settings and Logout Section */}
        <div className="dashboard-sidebar-section dashboard-sidebar-section-account">
          <div className="dashboard-sidebar-section-title">Account</div>
          <Link
            href={`/${locale}/dashboard/settings`}
            className={`dashboard-sidebar-link ${
              isActive('/dashboard/settings') ? 'active' : ''
            }`}
          >
            <FaCog className="dashboard-sidebar-icon" />
            <span>Settings</span>
          </Link>
          <button onClick={handleLogout} className="dashboard-sidebar-logout">
            <FaSignOutAlt className="dashboard-sidebar-icon" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}


