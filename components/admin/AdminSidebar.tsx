'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { 
  FaHome,
  FaDumbbell,
  FaUsers,
  FaFileContract,
  FaCog,
  FaSignOutAlt,
  FaChartLine,
  FaCreditCard,
  FaPalette,
  FaBuilding,
  FaIdCard,
  FaEnvelope,
  FaUserShield,
  FaBell,
} from 'react-icons/fa';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { usePermissions } from '@/hooks/usePermissions';

const adminMainItems = [
  { href: '/admin', label: 'Admin Dashboard', icon: FaHome },
  { href: '/admin/gyms', label: 'Gym Management', icon: FaDumbbell, permission: { resource: 'gyms', action: 'read' } },
];

const systemManagementItems = [
  { href: '/admin/roles', label: 'Roles & Permissions', icon: FaUserShield, permission: { resource: 'settings', action: 'read' } },
  { href: '/admin/templates/contracts', label: 'Contract Templates', icon: FaFileContract, permission: { resource: 'templates', action: 'read' } },
  { href: '/admin/templates/id-cards', label: 'ID Card Templates', icon: FaIdCard, permission: { resource: 'templates', action: 'read' } },
  { href: '/admin/settings', label: 'Global Settings', icon: FaCog, permission: { resource: 'settings', action: 'read' } },
];

const businessManagementItems = [
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: FaBell, permission: { resource: 'subscriptions', action: 'read' } },
  { href: '/admin/payments', label: 'Payment Gateways', icon: FaCreditCard, permission: { resource: 'payments', action: 'read' } },
  { href: '/admin/branding', label: 'CMS & Branding', icon: FaPalette, permission: { resource: 'branding', action: 'read' } },
  { href: '/admin/organization', label: 'Organization', icon: FaBuilding, permission: { resource: 'organization', action: 'read' } },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { logoutAdmin } = useAdminAuth();
  const { canAccess } = usePermissions();

  const handleLogout = () => {
    logoutAdmin();
    router.push(`/${locale}/login`);
  };


  // Filter items based on permissions
  const filterItemsByPermission = (items: any[]) => {
    return items.filter(item => {
      if (!item.permission) return true;
      return canAccess(item.permission.resource, item.permission.action);
    });
  };

  const filteredMainItems = filterItemsByPermission(adminMainItems);
  const filteredSystemItems = filterItemsByPermission(systemManagementItems);
  const filteredBusinessItems = filterItemsByPermission(businessManagementItems);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === `/${locale}/admin`;
    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  const renderNavItem = (item: { href: string; label: string; icon: any }) => {
    const IconComponent = item.icon;
    return (
      <Link
        key={item.href}
        href={`/${locale}${item.href}`}
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
      <div className="dashboard-sidebar-branding">FitConnect Admin</div>
      <nav className="dashboard-sidebar-nav">
        {/* Main Navigation */}
        <div className="dashboard-sidebar-section">
          <div className="dashboard-sidebar-section-title">Main</div>
          {filteredMainItems.map(renderNavItem)}
        </div>

        {/* System Management */}
        {filteredSystemItems.length > 0 && (
          <div className="dashboard-sidebar-section">
            <div className="dashboard-sidebar-section-title">System Management</div>
            {filteredSystemItems.map(renderNavItem)}
          </div>
        )}

        {/* Business Management */}
        {filteredBusinessItems.length > 0 && (
          <div className="dashboard-sidebar-section">
            <div className="dashboard-sidebar-section-title">Business Management</div>
            {filteredBusinessItems.map(renderNavItem)}
          </div>
        )}

        {/* Account Section */}
        <div className="dashboard-sidebar-section dashboard-sidebar-section-account">
          <div className="dashboard-sidebar-section-title">Account</div>
          <button onClick={handleLogout} className="dashboard-sidebar-logout">
            <FaSignOutAlt className="dashboard-sidebar-icon" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
