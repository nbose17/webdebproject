'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

export default function AdminTopBar() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { logoutAdmin } = useAdminAuth();
  const { currentUser, isAdmin } = usePermissions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const handleLogout = () => {
    logoutAdmin();
    router.push(`/${locale}/login`);
    setIsPopoverOpen(false);
  };

  const handleAdminSettings = () => {
    router.push(`/${locale}/admin/settings`);
    setIsPopoverOpen(false);
  };

  const userInitials = currentUser?.name
    ?.split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="dashboard-topbar">
      <div className="dashboard-topbar-content">
        <div className="dashboard-topbar-spacer"></div>
        <div className="dashboard-topbar-actions">
          <button
            ref={buttonRef}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="dashboard-topbar-avatar-button"
            aria-label="User menu"
          >
            <div className="dashboard-topbar-avatar">
              {userInitials}
            </div>
            <FaChevronDown className={`dashboard-topbar-chevron ${isPopoverOpen ? 'open' : ''}`} />
          </button>
          {isPopoverOpen && (
            <div ref={popoverRef} className="dashboard-topbar-popover">
              <div className="dashboard-topbar-popover-header">
                <div className="dashboard-topbar-popover-avatar">
                  {userInitials}
                </div>
                <div className="dashboard-topbar-popover-info">
                  <div className="dashboard-topbar-popover-name">
                    {currentUser?.name || 'Admin'}
                  </div>
                  <div className="dashboard-topbar-popover-email">
                    {currentUser?.email || ''}
                  </div>
                </div>
              </div>
              <div className="dashboard-topbar-popover-divider"></div>
              <button
                onClick={handleAdminSettings}
                className="dashboard-topbar-popover-item"
              >
                <FaCog className="dashboard-topbar-popover-icon" />
                <span>Admin Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="dashboard-topbar-popover-item"
              >
                <FaSignOutAlt className="dashboard-topbar-popover-icon" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}