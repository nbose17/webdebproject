'use client';

import { Select, Tag, Tooltip } from 'antd';
import { 
  FaUserShield, 
  FaCrown, 
  FaUserTie, 
  FaDumbbell, 
  FaHeadset,
  FaInfoCircle
} from 'react-icons/fa';
import { UserRole } from '@/lib/types';

const { Option } = Select;

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
}

interface RoleSelectorProps {
  value?: UserRole;
  onChange?: (value: UserRole) => void;
  options: RoleOption[];
  placeholder?: string;
  disabled?: boolean;
  showDescription?: boolean;
}

export default function RoleSelector({
  value,
  onChange,
  options,
  placeholder = "Select role",
  disabled = false,
  showDescription = true
}: RoleSelectorProps) {

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.FITCONNECT_ADMIN:
        return <FaUserShield style={{ color: '#ff4d4f' }} />;
      case UserRole.GYM_OWNER:
        return <FaCrown style={{ color: '#722ed1' }} />;
      case UserRole.GYM_MANAGER:
        return <FaUserTie style={{ color: '#4CAF50' }} />;
      case UserRole.GYM_TRAINER:
        return <FaDumbbell style={{ color: '#52c41a' }} />;
      case UserRole.GYM_RECEPTIONIST:
        return <FaHeadset style={{ color: '#fa8c16' }} />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case UserRole.FITCONNECT_ADMIN: return 'red';
      case UserRole.GYM_OWNER: return 'purple';
      case UserRole.GYM_MANAGER: return 'blue';
      case UserRole.GYM_TRAINER: return 'green';
      case UserRole.GYM_RECEPTIONIST: return 'orange';
      default: return 'default';
    }
  };

  const getRoleDisplayName = (role: UserRole): string => {
    return role
      .replace('fitconnect_', '')
      .replace('gym_', '')
      .replace('_', ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Custom option renderer
  const renderOption = (option: RoleOption) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '8px 0',
      gap: '12px'
    }}>
      <div style={{ fontSize: '16px' }}>
        {getRoleIcon(option.value)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '2px'
        }}>
          <span style={{ fontWeight: '500' }}>{option.label}</span>
          <Tag color={getRoleColor(option.value)} size="small">
            {getRoleDisplayName(option.value)}
          </Tag>
        </div>
        {showDescription && (
          <div style={{ 
            fontSize: '12px', 
            color: '#8c8c8c',
            lineHeight: '1.2'
          }}>
            {option.description}
          </div>
        )}
      </div>
    </div>
  );

  // Value renderer (what shows when an option is selected)
  const renderValue = (val: UserRole) => {
    const option = options.find(opt => opt.value === val);
    if (!option) return null;

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px'
      }}>
        {getRoleIcon(val)}
        <span>{option.label}</span>
        <Tag color={getRoleColor(val)} size="small">
          {getRoleDisplayName(val)}
        </Tag>
      </div>
    );
  };

  return (
    <div>
      <Select
        value={value}
        onChange={onChange}
        placeholder={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaUserShield style={{ color: '#d9d9d9' }} />
            <span>{placeholder}</span>
          </div>
        }
        disabled={disabled}
        style={{ width: '100%' }}
        dropdownStyle={{ padding: '8px' }}
        optionLabelProp="label"
      >
        {options.map(option => (
          <Option 
            key={option.value} 
            value={option.value}
            label={option.label}
          >
            {renderOption(option)}
          </Option>
        ))}
      </Select>

      {/* Role Permission Info */}
      {value && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px 12px',
          backgroundColor: '#fafafa',
          border: '1px solid #f0f0f0',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            marginBottom: '4px',
            fontWeight: '500',
            color: '#595959'
          }}>
            <FaInfoCircle style={{ color: '#4CAF50' }} />
            Role Permissions
          </div>
          <div style={{ color: '#8c8c8c' }}>
            {getRolePermissionSummary(value)}
          </div>
        </div>
      )}
    </div>
  );
}

function getRolePermissionSummary(role: UserRole): string {
  switch (role) {
    case UserRole.FITCONNECT_ADMIN:
      return 'Full system access: Manage all gyms, users, settings, payments, and system configuration.';
    case UserRole.GYM_OWNER:
      return 'Gym management: Full control over owned gyms, branches, staff, clients, and business settings.';
    case UserRole.GYM_MANAGER:
      return 'Branch operations: Manage assigned branch, staff scheduling, client services, and daily operations.';
    case UserRole.GYM_TRAINER:
      return 'Training services: Access client profiles, manage training sessions, and update workout plans.';
    case UserRole.GYM_RECEPTIONIST:
      return 'Front desk operations: Handle client check-ins, basic account management, and customer service.';
    default:
      return 'No specific permissions assigned.';
  }
}

